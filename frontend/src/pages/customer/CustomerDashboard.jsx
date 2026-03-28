import React, { useState, useEffect } from 'react';
import { Search, CircleUserRound } from 'lucide-react';
import CategoryBar from '../../components/customer/CategoryBar';
import FoodCard from '../../components/customer/FoodCard';
import Tray from '../../components/customer/Tray';
import CheckoutModal from '../../components/customer/CheckoutModal';
import UserMenu from '../../components/customer/UserMenu'

export default function CustomerDashboard() {
    const [isMobileTrayOpen, setIsMobileTrayOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [view, setView] = useState('menu');

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
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
            {/* --- HEADER --- */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 md:px-8 py-5">
                <div className="max-w-400 mx-auto flex justify-between items-center">

                    {/* Brand */}
                    <h1 onClick={() => setView('menu')} className="text-2xl font-black italic text-blue-600 tracking-tighter cursor-pointer">
                        CANTEEN.
                    </h1>

                    {/* User Icon Button */}
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className={`
                                w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                                ${isUserMenuOpen
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 rotate-12'
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-blue-600'}
                            `}
                        >
                            <CircleUserRound size={28} strokeWidth={isUserMenuOpen ? 2.5 : 2} />
                        </button>

                        {/* Modular User Menu */}
                        <UserMenu
                            isOpen={isUserMenuOpen}
                            onClose={() => setIsUserMenuOpen(false)}
                            userName="Shreyash Mishra"
                            userRole="Customer"
                            onNavigate={setView}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-400 mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 grow">
                {/* MENU SECTION */}
                <div className="lg:col-span-8 space-y-6">
                    <CategoryBar categories={["All", "Breakfast", "Lunch", "Snacks", "Beverages"]} active={activeCategory} onSelect={setActiveCategory} />
                    <div className="relative w-full ">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            className="w-full bg-gray-100 rounded-2xl py-3.5 pl-11 pr-4 font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                            placeholder="Search food..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 pb-24 lg:pb-0">
                        {filteredMenu.map(item => (
                            <FoodCard key={item.id} item={item} quantity={cart[item.id] || 0} onUpdate={(delta) => updateCart(item.id, delta)} />
                        ))}
                    </div>
                </div>

                {/* ---TRAY CONTAINER --- */}
                <aside className={`
                    ${isMobileTrayOpen ? 'fixed inset-0 z-100 flex flex-col justify-end bg-black/60 backdrop-blur-sm' : 'hidden lg:block lg:col-span-4'}
                `}>
                    {/* Background overlay for mobile only */}
                    {isMobileTrayOpen && <div className="absolute inset-0 -z-10" onClick={() => setIsMobileTrayOpen(false)} />}

                    <div className={`
                        bg-white shadow-2xl border border-gray-100 flex flex-col
                        ${isMobileTrayOpen
                            ? 'rounded-t-[40px] p-6 max-h-[85vh] animate-in slide-in-from-bottom-full duration-300'
                            : 'rounded-[35px] p-6 sticky top-28'}
                    `}>
                        {isMobileTrayOpen && <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 shrink-0" onClick={() => setIsMobileTrayOpen(false)} />}

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

            {/* MOBILE FLOATING BAR */}
            {cartCount > 0 && !isMobileTrayOpen && (
                <div className="fixed bottom-6 left-6 right-6 lg:hidden z-50 animate-in fade-in slide-in-from-bottom-5">
                    <button
                        onClick={() => setIsMobileTrayOpen(true)}
                        className="w-full bg-blue-600 text-white p-5 rounded-[25px] flex justify-between items-center shadow-2xl active:scale-95 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 px-3 py-1 rounded-lg font-black text-sm">{cartCount}</div>
                            <span className="font-black uppercase text-sm tracking-tight italic text-left">Review <br className="xs:hidden" /> Your Tray</span>
                        </div>
                        <span className="font-black text-xl tracking-tighter">₹{cartTotal}</span>
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