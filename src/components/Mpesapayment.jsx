import { useState } from "react";
import axios from "axios";

function MpesaPayment() {
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const payNow = async () => {
        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/mpesa/stk-push",
                {
                    phone,
                    amount,
                }
            );

            alert(
                response.data.CustomerMessage ||
                "STK Push sent successfully."
            );
        } catch (error) {
            console.error(error);

            alert("Failed to initiate payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Pay with M-Pesa</h3>

            <input
                type="text"
                placeholder="254712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <br />
            <br />

            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <br />
            <br />

            <button onClick={payNow} disabled={loading}>
                {loading ? "Processing..." : "Pay with M-Pesa"}
            </button>
        </div>
    );
}

export default MpesaPayment;