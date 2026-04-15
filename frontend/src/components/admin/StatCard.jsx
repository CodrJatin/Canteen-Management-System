import React from 'react';

export default function StatCard({ label, value, icon, color }) {

    const colors = {
        orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        white: "bg-white/10 text-white border-white/20",
        red: "bg-red-500/10 text-red-500 border-red-500/20",
        green: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    };

    return (
        <div className="bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-[35px] md:rounded-[45px] border border-white/10 flex items-center gap-5 md:gap-7 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] group hover:bg-white/8 transition-all duration-500 relative overflow-hidden">

            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40 ${color === 'orange' ? 'bg-orange-500' : color === 'red' ? 'bg-red-500' : 'bg-white'}`} />

            <div className={`${colors[color] || colors.white} p-4 md:p-5 rounded-[22px] md:rounded-[28px] shrink-0 border shadow-inner flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                {icon}
            </div>

            <div className="min-w-0 relative z-10">
                <p className="text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-[0.25em] truncate mb-1 leading-none">
                    {label}
                </p>
                <p className="text-2xl md:text-4xl font-black text-white tracking-tighter italic truncate leading-tight">
                    {value}
                </p>
            </div>
        </div>
    );
}