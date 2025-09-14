"use client";
import { useState } from "react";

export default function EcocashButton({
  amount,
  email,
  phone,
}: {
  amount: number;
  email: string;
  phone: string;
}) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pay/ecocash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, email, phone }),
      });
      const data = await res.json();

      if (data.redirectUrl) {
        // Redirect user to PayNow Ecocash checkout page
        window.location.href = data.redirectUrl;
      } else {
        alert("Payment failed to initiate");
      }
    } catch (err) {
      console.error(err);
      alert("Error initiating payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
    >
      {loading ? "Processing..." : "Pay with Ecocash"}
    </button>
  );
}
