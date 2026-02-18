import React, { useMemo, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../components/Cart/useCart";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("250g");
  const [quantity, setQuantity] = useState(1);

  const [notification, setNotification] = useState({ show: false, name: "" });

  useEffect(() => {
    const savedProducts = localStorage.getItem("teaProducts");
    const allProducts = savedProducts ? JSON.parse(savedProducts) : [];
    const found = allProducts.find((p) => String(p.id) === String(id));

    if (found) {
      // Ensure variants exist; fallback to basePrice/price if older products exist
      const variants =
        Array.isArray(found.variants) && found.variants.length > 0
          ? found.variants
          : [
              {
                size: "250g",
                price: Number(found.basePrice || found.price || 0),
                stock: Number(found.stock || 10),
              },
            ];

      setProduct({ ...found, variants });
      setSelectedSize(variants[0]?.size || "250g");
    }

    setLoading(false);
    window.scrollTo(0, 0);
  }, [id]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants) return null;
    return (
      product.variants.find((v) => v.size === selectedSize) ||
      product.variants[0]
    );
  }, [product, selectedSize]);

  const stockLeft = Number(selectedVariant?.stock ?? 0);
  const unitPrice = Number(selectedVariant?.price ?? 0);

  const isOutOfStock = stockLeft <= 0;
  const urgencyText =
    stockLeft > 0 && stockLeft <= 3 ? `Only ${stockLeft} left` : "";

  // keep quantity valid when changing size
  useEffect(() => {
    if (!selectedVariant) return;
    setQuantity((q) => Math.max(1, Math.min(q, stockLeft || 1)));
  }, [selectedSize, stockLeft, selectedVariant]);

  const handleIncrement = () => {
    if (isOutOfStock) return;
    setQuantity((prev) => Math.min(prev + 1, stockLeft));
  };

  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const onAddToCart = () => {
    if (!product || !selectedVariant) return;
    if (isOutOfStock) return;

    addToCart({
      ...product,
      // important: cart differentiates by size
      selectedSize,
      price: unitPrice,
      quantity,
      stockAtAdd: stockLeft, // optional, can be used for messaging
    });

    setNotification({ show: true, name: product.name });
    setTimeout(() => setNotification({ show: false, name: "" }), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#062016] flex items-center justify-center">
        <div className="animate-pulse text-green-500 font-black tracking-widest uppercase">
          Harvesting Data...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#062016] flex flex-col items-center justify-center text-white p-6 text-center">
        <h2 className="text-4xl font-black uppercase mb-4 tracking-tighter">
          Tea Not Found
        </h2>
        <Link
          to="/products"
          className="bg-white text-black px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-green-500 hover:text-white transition-all"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#062016] text-white pt-32 pb-20 px-6 lg:px-16 overflow-hidden">
      {/* NOTIFICATION */}
      <div
        className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          notification.show
            ? "translate-y-0 opacity-100"
            : "-translate-y-20 opacity-0"
        }`}
      >
        <div className="bg-white text-black px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 border border-green-500">
          <div className="bg-green-500 rounded-full p-1 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-sm font-black uppercase tracking-tight">
            {notification.name} ({selectedSize} × {quantity}) added
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* LEFT: IMAGE */}
          <div className="lg:sticky lg:top-32">
            <div className="relative rounded-[40px] overflow-hidden bg-black/20 aspect-[4/5] shadow-2xl border border-white/5">
              <img
                src={product.img}
                className="w-full h-full object-cover"
                alt={product.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#062016]/80 to-transparent" />
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="flex flex-col pt-4">
            <Link
              to="/products"
              className="group text-[10px] font-black text-white/40 mb-12 hover:text-green-400 transition-colors flex items-center gap-2 tracking-[0.4em]"
            >
              <span className="group-hover:-translate-x-2 transition-transform">
                ←
              </span>
              BACK TO COLLECTION
            </Link>

            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-8">
              <p className="text-5xl font-mono text-green-400 font-bold">
                ৳{unitPrice.toLocaleString()}
              </p>
              <div className="h-10 w-[1px] bg-white/10" />
              <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest italic">
                {product.origin ? product.origin : "Estate Certified"}
              </span>
            </div>

            {/* Stock + Urgency */}
            <div className="flex items-center gap-3 mb-10">
              <span
                className={`text-[10px] font-black uppercase tracking-[0.35em] px-4 py-2 rounded-full border ${
                  isOutOfStock
                    ? "border-red-500/30 text-red-400 bg-red-500/10"
                    : "border-white/10 text-white/50 bg-white/5"
                }`}
              >
                {isOutOfStock ? "Out of stock" : `${stockLeft} in stock`}
              </span>

              {urgencyText && (
                <span className="text-[10px] font-black uppercase tracking-[0.35em] px-4 py-2 rounded-full border border-emerald-500/30 text-emerald-300 bg-emerald-500/10">
                  {urgencyText}
                </span>
              )}
            </div>

            <p className="text-gray-400 text-xl leading-relaxed mb-12 font-medium max-w-xl">
              {product.description}
            </p>

            {/* SIZE SELECTOR */}
            <div className="mb-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-4">
                Select Size
              </h4>

              <div className="flex flex-wrap gap-3">
                {product.variants.map((v) => {
                  const isSelected = v.size === selectedSize;
                  const vStock = Number(v.stock || 0);
                  const disabled = vStock <= 0;

                  return (
                    <button
                      key={v.size}
                      onClick={() => setSelectedSize(v.size)}
                      disabled={disabled}
                      className={`px-5 py-3 rounded-full border text-[11px] font-black uppercase tracking-[0.25em] transition-all ${
                        disabled
                          ? "border-white/5 text-white/20 bg-white/[0.02] cursor-not-allowed"
                          : isSelected
                            ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-200"
                            : "border-white/10 bg-white/5 text-white/60 hover:border-emerald-500/30 hover:text-emerald-200"
                      }`}
                      title={disabled ? "Out of stock" : `${vStock} in stock`}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTION SECTION */}
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity */}
                <div className="flex items-center justify-between border-2 border-white/10 rounded-full px-6 py-4 bg-white/5 min-w-[150px]">
                  <button
                    onClick={handleDecrement}
                    className="w-10 h-10 flex items-center justify-center text-2xl hover:text-green-500 transition-colors disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>

                  <span className="text-xl font-black font-mono">
                    {quantity}
                  </span>

                  <button
                    onClick={handleIncrement}
                    className="w-10 h-10 flex items-center justify-center text-2xl hover:text-green-500 transition-colors disabled:opacity-30"
                    disabled={isOutOfStock || quantity >= stockLeft}
                  >
                    +
                  </button>
                </div>

                {/* Add Button */}
                <button
                  onClick={onAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-5 rounded-full font-black uppercase tracking-[0.2em] transition-all duration-500 active:scale-95 shadow-xl ${
                    isOutOfStock
                      ? "bg-white/10 text-white/30 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-white hover:text-black shadow-green-500/20"
                  }`}
                >
                  {isOutOfStock
                    ? "Out of Stock"
                    : `Add to Cart — ৳${(unitPrice * quantity).toLocaleString()}`}
                </button>
              </div>

              {/* DETAILS FOOTER */}
              <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-2">
                    Category
                  </h4>
                  <p className="text-white text-sm font-bold uppercase">
                    {product.category}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-2">
                    Shipping
                  </h4>
                  <p className="text-white text-sm font-bold uppercase">
                    Nationwide Delivery
                  </p>
                </div>
              </div>

              {/* tags */}
              {Array.isArray(product.tags) && product.tags.length > 0 && (
                <div className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/10 text-white/45 bg-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
