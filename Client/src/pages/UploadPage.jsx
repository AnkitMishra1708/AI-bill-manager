import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Upload as UploadIcon } from "lucide-react";
import { parseInvoice } from "../components/ParseInvoice";
import { saveInvoiceApi } from "../api/invoice";

export const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [extractData, setExtractData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus("selectedFile")
    }
  };

  const handleExtract = async () => {
    try {
      if (!file) return;
      setLoading(true);
      const response = await parseInvoice(file);
      setExtractData(response.data.data)
      setLoading(false);
      setStatus("extracted")

      if (!(response.data.data?.parsedData?.isValidBill)) {
        setStatus("error");
        return;
      }
    } catch (error) {
      setError(error.response.data)
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!file) return;
      setLoading(true);
      await saveInvoiceApi(payload);
      setStatus("success")
    } catch (error) {
      setLoading(false);
    }
  };

  const payload = {
    imageUrl: extractData?.imageUrl,
    invoiceNumber: extractData?.parsedData.invoiceNumber,
    invoiceName: extractData?.parsedData.invoiceName,
    totalAmount: extractData?.parsedData.totalAmount,
    invoiceDate: extractData?.parsedData.invoiceDate,
    productList: extractData?.parsedData?.productList,
  };

  const renderContent = () => {
    switch (status) {
      case "idle":
        return <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white px-8 py-24 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <UploadIcon className="h-6 w-6 text-black" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-stone-900">
            Upload a bill
          </h2>

          <p className="mt-1 max-w-sm text-sm text-stone-400">
            Drag and drop a photo of your receipt here, or click to browse
            your files.
          </p>

          <label className="mt-6 inline-block cursor-pointer rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800">
            Choose file

            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div >;

      case "selectedFile":
        return <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white px-8 py-24 text-center">
          <p className="max-w-sm truncate text-sm font-medium text-stone-700">
            {file.name}
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleExtract}
              disabled={loading}
              className="mt-4 cursor-pointer rounded-lg bg-black px-5 py-2.5 text-sm font-medium hover:bg-gray-700 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Extracting..." : "Extract"}
            </button>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-4 cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-100 transition duration-300"
            >
              Cancel
            </button>
          </div>

          {error ? <p className="text-red-600 mt-4">{error.errors}</p> : null}
        </div>;

      case "extracted":
        return <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white px-8 py-24 text-center">
          <img src={extractData.imageUrl} alt="" />
          <button
            type="button"
            onClick={handleSave}
            className="mt-4 cursor-pointer rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Save
          </button>
        </div>;

      case "success":
        return <div className="flex flex-col items-center">
          <p className="text-center text-4xl font-semibold tracking-tight text-gray-800">
            Invoice Saved <span className="text-green-600">Successfully!</span>
          </p>
          <Link
            to="/"
            className="flex justify-center items-center gap-2 rounded-xl px-6 py-3 text-lg font-semibold text-black"
          >
            <ChevronLeft size={16} />
            Back to Home Page
          </Link>
        </div>;

      case "success":
        return (
          <h1 className="flex justify-center items-center text-4xl font-bold">Loading...</h1>
        )

      case "error":
        return <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white px-8 py-24 text-center">
          <p className="max-w-sm truncate text-sm font-medium text-stone-700">
            {file.name}
          </p>

          <button
            type="button"
            onClick={handleExtract}
            disabled={loading}
            className="mt-4 cursor-pointer rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Extracting..." : "Extract"}
          </button>
          {!(extractData?.parsedData?.isValidBill) ? <p className="text-red-600 mt-4">Please upload a valid bill.</p> : null}
        </div>;

      default:
        return null;
    }
  };

  return (
    <div>
      {renderContent()}
    </div >
  )
};