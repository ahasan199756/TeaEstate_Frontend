export const teaProducts = [
  {
    id: 1,
    sku: "BD-SYL-GREEN-ORG-001",
    name: "Organic Sylhet Green Tea",
    category: "Green Tea",
    origin: "Sylhet (Estate Grade)",
    rating: 4.8,
    description:
      "Hand-picked leaves from misty Sylhet estates. Clean, grassy finish with a soft sweetness.",
    tags: ["Organic", "Fresh", "Everyday Premium"],
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=1200",
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=1200",
      "https://images.unsplash.com/photo-1542801706-7c9918b3d0d8?w=1200",
    ],
    img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800",
    variants: [
      { size: "250g", price: 950, stock: 18 },
      { size: "500g", price: 1800, stock: 10 },
      { size: "1kg", price: 3400, stock: 6 },
    ],
  },

  {
    id: 2,
    sku: "BD-SRI-BLACK-PREM-002",
    name: "Srimangal Premium Black Tea",
    category: "Black Tea",
    origin: "Srimangal (Heritage Estate)",
    rating: 4.9,
    description:
      "Bold and robust with a malty body. Perfect with milk or straight.",
    tags: ["Strong", "Milk Tea", "Best Seller"],
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1544739313-6fad02872377?w=1200",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200",
    ],
    img: "https://images.unsplash.com/photo-1544739313-6fad02872377?w=800",
    variants: [
      { size: "250g", price: 750, stock: 25 },
      { size: "500g", price: 1400, stock: 14 },
      { size: "1kg", price: 2600, stock: 7 },
    ],
  },

  {
    id: 3,
    sku: "BD-SRI-FF-ORTH-003",
    name: "Srimangal First Flush (Limited)",
    category: "Orthodox Tea",
    origin: "Srimangal (First Flush)",
    rating: 4.9,
    description:
      "Early harvest orthodox leaf—light, aromatic, and super smooth. Limited batch.",
    tags: ["Limited", "Aromatic", "Orthodox"],
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=1200",
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200",
    ],
    img: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=800",
    variants: [
      { size: "250g", price: 1100, stock: 9 },
      { size: "500g", price: 2100, stock: 5 },
      { size: "1kg", price: 3900, stock: 2 }, // urgency-ready
    ],
  },

  {
    id: 4,
    sku: "BD-SYL-GOLD-TIPS-004",
    name: "Sylhet Golden Tips Reserve",
    category: "Premium Black",
    origin: "Sylhet (Golden Buds)",
    rating: 5.0,
    description:
      "Golden buds with honey notes and silky finish. Gift-worthy premium tea.",
    tags: ["Reserve", "Gift", "Rare"],
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200",
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=1200",
    ],
    img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800",
    variants: [
      { size: "250g", price: 1400, stock: 7 },
      { size: "500g", price: 2700, stock: 4 },
      { size: "1kg", price: 5200, stock: 1 }, // “Only 1 left”
    ],
  },

  {
    id: 5,
    sku: "BD-PAN-ORTH-005",
    name: "Panchagarh Cool-Climate Orthodox",
    category: "Orthodox Tea",
    origin: "Panchagarh (Northern Estates)",
    rating: 4.7,
    description:
      "Cool climate-grown leaf for a crisp cup. Balanced and bright.",
    tags: ["Cool Climate", "Crisp", "Daily"],
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200",
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=1200",
    ],
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
    variants: [
      { size: "250g", price: 850, stock: 16 },
      { size: "500g", price: 1600, stock: 9 },
      { size: "1kg", price: 3000, stock: 4 },
    ],
  },

  {
    id: 6,
    sku: "BD-CTG-OOLONG-006",
    name: "Chittagong Hill Oolong",
    category: "Oolong",
    origin: "Chittagong Hill Tracts",
    rating: 4.9,
    description: "Semi-oxidized specialty cup—floral, smooth, and premium.",
    tags: ["Specialty", "Floral", "Smooth"],
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1523906630133-f6934a1ab7a2?w=1200",
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=1200",
    ],
    img: "https://images.unsplash.com/photo-1523906630133-f6934a1ab7a2?w=800",
    variants: [
      { size: "250g", price: 1500, stock: 8 },
      { size: "500g", price: 2900, stock: 4 },
      { size: "1kg", price: 5500, stock: 2 },
    ],
  },

  {
    id: 7,
    sku: "BD-SRI-7L-BLEND-007",
    name: "Seven Layer Milk Tea Blend",
    category: "Signature Blend",
    origin: "Inspired by Srimangal",
    rating: 4.6,
    description:
      "A creamy milk-tea friendly blend inspired by Srimangal’s iconic layered tea culture.",
    tags: ["Signature", "Milk Tea", "Comfort"],
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?w=1200",
      "https://images.unsplash.com/photo-1542801706-7c9918b3d0d8?w=1200",
    ],
    img: "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?w=800",
    variants: [
      { size: "250g", price: 650, stock: 30 },
      { size: "500g", price: 1200, stock: 18 },
      { size: "1kg", price: 2200, stock: 9 },
    ],
  },

  {
    id: 8,
    sku: "BD-SYL-JAFLONG-GREEN-008",
    name: "Jaflong Estate Green",
    category: "Green Tea",
    origin: "Jaflong, Sylhet",
    rating: 4.8,
    description:
      "Mineral-rich soil grown green tea—clean taste with a fresh aroma.",
    tags: ["Estate", "Fresh", "Clean"],
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200",
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=1200",
    ],
    img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800",
    variants: [
      { size: "250g", price: 900, stock: 12 },
      { size: "500g", price: 1700, stock: 7 },
      { size: "1kg", price: 3200, stock: 3 },
    ],
  },

  {
    id: 9,
    sku: "BD-HERB-TULSI-009",
    name: "Bangla Tulsi Fusion",
    category: "Herbal Tea",
    origin: "Bangladesh (Herbal Blend)",
    rating: 4.5,
    description: "A calming tulsi-forward blend with light green tea notes.",
    tags: ["Herbal", "Calm", "Wellness"],
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=1200",
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=1200",
    ],
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800",
    variants: [
      { size: "250g", price: 600, stock: 20 },
      { size: "500g", price: 1100, stock: 12 },
      { size: "1kg", price: 2000, stock: 6 },
    ],
  },

  {
    id: 10,
    sku: "BD-CTC-DUST-010",
    name: "Bangla Gold Dust CTC",
    category: "CTC Tea",
    origin: "Sylhet (CTC)",
    rating: 4.7,
    description:
      "Strong CTC for classic Bangladeshi milk tea—quick brew, deep color.",
    tags: ["CTC", "Strong", "Daily"],
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1542801706-7c9918b3d0d8?w=1200",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200",
    ],
    img: "https://images.unsplash.com/photo-1542801706-7c9918b3d0d8?w=800",
    variants: [
      { size: "250g", price: 500, stock: 40 },
      { size: "500g", price: 900, stock: 22 },
      { size: "1kg", price: 1600, stock: 10 },
    ],
  },
];
