// src/components/Cart/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  IoArrowBack,
  IoLocateOutline,
  IoCardOutline,
  IoWalletOutline,
  IoBagCheckOutline,
  IoTicketOutline,
  IoCheckmarkCircle,
  IoShieldCheckmarkOutline,
  IoAddCircleOutline,
  IoRemoveCircleOutline,
  IoTrashOutline,
  IoChatbubbleEllipsesOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useCart } from "./useCart";

/* ------------------------- Helpers ------------------------- */

const DEFAULT_CONFIG = {
  store: { currency: "৳" },
  shipping: {
    flatFee: 50,
    freeShippingOver: 2000,
    insideDhakaDays: 3,
    outsideDhakaMaxDays: 7,
  },
  payments: {
    cod: { enabled: true, note: "Pay on delivery available nationwide." },
    bkash: {
      enabled: true,
      merchantNumber: "01XXXXXXXXX",
      merchantType: "Personal",
      instructions: "Send money then add transaction ID.",
    },
    nagad: {
      enabled: true,
      merchantNumber: "01XXXXXXXXX",
      instructions: "Send money then add transaction ID.",
    },
    stripe: {
      enabled: false,
      publishableKey: "",
      note: "Card payments via Stripe.",
    },
  },
};

function readSiteConfig() {
  try {
    const raw = localStorage.getItem("siteConfig_v1");
    if (!raw) return DEFAULT_CONFIG;

    const cfg = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...cfg,
      store: { ...DEFAULT_CONFIG.store, ...(cfg.store || {}) },
      shipping: { ...DEFAULT_CONFIG.shipping, ...(cfg.shipping || {}) },
      payments: { ...DEFAULT_CONFIG.payments, ...(cfg.payments || {}) },
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

const clampMoney = (n) => (Number.isFinite(n) ? Math.max(0, n) : 0);
const toMoney = (n) => clampMoney(Number(n || 0));
const fmt = (currency, n) => `${currency}${toMoney(n).toLocaleString()}`;

const onlyDigits = (s) => String(s || "").replace(/\D/g, "");
const isValidPhone = (digits) => {
  // simple BD-friendly: 10-15 digits ok (covers 01xxxxxxxxx + country)
  const d = onlyDigits(digits);
  return d.length >= 10 && d.length <= 15;
};

function getInitialUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
}

/* ------------------------- Component ------------------------- */

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    subtotal,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const [siteConfig, setSiteConfig] = useState(readSiteConfig);

  // Refresh config when admin updates it
  useEffect(() => {
    const refresh = () => setSiteConfig(readSiteConfig());
    window.addEventListener("storage", refresh);
    window.addEventListener("siteConfigUpdate", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("siteConfigUpdate", refresh);
    };
  }, []);

  const currency = siteConfig?.store?.currency || "৳";

  const enabled = useMemo(() => {
    const p = siteConfig?.payments || {};
    return {
      cod: !!p.cod?.enabled,
      bkash: !!p.bkash?.enabled,
      nagad: !!p.nagad?.enabled,
      card: !!p.stripe?.enabled,
    };
  }, [siteConfig]);

  const onlineGateways = useMemo(() => {
    const list = [];
    if (enabled.bkash) list.push("bkash");
    if (enabled.nagad) list.push("nagad");
    if (enabled.card) list.push("card");
    return list;
  }, [enabled]);

  const user = useMemo(() => getInitialUser(), []);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    phone: "",
    paymentMethod: enabled.cod ? "cod" : onlineGateways[0] || "cod",
  });

  const [paymentGroup, setPaymentGroup] = useState(
    formData.paymentMethod === "cod" ? "cod" : "online",
  );

  const [paymentRef, setPaymentRef] = useState(""); // trx id for bkash/nagad
  const [hoveredItemId, setHoveredItemId] = useState(null);

  // coupon state (keep yours but slightly safer)
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const safeSubtotal = toMoney(subtotal);

  // Shipping
  const flatFee = toMoney(siteConfig?.shipping?.flatFee);
  const freeOver = toMoney(siteConfig?.shipping?.freeShippingOver);
  const shipping = freeOver > 0 && safeSubtotal >= freeOver ? 0 : flatFee;

  const total = clampMoney(safeSubtotal - toMoney(discount) + shipping);

  const isTrxPayment =
    formData.paymentMethod === "bkash" || formData.paymentMethod === "nagad";

  // Keep group in sync if paymentMethod changes
  useEffect(() => {
    setPaymentGroup(formData.paymentMethod === "cod" ? "cod" : "online");
  }, [formData.paymentMethod]);

  // If COD disabled, force online; if online becomes empty, fallback to COD
  useEffect(() => {
    const current = formData.paymentMethod;

    // If method disabled, choose a valid one
    const methodIsEnabled =
      (current === "cod" && enabled.cod) ||
      (current === "bkash" && enabled.bkash) ||
      (current === "nagad" && enabled.nagad) ||
      (current === "card" && enabled.card);

    if (methodIsEnabled) return;

    if (enabled.cod) setFormData((s) => ({ ...s, paymentMethod: "cod" }));
    else if (onlineGateways[0])
      setFormData((s) => ({ ...s, paymentMethod: onlineGateways[0] }));
  }, [enabled, onlineGateways, formData.paymentMethod]);

  const setMethod = (method) => {
    setFormData((s) => ({ ...s, paymentMethod: method }));
    if (method === "cod") setPaymentRef("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digits = onlyDigits(value).slice(0, 15);
      setFormData((s) => ({ ...s, phone: digits }));
      return;
    }

    setFormData((s) => ({ ...s, [name]: value }));
  };

  const applyCoupon = () => {
    setCouponError("");
    const code = coupon.toUpperCase().trim();
    const sub = safeSubtotal;

    // Example rules (edit anytime)
    if (code === "SAVE10") {
      const d = Math.round(sub * 0.1);
      setDiscount(d);
      setAppliedCoupon(code);
      return;
    }

    if (code === "WELCOME100" && sub > 500) {
      setDiscount(100);
      setAppliedCoupon(code);
      return;
    }

    setCouponError("Invalid code or minimum purchase not met");
    setDiscount(0);
    setAppliedCoupon(null);
  };

  const buildOrder = () => {
    const phoneDigits = onlyDigits(formData.phone);

    return {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString("en-GB"),
      timestamp: Date.now(),
      status: "Pending",

      customerName: String(formData.name || "").trim(),
      email: String(formData.email || "")
        .trim()
        .toLowerCase(),
      phone: phoneDigits,

      address: `${String(formData.address || "").trim()}, ${String(
        formData.city || "",
      ).trim()}`,

      items: [...cart],
      subtotal: safeSubtotal,
      discount: toMoney(discount),
      shipping,
      total,

      paymentMethod: formData.paymentMethod,
      paymentRef: isTrxPayment ? String(paymentRef || "").trim() : null,
      couponUsed: appliedCoupon,
    };
  };

  const saveOrderLocal = (order) => {
    const existing = JSON.parse(localStorage.getItem("customerOrders") || "[]");
    localStorage.setItem(
      "customerOrders",
      JSON.stringify([order, ...existing]),
    );
    window.dispatchEvent(new Event("orderUpdate"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cart?.length) return;

    const name = String(formData.name || "").trim();
    const email = String(formData.email || "").trim();
    const address = String(formData.address || "").trim();
    const city = String(formData.city || "").trim();
    const phoneDigits = onlyDigits(formData.phone);

    if (!name || !email || !address || !city) {
      alert("Please fill in all shipping fields.");
      return;
    }
    if (!isValidPhone(phoneDigits)) {
      alert("Please enter a valid phone number.");
      return;
    }

    // Validate payment
    if (formData.paymentMethod !== "cod" && onlineGateways.length === 0) {
      alert("Online payment is currently unavailable.");
      return;
    }
    if (isTrxPayment && !String(paymentRef || "").trim()) {
      alert("Please provide your transaction ID (Trx ID).");
      return;
    }

    // ✅ If Card selected but Stripe key empty, block (since you’re not actually charging yet)
    if (
      formData.paymentMethod === "card" &&
      !String(siteConfig?.payments?.stripe?.publishableKey || "").trim()
    ) {
      alert(
        "Card payment is not configured yet. Please choose bKash/Nagad/COD.",
      );
      return;
    }

    const order = buildOrder();
    saveOrderLocal(order);
    clearCart();
    navigate("/order-success");
  };

  /* ------------------------- Empty cart ------------------------- */

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#040d0a] flex flex-col items-center justify-center p-10 text-center text-white">
        <IoBagCheckOutline size={60} className="text-emerald-500/20 mb-6" />
        <h2 className="text-4xl font-black uppercase mb-6 italic tracking-tighter">
          Your Bag is Empty
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="text-emerald-400 font-black uppercase tracking-widest text-xs flex items-center gap-2 border border-emerald-500/30 px-6 py-3 rounded-full hover:bg-emerald-500 hover:text-black transition-all"
        >
          <IoArrowBack /> Explore Collection
        </button>
      </div>
    );
  }

  /* ------------------------- UI ------------------------- */

  return (
    <div className="min-h-screen bg-[#040d0a] text-white pt-32 pb-20 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4 hover:gap-4 transition-all"
          >
            <IoArrowBack /> Go Back
          </button>

          <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-none">
            Complete{" "}
            <span className="text-emerald-500 text-7xl block md:inline">
              Order
            </span>
          </h1>

          <p className="mt-4 text-white/35 text-[10px] font-black uppercase tracking-[0.25em]">
            Inside Dhaka: {siteConfig.shipping.insideDhakaDays} Days • Outside
            Dhaka: Up To {siteConfig.shipping.outsideDhakaMaxDays} Days
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: FORM */}
          <div className="lg:col-span-7 space-y-8">
            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Shipping */}
              <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] backdrop-blur-md">
                <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-500 mb-8">
                  <IoLocateOutline size={20} /> 01. Shipping Logistics
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Full Name"
                    />
                    <input
                      required
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Email Address"
                    />
                  </div>

                  <input
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500"
                    placeholder="Street Address"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500"
                      placeholder="City"
                    />

                    <input
                      required
                      name="phone"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px]">
                <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-500 mb-8">
                  <IoCardOutline size={20} /> 02. Payment Method
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* COD */}
                  <button
                    type="button"
                    disabled={!enabled.cod}
                    onClick={() => enabled.cod && setMethod("cod")}
                    className={`p-6 rounded-2xl border-2 text-left flex flex-col gap-2 transition-all ${
                      formData.paymentMethod === "cod"
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-white/5 bg-white/5 hover:bg-white/10"
                    } ${!enabled.cod ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <IoWalletOutline size={24} />
                    <span className="font-black uppercase text-[10px] tracking-widest">
                      Cash on Delivery
                    </span>
                    {siteConfig.payments.cod?.note && (
                      <span className="text-[9px] text-white/35 font-bold uppercase tracking-wider">
                        {siteConfig.payments.cod.note}
                      </span>
                    )}
                  </button>

                  {/* ONLINE */}
                  <button
                    type="button"
                    disabled={onlineGateways.length === 0}
                    onClick={() => {
                      if (!onlineGateways.length) return;
                      setMethod(onlineGateways[0]); // auto choose first enabled gateway
                    }}
                    className={`p-6 rounded-2xl border-2 text-left flex flex-col gap-2 transition-all ${
                      formData.paymentMethod !== "cod"
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-white/5 bg-white/5 hover:bg-white/10"
                    } ${onlineGateways.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <IoCardOutline size={24} />
                    <span className="font-black uppercase text-[10px] tracking-widest">
                      Online Payment
                    </span>

                    <div className="flex items-center gap-2 mt-2">
                      {enabled.bkash && (
                        <img
                          src="/payments/bkash.png"
                          alt="bKash"
                          className="h-6 w-auto"
                        />
                      )}
                      {enabled.nagad && (
                        <img
                          src="/payments/nagad.png"
                          alt="Nagad"
                          className="h-6 w-auto"
                        />
                      )}
                      {enabled.card && (
                        <img
                          src="/payments/card.png"
                          alt="Card"
                          className="h-6 w-auto"
                        />
                      )}
                    </div>

                    <span className="text-[9px] text-white/35 font-bold uppercase tracking-wider">
                      Choose gateway below
                    </span>
                  </button>
                </div>

                {/* gateways */}
                {formData.paymentMethod !== "cod" && (
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {enabled.bkash && (
                      <GatewayButton
                        active={formData.paymentMethod === "bkash"}
                        onClick={() => setMethod("bkash")}
                        label="bKash"
                        img="/payments/bkash.png"
                      />
                    )}
                    {enabled.nagad && (
                      <GatewayButton
                        active={formData.paymentMethod === "nagad"}
                        onClick={() => setMethod("nagad")}
                        label="Nagad"
                        img="/payments/nagad.png"
                      />
                    )}
                    {enabled.card && (
                      <GatewayButton
                        active={formData.paymentMethod === "card"}
                        onClick={() => setMethod("card")}
                        label="Card"
                        img="/payments/card.png"
                      />
                    )}
                  </div>
                )}

                {/* instructions */}
                {isTrxPayment && (
                  <div className="mt-6 bg-black/30 border border-white/10 rounded-2xl p-6 space-y-3">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                      Manual Payment Instructions
                    </div>

                    {formData.paymentMethod === "bkash" && (
                      <div className="text-white/50 text-xs leading-relaxed">
                        <div className="font-black uppercase tracking-widest text-[10px] text-white/70">
                          Merchant: {siteConfig.payments.bkash.merchantNumber} (
                          {siteConfig.payments.bkash.merchantType})
                        </div>
                        <div className="mt-2">
                          {siteConfig.payments.bkash.instructions}
                        </div>
                      </div>
                    )}

                    {formData.paymentMethod === "nagad" && (
                      <div className="text-white/50 text-xs leading-relaxed">
                        <div className="font-black uppercase tracking-widest text-[10px] text-white/70">
                          Merchant: {siteConfig.payments.nagad.merchantNumber}
                        </div>
                        <div className="mt-2">
                          {siteConfig.payments.nagad.instructions}
                        </div>
                      </div>
                    )}

                    <input
                      required
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500 transition-colors text-sm"
                      placeholder="Transaction ID (Trx ID)"
                    />
                  </div>
                )}

                {/* card note */}
                {formData.paymentMethod === "card" && (
                  <div className="mt-6 bg-black/30 border border-white/10 rounded-2xl p-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
                      Card Payment
                    </div>
                    <div className="mt-2 text-white/50 text-xs leading-relaxed">
                      {siteConfig.payments.stripe?.note ||
                        "Card payments are processed securely."}
                      {!String(
                        siteConfig.payments.stripe?.publishableKey || "",
                      ).trim() && (
                        <div className="mt-2 text-red-400 text-[11px] font-bold">
                          Stripe key not set in Admin Settings. Choose
                          bKash/Nagad/COD.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* Add more items */}
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="w-full py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.25em] rounded-2xl hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
              >
                <IoAddCircleOutline size={18} /> Add More Items
              </button>
            </form>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-5">
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] sticky top-32">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-8">
                Order Summary
              </h3>

              <div className="space-y-4 mb-8 max-h-56 overflow-y-auto pr-2 custom-scrollbar relative">
                {cart.map((item) => {
                  const lineTotal =
                    toMoney(item.price) * toMoney(item.quantity);
                  const show = hoveredItemId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="flex justify-between items-start text-xs gap-3"
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                    >
                      <div className="relative">
                        <span className="text-white/70 font-bold cursor-help">
                          {item.name}{" "}
                          <span className="text-emerald-500">
                            x{item.quantity}
                          </span>
                        </span>

                        {show && item.img && (
                          <div className="absolute left-0 top-6 z-50 w-44 rounded-2xl overflow-hidden border border-white/10 bg-[#050f0b] shadow-2xl">
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-full h-28 object-cover"
                            />
                            <div className="p-3">
                              <div className="text-[10px] font-black uppercase tracking-widest text-white/80 truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-emerald-400 font-mono font-black mt-1">
                                {fmt(currency, item.price)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="text-white/40 hover:text-white transition-all"
                          title="Decrease"
                        >
                          <IoRemoveCircleOutline size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className="text-white/40 hover:text-white transition-all"
                          title="Increase"
                        >
                          <IoAddCircleOutline size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400/60 hover:text-red-400 transition-all ml-1"
                          title="Remove"
                        >
                          <IoTrashOutline size={16} />
                        </button>

                        <span className="font-mono text-emerald-500 min-w-[84px] text-right">
                          {fmt(currency, lineTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* COUPON */}
              <div className="border-t border-white/5 py-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <IoTicketOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="PROMO CODE"
                      className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-emerald-500 text-xs font-bold tracking-widest uppercase"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="bg-white text-black px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <p className="text-red-400 text-[10px] mt-2 font-bold uppercase tracking-tighter">
                    {couponError}
                  </p>
                )}

                {appliedCoupon && (
                  <p className="text-emerald-500 text-[10px] mt-2 font-bold uppercase tracking-widest flex items-center gap-1">
                    <IoCheckmarkCircle /> Code {appliedCoupon} Applied
                  </p>
                )}
              </div>

              {/* TOTALS */}
              <div className="space-y-3 border-t border-white/5 pt-6">
                <div className="flex justify-between text-xs text-white/40 font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>{fmt(currency, safeSubtotal)}</span>
                </div>

                {toMoney(discount) > 0 && (
                  <div className="flex justify-between text-xs text-emerald-500 font-bold uppercase tracking-widest">
                    <span>Discount</span>
                    <span>-{fmt(currency, discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-white/40 font-bold uppercase tracking-widest">
                  <span>Shipping</span>
                  <span>{fmt(currency, shipping)}</span>
                </div>

                <div className="flex justify-between items-end pt-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em] block mb-1">
                      Total Payable
                    </span>
                    <span className="text-4xl font-black font-mono tracking-tighter">
                      {fmt(currency, total)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 text-white/25 text-[9px] font-black uppercase tracking-[0.22em] flex items-center gap-2">
                  <IoChatbubbleEllipsesOutline />
                  Shipping + payments are controlled from Admin Settings.
                </div>
              </div>

              <button
                form="checkout-form"
                type="submit"
                className="w-full py-6 mt-8 bg-emerald-500 text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
              >
                Confirm Order
              </button>

              <div className="mt-6 flex items-center justify-center gap-4 text-white/20">
                <IoShieldCheckmarkOutline size={18} />
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                  Secure Encrypted Transaction
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Small UI Component ------------------------- */

function GatewayButton({ active, onClick, label, img }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all ${
        active
          ? "border-emerald-500 bg-emerald-500/10"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <img src={img} alt={label} className="h-7 w-auto mx-auto" />
      <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-white/70">
        {label}
      </div>
    </button>
  );
}
