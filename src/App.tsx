import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  ShoppingCart, 
  Calendar, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Plus, 
  Minus, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  Menu as MenuIcon,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  CreditCard,
  Truck,
  Store
} from 'lucide-react';
import { MenuItem, CartItem, BookingData } from './types';
import { MENU, RESTAURANT_INFO } from './data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Fix for default marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'menu' | 'book' | 'location'>('home');
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ember-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ember-cart', JSON.stringify(cart));
  }, [cart]);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    // Show toast or feedback
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const navigate = (page: typeof currentPage) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass h-[68px] flex items-center px-4 md:px-8 justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('home')}
        >
          <span className="text-2xl font-display text-gold font-black tracking-tighter">THE EMBER TABLE</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => navigate('home')} className={cn("hover:text-gold transition-colors", currentPage === 'home' && "text-gold")}>Home</button>
          <button onClick={() => navigate('menu')} className={cn("hover:text-gold transition-colors", currentPage === 'menu' && "text-gold")}>Menu</button>
          <button onClick={() => navigate('book')} className={cn("hover:text-gold transition-colors", currentPage === 'book' && "text-gold")}>Book a Table</button>
          <button onClick={() => navigate('location')} className={cn("hover:text-gold transition-colors", currentPage === 'location' && "text-gold")}>Find Us</button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-gold" />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={cartCount}
                className="absolute -top-1 -right-1 bg-rust text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-bg"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
          <button 
            onClick={() => navigate('book')}
            className="hidden md:flex btn-primary py-2 px-5 text-sm"
          >
            Book Now
          </button>
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-bg pt-20 px-6 flex flex-col gap-6"
          >
            <button onClick={() => navigate('home')} className="text-2xl font-display text-left">Home</button>
            <button onClick={() => navigate('menu')} className="text-2xl font-display text-left">Menu</button>
            <button onClick={() => navigate('book')} className="text-2xl font-display text-left">Book a Table</button>
            <button onClick={() => navigate('location')} className="text-2xl font-display text-left">Find Us</button>
            <button 
              onClick={() => navigate('book')}
              className="btn-primary w-full mt-4"
            >
              Book Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-[68px]">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && <HomePage key="home" onNavigate={navigate} onAddToCart={addToCart} />}
          {currentPage === 'menu' && <MenuPage key="menu" onAddToCart={addToCart} />}
          {currentPage === 'book' && <BookingPage key="book" />}
          {currentPage === 'location' && <LocationPage key="location" />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        total={cartTotal}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={cartTotal}
        onSuccess={() => {
          setCart([]);
          setIsCheckoutOpen(false);
        }}
      />

      {/* Sticky Mobile Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-bg/95 backdrop-blur-sm border-t border-border flex items-center px-4 gap-3">
        <button 
          onClick={() => navigate('book')}
          className="flex-1 btn-outline py-2.5 text-xs h-11"
        >
          <Calendar className="w-4 h-4" />
          Book Table
        </button>
        <button 
          onClick={() => navigate('menu')}
          className="flex-1 btn-primary py-2.5 text-xs h-11"
        >
          <ShoppingCart className="w-4 h-4" />
          Order Food
        </button>
      </div>
    </div>
  );
}

// --- SUB-PAGES ---

function HomePage({ onNavigate, onAddToCart }: { onNavigate: (p: any) => void, onAddToCart: (i: MenuItem) => void, key?: string }) {
  const featuredItems = useMemo(() => MENU.filter(i => i.tags.includes('popular')).slice(0, 6), []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-20 pb-20"
    >
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-rust)_0%,_transparent_70%)] opacity-20 pointer-events-none" />
        <div className="max-w-4xl text-center z-10 space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-cream leading-tight">
              WOOD-FIRED <br />
              <span className="text-gold">PERFECTION.</span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto mt-6 font-light">
              Experience the authentic taste of South African wood-fired grills. 
              Crafted with heritage, served with passion since 2012.
            </p>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <button onClick={() => onNavigate('menu')} className="btn-primary w-full md:w-auto px-10 py-4 text-lg">
              Order Online
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => onNavigate('book')} className="btn-outline w-full md:w-auto px-10 py-4 text-lg">
              Book a Table
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12"
          >
            {[
              { label: '12+ Years', sub: 'Heritage' },
              { label: '4.9★', sub: 'Google Rating' },
              { label: '48k+', sub: 'Happy Diners' },
              { label: '~25min', sub: 'Delivery' }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-2xl font-display text-gold">{stat.label}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted">{stat.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Floating Emoji */}
        <motion.div 
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[20%] text-8xl hidden lg:block opacity-40 select-none"
        >
          🍖
        </motion.div>
        <motion.div 
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] bottom-[20%] text-8xl hidden lg:block opacity-40 select-none"
        >
          🔥
        </motion.div>
      </section>

      {/* Announcement Ticker */}
      <div className="bg-gold py-3 overflow-hidden whitespace-nowrap border-y border-gold/20">
        <div className="flex animate-marquee gap-12 text-bg font-bold uppercase tracking-tighter text-sm">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="flex items-center gap-12">
              <span>Free delivery over R250</span>
              <span>•</span>
              <span>Fresh ingredients daily</span>
              <span>•</span>
              <span>Wood-fired oven since 2012</span>
              <span>•</span>
              <span>Open 7 days a week</span>
              <span>•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Featured Menu */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl">Our Signature <span className="text-gold">Flames</span></h2>
            <p className="text-muted">The dishes that made us famous in Woodstock.</p>
          </div>
          <button onClick={() => onNavigate('menu')} className="text-gold font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            View Full Menu <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map(item => (
            <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      {/* Location Preview */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-surface border border-border rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Open Now
              </div>
              <h2 className="text-4xl">Visit the <span className="text-gold">Ember</span></h2>
              <p className="text-muted leading-relaxed">
                Located in the heart of Woodstock, our kitchen is a tribute to the 
                traditional South African braai. Come for the food, stay for the warmth.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gold" />
                <span>{RESTAURANT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold" />
                <a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:text-gold transition-colors">{RESTAURANT_INFO.phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold" />
                <span>Today: 11:00 – 22:00</span>
              </div>
            </div>

            <button onClick={() => onNavigate('location')} className="btn-primary w-full md:w-auto">
              Get Directions
            </button>
          </div>
          <div className="h-[300px] md:h-[400px] bg-card rounded-2xl border border-border flex items-center justify-center text-muted italic">
            [Interactive Map Preview]
          </div>
        </div>
      </section>
    </motion.div>
  );
}

function MenuPage({ onAddToCart }: { onAddToCart: (i: MenuItem) => void, key?: string }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Starters', 'Mains', 'Grills', 'Sides', 'Desserts', 'Drinks'];

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return MENU;
    return MENU.filter(i => i.category === activeCategory);
  }, [activeCategory]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12"
    >
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl">The <span className="text-gold">Menu</span></h1>
        <p className="text-muted max-w-xl mx-auto">From the wood-fire to your table. Every dish tells a story of smoke and spice.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border border-border",
              activeCategory === cat ? "bg-rust text-white border-rust" : "bg-surface hover:bg-card text-muted"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => (
          <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </motion.div>
  );
}

function BookingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BookingData>>({
    partySize: 2,
    seating: 'Indoor Dining'
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const confirmBooking = () => {
    const ref = `EMB-${Math.floor(1000 + Math.random() * 9000)}`;
    const message = `✅ *Table Booked — The Ember Table!*%0A📅 ${formData.date} at ${formData.time}%0A👥 ${formData.partySize} guests — ${formData.seating}%0A🔖 Booking Ref: #${ref}%0A📍 14 Flame Street, Woodstock, Cape Town%0A📞 +27 21 123 4567%0AWe can't wait to see you! 🔥❤️`;
    window.open(`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${message}`, '_blank');
    setStep(7); // Success step
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-4 py-12 space-y-12"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl">Book a <span className="text-gold">Table</span></h1>
        <div className="flex items-center justify-center gap-2 text-gold text-sm">
          <Star className="w-4 h-4 fill-gold" />
          <span>4.9 · Booked 34 times this week</span>
        </div>
      </div>

      {/* Progress Bar */}
      {step < 7 && (
        <div className="flex items-center gap-2">
          {Array(6).fill(null).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                step > i ? "bg-rust" : "bg-border"
              )} 
            />
          ))}
        </div>
      )}

      <div className="bg-surface border border-border rounded-3xl p-8 min-h-[400px] flex flex-col">
        {step === 1 && (
          <div className="space-y-6 flex-grow">
            <h3 className="text-2xl font-display">Choose Date</h3>
            <input 
              type="date" 
              className="w-full bg-card border border-border rounded-xl p-4 text-cream focus:border-gold outline-none"
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
            <div className="text-xs text-muted italic">Note: We are closed on Mondays.</div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 flex-grow">
            <h3 className="text-2xl font-display">Choose Time</h3>
            <div className="grid grid-cols-3 gap-3">
              {['12:00', '13:00', '14:00', '17:30', '18:30', '19:30', '20:30'].map(t => (
                <button
                  key={t}
                  onClick={() => setFormData({ ...formData, time: t })}
                  className={cn(
                    "p-4 rounded-xl border transition-all font-medium",
                    formData.time === t ? "bg-rust border-rust text-white" : "bg-card border-border hover:border-gold/50"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 flex-grow">
            <h3 className="text-2xl font-display">Party Size</h3>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <button
                  key={n}
                  onClick={() => setFormData({ ...formData, partySize: n })}
                  className={cn(
                    "p-4 rounded-xl border transition-all font-medium",
                    formData.partySize === n ? "bg-rust border-rust text-white" : "bg-card border-border hover:border-gold/50"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            {formData.partySize! > 6 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-sm">
                ⚠️ Groups of 7+ need 48hr advance notice — we'll confirm via WhatsApp.
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 flex-grow">
            <h3 className="text-2xl font-display">Seating Preference</h3>
            <div className="space-y-3">
              {['Indoor Dining', 'Outdoor Patio', 'No Preference'].map(s => (
                <button
                  key={s}
                  onClick={() => setFormData({ ...formData, seating: s })}
                  className={cn(
                    "w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between",
                    formData.seating === s ? "bg-rust/10 border-rust text-rust" : "bg-card border-border hover:border-gold/50"
                  )}
                >
                  <span>{s}</span>
                  {formData.seating === s && <CheckCircle2 className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 flex-grow">
            <h3 className="text-2xl font-display">Your Details</h3>
            <div className="space-y-4">
              <input 
                placeholder="Full Name"
                className="w-full bg-card border border-border rounded-xl p-4 text-cream outline-none focus:border-gold"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input 
                placeholder="WhatsApp Number"
                className="w-full bg-card border border-border rounded-xl p-4 text-cream outline-none focus:border-gold"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input 
                placeholder="Email Address"
                className="w-full bg-card border border-border rounded-xl p-4 text-cream outline-none focus:border-gold"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6 flex-grow">
            <h3 className="text-2xl font-display">Review & Confirm</h3>
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted">Date:</span><span>{formData.date}</span></div>
              <div className="flex justify-between"><span className="text-muted">Time:</span><span>{formData.time}</span></div>
              <div className="flex justify-between"><span className="text-muted">Guests:</span><span>{formData.partySize}</span></div>
              <div className="flex justify-between"><span className="text-muted">Seating:</span><span>{formData.seating}</span></div>
              <div className="pt-3 border-t border-border flex justify-between font-bold">
                <span>{formData.name}</span>
                <span>{formData.phone}</span>
              </div>
            </div>
            <p className="text-xs text-muted">By confirming, you agree to our cancellation policy (4h notice required).</p>
          </div>
        )}

        {step === 7 && (
          <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6 py-12">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-display">Booking Confirmed!</h3>
            <p className="text-muted">We've sent a confirmation to your WhatsApp. <br /> See you soon at The Ember Table!</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Done
            </button>
          </div>
        )}

        {step < 7 && (
          <div className="flex items-center gap-4 mt-8">
            {step > 1 && (
              <button onClick={prevStep} className="btn-outline flex-1">Back</button>
            )}
            <button 
              onClick={step === 6 ? confirmBooking : nextStep} 
              className="btn-primary flex-1"
              disabled={step === 1 && !formData.date || step === 2 && !formData.time || step === 5 && (!formData.name || !formData.phone)}
            >
              {step === 6 ? 'Confirm Booking' : 'Next Step'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function LocationPage() {
  const position: [number, number] = [RESTAURANT_INFO.coords.lat, RESTAURANT_INFO.coords.lng];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12"
    >
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl">Find <span className="text-gold">Us</span></h1>
        <p className="text-muted max-w-xl mx-auto">14 Flame Street, Woodstock. The fire is always burning.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[500px] bg-card border border-border rounded-3xl overflow-hidden relative z-0">
          <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <Marker position={position}>
              <Popup>
                <div className="text-bg font-bold">The Ember Table</div>
                <div className="text-xs text-muted">14 Flame Street, Woodstock</div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-3xl p-8 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Open Now
              </div>
              <h3 className="text-2xl font-display">Contact Details</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold shrink-0" />
                  <span>{RESTAURANT_INFO.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gold shrink-0" />
                  <a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:text-gold transition-colors">{RESTAURANT_INFO.phone}</a>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gold shrink-0" />
                  <a href={`https://wa.me/${RESTAURANT_INFO.whatsapp}`} className="hover:text-gold transition-colors">WhatsApp Us</a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-display">Opening Hours</h3>
              <div className="space-y-2 text-sm">
                {RESTAURANT_INFO.hours.map(h => (
                  <div key={h.day} className={cn("flex justify-between", h.day === 'Tuesday' && "text-gold font-bold")}>
                    <span className="text-muted">{h.day}</span>
                    <span>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => window.open(`https://maps.google.com/?daddr=${RESTAURANT_INFO.coords.lat},${RESTAURANT_INFO.coords.lng}`, '_blank')}
              className="btn-primary w-full"
            >
              Get Directions
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border p-4 rounded-2xl text-center space-y-2">
              <div className="text-gold font-bold">🚗 Car</div>
              <div className="text-[10px] text-muted">Free On-site Parking</div>
            </div>
            <div className="bg-card border border-border p-4 rounded-2xl text-center space-y-2">
              <div className="text-gold font-bold">🚌 Bus</div>
              <div className="text-[10px] text-muted">MyCiTi Route T01</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- COMPONENTS ---

function MenuItemCard({ item, onAddToCart }: { item: MenuItem, onAddToCart: (i: MenuItem) => void, key?: any }) {
  return (
    <div className="card-hover group">
      <div className="h-48 bg-surface flex items-center justify-center text-6xl relative">
        {item.emoji}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {item.tags.map(tag => (
            <span 
              key={tag} 
              className={cn(
                "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                tag === 'hot' ? "bg-rust text-white" : 
                tag === 'new' ? "bg-green-500 text-white" : 
                "bg-gold text-bg"
              )}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute bottom-4 right-4 bg-bg/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-gold">
          <Star className="w-3 h-3 fill-gold" />
          {item.rating}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl group-hover:text-gold transition-colors">{item.name}</h3>
          <span className="text-xl font-bold text-gold">R{item.price}</span>
        </div>
        <p className="text-sm text-muted line-clamp-2 font-light leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-muted uppercase tracking-widest">{item.calories} kcal</span>
          <button 
            onClick={() => onAddToCart(item)}
            className="btn-primary py-2 px-4 text-xs"
          >
            <Plus className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ isOpen, onClose, cart, total, onUpdateQuantity, onRemove, onCheckout }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-bg border-l border-border z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl">Your <span className="text-gold">Order</span></h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <ShoppingCart className="w-16 h-16" />
                  <p>Your cart is empty. <br /> Time to fire up the grill!</p>
                </div>
              ) : (
                cart.map((item: CartItem) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center text-2xl shrink-0">
                      {item.emoji}
                    </div>
                    <div className="flex-grow space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="group-hover:text-gold transition-colors">{item.name}</span>
                        <span>R{item.price * item.quantity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-surface rounded-lg px-2 py-1">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="hover:text-gold"><Minus className="w-3 h-3" /></button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="hover:text-gold"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="text-[10px] text-muted hover:text-red-500 uppercase tracking-widest">Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {total > 0 && total < 250 && (
                <div className="p-4 bg-gold/10 border border-gold/20 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-gold uppercase tracking-wider">Free Delivery Progress</div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gold" style={{ width: `${(total / 250) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-muted">Add R{250 - total} more for free delivery!</p>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-border space-y-4 bg-surface/50">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted"><span>Subtotal</span><span>R{total}</span></div>
                  <div className="flex justify-between text-muted"><span>Delivery Fee</span><span>{total >= 250 ? 'FREE' : 'R35'}</span></div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-gold">R{total + (total >= 250 ? 0 : 35)}</span>
                  </div>
                </div>
                <button 
                  onClick={onCheckout}
                  className="btn-primary w-full py-4 text-lg"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CheckoutModal({ isOpen, onClose, cart, total, onSuccess }: any) {
  const [step, setStep] = useState(1);
  const [deliveryType, setDeliveryType] = useState('Delivery');
  const finalTotal = total + (total >= 250 || deliveryType === 'Pickup' ? 0 : 35);

  const placeOrder = () => {
    const ref = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsList = cart.map((i: any) => `• ${i.quantity}x ${i.name} (R${i.price * i.quantity})`).join('%0A');
    const message = `🔥 *Order Confirmed — The Ember Table* %0A🔖 Order: #${ref}%0A%0A${itemsList}%0A%0A💰 Total: R${finalTotal}%0A🛵 Estimated: ~30 minutes%0A📞 Questions? +27 21 123 4567`;
    window.open(`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${message}`, '_blank');
    setStep(3);
    setTimeout(() => {
      onSuccess();
      setStep(1);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-bg border border-border w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl">Checkout</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setDeliveryType('Delivery')}
                      className={cn("p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all", deliveryType === 'Delivery' ? "bg-rust/10 border-rust text-rust" : "bg-card border-border")}
                    >
                      <Truck className="w-6 h-6" />
                      <span className="font-bold">Delivery</span>
                    </button>
                    <button 
                      onClick={() => setDeliveryType('Pickup')}
                      className={cn("p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all", deliveryType === 'Pickup' ? "bg-rust/10 border-rust text-rust" : "bg-card border-border")}
                    >
                      <Store className="w-6 h-6" />
                      <span className="font-bold">Pickup</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <input placeholder="Full Name" className="w-full bg-card border border-border p-4 rounded-xl outline-none focus:border-gold" />
                    <input placeholder="WhatsApp Number" className="w-full bg-card border border-border p-4 rounded-xl outline-none focus:border-gold" />
                    {deliveryType === 'Delivery' && (
                      <input placeholder="Delivery Address" className="w-full bg-card border border-border p-4 rounded-xl outline-none focus:border-gold" />
                    )}
                  </div>

                  <button onClick={() => setStep(2)} className="btn-primary w-full py-4">Review Order</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <div className="text-xs font-bold text-gold uppercase tracking-widest">Order Summary</div>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                      {cart.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted">{item.quantity}x {item.name}</span>
                          <span>R{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-border space-y-2 text-sm">
                      <div className="flex justify-between text-muted"><span>Subtotal</span><span>R{total}</span></div>
                      <div className="flex justify-between text-muted"><span>{deliveryType} Fee</span><span>{deliveryType === 'Pickup' || total >= 250 ? 'FREE' : 'R35'}</span></div>
                      <div className="flex justify-between text-xl font-bold pt-2 text-gold">
                        <span>Total</span>
                        <span>R{finalTotal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-bold text-muted uppercase tracking-widest">Payment Method</div>
                    <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl">
                      <CreditCard className="w-5 h-5 text-gold" />
                      <span className="text-sm">Pay on {deliveryType === 'Delivery' ? 'Arrival' : 'Collection'} (Cash/Card)</span>
                    </div>
                  </div>

                  <button onClick={placeOrder} className="btn-primary w-full py-4">Place Order via WhatsApp</button>
                </div>
              )}

              {step === 3 && (
                <div className="py-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-display">Order Placed!</h3>
                  <p className="text-muted">Redirecting you to WhatsApp for confirmation...</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Footer({ onNavigate }: { onNavigate: (p: any) => void }) {
  return (
    <footer className="bg-surface border-t border-border pt-20 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-display text-gold">THE EMBER TABLE</h2>
          <p className="text-sm text-muted leading-relaxed">
            Authentic wood-fired kitchen in the heart of Woodstock. 
            Keeping the fire burning since 2012.
          </p>
          <div className="flex gap-4">
            <Instagram className="w-5 h-5 text-muted hover:text-gold cursor-pointer transition-colors" />
            <Facebook className="w-5 h-5 text-muted hover:text-gold cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 text-muted hover:text-gold cursor-pointer transition-colors" />
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-gold">Menu</h4>
          <div className="flex flex-col gap-3 text-sm text-muted">
            <button onClick={() => onNavigate('menu')} className="text-left hover:text-gold transition-colors">Starters</button>
            <button onClick={() => onNavigate('menu')} className="text-left hover:text-gold transition-colors">Mains</button>
            <button onClick={() => onNavigate('menu')} className="text-left hover:text-gold transition-colors">Grills</button>
            <button onClick={() => onNavigate('menu')} className="text-left hover:text-gold transition-colors">Desserts</button>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-gold">Visit Us</h4>
          <div className="flex flex-col gap-3 text-sm text-muted">
            <button onClick={() => onNavigate('location')} className="text-left hover:text-gold transition-colors">Find Us</button>
            <button onClick={() => onNavigate('book')} className="text-left hover:text-gold transition-colors">Book a Table</button>
            <span>14 Flame Street, Woodstock</span>
            <span>+27 21 123 4567</span>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-gold">Opening Hours</h4>
          <div className="flex flex-col gap-2 text-xs text-muted">
            <div className="flex justify-between"><span>Mon</span><span>CLOSED</span></div>
            <div className="flex justify-between"><span>Tue - Wed</span><span>11:00 - 22:00</span></div>
            <div className="flex justify-between"><span>Thu - Sat</span><span>11:00 - 23:30</span></div>
            <div className="flex justify-between"><span>Sun</span><span>10:00 - 21:00</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-[10px] text-muted uppercase tracking-widest">
        <span>© 2026 The Ember Table. All rights reserved.</span>
        <div className="flex gap-6">
          <span className="hover:text-gold cursor-pointer">Privacy Policy</span>
          <span className="hover:text-gold cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
