import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`${sizeClasses[size]} border-indigo-200 border-t-indigo-600 rounded-full animate-spin`}
                role="status"
                aria-label="loading" />
            {text && (
                <p className="text-sm font-medium text-slate-600 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    return <div className="flex items-center justify-center p-4">{spinner}</div>;
};