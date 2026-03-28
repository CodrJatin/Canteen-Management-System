export default function TabButton({ active, onClick, icon, label }) {
    return (
        <button onClick={onClick} className={`flex items-center justify-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold cursor-pointer transition-all flex-1 md:flex-none ${active ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:bg-gray-100"}`}>
            {icon} {label}
        </button>
    );
}