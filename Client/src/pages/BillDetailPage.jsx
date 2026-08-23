import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronDown, CircleHelp, ChevronUp } from "lucide-react";
import { detailedInvoiceApi } from "../api/invoice"
import { StatCard, FormatDate } from "../components/index.js"

export const BillDetailPage = () => {
  const { id } = useParams();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("list");
  const [expanded, setExpanded] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const loadBill = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await detailedInvoiceApi(id);
      const data = response.data.data
      setBill(data);
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.log(error);
    }
  }

  useEffect(() => {
    loadBill();
    setLoading(false)
  }, [id]);

  if (loading) {
    return (
      <h1 className="flex justify-center items-center text-4xl font-bold">Loading...</h1>
    )
  }

  if (!bill) return null;

  const productList = bill?.productList || [];
  const itemCount = productList.length;
  const averageSpend = bill?.totalAmount / productList?.length;
  const highest = productList.reduce((max, i) => Math.max(max, i.totalPrice), 0);

  const visibleItems = expanded ? productList : productList.slice(0, 5);
  const hiddenCount = productList.length - visibleItems.length;

  const sortedForBreakdown = [...productList].sort((a, b) => b.totalPrice - a.totalPrice);
  const maxForBar = sortedForBreakdown[0]?.totalPrice || 1;

  return (
    <div className="max-w-3xl mx-auto px-6">
      <BackLink />

      <div className="mt-4 relative rounded-lg overflow-hidden border border-gray-200 h-48">
        {bill.imageUrl ? (
          <img
            src={bill.imageUrl}
            alt={`Receipt from ${bill.invoiceName}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between">
          <div>
            <p className="text-white font-semibold text-lg leading-tight">
              {bill.invoiceName}
            </p>
            <p className="text-white/80 text-sm">
              {FormatDate(bill.invoiceDate)}
              {bill.invoiceNumber ? ` · #${bill.invoiceNumber}` : ""}
            </p>
          </div>
          <p className="text-white font-semibold text-2xl">
            {formatCurrency(bill.totalAmount)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 divide-x divide-gray-200 border border-gray-200 rounded-lg bg-white">
        <StatCard label="Items" value={itemCount} />
        <StatCard label="Avg Price" value={formatCurrency(averageSpend)} />
        <StatCard label="Highest" value={formatCurrency(highest)} />
      </div>

      <div className="mt-6 grid grid-cols-2 rounded-lg bg-gray-100 p-1">
        <TabButton
          active={view === "list"}
          onClick={() => setView("list")}
          label="Item List"
        />
        <TabButton
          active={view === "breakdown"}
          onClick={() => setView("breakdown")}
          label="Spend Breakdown"
        />
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white overflow-hidden font-mono">
        {view === "list" ? (
          <>
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 text-xs font-medium tracking-wide text-gray-400 uppercase border-b border-gray-100">
              <span>Item</span>
              <span>Qty</span>
              <span className="text-right">Price</span>
            </div>
            {visibleItems.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-slate-800 font-medium truncate">
                  {item.productName}
                </span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 justify-self-start">
                  ×{item.unitPrice}
                </span>
                <span className="text-right text-gray-900 font-medium">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            ))}
            {productList.length > 5 && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="w-full flex items-center justify-center gap-1 py-3 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
              >
                {expanded ? (
                  <>
                    Show less <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    Show {hiddenCount} more item{hiddenCount === 1 ? "" : "s"}{" "}
                    <ChevronDown size={16} />
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="p-5 space-y-4">
            {sortedForBreakdown.map((item, i) => (
              <div key={`${item.productName}-${i}`}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-slate-800 font-medium">
                    {item.productName}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-black"
                    style={{
                      width: `${Math.max(
                        (item.totalPrice / maxForBar) * 100,
                        3
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-t border-gray-200">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-semibold text-green-700 text-lg">
            {formatCurrency(bill?.totalAmount)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => setShowJson((s) => !s)}
          className="flex items-center cursor-pointer gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          {showJson ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Show JSON
        </button>

        <div className="relative group">
          <CircleHelp
            size={15}
            className="cursor-pointer text-gray-400 transition-colors duration-200 hover:text-gray-600"
          />

          <div
            className="
      pointer-events-none absolute bottom-full left-1/2 mb-2
      -translate-x-1/2 translate-y-1
      whitespace-nowrap rounded-md bg-gray-800 px-2 py-1
      text-xs text-white shadow-sm
      opacity-0 transition-all duration-200 ease-out
      group-hover:translate-y-0 group-hover:opacity-100
      "
          >
            Want the above product data? Here’s the JSON.
          </div>
        </div>
      </div>
      {showJson && (
        <pre className="mt-2 rounded-lg bg-gray-900 text-gray-100 text-xs p-4 overflow-x-auto">
          {JSON.stringify(getDisplayJson(bill), null, 2)}
        </pre>
      )}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
    >
      <ChevronLeft size={16} />
      Back to bills
    </Link>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 text-sm font-medium rounded-md transition-colors ${active
        ? "bg-white text-gray-900 shadow-sm"
        : "text-gray-500 hover:text-gray-700"
        }`}
    >
      {label}
    </button>
  );
}

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const HIDDEN_JSON_FIELDS = [
  "user",
  "_id",
  "createdAt",
  "updatedAt",
  "__v",
];

function getDisplayJson(bill) {
  if (!bill) return bill;
  const clean = { ...bill };
  for (const key of HIDDEN_JSON_FIELDS) delete clean[key];

  if (Array.isArray(clean.productList)) {
    clean.productList = clean.productList.map((item) => {
      const cleanItem = { ...item };
      for (const key of HIDDEN_JSON_FIELDS) delete cleanItem[key];
      return cleanItem;
    });
  }

  return clean;
}