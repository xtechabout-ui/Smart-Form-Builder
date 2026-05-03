import vendorDashboardImage from "@assets/WeddingHub_-_Vendor_Dashboard_1777793664449.png";

export default function VendorDashboard() {
  return (
    <div className="min-h-screen bg-[#f8f7fa] p-4">
      <div className="mx-auto max-w-[1100px] overflow-hidden rounded-[18px] border border-gray-100 bg-white shadow-sm">
        <img src={vendorDashboardImage} alt="Vendor dashboard" className="w-full h-auto" />
      </div>
    </div>
  );
}
