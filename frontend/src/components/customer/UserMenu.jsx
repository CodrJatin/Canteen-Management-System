import React from 'react';
import { CircleUserRound, ShoppingBag, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router";

export default function UserMenu({ isOpen, onClose, userName, userRole, onNavigate }) {

    const { logout } = useAuth();
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop to close when clicking outside */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            <div className="absolute right-0 mt-4 w-72 bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-50 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">

                {/* --- USER IDENTITY SECTION --- */}
                <div className="bg-blue-50/50 p-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-blue-600 shadow-sm mb-3 border-4 border-white">
                        <CircleUserRound size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">
                        {userName}
                    </h3>
                    {/* Role Badge */}
                    <span className="mt-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-100">
                        {userRole}
                    </span>
                </div>

                {/* --- ACTIONS SECTION --- */}
                <div className="p-3">
                    <button
                        onClick={() => { onNavigate('orders'); onClose(); }}
                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ShoppingBag size={20} />
                            </div>
                            <span className="font-bold text-gray-700">My Orders</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                    </button>

                    <div className="h-px bg-gray-100 mx-4 my-2" />

                    <button
                        className="w-full flex items-center p-4 rounded-2xl hover:bg-red-50 text-red-500 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            
                            <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-3 md:px-5 py-2 rounded-2xl transition-all cursor-pointer">
                                <LogOut size={18} /> <span>Logout</span>
                            </button>
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}