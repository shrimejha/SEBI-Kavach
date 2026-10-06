import imagehash
from PIL import Image
import io
import os
import time
import hashlib
import uuid
from typing import Tuple, Optional, List, Dict, Any

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
from cryptography.exceptions import InvalidSignature

class PHashRegistry:
    def __init__(self):
        # In-memory store of official registered media perceptual hashes & C2PA manifests
        self.registry: List[Dict[str, Any]] = []
        self.c2pa_manifests: Dict[str, Dict[str, Any]] = {}
        
        # SEBI Content Credentials Authority (ECDSA P-256 Keypair)
        self._private_key = ec.generate_private_key(ec.SECP256R1())
        self._public_key = self._private_key.public_key()
        self._public_key_pem = self._public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode('utf-8')
        
        self._seed_default_official_hashes()

    def _seed_default_official_hashes(self):
        """Seed registry with sample official circular/announcement hashes."""
        h1 = "acd5d57d2980c69c"
        h2 = "0f1e2d3c4b5a6978"
        
        self.registry.append({
            "hash": imagehash.hex_to_hash(h1),
            "signer": "SEBI Official Communications Bureau",
            "title": "SEBI Official Advisory Notice 2026",
            "timestamp": "2026-08-01T10:00:00Z"
        })
        self.registry.append({
            "hash": imagehash.hex_to_hash(h2),
            "signer": "NSE Investor Relations",
            "title": "NSE Official Board Resolution Notice",
            "timestamp": "2026-08-02T14:30:00Z"
        })

    def register_media(self, image_input: Image.Image, signer: str, title: str) -> str:
        """Register an official media file by computing its perceptual hash."""
        p_hash = imagehash.phash(image_input)
        entry = {
            "hash": p_hash,
            "signer": signer,
            "title": title,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        self.registry.append(entry)
        return str(p_hash)

    def match_media(self, image_input: Image.Image, threshold: int = 6) -> Tuple[bool, Optional[str], Optional[str], int]:
        """
        Check if an inbound compressed/re-encoded image matches any registered official media.
        Returns: (is_matched, signer_name, title, lowest_hamming_distance)
        """
        try:
            inbound_hash = imagehash.phash(image_input)
            best_match = None
            min_distance = 999

            for entry in self.registry:
                distance = inbound_hash - entry["hash"]  # Hamming distance
                if distance < min_distance:
                    min_distance = distance
                    best_match = entry

            if min_distance <= threshold and best_match:
                return True, best_match["signer"], best_match["title"], min_distance

            return False, None, None, min_distance
        except Exception as e:
            print(f"[pHash Engine] Error matching media: {e}")
            return False, None, None, 999

    # ── C2PA Content Credentials Provenance Methods ────────────────────────────
    def issue_c2pa_manifest(self, image_input: Image.Image, issuer_name: str, issuer_title: str, doc_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Issues a cryptographically signed C2PA-style Content Credential manifest
        for genuine SEBI / Exchange communications.
        """
        # 1. Compute media hashes
        buf = io.BytesIO()
        image_input.convert("RGB").save(buf, format="PNG")
        image_bytes = buf.getvalue()
        
        sha256_hex = hashlib.sha256(image_bytes).hexdigest()
        p_hash = imagehash.phash(image_input)
        phash_hex = str(p_hash)
        
        manifest_id = doc_id or f"urn:c2pa:sebi:{uuid.uuid4().hex[:12]}"
        timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        
        # 2. Construct claims payload to sign
        claim_data = f"{manifest_id}|{sha256_hex}|{phash_hex}|{issuer_name}|{timestamp}".encode('utf-8')
        
        # 3. Sign using SEBI Authority Private Key (ECDSA P-256)
        signature_bytes = self._private_key.sign(
            claim_data,
            ec.ECDSA(hashes.SHA256())
        )
        signature_hex = signature_bytes.hex()
        
        manifest = {
            "c2pa_version": "2.1.0-SEBI",
            "manifest_id": manifest_id,
            "issuer": issuer_name,
            "issuer_title": issuer_title,
            "timestamp": timestamp,
            "cryptographic_proof": {
                "algorithm": "ECDSA_P256_SHA256",
                "authority": "SEBI Content Credentials Authority (India)",
                "signature": signature_hex,
                "public_key_pem": self._public_key_pem,
            },
            "assertions": {
                "sha256_digest": sha256_hex,
                "phash": phash_hex,
                "format": "image/png",
                "provenance_status": "CRYPTOGRAPHICALLY_SIGNED_GENUINE"
            }
        }
        
        # Save in memory manifests & register pHash
        self.c2pa_manifests[manifest_id] = manifest
        self.c2pa_manifests[sha256_hex] = manifest
        self.c2pa_manifests[phash_hex] = manifest
        self.register_media(image_input, issuer_name, issuer_title)
        
        return manifest

    def verify_c2pa_manifest(self, manifest_id_or_hash: str) -> Tuple[bool, Optional[Dict[str, Any]], str]:
        """
        Verifies ECDSA digital signature & provenance manifest for a given ID or hash.
        """
        manifest = self.c2pa_manifests.get(manifest_id_or_hash)
        if not manifest:
            return False, None, "No C2PA Content Credential manifest found for this ID or hash."

        try:
            proof = manifest["cryptographic_proof"]
            assertions = manifest["assertions"]
            
            manifest_id = manifest["manifest_id"]
            sha256_hex = assertions["sha256_digest"]
            phash_hex = assertions["phash"]
            issuer_name = manifest["issuer"]
            timestamp = manifest["timestamp"]
            
            claim_data = f"{manifest_id}|{sha256_hex}|{phash_hex}|{issuer_name}|{timestamp}".encode('utf-8')
            signature_bytes = bytes.fromhex(proof["signature"])
            
            # Verify signature using Authority Public Key
            self._public_key.verify(
                signature_bytes,
                claim_data,
                ec.ECDSA(hashes.SHA256())
            )
            return True, manifest, "Cryptographic C2PA Signature VERIFIED. Issued by authorized SEBI key."
        except InvalidSignature:
            return False, manifest, "INVALID SIGNATURE: Content credentials signature failed validation."
        except Exception as e:
            return False, manifest, f"Verification error: {e}"

# Global Singleton Instance
phash_registry = PHashRegistry()
