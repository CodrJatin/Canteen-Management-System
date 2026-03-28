import { Plus, Minus, Star } from 'lucide-react';

export default function FoodCard({ item, quantity, onUpdate }) {
    return (
        <div className="bg-white p-4 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-md transition-all group text-left">
            <div className="flex justify-between items-start mb-4">
                <div className="text-4xl bg-gray-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                    {item.image}
                </div>
                <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg text-orange-600 font-black text-[10px]">
                    <Star size={10} fill="currentColor" /> {item.rating}
                </div>
            </div>
            <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">{item.name}</h3>
            <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-black text-gray-900 tracking-tighter">₹{item.price}</span>

                {quantity > 0 ? (
                    <div className="flex items-center gap-3 bg-blue-600 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-blue-100">
                        <button onClick={() => onUpdate(-1)}><Minus size={16} strokeWidth={3} /></button>
                        <span className="font-black text-sm w-4 text-center">{quantity}</span>
                        <button onClick={() => onUpdate(1)}><Plus size={16} strokeWidth={3} /></button>
                    </div>
                ) : (
                    <button
                        onClick={() => onUpdate(1)}
                        className="bg-white border-2 border-gray-100 hover:border-blue-600 hover:text-blue-600 p-2.5 rounded-xl transition-all"
                    >
                        <Plus size={20} strokeWidth={3} />
                    </button>
                )}
            </div>
        </div>
    );
}