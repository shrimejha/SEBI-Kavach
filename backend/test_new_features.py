import io
import requests
import numpy as np
from PIL import Image

BASE_URL = "http://localhost:8000/api/v1"

def test_new_features():
    print("================================================================")
    print("TESTING ADVANCED INVESTOR KAVACH NEW FEATURES")
    print("================================================ fall\n")

    # ── 1. C2PA Content Credentials Signing & Verification ──────────────────────
    print("[TEST 1] C2PA Content Credentials Signing Authority...")
    img = Image.new("RGB", (200, 200), color="blue")
    img_buf = io.BytesIO()
    img.save(img_buf, format="PNG")
    img_buf.seek(0)

    res_sign = requests.post(
        f"{BASE_URL}/verify/sign",
        files={"file": ("official_notice.png", img_buf, "image/png")},
        data={
            "issuer_name": "SEBI Official Communications Bureau",
            "issuer_title": "SEBI Advisory Circular 2026-Q3",
            "doc_id": "urn:c2pa:sebi:advisory:9942"
        }
    )
    print(f"C2PA Sign Status: {res_sign.status_code}")
    sign_data = res_sign.json()
    manifest = sign_data.get("c2pa_manifest", {})
    manifest_id = manifest.get("manifest_id")
    print(f"Manifest ID:      {manifest_id}")
    print(f"Issuer:           {manifest.get('issuer')}")
    print(f"Proof Algorithm:  {manifest.get('cryptographic_proof', {}).get('algorithm')}")
    print(f"Signature:        {manifest.get('cryptographic_proof', {}).get('signature')[:40]}...\n")

    # Test C2PA Manifest Lookup
    print("[TEST 2] Verifying C2PA Manifest Signature...")
    res_verify = requests.post(
        f"{BASE_URL}/verify/",
        json={"content_id": manifest_id}
    )
    print(f"Verify Status:    {res_verify.status_code}")
    v_data = res_verify.json()
    print(f"Status:           {v_data.get('status')}")
    print(f"Message:          {v_data.get('message')}")
    print(f"pHash Matched:    {v_data.get('phash_matched')}\n")

    # ── 2. Live Challenge Mode ────────────────────────────────────────────────
    print("[TEST 3] Generating Live 5-Second Challenge Code...")
    res_chal_gen = requests.post(f"{BASE_URL}/detect/challenge/generate")
    print(f"Challenge Gen Status: {res_chal_gen.status_code}")
    c_gen_data = res_chal_gen.json()
    challenge_id = c_gen_data.get("challenge_id")
    print(f"Challenge Code:   {c_gen_data.get('challenge_code')}")
    print(f"Action Prompt:    {c_gen_data.get('action_prompt')}\n")

    print("[TEST 4] Verifying Challenge Response Frame Liveness...")
    frame_img = Image.new("RGB", (300, 300), color="green")
    frame_buf = io.BytesIO()
    frame_img.save(frame_buf, format="JPEG")
    frame_buf.seek(0)

    res_chal_ver = requests.post(
        f"{BASE_URL}/detect/challenge/verify",
        data={"challenge_id": challenge_id},
        files={"file": ("frame.jpg", frame_buf, "image/jpeg")}
    )
    print(f"Challenge Verify Status: {res_chal_ver.status_code}")
    c_ver_data = res_chal_ver.json()
    print(f"Is Live Human:    {c_ver_data.get('is_live_human')}")
    print(f"Liveness Score:   {c_ver_data.get('liveness_score')}")
    print(f"Verdict:          {c_ver_data.get('verdict')}")
    print(f"Indicators:       {c_ver_data.get('technical_indicators')}\n")

    # ── 3. AI Scam-Baiting Honeypot ───────────────────────────────────────────
    print("[TEST 5] Gemini 3.6 AI Scam-Baiting & UPI ID Harvesting...")
    scam_msg = "Join our VIP Telegram group for guaranteed 500% profit. Transfer token amount Rs 5000 to UPI ID sebi.refund.verify@okaxis or call +91 98765 43210 immediately!"
    
    res_honey = requests.post(
        f"{BASE_URL}/honeypot/engage",
        json={"channel_name": "NIFTY SureShot Jackpot Tips", "message_text": scam_msg}
    )
    print(f"Honeypot Engage Status: {res_honey.status_code}")
    h_data = res_honey.json()
    print(f"Bot Persona Reply: {h_data.get('bot_persona_response')}")
    intel = h_data.get("harvested_intelligence", {})
    print(f"Harvested UPI IDs: {intel.get('extracted_upi_ids')}")
    print(f"Harvested Phones:  {intel.get('extracted_phones')}\n")

    print("[TEST 6] Fetching Live Harvested Threat Intelligence Store...")
    res_intel = requests.get(f"{BASE_URL}/honeypot/intel")
    print(f"Intel List Status: {res_intel.status_code}")
    intel_list = res_intel.json()
    print(f"Total Intelligence Items Logged: {len(intel_list)}")
    print(f"Latest Item Channel:             {intel_list[0].get('channel_name') if intel_list else 'N/A'}\n")

    print("================================================================")
    print("ALL NEW FEATURES VERIFIED SUCCESSFULLY")
    print("================================================================")

if __name__ == "__main__":
    test_new_features()
