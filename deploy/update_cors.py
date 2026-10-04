"""
update_cors.py — update ALLOWED_ORIGINS on the deployed Lambda without
re-uploading the zip. Much faster than a full redeploy.
"""
import sys
import boto3
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))

FUNCTION_NAME = "smart-farmer-diagnose"
REGION = os.getenv("AWS_REGION", "us-east-1")

NEW_ORIGINS = ",".join([
    "https://smart-farmer-naqogp8da-mubirueltonfelix-3337s-projects.vercel.app",
    "https://smart-farmer-blond-seven.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
])

client = boto3.client("lambda", region_name=REGION)

# Get current config so we don't wipe other env vars
current = client.get_function_configuration(FunctionName=FUNCTION_NAME)
env_vars = current.get("Environment", {}).get("Variables", {})

# Update just ALLOWED_ORIGINS
env_vars["ALLOWED_ORIGINS"] = NEW_ORIGINS

response = client.update_function_configuration(
    FunctionName=FUNCTION_NAME,
    Environment={"Variables": env_vars},
)

print(f"[ok] Updated ALLOWED_ORIGINS on {FUNCTION_NAME}")
print(f"     Origins: {NEW_ORIGINS}")
print(f"     State: {response['State']}")
