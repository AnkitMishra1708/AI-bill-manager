import React, { useEffect, useState } from 'react'
import { BillRow, SearchBar, StatCard, LoadingSpinner } from '../components/index.js'
import { allInvoiceApi } from '../api/invoice.js';

export const BillsPage = () => {
  const [query, setQuery] = useState("");
  const [allInvoice, setAllInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAllInvoice = async () => {
      try {
        const response = await allInvoiceApi();
        const data = response?.data?.data;
        setAllInvoice(data);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError(err.message)
      }
    };

    fetchAllInvoice();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (<p className='text-3xl font-bold'>Oops, something went wrong.</p>)
  }

  const totalSpend = Number(
    allInvoice?.reduce((total, current) => total + Number(current.totalAmount || 0), 0)
      .toFixed(1)
  ) || 0;
  const averageSpend = Number(
    (totalSpend / (allInvoice?.length || 1)).toFixed(1)
  ) || 0;

  const filteredInvoices = allInvoice?.filter((invoice) => {
    const searched = query.toLowerCase();
    return (
      invoice.invoiceName?.toLowerCase().includes(searched) ||
      invoice.invoiceNumber?.toLowerCase().includes(searched) ||
      invoice.invoiceDate?.toLowerCase().includes(searched)
    );
  });
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <StatCard label="TOTAL BILLS" value={allInvoice?.length || 0} />
        <StatCard label="TOTAL SPEND" value={`₹${totalSpend}`} />
        <StatCard label="AVERAGE SPEND" value={`₹${averageSpend}`} />
      </div>

      <div className="mt-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search bills by store name..."
        />
      </div>

      <div className="mt-2">
        <h2 className="mt-8 mb-3 text-sm font-medium text-stone-500">
          All bills — {allInvoice?.length || 0}
        </h2>

        <div className="max-h-150 md:max-h-100.5 overflow-y-auto custom-scrollbar rounded-2xl border border-stone-200 bg-white">
          {filteredInvoices?.length > 0 ? (
            filteredInvoices.map((bill) => (
              <div key={bill._id}>
                <BillRow bill={bill} />
              </div>
            ))
          ) : (
            <p className="px-5 py-8 text-center text-sm text-stone-400">
              No bills match your search.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
