import { useState } from "react";
import { useParams, Link } from "wouter";
import {
  MapPin, Star, Users, Phone, MessageCircle, BadgeCheck, ChevronLeft, ChevronRight,
  Shield, Calendar, X, Award
} from "lucide-react";
import {
  useGetVendor, getGetVendorQueryKey, useGetVendorReviews, getGetVendorReviewsQueryKey,
  useCreateBooking, useCreateReview
} from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

function formatPKR(n: number) { return `PKR ${n.toLocaleString("en-PK")}`; }

function StarRating({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <Star key={s}
          className={`w-5 h-5 cursor-${interactive ? "pointer" : "default"} transition-colors ${
            s <= (hovered || Math.round(rating)) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
          }`}
          onMouseEnter={() => interactive && setHovered(s)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate?.(s)}
        />
      ))}
    </div>
  );
}

function BookingModal({ vendorId, packages, onClose }: { vendorId: number; packages: {id: number; name: string}[]; onClose: () => void }) {
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [notes, setNotes] = useState("");
  const [packageId, setPackageId] = useState<number | undefined>();
  const [done, setDone] = useState(false);
  const createBooking = useCreateBooking();

  const submit = () => {
    createBooking.mutate({ data: { vendorId, eventDate, guestCount: guestCount ? Number(guestCount) : undefined, notes, packageId } }, {
      onSuccess: () => setDone(true),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {done ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Booking Requested!</h3>
            <p className="text-gray-500 text-sm mb-6">The vendor will review and respond to your booking request soon.</p>
            <Button onClick={onClose} className="rose-gradient text-white rounded-xl">Done</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold">Book This Vendor</h3>
              <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {packages.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Package (optional)</label>
                  <select value={packageId ?? ""} onChange={e => setPackageId(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white">
                    <option value="">No specific package</option>
                    {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Event Date *</label>
                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Guest Count</label>
                <input type="number" value={guestCount} onChange={e => setGuestCount(e.target.value)} placeholder="e.g. 300"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special requirements..." rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
              </div>
              <Button onClick={submit} disabled={!eventDate || createBooking.isPending} className="w-full rose-gradient text-white rounded-xl">
                {createBooking.isPending ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ReviewModal({ vendorId, onClose }: { vendorId: number; onClose: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const createReview = useCreateReview();
  const qc = useQueryClient();

  const submit = () => {
    createReview.mutate({ vendorId, data: { rating, comment } }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getGetVendorReviewsQueryKey(vendorId) });
        qc.invalidateQueries({ queryKey: getGetVendorQueryKey(vendorId) });
        setDone(true);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {done ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="font-display text-xl font-bold mb-2">Review Submitted!</h3>
            <p className="text-gray-500 text-sm mb-6">Thank you for sharing your experience.</p>
            <Button onClick={onClose} className="rose-gradient text-white rounded-xl">Done</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold">Write a Review</h3>
              <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Your Rating</label>
                <StarRating rating={rating} interactive onRate={setRating} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Your Review</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
              </div>
              <Button onClick={submit} disabled={createReview.isPending} className="w-full rose-gradient text-white rounded-xl">
                {createReview.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VendorProfile() {
  const params = useParams<{ id: string }>();
  const vendorId = Number(params.id);
  const { user } = useAuth();
  const [imgIdx, setImgIdx] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const { data: vendor, isLoading } = useGetVendor(vendorId, { query: { queryKey: getGetVendorQueryKey(vendorId) } });
  const { data: reviews } = useGetVendorReviews(vendorId, { query: { queryKey: getGetVendorReviewsQueryKey(vendorId) } });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!vendor) return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <div className="text-5xl mb-4">😢</div>
        <h2 className="font-display text-2xl font-bold mb-2">Vendor Not Found</h2>
        <Link href="/vendors"><Button className="rose-gradient text-white rounded-xl mt-4">Browse Vendors</Button></Link>
      </div>
    </div>
  );

  const allImages = [
    ...(vendor.coverImageUrl ? [vendor.coverImageUrl] : []),
    ...vendor.images.filter(i => i.imageUrl !== vendor.coverImageUrl).map(i => i.imageUrl)
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {bookingOpen && <BookingModal vendorId={vendorId} packages={vendor.packages} onClose={() => setBookingOpen(false)} />}
      {reviewOpen && <ReviewModal vendorId={vendorId} onClose={() => setReviewOpen(false)} />}

      {/* Image Gallery */}
      <div className="relative bg-gray-900 h-72 md:h-96 overflow-hidden">
        {allImages.length > 0 ? (
          <img src={allImages[imgIdx]} alt={vendor.title} className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="w-full h-full hero-gradient flex items-center justify-center text-8xl">💒</div>
        )}
        {allImages.length > 1 && (
          <>
            <button onClick={() => setImgIdx(i => (i - 1 + allImages.length) % allImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button onClick={() => setImgIdx(i => (i + 1) % allImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`rounded-full transition-all ${i === imgIdx ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`} />
              ))}
            </div>
          </>
        )}
        <div className="absolute top-4 left-4">
          <Link href="/vendors">
            <button className="flex items-center gap-1 text-sm text-white bg-black/30 backdrop-blur px-3 py-1.5 rounded-full hover:bg-black/50">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex flex-wrap items-start gap-3 mb-4">
                <span className="text-xs font-medium bg-rose-50 text-rose-600 px-3 py-1 rounded-full border border-rose-100">
                  {vendor.category}
                </span>
                {vendor.verified && (
                  <span className="flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
                {vendor.rating >= 4.8 && (
                  <span className="flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100">
                    <Award className="w-3.5 h-3.5" /> Top Rated
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">{vendor.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <StarRating rating={vendor.rating} />
                  <span className="font-semibold text-gray-800">{vendor.rating.toFixed(1)}</span>
                  <span>({vendor.totalReviews} reviews)</span>
                </div>
                {(vendor.location || vendor.area) && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span>{vendor.area}{vendor.location ? `, ${vendor.location}` : ""}</span>
                  </div>
                )}
                {vendor.capacity && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>Up to {vendor.capacity.toLocaleString()} guests</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {vendor.description && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h2 className="font-display text-xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed">{vendor.description}</p>
              </div>
            )}

            {/* Packages */}
            {vendor.packages.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Pricing Packages</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {vendor.packages.map(pkg => (
                    <div key={pkg.id} className={`rounded-2xl border-2 p-5 relative ${pkg.isPopular ? "border-rose-400 bg-rose-50" : "border-gray-100 bg-white"}`}>
                      {pkg.isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Most Popular
                        </div>
                      )}
                      <h3 className="font-bold text-gray-900 mb-1">{pkg.name}</h3>
                      {pkg.description && <p className="text-xs text-gray-500 mb-3">{pkg.description}</p>}
                      <p className={`text-2xl font-bold mb-4 ${pkg.isPopular ? "text-rose-600" : "text-gray-900"}`}>
                        {formatPKR(pkg.price)}
                      </p>
                      <ul className="space-y-1.5 mb-5">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="text-emerald-500 font-bold mt-0.5">✓</span> {f}
                          </li>
                        ))}
                      </ul>
                      <Button onClick={() => setBookingOpen(true)}
                        className={`w-full rounded-xl text-sm ${pkg.isPopular ? "rose-gradient text-white" : "border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"}`}
                        variant={pkg.isPopular ? "default" : "outline"}>
                        Select Package
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {vendor.latitude && vendor.longitude && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Location</h2>
                <iframe
                  src={`https://maps.google.com/maps?q=${vendor.latitude},${vendor.longitude}&z=15&output=embed`}
                  className="w-full h-64 rounded-xl border border-gray-100"
                  loading="lazy"
                />
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-gray-900">Reviews</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={vendor.rating} />
                    <span className="font-semibold">{vendor.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-sm">({vendor.totalReviews} reviews)</span>
                  </div>
                </div>
                {user?.role === "user" && (
                  <Button onClick={() => setReviewOpen(true)} variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-sm">
                    Write a Review
                  </Button>
                )}
              </div>

              {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-10 h-10 rose-gradient rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        {(r.userName ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900 text-sm">{r.userName ?? "Anonymous"}</span>
                          <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}</span>
                        </div>
                        <div className="flex mb-2">
                          {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />)}
                        </div>
                        {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Star className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                  <p className="text-sm">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-md p-6">
              <div className="mb-4">
                {vendor.priceRangeMin && (
                  <p className="text-xs text-gray-400 mb-1">Starting from</p>
                )}
                {vendor.priceRangeMin ? (
                  <p className="font-display text-2xl font-bold text-rose-600">{formatPKR(vendor.priceRangeMin)}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic">Contact for pricing</p>
                )}
                {vendor.priceRangeMax && vendor.priceRangeMin && (
                  <p className="text-xs text-gray-400">up to {formatPKR(vendor.priceRangeMax)}</p>
                )}
              </div>

              {user ? (
                <Button onClick={() => setBookingOpen(true)} className="w-full rose-gradient text-white font-semibold rounded-xl mb-3 py-2.5">
                  <Calendar className="w-4 h-4 mr-2" /> Book Now
                </Button>
              ) : (
                <Link href="/login">
                  <Button className="w-full rose-gradient text-white font-semibold rounded-xl mb-3 py-2.5">
                    Sign In to Book
                  </Button>
                </Link>
              )}

              {vendor.whatsapp && (
                <a href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-xl mb-4">
                    <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Inquiry
                  </Button>
                </a>
              )}

              <div className="border-t border-gray-100 pt-4 space-y-3">
                {[
                  { icon: BadgeCheck, label: "Verified Vendor", color: "text-emerald-500" },
                  { icon: Shield, label: "Secure Booking", color: "text-blue-500" },
                  { icon: Calendar, label: "Free Cancellation", color: "text-rose-500" },
                ].map(trust => (
                  <div key={trust.label} className="flex items-center gap-3 text-sm text-gray-600">
                    <trust.icon className={`w-4 h-4 ${trust.color} shrink-0`} />
                    {trust.label}
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4 text-center">
                <p className="text-xs text-gray-400">{vendor.profileViews.toLocaleString()} people viewed this vendor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
