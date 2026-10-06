import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from backend import model_runner


def test_local_image_model_configured():
    """Ensure the local image model configuration is available."""
    assert isinstance(model_runner.IMAGE_MODEL, str)
    assert model_runner.IMAGE_MODEL == "zotac-pc/verilens-deepfake-detector"


def test_analyze_image_frame_callable():
    """Verify the local image analysis entrypoint is callable."""
    assert callable(model_runner.analyze_image_frame)
