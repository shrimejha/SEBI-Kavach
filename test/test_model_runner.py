import sys
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from PIL import Image
from backend.model_runner import analyze_image_frame


def test_analyze_image_frame_local_model_schema():
    """Local model inference should return a valid result structure for a simple image."""
    image = Image.new("RGB", (10, 10), "white")

    result = analyze_image_frame(image)

    assert isinstance(result, dict)
    assert "risk_level" in result
    assert "confidence_score" in result
    assert "is_synthetic" in result
    assert "label" in result
    assert "explanation" in result
    assert isinstance(result["confidence_score"], float)
    assert 0.0 <= result["confidence_score"] <= 1.0
    assert result["label"] in {"FAKE", "REAL"}


def test_analyze_image_frame_with_flat_image():
    """A clean flat image should not crash and should produce a decision."""
    flat_image = Image.new("RGB", (64, 64), (255, 255, 255))

    result = analyze_image_frame(flat_image)

    assert result["risk_level"] in {"low", "medium", "high"}
    assert isinstance(result["is_synthetic"], bool)
