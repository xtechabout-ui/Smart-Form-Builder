import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useListVendors, getListVendorsQueryKey } from "@workspace/api-client-react";
import { VendorCard } from "@/components/VendorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["Marriage Hall","Catering","Photography","Videography","Decoration","Car Rental","Event Planner","Makeup & Beauty"];
const AREAS = ["Clifton","DHA","Gulshan","North Nazimabad","Saddar","Korangi","Malir","Bahria Town","Scheme 33","PECHS"];

function useQuery() {
  const [loc] = useLocation();
  return new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
}

export default function VendorListing() {
  const q = useQuery();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState(q.get("search") ?? "");
  const [category, setCategory] = useState(q.get("category") ?? "");
  const [area, setArea] = useState(q.get("area") ?? "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const featured = q.get("featured");

  const params = {
    ...(search && { search }),
    ...(category && { category }),
    ...(area && { area }),
    ...(minPrice && { minPrice: Number(minPrice) }),
    ...(maxPrice && { maxPrice: Number(maxPrice) }),
    ...(minRating && { minRating: Number(minRating) }),
    ...(featured === "true" && { featured: true }),
    page,
    limit: 12,
  };

  const { data, isLoading } = useListVendors(params, {
    query: { queryKey: getListVendorsQueryKey(params) }
  });

  useEffect(() => { setPage(1); }, [search, category, area, minPrice, maxPrice, minRating]);

  const clearFilters = () => { setCategory(""); setArea(""); setMinPrice(""); setMaxPrice(""); setMinRating(""); setSearch(""); };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); };

  const Sidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="cat" checked={!category} onChange={() => setCategory("")} className="text-rose-500" />
            <span className="text-sm text-gray-600">All Categories</span>
          </label>
          {CATEGORIES.map(c => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="cat" checked={category === c} onChange={() => setCategory(c)} className="text-rose-500 accent-rose-500" />
              <span className="text-sm text-gray-600">{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Area</h3>
        <select value={area} onChange={e => setArea(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white">
          <option value="">All Areas</option>
          {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Price Range (PKR)</h3>
        <div className="flex gap-2">
          <Input value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min" type="number" className="border-gray-200 rounded-xl text-sm" />
          <Input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max" type="number" className="border-gray-200 rounded-xl text-sm" />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Min Rating</h3>
        <div className="space-y-2">
          {[["", "Any Rating"],["4","4+ Stars"],["4.5","4.5+ Stars"],["5","5 Stars"]].map(([v,l]) => (
            <label key={v} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="rating" checked={minRating === v} onChange={() => setMinRating(v)} className="text-rose-500 accent-rose-500" />
              <span className="text-sm text-gray-600">{l}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={clearFilters} className="w-full text-sm text-rose-500 hover:text-rose-700 font-medium py-2 border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky search bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input data-testid="input-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..." className="flex-1 bg-transparent text-sm outline-none py-2.5 text-gray-700 placeholder-gray-400" />
              {search && <button type="button" onClick={() => setSearch("")}><X className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>}
            </div>
            <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white hover:bg-gray-50">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-36">
              <h2 className="font-display text-lg font-bold text-gray-900 mb-6">Filters</h2>
              <Sidebar />
            </div>
          </aside>

          {/* Mobile Sidebar Drawer */}
          {sidebarOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-gray-900">
                  {category || "All Vendors"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {data ? `${data.total} vendors found` : "Loading..."}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.vendors && data.vendors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.vendors.map(v => <VendorCard key={v.id} vendor={v} />)}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">No vendors found</h3>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl">Clear Filters</Button>
              </div>
            )}

            {/* Pagination */}
            {data && data.pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-xl">
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <span className="text-sm text-gray-600 font-medium">
                  Page {page} of {data.pages}
                </span>
                <Button variant="outline" onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages} className="rounded-xl">
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
