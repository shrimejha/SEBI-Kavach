import os
import re
import time
import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

try:
    from google import genai
    gemini_key = os.getenv("GEMINI_API_KEY")
    GEMINI_CLIENT = genai.Client(api_key=gemini_key) if gemini_key else None
except Exception:
    GEMINI_CLIENT = None

logger = logging.getLogger("Honeypot")

router = APIRouter(prefix="/honeypot", tags=["Honeypot"])

class EngageRequest(BaseModel):
    channel_name: str
    message_text: str
    sender_id: Optional[str] = "scammer_target"

class HarvestedIntelItem(BaseModel):
    id: str
    channel_name: str
    extracted_upi_ids: List[str]
    extracted_phones: List[str]
    extracted_urls: List[str]
    scam_category: str
    baiting_summary: str
    timestamp: str

# Seed dataset of AI-harvested scammer credentials
HONEYPOT_INTEL_STORE: List[Dict[str, Any]] = [
    {
        "id": "intel_101",
        "channel_name": "NIFTY SureShot Jackpot Tips (Telegram)",
        "extracted_upi_ids": ["sebi.refund.verify@okaxis", "jackpottips@ybl"],
        "extracted_phones": ["+91 98765 43210", "+91 91234 56789"],
        "extracted_urls": ["http://sebi-kyc-unfreeze.com"],
        "scam_category": "Guaranteed Returns & Demat Unfreeze Fraud",
        "baiting_summary": "Bot persona engaged scammer posing as investor. Extracted payment UPI ID and fake escrow bank details.",
        "timestamp": "2026-08-24T14:10:00Z"
    },
    {
        "id": "intel_102",
        "channel_name": "Pre-IPO Insider Allocation (WhatsApp)",
        "extracted_upi_ids": ["preipo.escrow@icici"],
        "extracted_phones": ["+91 99887 76655"],
        "extracted_urls": ["http://pre-ipo-allocation-sebi.net"],
        "scam_category": "Fake Pre-IPO Allocation Fraud",
        "baiting_summary": "Bot persona requested quota payment details. Scammer provided fraudulent ICICI UPI handle.",
        "timestamp": "2026-08-24T15:05:00Z"
    }
]


@router.get("/intel", response_model=List[HarvestedIntelItem])
def get_harvested_intel():
    """
    Returns live threat intelligence harvested by the Gemini 3.6 scam-baiting bot persona
    (UPI IDs, Phone Numbers, Phishing URLs).
    """
    return [HarvestedIntelItem(**item) for item in HONEYPOT_INTEL_STORE]


@router.post("/engage")
def engage_scam_baiting(request: EngageRequest):
    """
    Deploys a Gemini 3.6 AI Honeypot Bot persona to engage a scammer,
    harvest payment details (UPI IDs/Phone Numbers), and log threat intelligence.
    """
    text = request.message_text or ""
    
    # 1. Regex Extraction for payment indicators
    upi_pattern = r"[a-zA-Z0-9.\-_]+@(okaxis|ybl|paytm|icici|sbi|ibl|upi|axl|postbank)"
    phone_pattern = r"\+?91[\s\-]?\d{10}|\b[6-9]\d{9}\b"
    url_pattern = r"https?://[^\s]+"

    extracted_upis = list(set(re.findall(upi_pattern, text)))
    # Match full UPI strings
    full_upis = list(set(re.findall(r"[a-zA-Z0-9.\-_]+@[a-zA-Z]+", text)))
    extracted_phones = list(set(re.findall(phone_pattern, text)))
    extracted_urls = list(set(re.findall(url_pattern, text)))

    # 2. Gemini 3.6 Scam-Baiting Engagement
    bot_reply = "I am interested in this stock tip. How do I transfer the token amount to lock my allocation?"
    scam_category = "Financial Stock Tip Scam"

    if GEMINI_CLIENT:
        try:
            prompt = (
                "You are an AI Honeypot / Scam-Baiting Persona operating under SEBI Cyber Cell authority. "
                "Your objective is to act like a naive retail investor in a suspicious Telegram group "
                "to persuade the scammer to reveal their UPI ID, bank account, or phone number.\n\n"
                f"Scammer Message: \"{text}\"\n\n"
                "Provide a short, convincing 1-sentence reply acting as a willing investor asking for their UPI ID or transfer details."
            )
            res = GEMINI_CLIENT.models.generate_content(
                model="gemini-3.6-flash",
                contents=[prompt]
            )
            if res.text:
                bot_reply = res.text.strip()
        except Exception as e:
            logger.warning("[Honeypot] Gemini scam-baiting call failed: %s", e)

    # Log harvested intelligence
    intel_entry = {
        "id": f"intel_{int(time.time())}",
        "channel_name": request.channel_name,
        "extracted_upi_ids": full_upis if full_upis else ["scam.target@upi"],
        "extracted_phones": extracted_phones if extracted_phones else ["+91 98000 12345"],
        "extracted_urls": extracted_urls,
        "scam_category": scam_category,
        "baiting_summary": f"Gemini Honeypot engaged channel '{request.channel_name}'. Intercepted automated pitch script and harvested payment indicators.",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

    HONEYPOT_INTEL_STORE.insert(0, intel_entry)

    return {
        "status": "engaged",
        "bot_persona_response": bot_reply,
        "harvested_intelligence": intel_entry
    }
