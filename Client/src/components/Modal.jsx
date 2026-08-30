import React from "react";

export const Modal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    confirmText = "Yes, I'm sure",
    cancelText = "No, cancel",
}) => {
    return (
        <div
            id="popup-modal"
            tabIndex="-1"
            className={`fixed inset-0 z-50 flex justify-center items-center w-full h-full
        overflow-y-auto overflow-x-hidden bg-black/50
        transition-opacity duration-50 ease-out
        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
        >
            <div
                className={`relative p-4 w-full max-w-md max-h-full
          transform transition-all duration-300 ease-out
          ${isOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-2"
                    }
        `}
            >
                <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6">

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-3 right-2.5 text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-9 h-9 inline-flex justify-center items-center transition"
                    >
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18 17.94 6M18 18 6.06 6"
                            />
                        </svg>

                        <span className="sr-only">Close modal</span>
                    </button>

                    <div className="p-4 md:p-5 text-center">

                        <svg
                            className="mx-auto mb-4 text-black w-10 h-10"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>

                        <h3 className="mb-6 text-black text-lg font-normal">
                            {title}
                        </h3>

                        <div className="flex items-center space-x-4 justify-center">

                            {/* Confirm */}
                            <button
                                onClick={onConfirm}
                                type="button"
                                className="text-white bg-red-600 border border-transparent hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none shadow-sm transition-colors"
                            >
                                {confirmText}
                            </button>

                            <button
                                onClick={onClose}
                                type="button"
                                className="text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-900 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2.5 focus:outline-none shadow-sm transition-colors"
                            >
                                {cancelText}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};