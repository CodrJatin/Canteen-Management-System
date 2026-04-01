import { Edit3, Check, X, Trash2, AlertTriangle, Tag } from "lucide-react"
import { useState } from 'react';

export default function EditableRow({ item, onSave, onDeleteReq, mobile }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...item });

    const handleSave = () => {
        onSave(editData);
        setIsEditing(false);
    };

    // --- MOBILE EDITING VIEW (GLASS) ---
    if (isEditing && mobile) {
        return (
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 space-y-4 w-full animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Item Name & Category</p>
                    <input
                        className="w-full p-3 bg-white/5 border border-white/5 rounded-xl font-bold text-white outline-none focus:border-orange-500/50 transition-all"
                        value={editData.name}
                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Item Name"
                    />
                    <input
                        className="w-full p-3 bg-white/5 border border-white/5 rounded-xl font-bold text-orange-500 outline-none focus:border-orange-500/50 transition-all text-xs uppercase tracking-widest"
                        value={editData.category}
                        onChange={e => setEditData({ ...editData, category: e.target.value })}
                        placeholder="Category (e.g. Snacks)"
                    />
                </div>

                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 font-bold text-xs">₹</span>
                        <input
                            type="number"
                            className="w-full pl-7 pr-3 py-3 bg-white/5 border border-white/5 rounded-xl font-bold text-white outline-none focus:border-orange-500/50 transition-all"
                            value={editData.price}
                            onChange={e => setEditData({ ...editData, price: e.target.value })}
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            type="number"
                            className="w-full px-3 py-3 bg-white/5 border border-white/5 rounded-xl font-bold text-white outline-none text-center focus:border-orange-500/50 transition-all"
                            value={editData.quantity}
                            onChange={e => setEditData({ ...editData, quantity: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <button onClick={handleSave} className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-600/20">Save Changes</button>
                    <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-white/5 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest border border-white/5">Cancel</button>
                </div>
            </div>
        );
    }

    // --- MOBILE VIEW ---
    if (mobile) {
        return (
            <div className="border-b border-white/5 pb-5 mb-5 last:border-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-black text-lg text-white tracking-tight italic uppercase">{item.name}</h3>
                        <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em]">{item.category}</span>
                    </div>
                    <span className="font-black text-orange-500 text-xl italic">₹{item.price}</span>
                </div>

                <div className="flex items-center gap-4 mt-3">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${item.quantity < 10 ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-gray-400'}`}>
                        {item.quantity} Units Left
                    </span>
                </div>

                <div className="flex gap-2 mt-4">
                    <button onClick={() => setIsEditing(true)} className="flex-1 py-3 bg-white/5 text-gray-300 rounded-xl font-black text-[10px] uppercase tracking-widest border border-white/5 flex items-center justify-center gap-2">
                        <Edit3 size={14} /> Edit
                    </button>
                    <button onClick={() => onDeleteReq(item)} className="flex-1 py-3 bg-red-500/10 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-red-500/10 flex items-center justify-center gap-2">
                        <Trash2 size={14} /> Remove
                    </button>
                </div>
            </div>
        );
    }

    // --- DESKTOP EDITING VIEW ---
    if (isEditing) {
        return (
            <tr className="bg-orange-600/5 border-y border-orange-500/20 animate-in fade-in duration-300">
                <td className="py-4 px-4">
                    <input className="w-full p-3 bg-[#0f172a] border border-white/5 rounded-xl font-bold text-white outline-none focus:border-orange-500/50" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                </td>
                <td className="py-4 px-4">
                    <input className="w-full p-3 bg-[#0f172a] border border-white/5 rounded-xl font-bold text-orange-500 outline-none focus:border-orange-500/50 uppercase tracking-widest text-xs" value={editData.category} onChange={e => setEditData({ ...editData, category: e.target.value })} />
                </td>
                <td className="py-4 px-4">
                    <input type="number" className="w-full p-3 bg-[#0f172a] border border-white/5 rounded-xl font-bold text-white outline-none focus:border-orange-500/50" value={editData.price} onChange={e => setEditData({ ...editData, price: e.target.value })} />
                </td>
                <td className="py-4 px-4">
                    <input type="number" className="w-24 p-3 bg-[#0f172a] border border-white/5 rounded-xl font-bold text-white outline-none text-center focus:border-orange-500/50" value={editData.quantity} onChange={e => setEditData({ ...editData, quantity: e.target.value })} />
                </td>
                <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button onClick={handleSave} className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-500 shadow-lg shadow-orange-600/20 transition-all"><Check size={18} strokeWidth={3} /></button>
                        <button onClick={() => setIsEditing(false)} className="p-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 border border-white/5 transition-all"><X size={18} /></button>
                    </div>
                </td>
            </tr>
        );
    }

    // --- DESKTOP VIEW ---
    return (
        <tr className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors group">
            <td className="py-6 px-4 font-black text-white text-lg italic tracking-tight uppercase">{item.name}</td>

            {/* --- CATEGORY CELL --- */}
            <td className="py-6 px-4">
                <span className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] bg-orange-500/5 border border-orange-500/10 px-3 py-1.5 rounded-xl w-fit">
                    <Tag size={10} strokeWidth={3} />
                    {item.category || "All"}
                </span>
            </td>

            <td className="py-6 px-4 font-black text-orange-500 text-xl italic tracking-tighter">₹{item.price}</td>
            <td className="py-6 px-4">
                <div className="flex items-center gap-2">
                    <span className="font-black text-xl text-white italic">{item.quantity}</span>
                    <span className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em]">Units</span>
                    {item.quantity < 10 && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                </div>
            </td>
            <td className="py-6 px-4 text-right">
                <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setIsEditing(true)} className="p-3 text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border border-white/5">
                        <Edit3 size={16} /> Edit
                    </button>
                    <button onClick={() => onDeleteReq(item)} className="p-3 text-red-500/70 bg-red-500/5 hover:bg-red-500 hover:text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border border-red-500/10">
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}