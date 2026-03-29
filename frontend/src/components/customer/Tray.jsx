import { ShoppingBag, Plus, Minus, ChevronRight, X } from 'lucide-react';

export default function UnifiedTray({ cartEntries, menu, updateCart, cartTotal, cartCount, isMobile = false, onClose, onCheckout }) {

    const renderItems = () => (
        <div className={`grow overflow-y-auto pr-2 custom-scrollbar ${isMobile ? 'space-y-4' : 'space-y-3'}`}>
            {cartEntries.length > 0 ? (
                cartEntries.map(([id, qty]) => {
                    const item = menu.find(m => m.id === parseInt(id));
                    if (!item) return null;

                    return (
                        <div key={id} className={`flex justify-between items-center bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all ${isMobile ? 'p-5' : 'p-4'}`}>
                            <div className="min-w-0 pr-2">
                                <p className="font-black text-white text-xs uppercase truncate tracking-tight">{item.name}</p>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">₹{item.price} Each</p>
                            </div>

                            <div className="flex items-center gap-3 bg-black/20 p-1.5 rounded-xl border border-white/5">
                                <button onClick={() => updateCart(parseInt(id), -1)} className="p-1 text-gray-400 hover:text-orange-500 transition-colors">
                                    <Minus size={14} strokeWidth={3} />
                                </button>
                                <span className="font-black text-xs min-w-5 text-center text-orange-500">{qty}</span>
                                <button onClick={() => updateCart(parseInt(id), 1)} className="p-1 text-gray-400 hover:text-orange-500 transition-colors">
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
                <span className="bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded-xl font-black text-[10px] uppercase tracking-widest">
                    {cartCount} Items
                </span>
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
                    disabled={cartCount === 0}
                    onClick={onCheckout}
                    className="w-full bg-orange-600 text-white py-5 rounded-[25px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-orange-600/20 hover:bg-orange-500 disabled:opacity-20 disabled:grayscale transition-all flex items-center justify-center gap-3 group active:scale-95"
                >
                    {isMobile ? 'Initiate Payment' : 'Confirm Order'}
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}