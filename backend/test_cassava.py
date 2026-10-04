"""
Test cassava diagnosis against both local and Lambda endpoints.
Creates a realistic green-leaf test image and POSTs it with crop hint 'cassava'.
"""
import sys
import urllib.request
import urllib.parse
import urllib.error
import json
import base64
import io
from PIL import Image, ImageDraw

def make_leaf_image():
    """Create a realistic-ish green leaf image for testing."""
    img = Image.new("RGB", (400, 300), color=(34, 100, 34))
    draw = ImageDraw.Draw(img)
    # Add some yellow patches to simulate mosaic disease
    draw.ellipse([80, 60, 160, 120], fill=(200, 190, 40))
    draw.ellipse([200, 100, 260, 150], fill=(180, 170, 30))
    draw.ellipse([130, 150, 190, 200], fill=(210, 200, 50))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f"data:image/jpeg;base64,{b64}"

def test_endpoint(label, url, api_key=None):
    print(f"\n=== Testing {label} ===")
    print(f"URL: {url}")
    data_url = make_leaf_image()
    body = urllib.parse.urlencode({
        "image_b64": data_url,
        "crop": "cassava",
        "location": "Uganda",
    }).encode()
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    if api_key:
        headers["X-API-Key"] = api_key
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            result = json.loads(resp.read().decode())
            print(f"[ok] crop={result.get('crop')} disease={result.get('disease')} confidence={result.get('confidence')}")
            print(f"     status={result.get('status')} severity={result.get('severity')}")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"[HTTP {e.code}] {body}")
    except Exception as e:
        print(f"[ERROR] {e}")

# Test local backend
test_endpoint(
    "LOCAL (localhost:8000)",
    "http://127.0.0.1:8000/api/v1/diagnose",
)

# Test Lambda
test_endpoint(
    "LAMBDA (production)",
    "https://xince3bxpg.execute-api.us-east-1.amazonaws.com/api/v1/diagnose",
    api_key="-m4IsjVrORm0rzWcOP42ovNUzMFtrar6afIC5hagH9A",
)
