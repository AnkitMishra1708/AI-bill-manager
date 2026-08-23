import React, { useEffect, useState } from 'react'
import { BillRow, SearchBar, StatCard } from '../components/index.js'
import { allInvoiceApi } from '../api/invoice.js';

export const BillsPage = () => {
  const [query, setQuery] = useState("");
  const [allInvoice, setAllInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchAllInvoice = async () => {
    try {
      const response = await allInvoiceApi();
      const data = response?.data?.data;
      setAllInvoice(data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllInvoice();
  }, []);

  const filteredInvoices = allInvoice?.filter((invoice) => {
    const searched = query.toLowerCase();

    return (
      invoice.invoiceName?.toLowerCase().includes(searched) ||
      invoice.invoiceNumber?.toLowerCase().includes(searched) ||
      invoice.invoiceDate?.toLowerCase().includes(searched)
    );
  });

  if (loading) {
    return (
      <h1 className="flex justify-center items-center text-4xl font-bold">Loading...</h1>
    )
  }

  const totalSpend = Number((allInvoice?.reduce((total, current) => total + current.totalAmount, 0)).toFixed(1));
  const averageSpend = Number((totalSpend / (allInvoice?.length || 1)).toFixed(1));
  return (
    <>
      <div className="flex gap-5">
        <StatCard label="TOTAL BILLS" value={allInvoice?.length} />
        <StatCard label="TOTAL SPEND" value={`₹${totalSpend}`} />
        <StatCard label="AVERAGE SPEND" value={`₹${averageSpend || 0}`} />
      </div>

      <div className="mt-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search bills by store, item, or date…"
        />
      </div>

      <h2 className="mt-8 mb-3 text-sm font-medium text-stone-500">
        All bills — {allInvoice?.length || 0}
      </h2>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {allInvoice?.length > 0 ? filteredInvoices.map((bill,) => <BillRow key={bill._id} bill={bill} />)
          : (<p className="px-5 py-8 text-center text-sm text-stone-400">
            No bills match your search.
          </p>)}
      </div>
    </>
  )
}
