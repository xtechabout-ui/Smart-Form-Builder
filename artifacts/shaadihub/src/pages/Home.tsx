import { useState } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import homepageImage from "@assets/WeddingHub_-_Homepage_1777793655984.png";

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
          <img src={homepageImage} alt="ShaadiHub homepage" className="w-full h-auto" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 text-center">
        <h2 className="font-display text-3xl font-bold text-gray-900">Search vendors</h2>
        <form onSubmit={handleSearch} className="mx-auto mt-6 flex max-w-2xl gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search venues, photographers, caterers..."
              className="w-full bg-transparent outline-none"
            />
          </div>
          <Button type="submit" className="rounded-2xl bg-rose-500 px-6 text-white hover:bg-rose-600">
            Search
          </Button>
        </form>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {['Marriage Hall', 'Photography', 'Catering', 'Decoration'].map((tag) => (
            <Link key={tag} href={`/vendors?category=${encodeURIComponent(tag)}`}>
              <span className="cursor-pointer rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600">
                {tag}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
