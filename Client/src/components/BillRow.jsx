import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FormatDate } from "./FormatDate.jsx"
export const BillRow = ({ bill }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/bills/${bill._id}`)}
      className="flex w-full items-center gap-4 border-b border-stone-100 px-5 py-4 text-left last:border-b-0 cursor-pointer hover:bg-stone-50"
    >
      <img
        src={bill.imageUrl}
        alt={bill.invoiceName}
        className="h-12 w-12 shrink-0 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-stone-900">{bill.invoiceName}</p>
        <p className="mt-0.5 font-mono text-sm text-stone-400">
          {FormatDate(bill.invoiceDate)} • {bill.productList.length} items
        </p>
      </div>
      <span className="font-mono text-lg font-bold text-stone-900">
        ₹{bill.totalAmount}
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-stone-300" />
    </button>
  );
}

