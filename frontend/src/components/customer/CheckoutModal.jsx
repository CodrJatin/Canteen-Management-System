import React, { useState } from 'react';
import { X, Smartphone, Ticket, ArrowRight } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartTotal, cartEntries, menu }) {
    const [showToken, setShowToken] = useState(false);
    const [orderID] = useState(`ORD-${Math.floor(1000 + Math.random() * 9000)}`);

    if (!isOpen) return null;

    const qrData = `OrderID:${orderID}|Total:${cartTotal}`;
    const handleFinalClose = () => { setShowToken(false); onClose(); };

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 text-left">
            <div className="bg-[#1e293b] w-full max-w-md rounded-[45px] p-10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl" />

                <button onClick={handleFinalClose} className="absolute right-8 top-8 p-2.5 bg-white/5 text-gray-400 rounded-full hover:bg-white/10 transition-all hover:rotate-90">
                    <X size={20} />
                </button>

                {!showToken ? (
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 italic text-white">Payment<span className="text-orange-500">.</span></h2>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-10">Select gateway to continue</p>

                        <button className="w-full bg-orange-600/10 border-2 border-orange-500/20 p-8 rounded-[35px] flex flex-col items-center gap-4 group hover:bg-orange-600 hover:border-orange-500 transition-all active:scale-95 mb-10">
                            <div className="bg-orange-500 p-4 rounded-2xl text-white shadow-xl shadow-orange-600/30 group-hover:bg-white group-hover:text-orange-600 transition-colors">
                                <Smartphone size={32} />
                            </div>
                            <span className="font-black text-orange-500 uppercase text-xs tracking-widest group-hover:text-white transition-colors">Open UPI Apps</span>
                        </button>

                        <div className="space-y-4 mb-10 bg-black/20 p-6 rounded-[30px] border border-white/5">
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Order Summary</p>
                            <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                {cartEntries.map(([id, qty]) => {
                                    const item = menu.find(m => m.id === parseInt(id));
                                    return (
                                        <div key={id} className="flex justify-between text-[11px] font-black uppercase tracking-tight">
                                            <span className="text-gray-400">{item?.name} x{qty}</span>
                                            <span className="text-white">₹{qty * (item?.price || 0)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="pt-4 mt-2 border-t border-white/5 flex justify-between items-center">
                                <span className="text-2xl font-black text-white italic tracking-tighter">₹{cartTotal}</span>
                                <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Total Payable</span>
                            </div>
                        </div>

                        <button onClick={() => setShowToken(true)} className="w-full bg-white text-gray-900 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-500 hover:text-white shadow-2xl transition-all flex items-center justify-center gap-2 group">
                            Mark as Paid <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                        <div className="bg-orange-600/20 p-4 rounded-2xl text-orange-500 mb-6 border border-orange-500/20"><Ticket size={32} /></div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white mb-2">Token Issued</h2>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-10">Present at counter to collect food</p>

                        <div className="bg-white p-8 rounded-[45px] shadow-2xl shadow-black/50 mb-10 relative border-[6px] border-[#0f172a]">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`} alt="Token" className="w-48 h-48" />
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-6 py-1.5 rounded-full text-xs font-black shadow-xl border-2 border-[#1e293b]">
                                {orderID}
                            </div>
                        </div>

                        <div className="bg-orange-600/10 p-5 rounded-2xl w-full mb-10 border border-orange-500/10">
                            <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">Queue Status</p>
                            <p className="font-black text-white uppercase italic text-sm animate-pulse">Waiting for Kitchen...</p>
                        </div>

                        <button onClick={handleFinalClose} className="w-full bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">Dismiss</button>
                    </div>
                )}
            </div>
        </div>
    );
}