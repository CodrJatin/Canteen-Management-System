export default function StatCard({ label, value, icon, color }) {
    const colors = { green: "bg-green-100 text-green-600", blue: "bg-blue-100 text-blue-600", orange: "bg-orange-100 text-orange-600" };
    return (
        <div className="bg-white p-5 md:p-7 rounded-[25px] md:rounded-[35px] border border-gray-100 flex items-center gap-4 md:gap-6 shadow-sm">
            <div className={`${colors[color]} p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0`}>{icon}</div>
            <div className="min-w-0">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{label}</p>
                <p className="text-xl md:text-3xl font-black text-gray-900 mt-1 truncate">{value}</p>
            </div>
        </div>
    );
}