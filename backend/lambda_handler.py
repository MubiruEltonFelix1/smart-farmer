"""
lambda_handler.py — AWS Lambda entry point for the Smart Farmer diagnosis API.

Lambda cannot run an ASGI server, so Mangum translates each API Gateway event
into the ASGI calls FastAPI expects and translates the response back. The app in
main.py is otherwise untouched: same routes, same validation, same provider
switch, same error mapping.

Local development still runs uvicorn against main:app. This module exists only
for the deployed environment and is never imported locally.
"""

from mangum import Mangum

from main import app

# lifespan="auto" runs FastAPI's lifespan handler once per cold start and caches
# the result for warm invocations. That is where the diagnosis provider is
# prepared and its readiness recorded, so skipping it would leave /api/v1/health
# reporting "provider has not started yet".
handler = Mangum(app, lifespan="auto")
