import React, { useState } from 'react'
import { PricingCard, ThankYouPage } from "../components/index"
import { createOrderApi, VerifyPaymentApi } from '../api/payment';
import toast from 'react-hot-toast';

export const PricingPage = () => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const handleTokenPurchase = async (subscriptionsType) => {
    setLoading(subscriptionsType);
    try {
      const res = await createOrderApi({ subscriptionsType })
      const data = res.data.data.paymentSaved
      setLoading(null);

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
        handler: async function (response) {
          const verificationBody = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          const verifyResponse = await VerifyPaymentApi(verificationBody)
          console.log(verifyResponse);
          console.log(verifyResponse.data);
          console.log(verifyResponse.data.status);

          if (verifyResponse.data.status === 'success') {
            setIsPaymentSuccess(true)
            toast.success('Payment Successfully!');
          } else {
            toast.error('Payment Failed!');
          }
        }
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
        <ThankYouPage />
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
