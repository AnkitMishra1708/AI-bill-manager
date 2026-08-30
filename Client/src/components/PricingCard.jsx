import { Check, Minus } from "lucide-react";

export const PricingCard = ({
    name,
    members,
    price,
    period = "",
    features,
    buttonText = "Fix the deal",
}) => {
    return (
        <div className="w-full max-w-98.75 font-mono rounded-2xl border border-gray-100 bg-white px-8 pt-12 pb-7 shadow-[0_4px_10px_rgba(0,0,0,0.12)]">
            <h2 className="text-[21px] font-bold text-[#26343b]">
                {name}
            </h2>
            <p className="mt-2 text-[18px] text-gray-400">
                {members}
            </p>
            <div className="mt-5 flex items-baseline">
                <span className="text-[48px] leading-none font-bold text-[#26343b]">
                    {price}
                </span>
                <span className="ml-2 text-[22px] font-semibold text-gray-500">
                    {period}
                </span>
            </div>

            <div className="mt-9 space-y-5">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4"
                    >
                        <span
                            className={`flex h-5.25 w-5.25 shrink-0 items-center justify-center rounded-full ${feature.included
                                ? "bg-black text-white"
                                : "border-2 border-black text-black"
                                }`}
                        >
                            {feature.included ? (
                                <Check size={13} strokeWidth={3} />
                            ) : (
                                <Minus size={13} strokeWidth={3} />
                            )}
                        </span>

                        <span className="text-[18px] text-gray-700">
                            {feature.text}
                        </span>
                    </div>
                ))}
            </div>

            <button className="mt-8 h-12.5 w-full cursor-pointer rounded-xl bg-black hover:bg-gray-800 text-[16px] font-bold text-white shadow-md transition hover:opacity-90">
                {buttonText}
            </button>
        </div>
    );
};
