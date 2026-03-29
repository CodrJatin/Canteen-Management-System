export default function CategoryBar({ categories, active, onSelect }) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide select-none">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={`px-7 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] whitespace-nowrap transition-all duration-300 ${active === cat
                            ? "bg-orange-600 text-white scale-105"
                            : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300 border border-white/5"
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}