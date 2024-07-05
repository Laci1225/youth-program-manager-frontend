import {PaymentElement} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
/*const paymentRequest =stripe?.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
            label: 'Demo total',
            amount: 1000,
        },
    }
);*/

    const [message, setMessage] = useState<string | null | undefined>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsProcessing(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/tickets`,
            },
        });

        if (error?.type === "card_error" || error?.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsProcessing(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="border border-gray-200 rounded p-6 my-6 shadow-lg"
        >
            <PaymentElement className="mb-4" />
            <button
                disabled={isProcessing || !stripe || !elements}
                className={`bg-indigo-600 text-white font-semibold py-3 px-4 rounded transition-transform ${
                    isProcessing || !stripe || !elements ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700 active:scale-95'
                }`}
            >
                <span>
                    {isProcessing ? "Processing..." : "Pay now"}
                </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div className="mt-4 text-red-600">{message}</div>}
        </form>
    );
}
