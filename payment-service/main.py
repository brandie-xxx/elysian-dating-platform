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
    method: str  # ecocash, visa, mastercard

@app.post("/api/pay/initiate")
def initiate_payment(req: PaymentRequest):
    payload = {
        "id": INTEGRATION_ID,
        "key": INTEGRATION_KEY,
        "reference": f"ELYSIAN_{req.email}_{req.amount}",
        "amount": req.amount,
        "additionalinfo": "Elysian Premium Subscription",
        "returnurl": "https://elysian.com/payment/return",
        "resulturl": "https://elysian.com/api/pay/callback",
        "authemail": req.email,
        "phone": req.phone,
        "method": req.method.lower()
    }

    r = requests.post(PAYNOW_URL, data=payload)
    response = r.json()

    # PayNow responds with pollurl + redirecturl
    return {"redirectUrl": response.get("browserurl"), "pollUrl": response.get("pollurl")}

@app.post("/api/pay/callback")
async def payment_callback(request: Request):
    data = await request.form()
    # TODO: Verify transaction status & update DB subscription status here
    # Example: print("Payment callback", data)
    return {"status": "ok"}
