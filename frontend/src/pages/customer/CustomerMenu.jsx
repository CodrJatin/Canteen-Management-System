import { useNavigate } from "react-router";
import { useAuth } from "../../context/authContext";
import React, { useState } from 'react';
import { ShoppingCart, Wallet, Plus, Minus, Trash2, X, ChevronRight, UserCircle, LogOut } from 'lucide-react';

const MOCK_FOOD = [
    { id: 1, name: 'Masala Dosa', price: 60, category: 'Breakfast', image: '🥞' },
    { id: 2, name: 'Thali Special', price: 120, category: 'Lunch', image: '🍱' },
    { id: 3, name: 'Samosa (2pc)', price: 30, category: 'Snacks', image: '🥟' },
    { id: 4, name: 'Cold Coffee', price: 45, category: 'Drinks', image: '🧋' },
];

export default function CustomerMenu() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout } = useAuth(); // Get user data from your context
    const navigate = useNavigate();
    const [cart, setCart] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (id) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    const removeFromCart = (id) => {
        setCart(prev => {
            const newCart = { ...prev };
            if (newCart[id] > 1) newCart[id] -= 1;
            else delete newCart[id];
            return newCart;
        });
    };

    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const subtotal = MOCK_FOOD.reduce((sum, item) => sum + (item.price * (cart[item.id] || 0)), 0);
    const grandTotal = subtotal;

    return (
        <div className={`min-h-screen bg-gray-50 pb-32 ${isCartOpen ? 'overflow-hidden' : ''}`}>
            {/* Navbar */}
            <nav className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-20">
                {/* Left Side: Title */}
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">Canteen Hub</h1>

                {/* Right Side: Interactive Group */}
                <div className="flex items-center gap-3">
                    {/* Wallet Section */}
                    <div className="flex items-center gap-3 bg-green-100 text-green-700 pr-1 pl-4 py-1 rounded-2xl border border-green-200 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Wallet size={18} />
                            <span className="font-bold text-sm text-nowrap">₹450</span>
                        </div>

                        <button
                            onClick={() => alert("Recharge feature coming soon!")}
                            className="bg-green-600 text-white p-1.5 rounded-xl hover:bg-green-700 active:scale-90 transition-all shadow-md cursor-pointer"
                        >
                            <Plus size={16} strokeWidth={3} />
                        </button>
                    </div>

                    {/* Profile Button */}
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="bg-gray-100 p-2 rounded-2xl text-gray-600 hover:bg-gray-200 active:scale-90 transition-all border border-gray-200 shadow-sm"
                    >
                        <UserCircle size={24} />
                    </button>
                </div>
            </nav>

            {/* Food List */}
            <div className="p-4 space-y-4">
                {MOCK_FOOD.map(item => {
                    const qty = cart[item.id] || 0;
                    return (
                        <div key={item.id} className="bg-white p-4 rounded-3xl flex items-center justify-between shadow-sm border border-gray-100 transition-all hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                                    {item.image}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                                    <p className="text-blue-600 font-extrabold">₹{item.price}</p>
                                </div>
                            </div>

                            {/* ANIMATED BUTTONS */}
                            <div className="flex items-center">
                                {qty === 0 ? (
                                    <button
                                        onClick={() => addToCart(item.id)}
                                        className="bg-blue-600 text-white px-7 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-90 transition-all cursor-pointer"
                                    >
                                        ADD
                                    </button>
                                ) : (
                                    <div className="flex items-center bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 overflow-hidden animate-in zoom-in-95 duration-200">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2.5 hover:bg-blue-700 active:bg-blue-800 transition-colors"
                                        >
                                            {qty === 1 ? <Trash2 size={18} /> : <Minus size={18} />}
                                        </button>
                                        <span className="w-8 text-center font-bold text-lg select-none">{qty}</span>
                                        <button
                                            onClick={() => addToCart(item.id)}
                                            className="p-2.5 hover:bg-blue-700 active:bg-blue-800 transition-colors"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Floating Summary Bar */}
            {totalItems > 0 && !isCartOpen && (
                <div className="fixed bottom-6 inset-x-0 flex justify-center px-4 z-30">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="w-full max-w-md bg-gray-900 text-white py-4 rounded-2xl font-bold flex justify-between px-8 shadow-2xl items-center ring-4 ring-white/10 active:scale-95 transition-transform animate-in slide-in-from-bottom-10 fade-in duration-500"
                    >
                        <div className="flex flex-col items-start leading-tight">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{totalItems} ITEMS</span>
                            <span className="text-lg">₹{grandTotal}</span>
                        </div>
                        <span className="flex items-center gap-1 text-blue-400 font-bold">
                            View Cart <ChevronRight size={20} className="animate-pulse" />
                        </span>
                    </button>
                </div>
            )}

            {/* --- CART MODAL --- */}
            {isCartOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 animate-in fade-in duration-300" onClick={() => setIsCartOpen(false)} />

                    <div className="fixed bottom-0 inset-x-0 bg-white z-50 rounded-t-[40px] max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-full duration-500 ease-out shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                                    <ShoppingCart size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-800">My Cart</h2>
                            </div>
                            <button onClick={() => setIsCartOpen(false)} className="bg-gray-100 p-2.5 rounded-full hover:bg-gray-200 transition-colors"><X size={20} /></button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-8 overflow-y-auto">
                            <div className="space-y-5">
                                {MOCK_FOOD.filter(i => cart[i.id]).map(item => (
                                    <div key={item.id} className="flex justify-between items-center animate-in fade-in slide-in-from-left-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl w-12 h-12 bg-gray-50 flex items-center justify-center rounded-xl">{item.image}</span>
                                            <div>
                                                <p className="font-bold text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-500 font-medium">₹{item.price} per unit</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-xl">
                                            <span className="font-black text-blue-600">×{cart[item.id]}</span>
                                            <span className="font-bold text-gray-900">₹{item.price * cart[item.id]}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-50/50 p-6 rounded-3xl border-2 border-blue-100/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-600">Total Amount</span>
                                    <span className="text-2xl font-black text-gray-900">₹{grandTotal}</span>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-wider">
                                Confirm Order <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </>
            )}
            {/* --- PROFILE MODAL --- */}
            {isProfileOpen && (
                <>
                    {/* Animated Backdrop Blur */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 animate-in fade-in duration-300"
                        onClick={() => setIsProfileOpen(false)}
                    />

                    {/* Slide-up Container */}
                    <div className="fixed bottom-0 inset-x-0 bg-white z-50 rounded-t-[40px] animate-in slide-in-from-bottom-full duration-500 ease-out shadow-2xl p-8">
                        <div className="flex flex-col items-center text-center space-y-6">

                            {/* Large Avatar Icon */}
                            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner border-4 border-white ring-1 ring-blue-100">
                                <UserCircle size={64} strokeWidth={1.5} />
                            </div>

                            {/* User Info */}
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                    {user?.username || "Canteen User"}
                                </h2>
                                <div className="mt-1 inline-block px-4 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[2px]">
                                    {user?.role || "Customer"}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-full h-px bg-gray-100" />

                            {/* Action List */}
                            <div className="w-full space-y-3">
                                {/* Logout Button */}
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate("/");
                                    }}
                                    className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-100 active:scale-[0.98] transition-all cursor-pointer border border-red-100"
                                >
                                    <LogOut size={20} />
                                    Logout from Account
                                </button>

                                {/* Close Button */}
                                <button
                                    onClick={() => setIsProfileOpen(false)}
                                    className="w-full py-3 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}