import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from "../../context/authContext";
import Toast from '../Toast';

export default function WalletModal({ isOpen, onClose, currentBalance }) {
    const [amount, setAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { user, login } = useAuth();
    const quickAmounts = [100, 200, 500, 1000];
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    if (!isOpen) return null;

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const handleRecharge = async () => {
        if (!amount || parseFloat(amount) <= 0 || isProcessing) {
            showToast("Please enter a valid amount", "error");
            return;
        }

        setIsProcessing(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/wallet/recharge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user?.id,
                    amount: parseFloat(amount)
                })
            });

            const data = await response.json();

            if (response.ok) {
                const updatedUser = {
                    ...user,
                    walletBalance: (Number(user.walletBalance) || 0) + parseFloat(amount)
                };

                login(updatedUser);
                showToast(`Successfully added ₹${amount} to your wallet!`, "success");

                setTimeout(() => {
                    setAmount("");
                    setIsProcessing(false);
                    onClose();
                }, 1500); // Increased slightly so user can read the success toast
            } else {
                console.error("Server Error:", data.error);
                setIsProcessing(false);
                showToast(data.error || "Recharge failed", "error");
            }
        } catch (err) {
            console.error("Network Error:", err);
            setIsProcessing(false);
            showToast("Connection lost. Check your internet.", "error");
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* --- Toast Container --- */}
            {toast.show && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 z-110 w-full max-w-xs">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast({ ...toast, show: false })}
                    />
                </div>
            )}

            {/* Backdrop Blur */}
            <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-[#1e293b] rounded-[45px] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(234,88,12,0.15)] animate-in zoom-in-95 duration-300">

                {/* --- HEADER --- */}
                <div className="p-8 pb-0 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">
                            Digital Wallet<span className="text-orange-500">.</span>
                        </h2>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Refill Credits</p>
                    </div>
                    <button
                        onClick={() => { onClose(); setAmount(""); }}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 transition-all active:scale-90 border border-white/5"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* --- CURRENT BALANCE PILL --- */}
                    <div className="bg-linear-to-r from-orange-600/20 to-transparent border-l-4 border-orange-600 p-6 rounded-3xl">
                        <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em] block mb-1">Live Balance</span>
                        <span className="text-4xl font-black text-white italic tracking-tighter">₹{currentBalance}</span>
                    </div>

                    {/* --- INPUT SECTION --- */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-orange-500 italic">₹</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 pl-12 pr-6 text-2xl font-black text-white outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all placeholder:text-gray-700"
                            />
                        </div>

                        {/* QUICK ADD BUTTONS */}
                        <div className="grid grid-cols-4 gap-2">
                            {quickAmounts.map(amt => (
                                <button
                                    key={amt}
                                    onClick={() => setAmount(prev => (Number(prev) + amt).toString())}
                                    className="py-2.5 bg-white/5 border border-white/5 rounded-xl text-s font-black text-gray-400 hover:bg-orange-600 hover:text-white hover:border-orange-500 transition-all uppercase tracking-tighter"
                                >
                                    +{amt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- CTA BUTTON --- */}
                    <button
                        onClick={handleRecharge}
                        disabled={isProcessing || !amount}
                        className="w-full bg-orange-600 text-white py-5 rounded-[25px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-orange-600/30 hover:bg-orange-500 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 group"
                    >
                        {isProcessing ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                                Add Amount
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}