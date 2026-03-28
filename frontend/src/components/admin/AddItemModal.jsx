import { useState } from "react";
export default function AddItemModal({ onClose, onAdd }) {
    const [form, setForm] = useState({ name: '', price: '', quantity: '' });
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[30px] md:rounded-[35px] p-6 md:p-8 shadow-2xl text-left">
                <h2 className="text-xl md:text-2xl font-black text-gray-900">New Item</h2>
                <div className="mt-6 space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Name</label>
                        <input className="w-full mt-1 px-5 py-3 bg-gray-50 border rounded-2xl font-bold outline-none" placeholder="e.g. Vada" onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Price (₹)</label>
                            <input type="number" className="w-full mt-1 px-5 py-3 bg-gray-50 border rounded-2xl font-bold outline-none" placeholder="0" onChange={e => setForm({ ...form, price: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Initial Stock</label>
                            <input type="number" className="w-full mt-1 px-5 py-3 bg-gray-50 border rounded-2xl font-bold outline-none" placeholder="0" onChange={e => setForm({ ...form, quantity: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button onClick={onClose} className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-2xl cursor-pointer">Cancel</button>
                        <button onClick={() => onAdd(form)} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 cursor-pointer">Add Item</button>
                    </div>
                </div>
            </div>
        </div>
    );
}