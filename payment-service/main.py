from fastapi import FastAPI, Request
from pydantic import BaseModel
import requests

app = FastAPI()

PAYNOW_URL = "https://www.paynow.co.zw/interface/initiatetransaction"
INTEGRATION_ID = "your_integration_id"
INTEGRATION_KEY = "your_integration_key"

class PaymentRequest(BaseModel):
    email: str
    phone: str
    amount: float

@app.post("/api/pay/ecocash")
def initiate_payment(req: PaymentRequest):
    payload = {
        "id": INTEGRATION_ID,
        "key": INTEGRATION_KEY,
        "reference": f"STATIQUEX_{req.email}_{req.amount}",
        "amount": req.amount,
        "additionalinfo": "STATIQUEX Marketplace Purchase",
        "returnurl": "https://statiquex.com/payment/return",
        "resulturl": "https://statiquex.com/api/pay/callback",
        "authemail": req.email,
        "phone": req.phone,
        "method": "ecocash"
    }

    r = requests.post(PAYNOW_URL, data=payload)
    response = r.json()

    # PayNow responds with pollurl + redirecturl
    return {"redirectUrl": response.get("browserurl")}

@app.post("/api/pay/callback")
async def payment_callback(request: Request):
    data = await request.form()
    # Verify transaction status & update DB here
    # Example: print("Payment callback", data)
    return {"status": "ok"}
