import React, { useState } from 'react';
import { CheckCircle, X, Smartphone, Ticket } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartTotal, cartEntries, menu }) {
    const [showToken, setShowToken] = useState(false);
    const [orderID] = useState(`ORD-${Math.floor(1000 + Math.random() * 9000)}`);

    if (!isOpen) return null;

    const qrData = `OrderID:${orderID}|Total:${cartTotal}`;
    const upiLink = `upi://pay?pa=canteen@upi&pn=CanteenManager&am=${cartTotal}&cu=INR`;

    const handleFinalClose = () => {
        setShowToken(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
            <div className="bg-white w-full max-w-md rounded-[35px] p-8 shadow-2xl animate-in zoom-in-95 relative">
                <button onClick={handleFinalClose} className="absolute right-6 top-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <X size={20} />
                </button>

                {!showToken ? (
                    /* --- PAYMENT VIEW --- */
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-2 italic text-blue-600">Final Step</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Choose your payment method below</p>

                        <div className="mb-8">
                            <a href={upiLink} className="w-full bg-blue-50 border-2 border-blue-100 p-6 rounded-[25px] flex flex-col items-center gap-2 group hover:bg-blue-100 transition-all active:scale-95">
                                <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg"><Smartphone size={28} /></div>
                                <span className="block font-black text-blue-600 uppercase text-sm tracking-tight text-center">Pay via UPI App</span>
                            </a>
                        </div>

                        <div className="space-y-3 mb-8 bg-gray-50 p-5 rounded-3xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Order Review</p>
                            <div className='overflow-y-scroll max-h-24 pr-2 scrollbar-thin'>
                                {cartEntries.map(([id, qty]) => {
                                    const item = menu.find(m => m.id === parseInt(id));
                                    return (
                                        <div key={id} className="flex justify-between text-xs font-bold uppercase mb-2">
                                            <span className="text-gray-500">{item?.name} x{qty}</span>
                                            <span className="text-gray-900 font-black">₹{qty * (item?.price || 0)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="pt-3 mt-1 border-t border-gray-200 flex justify-between items-center">
                                <span className="font-black text-sm text-gray-400 uppercase">Total</span>
                                <span className="font-black text-2xl text-gray-900 tracking-tighter">₹{cartTotal}</span>
                            </div>
                        </div>

                        <button onClick={() => setShowToken(true)} className="w-full bg-green-500 text-white py-5 rounded-2xl font-black text-lg uppercase shadow-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                            <CheckCircle size={22} strokeWidth={3} /> I Have Paid
                        </button>
                    </div>
                ) : (
                    /* --- TOKEN VIEW (QR TOKEN) --- */
                    <div className="flex flex-col items-center animate-in zoom-in-95 duration-300 text-center">
                        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 mb-4"><Ticket size={32} /></div>
                        <h2 className="text-2xl font-black uppercase tracking-tight italic text-gray-900">Your Token</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Scan this to the counter</p>

                        <div className="bg-white p-6 rounded-[40px] shadow-inner border-4 border-blue-50 mb-6 relative">
                            {/* API-BASED QR CODE (Works everywhere) */}
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`}
                                alt="Token"
                                className="w-45 h-45"
                            />
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[12px] font-black shadow-lg">
                                {orderID}
                            </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-2xl w-full mb-8">
                            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Status</p>
                            <p className="font-black text-gray-800 uppercase italic text-sm">Waiting for Kitchen</p>
                        </div>

                        <button onClick={handleFinalClose} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest">Done & Close</button>
                    </div>
                )}
            </div>
        </div>
    );
}