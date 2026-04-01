import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, Clock, Receipt, QrCode } from 'lucide-react';
import API_BASE_URL from '../../api/config';
import {QRCode} from 'react-qr-code';

export default function MyOrdersModal({ isOpen, onClose, userId }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    // 1. State to track which order's QR to show
    const [qrTarget, setQrTarget] = useState(null);

    useEffect(() => {
        if (isOpen && userId) {
            fetchUserOrders();
        }
    }, [isOpen, userId]);

    const fetchUserOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching user orders:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-[#1e293b] w-full max-w-2xl h-[80vh] rounded-[45px] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.7)] border border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 relative">

                <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

                <header className="p-8 md:p-10 border-b border-white/5 flex justify-between items-center bg-white/2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/20">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Order History<span className="text-orange-500">.</span></h2>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Track your canteen requests</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all">
                        <X size={24} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-50">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Accessing Ledger...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <Receipt size={48} className="mb-4" />
                            <p className="font-bold italic text-lg uppercase tracking-tight">No active orders found</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white/5 border border-white/5 rounded-4xl overflow-hidden hover:border-orange-500/30 transition-all group">
                                <div className="p-6 flex flex-wrap justify-between items-center gap-4 border-b border-white/5 bg-white/2">
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm font-black text-white italic tracking-tight uppercase">{order.id}</p>

                                        {/* 2. Updated QR Button Trigger */}
                                        <button
                                            onClick={() => setQrTarget(order)}
                                            className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all active:scale-90 group"
                                            title="Show Order QR"
                                        >
                                            <QrCode size={16} />
                                        </button>

                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.status === 'Served' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                            order.status === 'Preparing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500 animate-pulse' :
                                                'bg-orange-500/10 border-orange-500/20 text-orange-500'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                            <Clock size={14} /> {order.timePaid}
                                        </div>
                                        <p className="text-lg font-black text-white italic tracking-tighter">₹{order.total}</p>
                                    </div>
                                </div>

                                <div className="p-6 bg-black/20">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                                <p className="text-xs font-bold text-gray-300 uppercase tracking-tight">
                                                    <span className="text-orange-500 font-black mr-2">{item.qty}x</span> {item.name}
                                                </p>
                                                <p className="text-[10px] font-black text-white opacity-50 italic">₹{item.price * item.qty}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* --- 3. THE QR MODAL POPUP --- */}
            {qrTarget && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#1e293b] w-full max-w-sm rounded-[45px] p-10 border border-white/10 shadow-2xl text-center relative animate-in zoom-in-95 duration-300">
                        {/* Close Button */}
                        <button
                            onClick={() => setQrTarget(null)}
                            className="absolute right-6 top-6 p-2 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-8">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Order Ticket<span className="text-orange-500">.</span></h3>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Scan at the counter</p>
                        </div>

                        {/* Visual QR Container */}
                        <div className="bg-white p-6 rounded-[35px] inline-block shadow-2xl shadow-orange-500/10 mb-8">
                            <div className="w-48 h-48 bg-[#0f172a] rounded-2xl flex items-center justify-center relative overflow-hidden">
                                <QRCode
                                    value={qrTarget.id || "N/A"}
                                    size={180}
                                    level="H"
                                    fgColor="#0f172a"
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 py-4 rounded-2xl">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 leading-none">Token ID</p>
                            <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{qrTarget.id}</p>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(249, 115, 22, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(249, 115, 22, 0.5); }
            `}} />
        </div>
    );
}