import React, { useState, useEffect } from 'react';
import { Search, CircleUserRound, ShoppingCart } from 'lucide-react';
import CategoryBar from '../../components/customer/CategoryBar';
import FoodCard from '../../components/customer/FoodCard';
import Tray from '../../components/customer/Tray';
import CheckoutModal from '../../components/customer/CheckoutModal';
import UserMenu from '../../components/customer/UserMenu'
import { useAuth } from "../../context/authContext"

export default function CustomerDashboard() {
    const [isMobileTrayOpen, setIsMobileTrayOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [view, setView] = useState('menu');
    const { user, logout } = useAuth();
    const displayName = user?.name || "Guest User";

    useEffect(() => {
        setMenu([
            { id: 1, name: 'Masala Dosa', price: 60, category: 'Breakfast', rating: 4.8, image: '🥞' },
            { id: 2, name: 'Thali Special', price: 120, category: 'Lunch', rating: 4.9, image: '🍱' },
            { id: 3, name: 'Samosa (2pc)', price: 30, category: 'Snacks', rating: 4.5, image: '🥟' },
            { id: 4, name: 'Ginger Chai', price: 15, category: 'Beverages', rating: 4.7, image: '☕' },
            { id: 5, name: 'Idli Vada Combo', price: 50, category: 'Breakfast', rating: 4.6, image: '⚪' },
            { id: 6, name: 'Paneer Butter Masala', price: 140, category: 'Lunch', rating: 4.9, image: '🥘' },
            { id: 7, name: 'Vada Pav (2pc)', price: 40, category: 'Snacks', rating: 4.7, image: '🍔' },
            { id: 8, name: 'Cold Coffee', price: 45, category: 'Beverages', rating: 4.4, image: '🧋' },
            { id: 9, name: 'Veg Sandwich', price: 55, category: 'Snacks', rating: 4.3, image: '🥪' },
            { id: 10, name: 'Butter Chicken Thali', price: 160, category: 'Lunch', rating: 5.0, image: '🍗' },
            { id: 11, name: 'Poha Special', price: 35, category: 'Breakfast', rating: 4.5, image: '🥣' },
            { id: 12, name: 'Mango Lassi', price: 40, category: 'Beverages', rating: 4.8, image: '🥛' },
            { id: 13, name: 'Cheese Pizza Slice', price: 70, category: 'Snacks', rating: 4.2, image: '🍕' },
            { id: 14, name: 'Lemon Iced Tea', price: 25, category: 'Beverages', rating: 4.6, image: '🍹' }
        ]);
    }, []);

    const updateCart = (id, delta) => {
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
        const item = menu.find(m => m.id === parseInt(id));
        return total + (item?.price || 0) * qty;
    }, 0);

    const filteredMenu = menu.filter(item =>
        (activeCategory === "All" || item.category === activeCategory) &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col font-sans overflow-x-hidden relative text-white">
            {/* --- THEME DECORATION --- */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-100 h-100 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* --- HEADER --- */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 px-4 md:px-8 py-5">
                <div className="max-w-350 mx-auto flex justify-between items-center">
                    <h1 onClick={() => setView('menu')} className="text-3xl font-black italic tracking-tighter cursor-pointer select-none text-white">
                        CANTEEN<span className="text-orange-500">.</span>
                    </h1>

                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className={`
                                w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border
                                ${isUserMenuOpen
                                    ? 'bg-orange-600 border-orange-500 text-white shadow-xl shadow-orange-600/20 rotate-12'
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
                            categories={["All", "Breakfast", "Lunch", "Snacks", "Beverages"]}
                            active={activeCategory}
                            onSelect={setActiveCategory}
                        />
                    </div>

                    {/* Food Grid */}
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
                </div>

                {/* --- TRAY CONTAINER --- */}
                <aside className={`
                    ${isMobileTrayOpen ? 'fixed inset-0 z-100 flex flex-col justify-end bg-black/80 backdrop-blur-md' : 'hidden lg:block lg:col-span-4'}
                `}>
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
                            onClose={() => setIsMobileTrayOpen(false)}
                            cartEntries={cartEntries}
                            menu={menu}
                            updateCart={updateCart}
                            cartTotal={cartTotal}
                            cartCount={cartCount}
                            onCheckout={() => {
                                setIsMobileTrayOpen(false);
                                setIsCheckoutOpen(true);
                            }}
                        />
                    </div>
                </aside>
            </main>

            {/* MOBILE FLOATING BAR - UPGRADED TO ORANGE */}
            {cartCount > 0 && !isMobileTrayOpen && (
                <div className="fixed bottom-8 left-6 right-6 lg:hidden z-50 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <button
                        onClick={() => setIsMobileTrayOpen(true)}
                        className="w-full bg-orange-600 text-white p-6 rounded-[30px] flex justify-between items-center shadow-[0_20px_50px_rgba(234,88,12,0.3)] active:scale-95 transition-all border border-orange-500"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-xl font-black text-sm">
                                {cartCount}
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="font-black uppercase text-[10px] tracking-widest opacity-80 leading-none">Your Tray</span>
                                <span className="font-black text-sm tracking-tight italic">Ready to Checkout?</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-black text-2xl tracking-tighter">₹{cartTotal}</span>
                            <ShoppingCart size={20} />
                        </div>
                    </button>
                </div>
            )}

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cartTotal={cartTotal}
                cartEntries={cartEntries}
                menu={menu}
            />
        </div>
    );
}