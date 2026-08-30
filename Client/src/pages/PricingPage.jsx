import React from 'react'
import { PricingCard } from "../components/index"

export const PricingPage = () => {
  return (
    <>
      <div className='flex justify-center font-bold text-5xl'>Subscribtions</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center items-center mt-5">
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
        />
      </div>
    </>
  )
}
