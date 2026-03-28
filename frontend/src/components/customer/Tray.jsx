import { ShoppingBag, Plus, Minus, ChevronRight, X, Trash2 } from 'lucide-react';

export default function UnifiedTray({
    cartEntries,
    menu,
    updateCart,
    cartTotal,
    cartCount,
    isMobile = false,
    onClose,
    onCheckout
}) {

    const renderItems = () => (
        <div className={`grow overflow-y-auto pr-2 custom-scrollbar ${isMobile ? 'space-y-3 px-1' : 'space-y-2'}`}>
            {cartEntries.length > 0 ? (
                cartEntries.map(([id, qty]) => {
                    const item = menu.find(m => m.id === parseInt(id));
                    if (!item) return null;

                    return (
                        <div
                            key={id}
                            className={`flex justify-between items-center bg-gray-50/50 rounded-xl border border-transparent hover:border-gray-200 transition-all ${isMobile ? 'p-4' : 'p-3'}`}
                        >
                            <div className="min-w-0 pr-2">
                                <p className="font-bold text-gray-900 text-xs uppercase truncate leading-tight">
                                    {item.name}
                                </p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                                    {qty} x ₹{item.price}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateCart(parseInt(id), -1)}
                                    className="p-1.5 hover:text-red-500 transition-colors"
                                >
                                    <Minus size={isMobile ? 16 : 12} strokeWidth={3} />
                                </button>

                                <span className="font-black text-xs min-w-7.5 text-center text-gray-700">
                                    {isMobile ? qty : `₹${qty * item.price}`}
                                </span>

                                <button
                                    onClick={() => updateCart(parseInt(id), 1)}
                                    className="p-1.5 hover:text-blue-600 transition-colors"
                                >
                                    <Plus size={isMobile ? 16 : 12} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="py-16 text-center space-y-3 opacity-20 grayscale">
                    <ShoppingBag size={40} className="mx-auto" />
                    <p className="font-black uppercase text-[10px] tracking-[0.2em]">Tray is empty</p>
                </div>
            )}
        </div>
    );
    return (
        <div className="flex flex-col h-full text-left">
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between mb-5 px-1 shrink-0">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="text-blue-600" size={20} strokeWidth={2.5} />
                    <h2 className="text-lg font-black uppercase tracking-tighter italic text-gray-900">
                        {isMobile ? "Review Tray" : "Your Tray"}
                    </h2>
                </div>

                {isMobile ? (
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition-colors"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                ) : (
                    <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg font-black text-[10px] uppercase tracking-widest">
                        {cartCount} Items
                    </span>
                )}
            </div>

            {/* --- SCROLLABLE LIST --- */}
            {renderItems()}

            {/* --- FOOTER --- */}
            <div className="mt-5 pt-5 border-t-2 border-dashed border-gray-50 px-1 shrink-0">
                <div className="flex justify-between items-center mb-5">
                    <div>
                        <span className="text-gray-400 font-bold uppercase text-[9px] tracking-[0.2em] block">
                            Grand Total
                        </span>
                        <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">
                            Incl. all taxes
                        </span>
                    </div>
                    <span className="text-3xl font-black text-gray-900 tracking-tighter leading-none">
                        ₹{cartTotal}
                    </span>
                </div>

                <button
                    disabled={cartCount === 0}
                    onClick={onCheckout}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-base uppercase tracking-tight shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-300 disabled:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                    {isMobile ? 'Confirm & Pay' : 'Confirm Order'}
                    <ChevronRight size={18} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
}