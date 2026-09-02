import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { PricingCard } from "../components/index"
import { createOrderApi, VerifyPaymentApi } from '../api/payment';
import toast from 'react-hot-toast';

export const PricingPage = () => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)

  const verifyPayment = async () => {
    const res = await VerifyPaymentApi();
    const data = res.data

    if (data.paymentSuccessfull) {
      setIsPaymentSuccess(true)
      toast.success("Payment Successfull.")
    } else {
      toast.error("Payment failed.")
    }
  }

  const handleTokenPurchase = async (subscriptionsType) => {
    setLoading(subscriptionsType);
    try {
      const res = await createOrderApi({ subscriptionsType })
      const data = res.data.data.paymentSaved
      setLoading(null);
      console.log(data);

      const { amount, currency, orderId, notes } = data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        order_id: orderId,
        name: "Bill Vault",
        description: "Make your invoice safe.",
        prefill: {
          name: notes.fullName,
          email: notes.email,
        },
        theme: {
          color: "#000"
        },
        handler: verifyPayment
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      setLoading(null)
      setError(error.message)
    }
  }

  return (
    <>
      {isPaymentSuccess ? (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-100">

            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-sm text-gray-600 mb-6">
              Thank you for your purchase. We have received your payment and your order is now being processed.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left border border-gray-200">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Order Number</span>
                <span className="font-medium text-gray-800">#12345678</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-800">October 24, 2026</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-500 font-semibold">Total Paid</span>
                <span className="font-bold text-gray-900">$99.00</span>
              </div>
            </div>

            <Link to="/" className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-black hover:bg-gray-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-center font-bold text-5xl">Subscriptions</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center items-center mt-7">
            <PricingCard
              name="Starter"
              members="Enjoy the show"
              price="₹10"
              period="/per token ₹3.33"
              features={[
                { text: "Get 3 tokens", included: true },
                { text: "Store your invoice", included: true },
                { text: "Support team full assist", included: false },
                { text: "Help the developer", included: false },
              ]}
              onBuyClick={() => handleTokenPurchase('Starter')}
              isLoading={loading === 'Starter'}
            />
            <PricingCard
              name="Premium"
              members="Enjoy the show even more"
              price="₹50"
              period="/per token ₹3.33"
              features={[
                { text: "Get 15 tokens", included: true },
                { text: "Store your invoice", included: true },
                { text: "Support team full assist", included: true },
                { text: "Help the developer", included: false },
              ]}
              onBuyClick={() => handleTokenPurchase('Premium')}
              isLoading={loading === 'Premium'}
            />
            <PricingCard
              name="Sarkaar"
              members="Anything for you"
              price="₹100"
              period="/per token ₹3.33"
              features={[
                { text: "Get 30 tokens", included: true },
                { text: "Store your invoice", included: true },
                { text: "Support team full assist", included: true },
                { text: "Help the developer", included: true },
              ]}
              onBuyClick={() => handleTokenPurchase('Sarkaar')}
              isLoading={loading === 'Sarkaar'}
            />
            {error?.message ? <p className="text-4xl text-red-500">{error.message}</p> : null}
          </div>
        </>
      )}
    </>
  );
}
