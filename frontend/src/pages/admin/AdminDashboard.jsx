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
    const [inventory, setInventory] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        setInventory([
            { id: 1, name: 'Masala Dosa', price: 60, quantity: 45 },
            { id: 2, name: 'Thali Special', price: 120, quantity: 12 },
            { id: 3, name: 'Samosa (2pc)', price: 30, quantity: 5 },
        ]);
    }, []);

    const [orders, setOrders] = useState([
        {
            id: "ORD-8821",
            userName: "Shreyash Mishra",
            total: 135,
            status: "Paid",
            date: "2026-03-28", // Key replaced here
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

    // --- DYNAMIC STATS CALCULATION ---
    const stats = React.useMemo(() => {
        // 1. Calculate Revenue (Total of all orders that are 'Served')
        const revenue = orders
            .filter(order => order.status === 'Served')
            .reduce((sum, order) => sum + order.total, 0);

        // 2. Calculate Orders Served (Count of orders with 'Served' status)
        const ordersServed = orders.filter(order => order.status === 'Served').length;

        // 3. Calculate Low Stock Alerts (Count of inventory items with quantity < 10)
        const lowStockCount = inventory.filter(item => item.quantity < 10).length;

        return {
            revenue,
            ordersServed,
            lowStockCount
        };
    }, [orders, inventory]); // Recalculate whenever these arrays change

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 text-left">
            <nav className="bg-white px-4 md:px-8 py-4 shadow-sm flex justify-between items-center sticky top-0 z-30 border-b border-gray-100">
                <div className="flex flex-col">
                    <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none">Admin Console</h1>
                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">Live Sync Active</span>
                </div>
                <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-3 md:px-5 py-2 rounded-2xl transition-all cursor-pointer">
                    <LogOut size={18} /> <span className="hidden md:inline">Logout</span>
                </button>
            </nav>

            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <StatCard
                        label="Today's Revenue"
                        value={`₹${stats.revenue}`}
                        icon={<TrendingUp size={24} />}
                        color="green"
                    />
                    <StatCard
                        label="Orders Served"
                        value={stats.ordersServed}
                        icon={<CheckCircle size={24} />}
                        color="blue"
                    />
                    <StatCard
                        label="Low Stock Alerts"
                        value={stats.lowStockCount}
                        icon={<AlertTriangle size={24} />}
                        color="orange"
                    />
                </div>

                <div className="flex gap-2 p-1.5 bg-gray-200/50 rounded-2xl w-full md:w-fit backdrop-blur-sm overflow-x-auto">
                    <TabButton active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} icon={<Package size={18} />} label="Stock" />
                    <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={18} />} label="Orders" />
                </div>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 min-h-125 p-4 md:p-8">
                    {activeTab === 'stock' ? (
                        <StockView
                            inventory={inventory}
                            onUpdate={handleUpdateItem}
                            onDeleteReq={setDeleteTarget}
                            onOpenAddModal={() => setIsAddModalOpen(true)}
                        />
                    ) : (<OrdersView orders={orders} />)}
                </div>
            </div>

            {isAddModalOpen && <AddItemModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddItem} />}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-[35px] p-8 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Confirm Delete</h3>
                        <p className="text-gray-500 mt-2 font-medium">Remove <span className="font-bold text-gray-900">"{deleteTarget.name}"</span>?</p>
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
