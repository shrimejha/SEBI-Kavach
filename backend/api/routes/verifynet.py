import io
import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from PIL import Image

try:
    from phash_registry import phash_registry
except ImportError:
    try:
        from backend.phash_registry import phash_registry
    except ImportError:
        import sys
        from pathlib import Path
        sys.path.append(str(Path(__file__).parent.parent.parent.resolve()))
        from phash_registry import phash_registry

router = APIRouter(prefix="/verify", tags=["VerifyNet"])

class VerificationRequest(BaseModel):
    content_id: str
    source_url: Optional[str] = None

class VerificationResponse(BaseModel):
    status: str
    message: str
    signer: Optional[str] = None
    timestamp: Optional[str] = None
    phash_matched: bool = False
    c2pa_manifest: Optional[Dict[str, Any]] = None

class SigningRequest(BaseModel):
    issuer_name: str
    issuer_title: str
    doc_id: Optional[str] = None


# ─────────────────────────────────────────────────────────────────────────────
# C2PA Manifest Verification & pHash Registry Lookup
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/", response_model=VerificationResponse)
def verify_content(request: VerificationRequest):
    query = (request.content_id or "").strip()
    
    # 1. Check C2PA Manifest Verification
    is_valid, manifest, msg = phash_registry.verify_c2pa_manifest(query)
    if is_valid and manifest:
        return VerificationResponse(
            status="verified",
            message=f"ASLI / VERIFIED: {msg}",
            signer=manifest.get("issuer"),
            timestamp=manifest.get("timestamp"),
            phash_matched=True,
            c2pa_manifest=manifest
        )

    # 2. Return fallback response based on query
    return VerificationResponse(
        status="unregistered",
        message="UNREGISTERED ORIGIN: No cryptographic C2PA signature or registered pHash found for this query.",
        signer=None,
        timestamp=datetime.datetime.now().isoformat(),
        phash_matched=False
    )


# ─────────────────────────────────────────────────────────────────────────────
# C2PA Content Credentials Signing Authority Endpoint
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/sign")
async def sign_official_circular(
    file: UploadFile = File(...),
    issuer_name: str = Form("SEBI Official Communications Bureau"),
    issuer_title: str = Form("SEBI Advisory Circular"),
    doc_id: Optional[str] = Form(None)
):
    """
    Issues a cryptographically signed C2PA Content Credential manifest for an official media file.
    Signed using SEBI Content Credentials Authority ECDSA P-256 private key.
    """
    try:
        file_bytes = await file.read()
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        
        manifest = phash_registry.issue_c2pa_manifest(
            image_input=image,
            issuer_name=issuer_name,
            issuer_title=issuer_title,
            doc_id=doc_id
        )
        
        return {
            "status": "success",
            "message": "C2PA Content Credential manifest issued and signed by SEBI Authority.",
            "c2pa_manifest": manifest
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"C2PA signing error: {str(e)}")


# ─────────────────────────────────────────────────────────────────────────────
# C2PA Manifest JSON Retrieval
# ─────────────────────────────────────────────────────────────────────────────
@router.get("/manifest/{manifest_id}")
def get_c2pa_manifest(manifest_id: str):
    is_valid, manifest, msg = phash_registry.verify_c2pa_manifest(manifest_id)
    if not manifest:
        raise HTTPException(status_code=404, detail="Manifest not found")
    return {
        "verified": is_valid,
        "verification_message": msg,
        "manifest": manifest
    }
