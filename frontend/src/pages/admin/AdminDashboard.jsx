import React, { useState, useEffect } from 'react';
import {
    LogOut, Package, ShoppingBag, Plus, Edit3, Check, X, Trash2,
    AlertCircle, TrendingUp, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // --- STATES ---
    const [activeTab, setActiveTab] = useState('stock');
    const [inventory, setInventory] = useState([]);
    const [stats, setStats] = useState({ revenue: 4250, orders: 128, lowStock: 5 });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Initial Data Load
    useEffect(() => {
        setInventory([
            { id: 1, name: 'Masala Dosa', price: 60, quantity: 45 },
            { id: 2, name: 'Thali Special', price: 120, quantity: 12 },
            { id: 3, name: 'Samosa (2pc)', price: 30, quantity: 5 },
        ]);
    }, []);

    // --- HANDLERS ---
    const handleUpdateItem = (id, updatedItem) => {
        setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item));
    };

    const handleAddItem = (newItem) => {
        setInventory(prev => [{ ...newItem, id: Date.now() }, ...prev]);
        setIsAddModalOpen(false);
    };

    const confirmDelete = () => {
        setInventory(prev => prev.filter(item => item.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 text-left">
            {/* --- NAVBAR --- */}
            <nav className="bg-white px-8 py-4 shadow-sm flex justify-between items-center sticky top-0 z-30 border-b border-gray-100">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Admin Console</h1>
                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">Live Sync Active</span>
                </div>
                <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-5 py-2.5 rounded-2xl transition-all cursor-pointer">
                    <LogOut size={20} /> Logout
                </button>
            </nav>

            <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
                {/* --- STATS TILES (RESTORED) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Today's Revenue" value={`₹${stats.revenue}`} icon={<TrendingUp />} color="green" />
                    <StatCard label="Orders Served" value={stats.orders} icon={<CheckCircle />} color="blue" />
                    <StatCard label="Low Stock Alerts" value={stats.lowStock} icon={<AlertTriangle />} color="orange" />
                </div>

                {/* --- TABS --- */}
                <div className="flex gap-2 p-1.5 bg-gray-200/50 rounded-2xl w-fit backdrop-blur-sm">
                    <TabButton active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} icon={<Package size={18} />} label="Stock" />
                    <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={18} />} label="Orders" />
                </div>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 min-h-125 p-8">
                    {activeTab === 'stock' ? (
                        <StockView
                            inventory={inventory}
                            onUpdate={handleUpdateItem}
                            onDeleteReq={setDeleteTarget}
                            onOpenAddModal={() => setIsAddModalOpen(true)}
                        />
                    ) : (
                        <div className="p-20 text-center font-bold text-gray-300 uppercase tracking-widest italic">Orders Section Coming Soon</div>
                    )}
                </div>
            </div>

            {/* --- ADD ITEM MODAL --- */}
            {isAddModalOpen && <AddItemModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddItem} />}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[35px] p-8 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Confirm Delete</h3>
                        <p className="text-gray-500 mt-2 font-medium">Remove <span className="font-bold text-gray-900">"{deleteTarget.name}"</span> from the menu?</p>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all cursor-pointer">Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-all cursor-pointer">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- SUB-COMPONENT: STOCK VIEW ---
function StockView({ inventory, onUpdate, onDeleteReq, onOpenAddModal }) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Inventory</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Manage Menu, Pricing & Stock</p>
                </div>
                <button onClick={onOpenAddModal} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 cursor-pointer">
                    <Plus size={20} strokeWidth={3} /> Add Item
                </button>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Item Name</th>
                        <th className="pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Price</th>
                        <th className="pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Stock</th>
                        <th className="pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map(item => <EditableRow key={item.id} item={item} onSave={onUpdate} onDeleteReq={onDeleteReq} />)}
                </tbody>
            </table>
        </div>
    );
}

// --- SUB-COMPONENT: EDITABLE ROW ---
function EditableRow({ item, onSave, onDeleteReq }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...item });

    const handleSave = () => {
        onSave(item.id, editData);
        setIsEditing(false);
    };

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

// --- SUB-COMPONENT: ADD MODAL ---
function AddItemModal({ onClose, onAdd }) {
    const [form, setForm] = useState({ name: '', price: '', quantity: '' });
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[35px] p-8 shadow-2xl text-left animate-in zoom-in-95 duration-200">
                <h2 className="text-2xl font-black text-gray-900">New Item</h2>
                <div className="mt-6 space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Name</label>
                        <input className="w-full mt-1 px-5 py-3 bg-gray-50 border rounded-2xl font-bold outline-none focus:border-blue-500" placeholder="e.g. Vada" onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Price (₹)</label>
                            <input type="number" className="w-full mt-1 px-5 py-3 bg-gray-50 border rounded-2xl font-bold outline-none focus:border-blue-500" placeholder="0" onChange={e => setForm({ ...form, price: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Initial Stock</label>
                            <input type="number" className="w-full mt-1 px-5 py-3 bg-gray-50 border rounded-2xl font-bold outline-none focus:border-blue-500" placeholder="0" onChange={e => setForm({ ...form, quantity: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button onClick={onClose} className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-2xl cursor-pointer transition-all">Cancel</button>
                        <button onClick={() => onAdd(form)} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 cursor-pointer transition-all">Add Item</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SHARED UI ---
function StatCard({ label, value, icon, color }) {
    const colors = { green: "bg-green-100 text-green-600", blue: "bg-blue-100 text-blue-600", orange: "bg-orange-100 text-orange-600" };
    return (
        <div className="bg-white p-7 rounded-[35px] border border-gray-100 flex items-center gap-6 shadow-sm">
            <div className={`${colors[color]} p-4 rounded-2xl`}>{icon}</div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }) {
    return (
        <button onClick={onClick} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold cursor-pointer transition-all ${active ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" : "text-gray-500 hover:bg-gray-100"}`}>
            {icon} {label}
        </button>
    );
}