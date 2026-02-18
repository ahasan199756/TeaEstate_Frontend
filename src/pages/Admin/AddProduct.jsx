import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Upload,
  Save,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  Download,
  Banknote,
  Percent,
  Star,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const DEFAULT_VARIANTS = [
  { id: "v-100", size: "100g", price: "", stock: "" },
  { id: "v-250", size: "250g", price: "", stock: "" },
];

const normalizeProduct = (p) => {
  // if already variants-based, keep
  if (Array.isArray(p?.variants) && p.variants.length) {
    return {
      ...p,
      variants: p.variants.map((v) => ({
        id: v.id || `${v.size}-${Math.random()}`,
        size: v.size || "Default",
        price: Number(v.price || 0),
        stock: Number(v.stock || 0),
      })),
    };
  }

  // fallback old structure -> convert to one Default variant
  const basePrice = Number(p?.basePrice || p?.price || 0);
  const stock = Number(p?.stock || 0);

  return {
    ...p,
    variants: [
      { id: "v-default", size: "Default", price: basePrice, stock: stock },
    ],
  };
};

const AddProduct = () => {
  const [availableCategories, setAvailableCategories] = useState([]);
  const fileInputRef = useRef(null);
  const bulkFileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const editDataRaw = location.state?.editProduct;

  const editData = editDataRaw ? normalizeProduct(editDataRaw) : null;

  const [isBulkMode, setIsBulkMode] = useState(false);

  const [formData, setFormData] = useState(() => {
    if (editData) return editData;

    return {
      id: Date.now(),
      name: "",
      category: "Green Tea",
      discountPrice: "",
      discountType: "flat",
      vat: "5",
      description: "",
      img: "",
      isFeatured: false,
      variants: DEFAULT_VARIANTS,
      updatedAt: new Date().toISOString(),
    };
  });

  useEffect(() => {
    const savedCats = JSON.parse(
      localStorage.getItem("teaCategories") ||
        '["Black Tea","Green Tea","Oolong","White Tea"]',
    );
    setAvailableCategories(savedCats);

    // when editing, sync formData
    if (editData) setFormData(editData);
  }, [editDataRaw]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- VARIANT HELPERS ---
  const addVariantRow = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        { id: `v-${Date.now()}`, size: "", price: "", stock: "" },
      ],
    }));
  };

  const removeVariantRow = (id) => {
    setFormData((prev) => ({
      ...prev,
      variants: (prev.variants || []).filter((v) => v.id !== id),
    }));
  };

  const updateVariant = (id, key, value) => {
    setFormData((prev) => ({
      ...prev,
      variants: (prev.variants || []).map((v) =>
        v.id === id ? { ...v, [key]: value } : v,
      ),
    }));
  };

  const totalStock = useMemo(() => {
    return (formData.variants || []).reduce(
      (sum, v) => sum + Number(v.stock || 0),
      0,
    );
  }, [formData.variants]);

  const minBasePrice = useMemo(() => {
    const prices = (formData.variants || [])
      .map((v) => Number(v.price || 0))
      .filter((n) => !Number.isNaN(n));

    if (!prices.length) return 0;
    return Math.min(...prices);
  }, [formData.variants]);

  // --- DISCOUNT + VAT ---
  const getDiscountValue = () => {
    const base = Number(minBasePrice) || 0;
    const disc = Number(formData.discountPrice) || 0;
    return formData.discountType === "percent" ? (base * disc) / 100 : disc;
  };

  const discountAmount = getDiscountValue();
  const priceAfterDiscount = (Number(minBasePrice) || 0) - discountAmount;
  const finalPrice = priceAfterDiscount * (1 + Number(formData.vat) / 100);

  // --- TEMPLATE DOWNLOAD ---
  const downloadTemplate = () => {
    // Now supports Variants in one cell like: "100g|2400|10;250g|4500|5"
    const headers =
      "Name,Category,Variants,DiscountPrice,DiscountType,VAT,Description,ImageURL,IsFeatured\n";
    const sampleVariants = "100g|2400|10;250g|4500|5";
    const sampleData = `Premium Sylhet Green Tea,Green Tea,${sampleVariants},10,percent,5,High altitude tea from Sylhet,https://example.com/tea.jpg,true\n`;

    const blob = new Blob([headers + sampleData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "estate_inventory_template.csv";
    a.click();
  };

  // --- BULK IMPORT ---
  const parseVariantsCell = (cell) => {
    // "100g|2400|10;250g|4500|5"
    if (!cell)
      return [{ id: `v-${Date.now()}`, size: "Default", price: 0, stock: 0 }];

    const parts = cell
      .split(";")
      .map((x) => x.trim())
      .filter(Boolean);

    return parts.map((p, idx) => {
      const [size, price, stock] = p.split("|").map((x) => x.trim());
      return {
        id: `v-${Date.now()}-${idx}`,
        size: size || "Default",
        price: Number(price || 0),
        stock: Number(stock || 0),
      };
    });
  };

  const handleBulkImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = String(event.target.result || "");
        const rows = text.split("\n").filter((row) => row.trim() !== "");
        const dataRows = rows.slice(1);

        const newProducts = dataRows.map((row) => {
          const cols = row.split(",").map((c) => c.trim());

          const variants = parseVariantsCell(cols[2]);

          return {
            id: Date.now() + Math.random(),
            name: cols[0],
            category: cols[1] || "Green Tea",
            variants,
            discountPrice: Number(cols[3]) || 0,
            discountType: cols[4] === "percent" ? "percent" : "flat",
            vat: Number(cols[5]) || 5,
            description: cols[6] || "",
            img: cols[7] || "",
            isFeatured: cols[8]?.toLowerCase() === "true",
            updatedAt: new Date().toISOString(),
          };
        });

        const existing = JSON.parse(localStorage.getItem("teaProducts")) || [];
        localStorage.setItem(
          "teaProducts",
          JSON.stringify([...existing, ...newProducts]),
        );
        alert(`Successfully imported ${newProducts.length} items!`);
        navigate("/admin/products");
      } catch (err) {
        alert("Error parsing CSV. Please use the provided template.");
      }
    };
    reader.readAsText(file);
  };

  // --- SUBMIT ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // basic validation for variants
    const cleanedVariants = (formData.variants || [])
      .map((v) => ({
        id: v.id || `v-${Date.now()}`,
        size: String(v.size || "Default").trim(),
        price: Number(v.price || 0),
        stock: Number(v.stock || 0),
      }))
      .filter((v) => v.size);

    if (!cleanedVariants.length) {
      alert("Please add at least one variant (size, price, stock).");
      return;
    }

    const existingItems = JSON.parse(localStorage.getItem("teaProducts")) || [];

    const finalProduct = {
      ...formData,
      name: String(formData.name || "").trim(),
      category: formData.category,
      variants: cleanedVariants,
      discountPrice: Number(formData.discountPrice || 0),
      vat: Number(formData.vat || 0),
      updatedAt: new Date().toISOString(),
    };

    const updatedItems = editData
      ? existingItems.map((item) =>
          item.id === formData.id ? finalProduct : item,
        )
      : [...existingItems, { ...finalProduct, id: Date.now() }];

    localStorage.setItem("teaProducts", JSON.stringify(updatedItems));
    navigate("/admin/products");
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4 pt-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            {editData ? "Modify Item" : "Add product"}
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <span className="px-3 py-1 bg-emerald-500 text-[9px] font-black text-white uppercase rounded-full">
              Active
            </span>
            <p className="text-white/20 font-bold text-[10px] uppercase tracking-[0.2em]">
              Database Management System
            </p>
          </div>
        </div>

        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
          <button
            onClick={() => setIsBulkMode(false)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              !isBulkMode
                ? "bg-emerald-500 text-white shadow-lg"
                : "text-white/40 hover:text-white"
            }`}
            type="button"
          >
            Single Entry
          </button>
          <button
            onClick={() => setIsBulkMode(true)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              isBulkMode
                ? "bg-emerald-500 text-white shadow-lg"
                : "text-white/40 hover:text-white"
            }`}
            type="button"
          >
            Bulk Import
          </button>
        </div>
      </div>

      {isBulkMode ? (
        <div className="grid grid-cols-1 gap-8 animate-in zoom-in-95 duration-500">
          <div className="bg-[#0a0a0a] border-2 border-dashed border-emerald-500/20 rounded-[40px] p-16 flex flex-col items-center text-center group hover:border-emerald-500/50 transition-all">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mb-8 group-hover:scale-110 transition-transform shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              <FileText size={48} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase mb-2">
              CSV Upload
            </h2>
            <p className="text-white/40 text-sm max-w-md mb-8">
              Use Variants column like: <b>100g|2400|10;250g|4500|5</b>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => bulkFileRef.current.click()}
                className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
                type="button"
              >
                Choose CSV File
              </button>
              <button
                onClick={downloadTemplate}
                className="px-10 py-4 bg-white/5 text-white/60 border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                type="button"
              >
                <Download size={16} /> Get Template
              </button>
            </div>
            <input
              type="file"
              ref={bulkFileRef}
              className="hidden"
              accept=".csv"
              onChange={handleBulkImport}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-4 space-y-6">
            {/* IMAGE */}
            <div className="relative group aspect-[4/5] bg-[#0a0a0a] border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center transition-all overflow-hidden shadow-2xl">
              {formData.img ? (
                <>
                  <img
                    src={formData.img}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-all bg-black/40 backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="w-32 py-2 bg-white text-black text-[9px] font-black uppercase rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                    >
                      <ImageIcon size={14} /> Local
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt("Enter Image URL:");
                        if (url) setFormData({ ...formData, img: url });
                      }}
                      className="w-32 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                    >
                      <LinkIcon size={14} /> URL
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, img: "" })}
                      className="mt-2 text-red-500 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest"
                    >
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-6 p-8">
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="p-8 rounded-full bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-white cursor-pointer transition-all shadow-inner group"
                  >
                    <Upload
                      size={32}
                      className="group-hover:-translate-y-1 transition-transform"
                    />
                  </div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                    Awaiting Harvest Visuals
                  </p>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setFormData({ ...formData, img: reader.result });
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            {/* FEATURED */}
            <div
              onClick={() =>
                setFormData({ ...formData, isFeatured: !formData.isFeatured })
              }
              className={`cursor-pointer p-6 rounded-[30px] border transition-all flex items-center justify-between group ${
                formData.isFeatured
                  ? "bg-yellow-400/10 border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.1)]"
                  : "bg-[#0a0a0a] border-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl transition-all ${
                    formData.isFeatured
                      ? "bg-yellow-400 text-black"
                      : "bg-white/5 text-white/20"
                  }`}
                >
                  <Star
                    size={20}
                    fill={formData.isFeatured ? "black" : "none"}
                  />
                </div>
                <div>
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest ${
                      formData.isFeatured ? "text-yellow-400" : "text-white/40"
                    }`}
                  >
                    Featured Status
                  </p>
                  <p className="text-white text-xs font-bold">
                    {formData.isFeatured
                      ? "Active in Carousel"
                      : "Hidden from Carousel"}
                  </p>
                </div>
              </div>
              <div
                className={`w-12 h-6 rounded-full relative transition-all ${
                  formData.isFeatured ? "bg-yellow-400" : "bg-white/10"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    formData.isFeatured ? "right-1" : "left-1"
                  }`}
                />
              </div>
            </div>

            {/* AUDIT */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[30px] p-6 shadow-xl">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-6">
                Inventory Audit
              </h4>
              <div className="space-y-4 font-medium">
                <div className="flex justify-between text-xs">
                  <span className="text-white/30 uppercase">In Stock:</span>
                  <span
                    className={`${
                      totalStock < 10 ? "text-orange-500" : "text-white"
                    } font-mono`}
                  >
                    {totalStock} Units
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-white/30 uppercase">From Price:</span>
                  <span className="text-white font-mono">
                    ৳{Number(minBasePrice || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-white/30 uppercase">Savings:</span>
                  <span className="text-red-500 font-mono">
                    -৳{discountAmount.toFixed(2)}
                  </span>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                  <span className="text-[10px] font-black text-emerald-500 uppercase">
                    Grand Total:
                  </span>
                  <span className="text-2xl font-black text-white font-mono">
                    ৳{finalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
            {/* BASIC */}
            <div className="grid grid-cols-2 gap-6 bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-white/10"
                  placeholder="e.g. Sylhet Estate Green Tea"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#111]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">
                  Tax Rate (VAT %)
                </label>
                <input
                  type="number"
                  value={formData.vat}
                  onChange={(e) =>
                    setFormData({ ...formData, vat: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* VARIANTS */}
            <div className="bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.3em]">
                    Variants (Size / Price / Stock)
                  </p>
                  <p className="text-white/25 text-xs mt-2">
                    Your store uses variants for accurate stock + size
                    selection.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addVariantRow}
                  className="px-5 py-3 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> Add Size
                </button>
              </div>

              <div className="space-y-3">
                {(formData.variants || []).map((v) => (
                  <div
                    key={v.id}
                    className="grid grid-cols-12 gap-3 items-center bg-white/[0.03] border border-white/10 rounded-2xl p-4"
                  >
                    <div className="col-span-4">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">
                        Size
                      </label>
                      <input
                        type="text"
                        value={v.size}
                        onChange={(e) =>
                          updateVariant(v.id, "size", e.target.value)
                        }
                        className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500/50"
                        placeholder="e.g. 100g"
                        required
                      />
                    </div>

                    <div className="col-span-4">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">
                        Price (৳)
                      </label>
                      <input
                        type="number"
                        value={v.price}
                        onChange={(e) =>
                          updateVariant(v.id, "price", e.target.value)
                        }
                        className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-emerald-500/50"
                        placeholder="0"
                        required
                      />
                    </div>

                    <div className="col-span-3">
                      <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">
                        Stock
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) =>
                            updateVariant(v.id, "stock", e.target.value)
                          }
                          className="mt-2 w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-10 text-white text-sm outline-none focus:border-emerald-500/50"
                          placeholder="0"
                          required
                        />
                        <Package
                          className="absolute left-3 top-1/2 -translate-y-0.5 text-white/20"
                          size={16}
                        />
                      </div>
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeVariantRow(v.id)}
                        className="p-3 rounded-xl bg-white/5 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        title="Remove variant"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PRICING */}
            <div className="grid grid-cols-2 gap-6 p-8 bg-emerald-500/5 rounded-[40px] border border-emerald-500/10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">
                  Discount
                </label>
                <div className="flex justify-between items-center">
                  <div className="flex bg-black/60 rounded-lg p-1 scale-95">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, discountType: "flat" })
                      }
                      className={`px-3 py-2 text-[9px] font-black rounded-md transition-all ${
                        formData.discountType === "flat"
                          ? "bg-emerald-500 text-white"
                          : "text-white/30"
                      }`}
                    >
                      <Banknote size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, discountType: "percent" })
                      }
                      className={`px-3 py-2 text-[9px] font-black rounded-md transition-all ${
                        formData.discountType === "percent"
                          ? "bg-emerald-500 text-white"
                          : "text-white/30"
                      }`}
                    >
                      <Percent size={12} />
                    </button>
                  </div>
                </div>

                <input
                  type="number"
                  value={formData.discountPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, discountPrice: e.target.value })
                  }
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none"
                  placeholder={
                    formData.discountType === "flat" ? "Amount" : "%"
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">
                  VAT (%)
                </label>
                <input
                  type="number"
                  value={formData.vat}
                  onChange={(e) =>
                    setFormData({ ...formData, vat: e.target.value })
                  }
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2 bg-[#0a0a0a] p-8 rounded-[40px] border border-white/5">
              <label className="text-[10px] font-black uppercase text-emerald-400 ml-2">
                Description
              </label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-emerald-500 outline-none transition-all resize-none"
                placeholder="Details about this harvest..."
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="group w-full py-8 bg-emerald-500 text-white rounded-[30px] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-emerald-400 transition-all hover:shadow-[0_20px_60px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3"
            >
              <Save
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              {editData ? "Commit to Database" : "Publish Harvest"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
