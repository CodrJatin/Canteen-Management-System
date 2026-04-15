import { useState } from "react";
import { X, PackagePlus, ChevronDown } from "lucide-react";

export default function AddItemModal({ onClose, onAdd }) {
    const [form, setForm] = useState({ name: '', price: '', quantity: '', category: '' });

    const categories = ["Main Course", "Snacks", "Beverages", "Desserts"];

    const handleSubmit = () => {

        if (!form.name || !form.price || !form.quantity || !form.category) {
            alert("Please fill in all fields including Category");
            return;
        }
        onAdd(form);
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-[#1e293b] w-full max-w-md rounded-[45px] p-8 md:p-12 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.7)] border border-white/10 animate-in zoom-in-95 relative overflow-hidden text-left">

                <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute right-8 top-8 p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                <header className="mb-10">
                    <div className="bg-orange-600/10 w-14 h-14 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/20 mb-6">
                        <PackagePlus size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">
                        New Entry<span className="text-orange-500">.</span>
                    </h2>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-2">
                        Append to Database
                    </p>
                </header>

                <div className="space-y-6">

                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Item Designation</label>
                        <input
                            className="w-full mt-2 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl font-bold text-white outline-none focus:bg-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-gray-700"
                            placeholder="e.g. Masala Dosa"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Classification</label>
                        <div className="relative">
                            <select
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                className="w-full mt-2 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl font-bold text-white outline-none focus:bg-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled className="bg-[#1e293b]">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat} className="bg-[#1e293b]">{cat}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-6 top-[60%] -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-orange-500 transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">

                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Price (₹)</label>
                            <input
                                type="number"
                                className="w-full mt-2 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl font-bold text-white outline-none focus:bg-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-gray-700"
                                placeholder="0"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Initial Units</label>
                            <input
                                type="number"
                                className="w-full mt-2 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl font-bold text-white outline-none focus:bg-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-gray-700"
                                placeholder="0"
                                value={form.quantity}
                                onChange={e => setForm({ ...form, quantity: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 font-black text-[10px] uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-2xl transition-all"
                        >
                            Abort
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-2 py-4 bg-orange-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-500 shadow-2xl shadow-orange-600/20 active:scale-95 transition-all px-8"
                        >
                            Commit to Stock
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}