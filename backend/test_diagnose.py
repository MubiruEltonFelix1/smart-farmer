"""Quick test: POST a tiny JPEG to /api/v1/diagnose and print the raw response."""
import urllib.request
import urllib.parse
import json
import base64
import io
from PIL import Image

# Create a tiny 100x100 green test image
img = Image.new("RGB", (100, 100), color=(34, 139, 34))
buf = io.BytesIO()
img.save(buf, format="JPEG")
b64 = base64.b64encode(buf.getvalue()).decode()
data_url = f"data:image/jpeg;base64,{b64}"

# POST to the local backend
body = urllib.parse.urlencode({"image_b64": data_url, "crop": "tomato"}).encode()
req = urllib.request.Request(
    "http://127.0.0.1:8000/api/v1/diagnose",
    data=body,
    method="POST",
)
try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        print("STATUS:", resp.status)
        print(json.dumps(json.loads(resp.read().decode()), indent=2))
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print(e.read().decode())
except Exception as e:
    print("ERROR:", e)
