
import { Edit3, Check, X , Trash2} from "lucide-react"
import { useState } from 'react';

export default function EditableRow({ item, onSave, onDeleteReq, mobile }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...item });

    const handleSave = () => {
        onSave(item.id, editData);
        setIsEditing(false);
    };

    // --- MOBILE EDITING VIEW (FIXED OVERFLOW) ---
    if (isEditing && mobile) {
        return (
            <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100 space-y-3 w-full box-border">
                {/* Item Name Input - Full width */}
                <input
                    className="w-full p-2.5 bg-white border border-blue-200 rounded-lg font-bold outline-none text-sm"
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Item Name"
                />

                {/* Price and Qty Inputs - 50/50 split */}
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                        <input
                            type="number"
                            className="w-full pl-6 pr-2 py-2.5 bg-white border border-blue-200 rounded-lg font-bold outline-none text-sm"
                            value={editData.price}
                            onChange={e => setEditData({ ...editData, price: e.target.value })}
                            placeholder="Price"
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            type="number"
                            className="w-full px-2 py-2.5 bg-white border border-blue-200 rounded-lg font-bold outline-none text-center text-sm"
                            value={editData.quantity}
                            onChange={e => setEditData({ ...editData, quantity: e.target.value })}
                            placeholder="Stock"
                        />
                    </div>
                </div>

                {/* Action Buttons - 50/50 split */}
                <div className="flex gap-2">
                    <button onClick={handleSave} className="flex-1 py-2.5 bg-green-500 text-white rounded-xl font-bold text-sm shadow-sm">Save Changes</button>
                    <button onClick={() => setIsEditing(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-500 rounded-xl font-bold text-sm">Cancel</button>
                </div>
            </div>
        );
    }

    // --- MOBILE VIEW ---
    if (mobile) {
        return (
            <div className="border-b border-gray-100 pb-4">
                <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h3>
                <div className="flex items-center gap-3 mt-1.5">
                    <span className="font-black text-gray-700">₹{item.price}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.quantity < 10 ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                        {item.quantity} In Stock
                    </span>
                </div>
                <div className="flex gap-2 mt-3.5">
                    <button onClick={() => setIsEditing(true)} className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
                        <Edit3 size={14} /> Edit
                    </button>
                    <button onClick={() => onDeleteReq(item)} className="flex-1 py-2.5 bg-red-50 text-red-500 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
                        <Trash2 size={14} /> Remove
                    </button>
                </div>
            </div>
        );
    }

    // --- DESKTOP EDITING VIEW ---
    if (isEditing) {
        return (
            <tr className="bg-blue-50/50">
                <td className="py-4 px-4"><input className="w-full p-2 bg-white border border-blue-200 rounded-lg font-bold outline-none" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} /></td>
                <td className="py-4 px-4"><input type="number" className="w-full p-2 bg-white border border-blue-200 rounded-lg font-bold outline-none" value={editData.price} onChange={e => setEditData({ ...editData, price: e.target.value })} /></td>
                <td className="py-4 px-4"><input type="number" className="w-24 p-2 bg-white border border-blue-200 rounded-lg font-bold outline-none text-center" value={editData.quantity} onChange={e => setEditData({ ...editData, quantity: e.target.value })} /></td>
                <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button onClick={handleSave} className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 cursor-pointer"><Check size={18} /></button>
                        <button onClick={() => setIsEditing(false)} className="p-2.5 bg-gray-200 text-gray-600 rounded-xl hover:bg-gray-300 cursor-pointer"><X size={18} /></button>
                    </div>
                </td>
            </tr>
        );
    }

    // --- DESKTOP VIEW ---
    return (
        <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
            <td className="py-6 px-4 font-bold text-gray-900 text-lg">{item.name}</td>
            <td className="py-6 px-4 font-black text-gray-700 text-lg">₹{item.price}</td>
            <td className="py-6 px-4 font-black text-xl text-gray-900">{item.quantity} <span className="text-[10px] text-gray-400 uppercase font-bold ml-1">Units</span></td>
            <td className="py-6 px-4 text-right">
                <div className="flex justify-end gap-2">
                    <button onClick={() => setIsEditing(true)} className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all cursor-pointer font-bold text-sm flex items-center gap-1">
                        <Edit3 size={16} /> Edit
                    </button>
                    <button onClick={() => onDeleteReq(item)} className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-2xl transition-all cursor-pointer font-bold text-sm flex items-center gap-1">
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}