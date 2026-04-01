import { ShoppingBag, Plus, Minus, ChevronRight, X, Loader2 } from 'lucide-react';

export default function UnifiedTray({ cartEntries, clearCart, menu, updateCart, cartTotal, cartCount, isMobile = false, onClose, onCheckout, isProcessing = false }) {

    const renderItems = () => (
        <div className={`grow overflow-y-auto pr-2 custom-scrollbar ${isMobile ? 'space-y-4' : 'space-y-3'}`}>
            {cartEntries.length > 0 ? (
                cartEntries.map(([id, qty]) => {
                    const item = menu.find(m => String(m.id) === String(id));
                    if (!item) return null;

                    return (
                        <div key={id} className={`flex justify-between items-center bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all ${isMobile ? 'p-5' : 'p-4'}`}>
                            <div className="min-w-0 pr-2">
                                <p className="font-black text-white text-xs uppercase truncate tracking-tight">{item.name}</p>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">₹{item.price} Each</p>
                            </div>

                            <div className="flex items-center gap-3 bg-black/20 p-1.5 rounded-xl border border-white/5">
                                <button onClick={() => updateCart(id, -1)} className="p-1 text-gray-400 hover:text-orange-500 transition-colors">
                                    <Minus size={14} strokeWidth={3} />
                                </button>

                                <span className="font-black text-xs min-w-5 text-center text-orange-500">{qty}</span>

                                {/* REMOVED parseInt here */}
                                <button onClick={() => updateCart(id, 1)} className="p-1 text-gray-400 hover:text-orange-500 transition-colors">
                                    <Plus size={14} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="py-20 text-center space-y-4 opacity-30">
                    <ShoppingBag size={48} className="mx-auto text-gray-500" />
                    <p className="font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">Your tray is empty</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col h-full text-left font-sans">
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-600/20 p-2 rounded-xl border border-orange-500/20">
                        <ShoppingBag className="text-orange-500" size={20} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">
                        {isMobile ? "Order Review" : "The Tray"}
                    </h2>
                </div>
                {/* --- REPLACED COUNTER WITH CLEAR BUTTON --- */}
                {cartCount > 0 && (
                    <button
                        onClick={() => clearCart()}
                        className="group flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-xl transition-all active:scale-95"
                    >
                        <X size={14} className="text-red-500 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="text-red-500 font-black text-[10px] uppercase tracking-widest">
                            Clear
                        </span>
                    </button>
                )}
            </div>

            {renderItems()}

            <div className="mt-8 pt-8 border-t border-white/5 shrink-0">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <span className="text-gray-500 font-black uppercase text-[10px] tracking-[0.2em] block mb-1">Total Bill</span>
                        <span className="text-[10px] text-orange-500/60 font-black uppercase tracking-widest leading-none italic underline decoration-orange-500/20">Tax Included</span>
                    </div>
                    <span className="text-4xl font-black text-white tracking-tighter leading-none italic">₹{cartTotal}</span>
                </div>

                <button
                    // Disable if cart is empty OR if we are currently processing an order
                    disabled={cartCount === 0 || isProcessing}
                    onClick={onCheckout}
                    className={`
        w-full py-5 rounded-[25px] font-black text-sm uppercase tracking-widest transition-all 
        flex items-center justify-center gap-3 group active:scale-95 shadow-2xl
        ${isProcessing
                            ? 'bg-orange-900/50 text-orange-500/50 cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-500 shadow-orange-600/20'}
        disabled:opacity-20 disabled:grayscale
    `}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Confirm Order
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}