import React from 'react';
import { X, CircleUserRound, ShoppingBag, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router";

export default function UserMenu({ isOpen, onClose, userName, userRole, onNavigate, isMyOrders }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <>

            <div className="fixed inset-0 z-40 h-100vh bg-black/60 backdrop-blur-[2px]" onClick={onClose} />

            <div className="absolute right-0 mt-6 w-80 bg-[#1e293b] backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] overflow-hidden z-50 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 origin-top-right">

                <div className="p-8 flex flex-col items-center text-center relative">
                    <button onClick={onClose} className="absolute right-8 top-8 p-2.5 bg-white/5 text-gray-400 rounded-full hover:bg-white/10 transition-all hover:rotate-90">
                        <X size={20} />
                    </button>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[60px] -z-10" />

                    <div className="w-20 h-20 bg-[#0f172a]/80 rounded-[28px] flex items-center justify-center text-orange-500 shadow-2xl mb-4 border border-white/5 group">
                        <CircleUserRound size={48} strokeWidth={1.2} className="group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <h3 className="text-xl font-black text-white tracking-tight leading-tight">
                        {userName}
                    </h3>

                    <span className="mt-3 px-4 py-1.5 bg-orange-600/20 border border-orange-500/20 text-orange-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                        {userRole}
                    </span>
                </div>

                <div className="p-4 bg-black/20 border-t border-white/5 space-y-2">
                    <button
                        onClick={() => { isMyOrders(true); onClose(); }}
                        className="w-full flex items-center justify-between p-4 rounded-3xl hover:bg-white/5 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-orange-600/10 text-orange-500 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                                <ShoppingBag size={20} />
                            </div>
                            <span className="font-bold text-gray-300 group-hover:text-white transition-colors text-sm">My Orders</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-700 group-hover:text-orange-500 transition-all group-hover:translate-x-1" />
                    </button>

                    <button
                        onClick={() => { logout(); navigate("/"); }}
                        className="w-full flex items-center p-4 rounded-3xl hover:bg-red-500/10 text-red-500 transition-all group gap-4"
                    >
                        <div className="p-2.5 bg-red-500/10 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all duration-300 text-red-500">
                            <LogOut size={20} />
                        </div>
                        <span className="font-bold text-sm">Logout Session</span>
                    </button>
                </div>
            </div>
        </>
    );
}