export const StatCard = ({ label, value }) => {
  return (
    <div className="flex-1 rounded-2xl border border-stone-200 bg-white px-6 py-5">
      <p className="text-xs font-medium tracking-wide text-stone-400">
        {label}
      </p>
      <p className="mt-2 font-mono text-3xl font-bold text-stone-900">
        {value}
      </p>
    </div>
  );
}
