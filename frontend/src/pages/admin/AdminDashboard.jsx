import React, { useState, useEffect } from 'react';
import {
    LogOut, Package, ShoppingBag, Trash2,
    TrendingUp, CheckCircle, AlertTriangle
} from 'lucide-react';

import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router";

import StockView from "../../components/admin/StockView"
import AddItemModal from '../../components/admin/AddItemModal';
import TabButton from '../../components/admin/TabButton';
import StatCard from '../../components/admin/StatCard';
import OrdersView from '../../components/admin/OrdersView';

export default function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('stock');
    const [stock, setStock] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // --- CORE LOGIC (UNTOUCHED) ---
    const handleFetchStock = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/stock');
            const data = await response.json();
            setStock(data);
        } catch (error) {
            console.error("Failed to fetch:", error);
        }
    };

    const [orders, setOrders] = useState([
        {
            id: "ORD-8821",
            userName: "Shreyash Mishra",
            total: 135,
            status: "Paid",
            date: "2026-03-28",
            timePaid: "14:43:54",
            timePreparing: null,
            timeServed: null,
            items: [
                { name: "Masala Dosa", qty: 2, price: 60 },
                { name: "Ginger Chai", qty: 1, price: 15 }
            ]
        },
        {
            id: "ORD-4412",
            userName: "Anjali Sharma",
            total: 45,
            status: "Preparing",
            date: "2026-03-28",
            timePaid: "14:30:05",
            timePreparing: "14:35:12",
            timeServed: null,
            items: [
                { name: "Cold Coffee", qty: 1, price: 45 }
            ]
        },
        {
            id: "ORD-9901",
            userName: "Rahul Verma",
            total: 180,
            status: "Paid",
            date: "2026-03-28",
            timePaid: "14:55:20",
            timePreparing: null,
            timeServed: null,
            items: [
                { name: "Thali Special", qty: 1, price: 120 },
                { name: "Samosa (2pc)", qty: 2, price: 30 }
            ]
        },
        {
            id: "ORD-2234",
            userName: "Priya Singh",
            total: 60,
            status: "Served",
            date: "2026-03-28",
            timePaid: "13:10:00",
            timePreparing: "13:15:22",
            timeServed: "13:25:40",
            items: [
                { name: "Masala Dosa", qty: 1, price: 60 }
            ]
        },
        {
            id: "ORD-1156",
            userName: "Vikram Goel",
            total: 30,
            status: "Served",
            date: "2026-03-28",
            timePaid: "12:45:10",
            timePreparing: "12:48:30",
            timeServed: "12:55:05",
            items: [
                { name: "Samosa (2pc)", qty: 1, price: 30 }
            ]
        }
    ]);

    const handleAddItem = async (newItem) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/stock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });

            if (response.ok) {
                const savedItem = await response.json();
                setStock(prev => [savedItem, ...prev]);
                setIsAddModalOpen(false);
                alert(`${savedItem.name} added to menu!`);
            } else {
                alert("Failed to save item to database.");
            }
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    const handleUpdateItem = async (updatedItem) => {
        if (!updatedItem || !updatedItem._id) {
            console.error("Update failed: Item or _id is missing", updatedItem);
            return;
        }
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/stock/${updatedItem._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: updatedItem.name,
                    price: Number(updatedItem.price),
                    quantity: Number(updatedItem.quantity)
                })
            });
            if (response.ok) {
                setStock(prev => prev.map(item =>
                    item._id === updatedItem._id ? { ...updatedItem } : item
                ));
            } else {
                const errorData = await response.json();
                console.error("Update rejected by server:", errorData.error);
            }
        } catch (error) {
            console.error("Network error during update:", error);
        }
    };

    const handleDeleteItem = async (itemOrId) => {
        const itemId = typeof itemOrId === 'object' ? itemOrId._id : itemOrId;
        if (!itemId) {
            console.error("No ID found for deletion!");
            return;
        }
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/stock/${itemId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setStock(prev => prev.filter(i => i._id !== itemId));
                setDeleteTarget(null);
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const stats = React.useMemo(() => {
        const revenue = orders
            .filter(order => order.status === 'Served')
            .reduce((sum, order) => sum + order.total, 0);
        const ordersServed = orders.filter(order => order.status === 'Served').length;
        const lowStockCount = stock.filter(item => item.quantity < 10).length;
        return { revenue, ordersServed, lowStockCount };
    }, [orders, stock]);

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col font-sans text-white overflow-x-hidden relative text-left">
            {/* --- THEME AMBIENCE --- */}
            <div className="absolute top-0 left-1/4 w-150 h-150 bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-125 h-125 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            {/* --- NAVBAR --- */}
            <nav className="bg-white/5 backdrop-blur-xl px-4 md:px-8 py-5 sticky top-0 z-40 border-b border-white/10 shadow-2xl">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black italic tracking-tighter leading-none">
                            ADMIN<span className="text-orange-500">.</span>
                        </h1>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Live Sync Active</span>
                        </div>
                    </div>

                    <button
                        onClick={() => { logout(); navigate("/"); }}
                        className="flex items-center gap-2 text-red-400 font-black uppercase text-[10px] tracking-widest hover:bg-red-500/10 px-5 py-3 rounded-2xl border border-red-500/20 transition-all cursor-pointer group"
                    >
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden md:inline">Logout Session</span>
                    </button>
                </div>
            </nav>

            <div className="p-4 md:p-10 max-w-7xl mx-auto w-full space-y-10 relative z-10">

                {/* --- STATS SECTION --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        label="Today's Revenue"
                        value={`₹${stats.revenue}`}
                        icon={<TrendingUp size={24} />}
                        color="orange"
                    />
                    <StatCard
                        label="Orders Served"
                        value={stats.ordersServed}
                        icon={<CheckCircle size={24} />}
                        color="white"
                    />
                    <StatCard
                        label="Low Stock Alerts"
                        value={stats.lowStockCount}
                        icon={<AlertTriangle size={24} />}
                        color="red"
                    />
                </div>

                {/* --- CONTENT TABS & VIEW --- */}
                <div className="space-y-6">
                    <div className="flex gap-2 p-1.5 bg-white/5 backdrop-blur-md rounded-[22px] border border-white/10 w-full md:w-fit">
                        <TabButton active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} icon={<Package size={18} />} label="Inventory" />
                        <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={18} />} label="Orders" />
                    </div>

                    <div className="bg-[#1e293b]/60 backdrop-blur-3xl rounded-[45px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 p-6 md:p-10 min-h-125">
                        {activeTab === 'stock' ? (
                            <StockView
                                stock={stock}
                                onUpdate={handleUpdateItem}
                                onDeleteReq={setDeleteTarget}
                                onOpenAddModal={() => setIsAddModalOpen(true)}
                                onFetchManual={handleFetchStock}
                            />
                        ) : (
                            <OrdersView orders={orders} />
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODALS --- */}
            {isAddModalOpen && <AddItemModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddItem} />}

            {deleteTarget && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-[#1e293b] w-full max-w-sm rounded-[45px] p-10 shadow-2xl border border-white/10 text-center animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-[28px] flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                            <Trash2 size={36} />
                        </div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter">Confirm Deletion</h3>
                        <p className="text-gray-500 mt-3 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                            Removing <span className="text-white">"{deleteTarget.name}"</span> <br /> from the inventory
                        </p>
                        <div className="flex gap-4 mt-10">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-4 bg-white/5 text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all cursor-pointer">Cancel</button>
                            <button onClick={() => handleDeleteItem(deleteTarget._id)} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 shadow-xl shadow-red-600/20 transition-all cursor-pointer">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}