import { Plus, Minus, Tag, Ban } from 'lucide-react';

export default function FoodCard({ item, quantity, onUpdate }) {
    const isOutOfStock = item.quantity <= 0;

    return (
        <div className={`bg-white/5 backdrop-blur-md p-5 rounded-[35px] border border-white/5 transition-all duration-300 group text-left relative overflow-hidden flex flex-col h-full ${isOutOfStock ? 'opacity-60 grayscale-[0.8]' : 'hover:border-orange-500/30'}`}>

            {!isOutOfStock && (
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/5 rounded-full blur-3xl group-hover:bg-orange-600/10 transition-colors" />
            )}

            <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="text-4xl bg-white/5 w-18 h-18 flex items-center justify-center rounded-[25px] border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    {item.image}
                </div>

                <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl text-orange-500 font-black text-[9px] uppercase tracking-widest">
                    <Tag size={10} strokeWidth={3} />
                    {item.category}
                </div>
            </div>

            <div className="relative z-10 grow">
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1 italic">
                    {item.name}
                </h3>

                {!isOutOfStock && item.quantity < 5 && (
                    <p className="text-[10px] text-orange-500 font-black uppercase italic">Only {item.quantity} left!</p>
                )}
            </div>

            <div className="flex justify-between items-center mt-auto relative z-10 pt-2">
                <div className="flex flex-col leading-none">
                    <span className="text-2xl font-black text-white tracking-tighter italic">₹{item.price}</span>
                </div>

                {isOutOfStock ? (
                    <button
                        disabled
                        className="bg-white/5 border border-white/5 text-gray-500 p-3 rounded-2xl cursor-not-allowed flex items-center gap-2"
                    >
                        <Ban size={18} strokeWidth={3} />
                        <span className="font-black text-[10px] uppercase tracking-widest">Unavailable</span>
                    </button>
                ) : quantity > 0 ? (
                    <div className="flex items-center gap-4 bg-orange-600 text-white px-4 py-2 rounded-2xl shadow-xl shadow-orange-600/20 border border-orange-500 transition-all">
                        <button onClick={() => onUpdate(-1)} className="hover:scale-125 transition-transform">
                            <Minus size={18} strokeWidth={3} />
                        </button>
                        <span className="font-black text-sm w-4 text-center">{quantity}</span>
                        <button onClick={() => onUpdate(1)} className="hover:scale-125 transition-transform">
                            <Plus size={18} strokeWidth={3} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => onUpdate(1)}
                        className="bg-white/5 border border-white/10 text-white hover:bg-orange-600 hover:border-orange-500 p-3 rounded-2xl transition-all duration-300 shadow-lg active:scale-90"
                    >
                        <Plus size={22} strokeWidth={3} />
                    </button>
                )}
            </div>
        </div>
    );
}