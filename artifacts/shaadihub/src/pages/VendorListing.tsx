import vendorMapImage from "@assets/WeddingHub_-_Map_Search_1777793655985.png";
import { Button } from "@/components/ui/button";

export default function VendorListing() {
  return (
    <div className="min-h-screen bg-[#f8f7fa] p-4">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm">
        <img src={vendorMapImage} alt="Vendor map search" className="w-full h-auto" />
      </div>
      <div className="mx-auto mt-6 max-w-5xl text-center text-sm text-gray-500">
        <Button variant="outline" className="rounded-2xl">Back to Home</Button>
      </div>
    </div>
  );
}
