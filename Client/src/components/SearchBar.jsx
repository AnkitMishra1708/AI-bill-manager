import { Search } from "lucide-react";

export const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-5 py-3.5">
      <Search className="h-5 w-5 text-stone-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder || "Search…"}
        className="w-full bg-transparent text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none"
      />
    </div>
  );
}
