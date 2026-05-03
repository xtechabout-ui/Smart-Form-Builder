import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Search, ArrowRight, CheckCircle2, Sparkles, Users, CalendarDays, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import homepageImage from "@assets/image_1777803412710.png";

const stats = [
  { label: "Verified vendors", value: "250+", icon: CheckCircle2 },
  { label: "Happy couples", value: "3.5k", icon: Users },
  { label: "Bookings monthly", value: "1.2k", icon: CalendarDays },
  { label: "Avg. rating", value: "4.8", icon: Star },
];

const categories = ["Marriage Hall", "Photography", "Catering", "Decoration"];

export default function Home() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(search.trim() ? `/vendors?search=${encodeURIComponent(search.trim())}` : "/vendors");
  };

  return (
    <div className="min-h-screen bg-[#faf8fb]">
      <section className="px-4 py-6">
        <div className="mx-auto max-w-[1100px] overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm">
          <img src={homepageImage} alt="ShaadiHub dashboard mockup" className="w-full h-auto" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-2 text-sm font-medium text-rose-600 shadow-sm">
              <Sparkles className="h-4 w-4" /> Wedding planning made simple
            </div>
            <h1 className="mt-5 font-display text-5xl font-black leading-tight text-gray-950 sm:text-6xl">
              Your Perfect <span className="text-rose-500">Wedding Day</span> Starts Here.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-500">
              Discover top-rated venues, photographers, caterers, and planners in one place.
              Compare real vendors, check availability, and book with confidence.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Find marriage hall near you"
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <Button type="submit" className="rounded-2xl bg-rose-500 px-7 text-white hover:bg-rose-600">
                Book Now
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              {categories.map((tag) => (
                <Link key={tag} href={`/vendors?category=${encodeURIComponent(tag)}`}>
                  <span className="cursor-pointer rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100">
                    {tag}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <stat.icon className="h-5 w-5 text-rose-500" />
                  <p className="mt-3 text-2xl font-bold text-gray-950">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_24px_80px_rgba(236,72,153,0.15)]">
              <div className="p-3">
                <div className="rounded-[28px] bg-gray-950 p-3">
                  <img src={homepageImage} alt="ShaadiHub dashboard preview" className="h-[560px] w-full rounded-[24px] object-cover" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-6 rounded-2xl bg-white px-5 py-4 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Venue spotlight</p>
              <p className="mt-1 text-lg font-bold text-gray-950">The Grand Heritage Villa</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Real-time availability
              </div>
            </div>
            <div className="absolute -right-2 top-8 rounded-2xl bg-rose-500 px-4 py-3 text-white shadow-lg">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ArrowRight className="h-4 w-4" /> Explore vendors
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
