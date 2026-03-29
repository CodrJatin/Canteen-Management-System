export default function TabButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center justify-center gap-2 
                px-6 md:px-8 py-2.5 md:py-3 
                rounded-xl font-black uppercase text-[10px] tracking-widest
                cursor-pointer transition-all duration-300
                flex-1 md:flex-none
                ${active
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20 scale-[1.02]"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }
            `}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}