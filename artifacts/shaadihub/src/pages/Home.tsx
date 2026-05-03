import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Star, Users, MapPin, Award, Shield, Zap, ArrowRight } from "lucide-react";
import { useListVendors, getListVendorsQueryKey } from "@workspace/api-client-react";
import { VendorCard } from "@/components/VendorCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const CATEGORIES = [
  { name: "Marriage Hall", icon: "🏛️", color: "from-rose-400 to-pink-500" },
  { name: "Catering", icon: "🍽️", color: "from-amber-400 to-orange-500" },
  { name: "Photography", icon: "📸", color: "from-violet-400 to-purple-500" },
  { name: "Videography", icon: "🎬", color: "from-blue-400 to-cyan-500" },
  { name: "Decoration", icon: "🌸", color: "from-pink-400 to-rose-500" },
  { name: "Car Rental", icon: "🚗", color: "from-slate-400 to-gray-500" },
  { name: "Event Planner", icon: "📋", color: "from-emerald-400 to-teal-500" },
  { name: "Makeup & Beauty", icon: "💄", color: "from-fuchsia-400 to-pink-500" },
];

const STATS = [
  { value: "2,500+", label: "Happy Couples", icon: "💑" },
  { value: "400+", label: "Trusted Vendors", icon: "🏪" },
  { value: "20+", label: "Areas in Karachi", icon: "📍" },
  { value: "4.8/5", label: "Average Rating", icon: "⭐" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const { data: featuredData } = useListVendors(
    { featured: true, limit: 6 },
    { query: { queryKey: getListVendorsQueryKey({ featured: true, limit: 6 }) } }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) setLocation(`/vendors?search=${encodeURIComponent(search.trim())}`);
    else setLocation("/vendors");
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient text-white py-24 lg:py-36 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-rose-200 text-sm font-medium uppercase tracking-widest mb-4">
              Karachi's Wedding Marketplace
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Plan Your Dream
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-amber-200">
                Wedding in Karachi
              </span>
            </h1>
            <p className="text-rose-100 text-lg md:text-xl mb-10 leading-relaxed">
              Connect with 400+ verified vendors — from grand marriage halls to master photographers.
              Your perfect wedding is just a click away.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-0 bg-white/10 backdrop-blur rounded-2xl p-1.5 border border-white/20">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-white/60 shrink-0" />
                  <input
                    data-testid="input-search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search venues, photographers, caterers..."
                    className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm py-2"
                  />
                </div>
                <Button type="submit" className="bg-white text-rose-600 hover:bg-rose-50 font-semibold rounded-xl px-6">
                  Search
                </Button>
              </div>
            </form>

            {/* Quick tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["Marriage Hall", "Photography", "Catering", "Decoration"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setLocation(`/vendors?category=${encodeURIComponent(tag)}`)}
                  className="text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-rose-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="font-display text-2xl md:text-3xl font-bold text-rose-600">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gradient-to-b from-white to-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-rose-500 text-sm font-medium uppercase tracking-widest mb-2">Browse by Category</p>
            <h2 className="font-display text-4xl font-bold text-gray-900">Find What You Need</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={`/vendors?category=${encodeURIComponent(cat.name)}`}>
                <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm card-hover cursor-pointer group">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {cat.icon}
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-rose-500 text-sm font-medium uppercase tracking-widest mb-2">Top Picks</p>
              <h2 className="font-display text-4xl font-bold text-gray-900">Featured Vendors</h2>
            </div>
            <Link href="/vendors?featured=true">
              <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl hidden sm:flex">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          {featuredData?.vendors && featuredData.vendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredData.vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/3] animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why ShaadiHub */}
      <section className="py-20 bg-rose-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">Why Choose ShaadiHub?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need to plan the perfect Karachi wedding, in one place.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Verified Vendors", desc: "Every vendor is personally verified by our team before listing on the platform.", color: "text-emerald-500" },
              { icon: Star, title: "Real Reviews", desc: "Authentic reviews from real couples who have used these services for their wedding.", color: "text-amber-500" },
              { icon: Zap, title: "Instant Booking", desc: "Book your preferred vendors instantly with our seamless online booking system.", color: "text-rose-500" },
            ].map((feat) => (
              <div key={feat.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <div className={`w-14 h-14 mx-auto mb-5 rounded-2xl bg-gray-50 flex items-center justify-center`}>
                  <feat.icon className={`w-7 h-7 ${feat.color}`} />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rose-gradient rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display text-4xl font-bold mb-4">Ready to Plan Your Dream Wedding?</h2>
              <p className="text-rose-100 mb-8 text-lg">Join thousands of happy couples who found their perfect vendors on ShaadiHub.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button className="bg-white text-rose-600 hover:bg-rose-50 font-semibold px-8 py-3 rounded-xl text-sm">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/vendors">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl text-sm">
                    Browse Vendors
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
