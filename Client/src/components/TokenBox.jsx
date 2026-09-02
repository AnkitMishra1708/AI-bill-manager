import React from 'react'
import { Coins } from 'lucide-react'

export const TokenBox = ({ count }) => {
    const getColorConfig = (num) => {
        if (num <= 3) {
            return {
                bg: 'bg-rose-50/60 hover:bg-rose-50',
                border: 'border-rose-200/80',
                text: 'text-rose-700',
                badgeBg: 'bg-rose-100',
                badgeText: 'text-rose-800',
                iconColor: '#e11d48'
            }
        }
        if (num <= 6) {
            return {
                bg: 'bg-amber-50/60 hover:bg-amber-50',
                border: 'border-amber-200/80',
                text: 'text-amber-700',
                badgeBg: 'bg-amber-100',
                badgeText: 'text-amber-800',
                iconColor: '#d97706'
            }
        }
        return {
            bg: 'bg-emerald-50/60 hover:bg-emerald-50',
            border: 'border-emerald-200/80',
            text: 'text-emerald-700',
            badgeBg: 'bg-emerald-100',
            badgeText: 'text-emerald-800',
            iconColor: '#059669'
        }
    }

    const styles = getColorConfig(count)

    return (
        <div className={`flex items-center gap-2.5 px-3 py-1.5 ${styles.bg} border ${styles.border} rounded-xl shadow-sm transition-all duration-200 hover:shadow w-fit cursor-pointer select-none`}>
            <Coins size={16} color={styles.iconColor} strokeWidth={2.2} />

            <span className={`text-xs font-medium ${styles.text} tracking-wide`}>
                Tokens Available
            </span>

            <span className={`inline-flex items-center justify-center min-w-7 h-5 px-1.5 text-xs font-bold ${styles.badgeBg} ${styles.badgeText} rounded-md tabular-nums shadow-sm`}>
                {count}
            </span>
        </div>
    )
}
