import React from 'react';
import { X, CheckCircle2, Copy, Download, Zap, CheckCircle } from 'lucide-react';
import {QRCode} from 'react-qr-code';

export default function CheckoutModal({ isOpen, onClose, orderId, totalAmount }) {
    if (!isOpen) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(orderId);

    };

    return (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-4">

            <div
                className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm bg-[#1e293b] rounded-[40px] border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">

                <div className="p-4 mt-6 flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} className="text-white" />
                    <span className="font-black uppercase text-xs tracking-[0.2em] text-white">Order Confirmed</span>
                </div>

                <div className="p-8 flex flex-col items-center text-center">

                    <div className="p-6 bg-white rounded-4xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] mb-6 transition-transform hover:scale-105 duration-500">
                        <QRCode
                            value={orderId || "N/A"}
                            size={180}
                            level="H"
                            fgColor="#0f172a"
                            className="rounded-xl"
                        />
                    </div>

                    <div className="space-y-1 mb-8">
                        <h3 className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Digital Token</h3>
                        <div className="flex items-center gap-2 justify-center group">
                            <span className="text-white font-mono text-sm opacity-80 select-all">{orderId}</span>
                            <button onClick={copyToClipboard} className="text-orange-500 hover:text-white transition-colors">
                                <Copy size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 mb-8 flex justify-between items-center">
                        <div className="text-left">
                            <span className="block text-[8px] font-black text-gray-500 uppercase tracking-widest">Amount Paid</span>
                            <span className="text-2xl font-black text-white italic tracking-tighter">₹{totalAmount}</span>
                        </div>
                        <div className="h-10 w-10 bg-orange-600/20 rounded-2xl flex items-center justify-center text-orange-500">
                            <CheckCircle size={20} />
                        </div>
                    </div>

                    <p className="text-shadow-xs text-gray-500 font-medium mb-8 leading-relaxed px-4">
                        Show this QR code at the <span className="text-white font-bold italic">Scanner</span> to initiate your order.
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full py-5 bg-white/5 border border-white/10 rounded-[25px] text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}