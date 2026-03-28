export default function CategoryBar({ categories, active, onSelect }) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all text-sm ${active === cat
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                            : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}