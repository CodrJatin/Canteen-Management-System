import React, { useState, useEffect } from 'react';
import { Plus, Wallet, Search, CircleUserRound, ShoppingCart, Loader2, ClipboardList } from 'lucide-react';
import CategoryBar from '../../components/customer/CategoryBar';
import FoodCard from '../../components/customer/FoodCard';
import Tray from '../../components/customer/Tray';
import CheckoutModal from '../../components/customer/CheckoutModal';
import UserMenu from '../../components/customer/UserMenu'
import WalletModal from '../../components/customer/WalletModal';
import { useAuth } from "../../context/authContext"
import { API_ENDPOINTS } from '../../api/config';
import Toast from '../../components/Toast';

export default function CustomerDashboard() {
    const [isMobileTrayOpen, setIsMobileTrayOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [view, setView] = useState('menu');
    const { user, logout, login } = useAuth();
    const displayName = user?.username || "Guest User";
    const clearCart = () => setCart({})
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    // --- FETCH LIVE DATA FROM MONGODB ---
    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch(`${API_ENDPOINTS.STOCK}`);
                const data = await response.json();

                if (response.ok) {
                    // Map MongoDB _id to id so your existing logic doesn't break
                    const normalizedData = data.map(item => ({
                        ...item,
                        id: item._id,
                        image: item.image || '🍽️'
                    }));
                    setMenu(normalizedData);
                }
            } catch (err) {
                console.error("Failed to fetch menu:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const updateCart = (id, delta) => {
        // 1. Find the item in the menu to check its stock
        const menuItem = menu.find(m => String(m.id) === String(id));
        if (!menuItem) return;

        const currentInCart = cart[id] || 0;

        // 2. STOCK CHECK: Prevent increasing if it exceeds DB quantity
        if (delta > 0 && currentInCart + 1 > menuItem.quantity) {
            showToast(`Only ${menuItem.quantity} units of ${menuItem.name} available!`, "error");
            return;
        }

        setCart(prev => {
            const newQty = Math.max(0, (prev[id] || 0) + delta);
            if (newQty === 0) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: newQty };
        });
    };

    const cartEntries = Object.entries(cart);
    const cartCount = cartEntries.reduce((a, b) => a + b[1], 0);
    const cartTotal = cartEntries.reduce((total, [id, qty]) => {
        const item = menu.find(m => String(m.id) === String(id));
        return total + (item?.price || 0) * qty;
    }, 0);

    const filteredMenu = menu.filter(item =>
        (activeCategory === "All" || item.category === activeCategory) &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const availableCategories = [
        "All",
        ...new Set(menu.map(item => item.category))
    ];

    const [isProcessing, setIsProcessing] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    const handleConfirmOrder = async () => {
        if (isProcessing || cartCount === 0) return;

        // Safety check for balance before hitting network
        if ((user?.walletBalance || 0) < cartTotal) {
            showToast("Insufficient Balance!", "error");
            setIsWalletOpen(true);
            return;
        }

        setIsProcessing(true);
        try {
            // Map cart IDs to the format your backend expects
            const orderItems = Object.entries(cart).map(([id, qty]) => {
                const item = menu.find(m => String(m.id) === String(id));
                return {id:item.id, name: item.name, qty: qty, price: item.price };
            });

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/place`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id, // Ensure this matches your localStorage key
                    items: orderItems,
                    total_amount: cartTotal
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Update the header balance immediately
                login({ ...user, walletBalance: data.new_balance });

                setIsMobileTrayOpen(false);
                setIsCheckoutOpen(true);

                setCurrentOrder(data); // Save the ORD-XXXX ID
                setCart({});           // Clear tray
            } else {
                showToast(data.error || "Order failed", "error");
                console.log(data.error)
            }
        } catch (err) {
            console.log(err)
            showToast("Server Connection Failed", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col font-sans overflow-x-hidden relative text-white">
            {/* Toast */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
            {/* --- THEME DECORATION --- */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-100 h-100 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* --- HEADER --- */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 px-4 md:px-8 py-5">
                <div className="max-w-350 mx-auto flex justify-between items-center">
                    {/* LOGO */}
                    <h1 className="text-3xl font-black italic tracking-tighter cursor-pointer select-none text-white">
                        CANTEEN<span className="text-orange-500">.</span>
                    </h1>

                    <div className="flex items-center gap-4">
                        {/* --- CONDENSED WALLET (Hidden on small screens) --- */}
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 pl-4 pr-3 py-2 rounded-2xl hover:bg-white/10 transition-all group">
                            {/* Wallet Icon */}
                            <Wallet size={18} className="text-orange-500 group-hover:scale-110 transition-transform" />

                            {/* Amount */}
                            <span className="text-lg font-black text-white italic tracking-tighter">
                                ₹{user?.walletBalance || "0.00"}
                            </span>

                            {/* --- PLUS ICON (Same style as FoodCard) --- */}
                            <button
                                onClick={() => setIsWalletOpen(true)}
                                className="bg-white/5 border border-white/10 text-white hover:bg-orange-600 hover:border-orange-500 p-2 rounded-xl transition-all duration-300 shadow-lg active:scale-90"
                            >
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        </div>

                        {/* USER MENU */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border
                        ${isUserMenuOpen
                                        ? 'bg-orange-600 border-orange-500 text-white shadow-xl shadow-orange-600/20'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-orange-500'}
                    `}
                            >
                                <CircleUserRound size={28} strokeWidth={isUserMenuOpen ? 2.5 : 2} />
                            </button>

                            <UserMenu
                                isOpen={isUserMenuOpen}
                                onClose={() => setIsUserMenuOpen(false)}
                                userName={displayName}
                                userRole="Customer"
                                onNavigate={setView}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-350 mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 grow relative z-10">
                {/* MENU SECTION */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Search and Categories */}
                    <div className="space-y-6">
                        <div className="relative w-full group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={20} />
                            <input
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4.5 pl-14 pr-6 font-bold outline-none focus:bg-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm placeholder:text-gray-600"
                                placeholder="Craving something specific?"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <CategoryBar
                            categories={availableCategories}
                            active={activeCategory}
                            onSelect={setActiveCategory}
                        />
                    </div>

                    {/* Food Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 w-full gap-4">
                            <Loader2 className="animate-spin text-orange-500" size={40} />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Fetching Fresh Menu...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-24 lg:pb-0">
                            {filteredMenu.map(item => (
                                <FoodCard
                                    key={item.id}
                                    item={item}
                                    quantity={cart[item.id] || 0}
                                    onUpdate={(delta) => updateCart(item.id, delta)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* --- TRAY CONTAINER --- */}
                <aside className={`${isMobileTrayOpen ? 'fixed inset-0 z-100 flex flex-col justify-end bg-black/80 backdrop-blur-md' : 'hidden lg:block lg:col-span-4'}`}>
                    {isMobileTrayOpen && <div className="absolute inset-0 -z-10" onClick={() => setIsMobileTrayOpen(false)} />}
                    <div className={`
                        bg-white/5 backdrop-blur-3xl border border-white/10 flex flex-col
                        ${isMobileTrayOpen
                            ? 'rounded-t-[45px] p-8 max-h-[90vh] animate-in slide-in-from-bottom-full duration-500'
                            : 'rounded-[40px] p-8 sticky top-32 shadow-2xl'}
                    `}>
                        {isMobileTrayOpen && (
                            <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-8 shrink-0 cursor-pointer hover:bg-white/20" onClick={() => setIsMobileTrayOpen(false)} />
                        )}

                        <Tray
                            isMobile={isMobileTrayOpen}
                            clearCart={clearCart}
                            onClose={() => setIsMobileTrayOpen(false)}
                            cartEntries={cartEntries}
                            menu={menu}
                            updateCart={updateCart}
                            cartTotal={cartTotal}
                            cartCount={cartCount}
                            isProcessing={isProcessing}
                            onCheckout={() => {
                                handleConfirmOrder();
                            }}
                        />
                    </div>
                </aside>
            </main>

            {/* MOBILE DUAL-ACTION FLOATING DOCK */}
            {!isMobileTrayOpen && (
                <div className="fixed bottom-8 left-6 right-6 lg:hidden z-50 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="flex gap-3 w-full">

                        {/* 1. CART / MENU ACTION */}
                        <button
                            onClick={() => setIsMobileTrayOpen(true)}
                            className="flex-1 bg-[#1e293b]/90 backdrop-blur-xl text-white p-5 rounded-[30px] flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] active:scale-95 transition-all border border-white/5"
                        >
                            <div className="flex items-center gap-4">
                                {cartCount > 0 ? (
                                    <>
                                        <div className="bg-orange-600 px-3 py-1 rounded-xl font-black text-xs shadow-lg shadow-orange-600/20">
                                            {cartCount}
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="font-black uppercase text-[8px] tracking-[0.2em] text-orange-500 leading-none">In Your Tray</span>
                                            <span className="font-black text-sm tracking-tight italic">₹{cartTotal}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-white/5 p-2 rounded-xl">
                                            <Plus size={18} className="text-orange-500" />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="font-black uppercase text-[8px] tracking-[0.2em] text-gray-500 leading-none">Hungry?</span>
                                            <span className="font-black text-sm tracking-tight italic text-gray-300">View Cart</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <ShoppingCart
                                size={20}
                                strokeWidth={2.5}
                                className={cartCount > 0 ? "text-orange-500" : "text-gray-600"}
                            />
                        </button>

                        {/* 2. ORDERS LINK ACTION */}
                        <button
                            className="aspect-square bg-[#1e293b]/90 backdrop-blur-xl text-gray-400 p-5 rounded-[30px] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] active:scale-95 transition-all border border-white/5 group hover:text-orange-500"
                        >
                            <div className="relative">
                                <ClipboardList size={24} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                            </div>
                        </button>

                    </div>
                </div>
            )}

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                orderId={currentOrder?.order_id}
                totalAmount={currentOrder?.total}
            />

            <WalletModal
                isOpen={isWalletOpen}
                onClose={() => setIsWalletOpen(false)}
                currentBalance={user?.walletBalance || 0}
            />
        </div>
    );
}