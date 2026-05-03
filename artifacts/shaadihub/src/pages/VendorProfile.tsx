import vendorProfileImage from "@assets/WeddingHub_-_Vendor_Profile_1777793655986.png";

export default function VendorProfile() {
  return (
    <div className="min-h-screen bg-[#f8f7fa] p-4">
      <div className="mx-auto max-w-[1100px] overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm">
        <img src={vendorProfileImage} alt="Vendor profile" className="w-full h-auto" />
      </div>
    </div>
  );
}
