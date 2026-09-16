export type Product = {
  slug: string;
  title: string;
  category: string;
  image: string;
  gallery?: string[];
  tagline: string;
  description: string;
  origin: string;
  moq: string;
  packaging: string;
  lead: string;
  hs: string;
  shelfLife: string;
  moisture?: string;
  color?: string;
  aroma?: string;
  applications: string[];
  specs: { label: string; value: string }[];
  benefits: string[];
  related: string[];
  featured?: boolean;
};

export const CATEGORIES = [
  "All",
  "Spices",
  "Rice & Grains",
  "Fresh Fruits",
  "Fresh Vegetables",
] as const;

// Reviewed public catalogue fallback. Numeric values are reference data, subject to batch confirmation.
export const PRODUCTS: Product[] = [
  {
    "slug": "turmeric-fingers",
    "title": "Turmeric Fingers",
    "category": "Spices",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779193385881-d15lv6mmbii.jpg",
    "tagline": "Indian turmeric fingers for international B2B buyers",
    "description": "GOPU Exports supplies Indian turmeric fingers for international spice processors and wholesale buyers. Share the required variety, origin, curcumin level, moisture limit and cleaning standard. Product availability, batch documentation and packing are reviewed before quotation.",
    "origin": "Nizamabad, Telangana, India",
    "moq": "1 MT depending on buyer requirement",
    "packaging": "25kg / 50kg PP or jute bags",
    "lead": "7–15 days depending on order quantity",
    "hs": "0910.30.10",
    "shelfLife": "12 Months",
    "applications": [
      "Spice Processing",
      "Food Manufacturing",
      "Turmeric Powder Production",
      "Ayurvedic Products",
      "Bulk Export Trade"
    ],
    "specs": [
      {
        "label": "Moisture",
        "value": "≤ 10%"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "pomegranate",
    "title": "Pomegranate",
    "category": "Fresh Fruits",
    "image": "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=900&auto=format&fit=crop",
    "tagline": "Indian pomegranate for international B2B buyers",
    "description": "Indian pomegranates for international fresh-produce importers, distributors and food processors. Share your required variety, size, packing and destination. Availability, quality requirements and handling arrangements are confirmed for each shipment.",
    "origin": "Solapur / Nashik, Maharashtra, India",
    "moq": "3 MT",
    "packaging": "4–5 kg carton boxes (tissue-wrapped)",
    "lead": "7–10 Days",
    "hs": "0810 90 40",
    "shelfLife": "60–90 days (4–6°C cold storage)",
    "applications": [
      "Fresh retail",
      "Juice extraction",
      "Food processing",
      "Nutraceuticals"
    ],
    "specs": [
      {
        "label": "Variety",
        "value": "Bhagwa (Wonderful)"
      },
      {
        "label": "Weight",
        "value": "250–400 g per fruit"
      },
      {
        "label": "Brix",
        "value": "≥ 16°"
      },
      {
        "label": "Arils",
        "value": "Deep red, soft seed"
      },
      {
        "label": "Shelf life",
        "value": "60–90 days cold"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "mango",
      "banana"
    ],
    "featured": false
  },
  {
    "slug": "banana",
    "title": "Banana (Cavendish)",
    "category": "Fresh Fruits",
    "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=900&auto=format&fit=crop",
    "tagline": "Indian banana (cavendish) for international B2B buyers",
    "description": "Indian Cavendish bananas for international fresh-produce importers and wholesalers. Grade, ripeness, packing, seasonal availability and cold-chain requirements are reviewed for the proposed destination and shipment.",
    "origin": "Tamil Nadu / Andhra Pradesh, India",
    "moq": "1 FCL (18–22 MT)",
    "packaging": "18–20 kg carton boxes",
    "lead": "7–10 Days",
    "hs": "0803 90 10",
    "shelfLife": "21–28 days (green stage cold chain)",
    "applications": [
      "Retail supermarkets",
      "Wholesale markets",
      "Processing (chips, flour)"
    ],
    "specs": [
      {
        "label": "Variety",
        "value": "Cavendish G9"
      },
      {
        "label": "Length",
        "value": "≥ 18 cm"
      },
      {
        "label": "Weight/piece",
        "value": "100–150 g"
      },
      {
        "label": "Brix",
        "value": "≥ 19°"
      },
      {
        "label": "Stage",
        "value": "Green (stage 1–2)"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "mango",
      "pomegranate"
    ],
    "featured": false
  },
  {
    "slug": "mango",
    "title": "Alphonso Mango",
    "category": "Fresh Fruits",
    "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=900&auto=format&fit=crop",
    "tagline": "Indian alphonso mango for international B2B buyers",
    "description": "Indian Alphonso mangoes for international fresh-produce importers, distributors and food businesses. Seasonal availability, origin evidence, fruit grade, packing and destination entry conditions are confirmed before quotation.",
    "origin": "Ratnagiri / Devgad, Maharashtra, India",
    "moq": "5 MT",
    "packaging": "Corrugated carton boxes (3–4 kg per box)",
    "lead": "5–7 Days (Seasonal: March–June)",
    "hs": "0804 50 20",
    "shelfLife": "14–21 days (refrigerated)",
    "applications": [
      "Premium retail",
      "Hotel supply",
      "Juice & pulp processing",
      "Gift boxes"
    ],
    "specs": [
      {
        "label": "Variety",
        "value": "Alphonso (Hapus)"
      },
      {
        "label": "Size",
        "value": "A, B (150–250 g per piece)"
      },
      {
        "label": "Brix",
        "value": "≥ 18°"
      },
      {
        "label": "Color",
        "value": "Golden saffron yellow"
      },
      {
        "label": "Season",
        "value": "March – June"
      },
      {
        "label": "Storage",
        "value": "8–12°C"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "banana",
      "pomegranate"
    ],
    "featured": true
  },
  {
    "slug": "non-basmati-rice",
    "title": "Non-Basmati Rice",
    "category": "Rice & Grains",
    "image": "/products/rice.webp",
    "tagline": "Indian non-basmati rice for international B2B buyers",
    "description": "Indian non-basmati rice for international importers, wholesalers and food-service buyers. Specify variety, raw or parboiled form, broken percentage and bag size. GOPU Exports confirms availability and destination requirements before accepting an order.",
    "origin": "Andhra Pradesh / Telangana / Odisha, India",
    "moq": "1 FCL (25 MT)",
    "packaging": "25 kg / 50 kg PP bags",
    "lead": "14–20 Days",
    "hs": "1006 30 90",
    "shelfLife": "18 months",
    "applications": [
      "Food aid programs",
      "Institutional supply",
      "Retail markets",
      "Food processing"
    ],
    "specs": [
      {
        "label": "Varieties",
        "value": "IR64, Sona Masuri, Swarna"
      },
      {
        "label": "Type",
        "value": "Raw / Parboiled / Steamed"
      },
      {
        "label": "Broken",
        "value": "5% / 10% / 25% (as required)"
      },
      {
        "label": "Moisture",
        "value": "≤ 14%"
      },
      {
        "label": "Admixture",
        "value": "≤ 1%"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "basmati-rice"
    ],
    "featured": false
  },
  {
    "slug": "basmati-rice",
    "title": "Basmati Rice",
    "category": "Rice & Grains",
    "image": "/products/rice.webp",
    "tagline": "Indian basmati rice for international B2B buyers",
    "description": "Indian basmati rice for international importers, distributors, restaurant groups and wholesale food businesses. Share the required variety, processing method, broken percentage and packing. Availability, origin documentation and commercial terms are confirmed with the quotation.",
    "origin": "Punjab / Haryana / Uttarakhand, India",
    "moq": "1 FCL (20 MT)",
    "packaging": "1 kg / 5 kg / 10 kg / 25 kg / 50 kg bags",
    "lead": "15–21 Days",
    "hs": "1006 30 10",
    "shelfLife": "24 months",
    "applications": [
      "Restaurant supply",
      "Retail wholesale",
      "Food processing",
      "Hotels & Catering"
    ],
    "specs": [
      {
        "label": "Variety",
        "value": "1121, Traditional, Pusa, Sharbati"
      },
      {
        "label": "Grain Length",
        "value": "≥ 7.5 mm (raw)"
      },
      {
        "label": "Elongation",
        "value": "≥ 1.5× on cooking"
      },
      {
        "label": "Moisture",
        "value": "≤ 13%"
      },
      {
        "label": "Broken",
        "value": "≤ 2%"
      },
      {
        "label": "Aroma",
        "value": "Natural Pandan-like fragrance"
      },
      {
        "label": "Processing",
        "value": "Double polished / Silky"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "non-basmati-rice",
      "cumin-seeds"
    ],
    "featured": true
  },
  {
    "slug": "fennel-seeds",
    "title": "Fennel Seeds",
    "category": "Spices",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779190969319-f17tr5fdfl.jpg",
    "tagline": "Indian fennel seeds for international B2B buyers",
    "description": "GOPU Exports supplies Indian fennel seeds to international importers, distributors, wholesalers and food businesses. Specify grade, physical form, purity and packing, together with destination-country requirements. Availability and export terms are confirmed during quotation.",
    "origin": "Gujarat / Rajasthan, India",
    "moq": "1 MT",
    "packaging": "25 kg PP bags",
    "lead": "10–14 Days",
    "hs": "0909 61 00",
    "shelfLife": "24 months",
    "applications": [
      "Culinary seasoning",
      "Herbal teas",
      "Pharmaceuticals",
      "Mouth fresheners"
    ],
    "specs": [
      {
        "label": "Grade",
        "value": "European, Lucknowi"
      },
      {
        "label": "Moisture",
        "value": "≤ 10%"
      },
      {
        "label": "Purity",
        "value": "98% min"
      },
      {
        "label": "Volatile Oil",
        "value": "≥ 1.5%"
      },
      {
        "label": "Color",
        "value": "Bright green-yellow"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "cumin-seeds",
      "coriander-seeds",
      "black-pepper"
    ],
    "featured": false
  },
  {
    "slug": "cinnamon",
    "title": "Cinnamon (Dalchini)",
    "category": "Spices",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779191510695-d1cgn6pr0vn.jpg",
    "tagline": "Indian cinnamon (dalchini) for international B2B buyers",
    "description": "GOPU Exports supplies Indian cinnamon (dalchini) to international importers, distributors, wholesalers and food businesses. Specify grade, physical form, purity and packing, together with destination-country requirements. Availability and export terms are confirmed during quotation.",
    "origin": "Tamil Nadu / Karnataka, India",
    "moq": "500 kg",
    "packaging": "25 kg bags / 5 kg retail packs",
    "lead": "14–18 Days",
    "hs": "0906 11 00",
    "shelfLife": "36 months",
    "applications": [
      "Baking",
      "Confectionery",
      "Beverages",
      "Nutraceuticals",
      "Perfumery"
    ],
    "specs": [
      {
        "label": "Type",
        "value": "Cassia / Ceylon"
      },
      {
        "label": "Moisture",
        "value": "≤ 13%"
      },
      {
        "label": "Volatile Oil",
        "value": "≥ 1%"
      },
      {
        "label": "Coumarin",
        "value": "As per destination norms"
      },
      {
        "label": "Form",
        "value": "Sticks / Powder / Quill"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "cloves",
      "green-cardamom",
      "fennel-seeds"
    ],
    "featured": false
  },
  {
    "slug": "cloves",
    "title": "Cloves",
    "category": "Spices",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779191053038-4ou5q55mxl4.webp",
    "tagline": "Indian cloves for international B2B buyers",
    "description": "GOPU Exports supplies Indian cloves to international importers, distributors, wholesalers and food businesses. Specify grade, physical form, purity and packing, together with destination-country requirements. Availability and export terms are confirmed during quotation.",
    "origin": "Tamil Nadu / Kerala, India",
    "moq": "500 kg",
    "packaging": "25 kg bags / vacuum packaging",
    "lead": "14–18 Days",
    "hs": "0907 10 00",
    "shelfLife": "36 months",
    "applications": [
      "Food manufacturing",
      "Essential oils",
      "Dental care",
      "Pharmaceuticals"
    ],
    "specs": [
      {
        "label": "Grade",
        "value": "Hand-picked, whole"
      },
      {
        "label": "Eugenol",
        "value": "≥ 72%"
      },
      {
        "label": "Moisture",
        "value": "≤ 12%"
      },
      {
        "label": "Volatile Oil",
        "value": "≥ 15%"
      },
      {
        "label": "Purity",
        "value": "99%"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "green-cardamom",
      "cinnamon",
      "black-pepper"
    ],
    "featured": false
  },
  {
    "slug": "coriander-seeds",
    "title": "Coriander Seeds",
    "category": "Spices",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779191176498-3zla9jy899t.webp",
    "tagline": "Indian coriander seeds for international B2B buyers",
    "description": "GOPU Exports supplies Indian coriander seeds to international importers, distributors, wholesalers and food businesses. Specify grade, physical form, purity and packing, together with destination-country requirements. Availability and export terms are confirmed during quotation.",
    "origin": "Rajasthan / Madhya Pradesh, India",
    "moq": "1 MT",
    "packaging": "25 kg PP bags",
    "lead": "10–14 Days",
    "hs": "0909 22 00",
    "shelfLife": "24 months",
    "applications": [
      "Culinary use",
      "Essential oil extraction",
      "Pharmaceuticals",
      "Beverages"
    ],
    "specs": [
      {
        "label": "Grade",
        "value": "Eagle, Scooter, Singapore"
      },
      {
        "label": "Moisture",
        "value": "≤ 10%"
      },
      {
        "label": "Purity",
        "value": "98% min"
      },
      {
        "label": "Volatile Oil",
        "value": "≥ 0.5%"
      },
      {
        "label": "Split",
        "value": "≤ 5%"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "cumin-seeds",
      "fennel-seeds",
      "turmeric-powder"
    ],
    "featured": false
  },
  {
    "slug": "cumin-seeds",
    "title": "Cumin Seeds",
    "category": "Spices",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779191633885-rtjwua32mwb.jpg",
    "tagline": "Indian cumin seeds for international B2B buyers",
    "description": "GOPU Exports supplies Indian cumin seeds to international importers, distributors, wholesalers and food businesses. Specify grade, physical form, purity and packing, together with destination-country requirements. Availability and export terms are confirmed during quotation.",
    "origin": "Unjha, Gujarat, India",
    "moq": "1 MT",
    "packaging": "25 kg PP bags / 50 kg bags",
    "lead": "10–14 Days",
    "hs": "0909 21 00",
    "shelfLife": "24 months",
    "applications": [
      "Food seasoning",
      "Spice blends",
      "Pharmaceuticals",
      "Ayurveda"
    ],
    "specs": [
      {
        "label": "Grade",
        "value": "European / Asian / Singapore"
      },
      {
        "label": "Moisture",
        "value": "≤ 10%"
      },
      {
        "label": "Purity",
        "value": "99% min"
      },
      {
        "label": "Volatile Oil",
        "value": "≥ 2.5%"
      },
      {
        "label": "Admixture",
        "value": "≤ 1%"
      },
      {
        "label": "Color",
        "value": "Uniform greenish-brown"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "coriander-seeds",
      "fennel-seeds",
      "turmeric-powder"
    ],
    "featured": false
  },
  {
    "slug": "red-chilli",
    "title": "Red Chilli (Whole)",
    "category": "Spices",
    "image": "/products/red-chilli.webp",
    "tagline": "Indian red chilli (whole) for international B2B buyers",
    "description": "GOPU Exports supplies whole Indian red chilli to international importers, spice processors, wholesalers and food-service buyers. Share your required variety, colour (ASTA), pungency (SHU), moisture limit and stem preference. Availability and batch results must be confirmed before an order is agreed.",
    "origin": "Guntur, Andhra Pradesh, India",
    "moq": "1 MT",
    "packaging": "25 kg PP bags / custom packaging",
    "lead": "7–12 Days",
    "hs": "0904 21 10",
    "shelfLife": "18 months",
    "applications": [
      "Spice blending",
      "Sauce manufacturing",
      "Food processing",
      "Restaurant supply"
    ],
    "specs": [
      {
        "label": "Variety",
        "value": "Guntur S4, Teja, 334"
      },
      {
        "label": "ASTA Color",
        "value": "80–100+ units"
      },
      {
        "label": "Scoville Heat",
        "value": "25,000–60,000 SHU"
      },
      {
        "label": "Moisture",
        "value": "≤ 12%"
      },
      {
        "label": "Stem",
        "value": "With / without stem"
      },
      {
        "label": "Purity",
        "value": "99%"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "turmeric-powder",
      "cumin-seeds",
      "coriander-seeds"
    ],
    "featured": true
  },
  {
    "slug": "turmeric-powder",
    "title": "Turmeric Powder",
    "category": "Spices",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779193108681-86orxks7c4b.webp",
    "tagline": "Indian turmeric powder for international B2B buyers",
    "description": "GOPU Exports supplies Indian turmeric powder for international food processors, distributors and wholesale buyers. Specify curcumin, colour, mesh size, moisture and purity requirements, together with your intended food application. Batch specifications, testing scope and packing are confirmed in the export quotation.",
    "origin": "Nizamabad, Telangana / Erode, Tamil Nadu",
    "moq": "1 MT",
    "packaging": "25 kg PP bags / 50 kg jute bags",
    "lead": "10–15 Days",
    "hs": "0910 30 20",
    "shelfLife": "24 months",
    "applications": [
      "Food coloring",
      "Cosmetics",
      "Pharmaceuticals",
      "Nutraceuticals",
      "Textiles"
    ],
    "specs": [
      {
        "label": "Curcumin",
        "value": "≥ 3.5%"
      },
      {
        "label": "Moisture",
        "value": "≤ 10%"
      },
      {
        "label": "Ash Content",
        "value": "≤ 7%"
      },
      {
        "label": "Color",
        "value": "Deep golden yellow (60–80 ASTA)"
      },
      {
        "label": "Mesh Size",
        "value": "60–100 mesh"
      },
      {
        "label": "Purity",
        "value": "99% minimum"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "red-chilli",
      "coriander-seeds",
      "cumin-seeds"
    ],
    "featured": true
  },
  {
    "slug": "black-pepper",
    "title": "Black Pepper",
    "category": "Spices",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779191735178-pzhxgxl3xuh.jpg",
    "tagline": "Indian black pepper for international B2B buyers",
    "description": "GOPU Exports supplies Indian black pepper to international importers, distributors, wholesalers and food businesses. Specify grade, physical form, purity and packing, together with destination-country requirements. Availability and export terms are confirmed during quotation.",
    "origin": "Kerala / Karnataka, India",
    "moq": "1 MT",
    "packaging": "25 kg bags / 50 kg PP bags",
    "lead": "7–12 Days",
    "hs": "0904 11 10",
    "shelfLife": "24 months",
    "applications": [
      "Food manufacturing",
      "Spice blending",
      "Condiments",
      "Pharmaceuticals"
    ],
    "specs": [
      {
        "label": "Grade",
        "value": "MG1, TGSEB"
      },
      {
        "label": "Bulk Density",
        "value": "≥ 550 g/L"
      },
      {
        "label": "Moisture",
        "value": "≤ 12%"
      },
      {
        "label": "Piperine",
        "value": "≥ 4%"
      },
      {
        "label": "Purity",
        "value": "99% minimum"
      },
      {
        "label": "Packaging",
        "value": "25 kg / 50 kg bags"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "green-cardamom",
      "cloves",
      "coriander-seeds"
    ],
    "featured": true
  },
  {
    "slug": "green-cardamom",
    "title": "Green Cardamom",
    "category": "Spices",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779191782834-3itrv4w4to6.jpg",
    "tagline": "Indian green cardamom for international B2B buyers",
    "description": "GOPU Exports supplies Indian green cardamom to international importers, distributors, wholesalers and food businesses. Specify grade, physical form, purity and packing, together with destination-country requirements. Availability and export terms are confirmed during quotation.",
    "origin": "Kerala / Karnataka, India",
    "moq": "1 MT",
    "packaging": "25 kg jute bags / vacuum pouches",
    "lead": "10–14 Days",
    "hs": "0908 31 00",
    "shelfLife": "24 months",
    "applications": [
      "Confectionery",
      "Beverages",
      "Perfumery",
      "Pharmaceuticals",
      "Food processing"
    ],
    "specs": [
      {
        "label": "Variety",
        "value": "Malabar, Mysore"
      },
      {
        "label": "Bold Size",
        "value": "7–8 mm & above"
      },
      {
        "label": "Moisture",
        "value": "≤ 12%"
      },
      {
        "label": "Volatile Oil",
        "value": "≥ 5%"
      },
      {
        "label": "Color",
        "value": "Bright green pods"
      },
      {
        "label": "Purity",
        "value": "98% minimum"
      },
      {
        "label": "Packaging",
        "value": "25 kg / vacuum packed"
      },
      {
        "label": "MOQ",
        "value": "1 MT"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [
      "black-pepper",
      "cloves",
      "cinnamon"
    ],
    "featured": true
  },
  {
    "slug": "chickpeas",
    "title": "Chickpeas",
    "category": "Pulses",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779191822705-u4knugs8jo.jpg",
    "tagline": "Indian chickpeas for international B2B buyers",
    "description": "GOPU Exports supplies Indian chickpeas to international importers, distributors, wholesalers and food businesses. Specify variety, whole or split form, grade and bag size. Availability and export terms are confirmed during quotation.",
    "origin": "India",
    "moq": "Discuss based on destination and pack size",
    "packaging": "25 kg / 50 kg PP bags, buyer-specific options on request",
    "lead": "Subject to availability and shipment plan",
    "hs": "",
    "shelfLife": "Confirm during quotation",
    "applications": [
      "Food processing",
      "Wholesale distribution",
      "Retail packing",
      "HORECA supply"
    ],
    "specs": [
      {
        "label": "Product",
        "value": "Chickpeas"
      },
      {
        "label": "Packing",
        "value": "Bulk PP bags or custom packing"
      },
      {
        "label": "MOQ",
        "value": "To be confirmed by enquiry"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "toor-dal",
    "title": "Toor Dal",
    "category": "Pulses",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779191928125-7p962dy8dvy.jpg",
    "tagline": "Indian toor dal for international B2B buyers",
    "description": "GOPU Exports supplies Indian toor dal to international importers, distributors, wholesalers and food businesses. Specify variety, whole or split form, grade and bag size. Availability and export terms are confirmed during quotation.",
    "origin": "India",
    "moq": "Discuss based on buyer requirement",
    "packaging": "25 kg / 50 kg bags, retail packs on request",
    "lead": "Subject to availability",
    "hs": "",
    "shelfLife": "",
    "applications": [
      "Food service",
      "Retail distribution",
      "Food ingredient supply"
    ],
    "specs": [
      {
        "label": "Product",
        "value": "Toor Dal"
      },
      {
        "label": "Packing",
        "value": "Bulk or buyer-specific"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "moong-dal",
    "title": "Moong Dal",
    "category": "Pulses",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779191976770-fnuv49jsdx.jpg",
    "tagline": "Indian moong dal for international B2B buyers",
    "description": "GOPU Exports supplies Indian moong dal to international importers, distributors, wholesalers and food businesses. Specify variety, whole or split form, grade and bag size. Availability and export terms are confirmed during quotation.",
    "origin": "India",
    "moq": "Confirm during quotation",
    "packaging": "25 kg / 50 kg bags, custom options by requirement",
    "lead": "",
    "hs": "",
    "shelfLife": "",
    "applications": [
      "Retail packing",
      "Food processing",
      "Wholesale distribution"
    ],
    "specs": [
      {
        "label": "Product",
        "value": "Moong Dal"
      },
      {
        "label": "Buyer details needed",
        "value": "Quantity, packing, destination"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "pearl-millet",
    "title": "Pearl Millet",
    "category": "Millets",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192075933-ohijq91x7u.jpg",
    "tagline": "Indian pearl millet for international B2B buyers",
    "description": "GOPU Exports supplies Indian pearl millet to international importers, distributors, wholesalers and food businesses. Specify grain variety, cleaning requirements, packing and intended use. Availability and export terms are confirmed during quotation.",
    "origin": "India",
    "moq": "Confirm by destination and pack size",
    "packaging": "25 kg / 50 kg bags",
    "lead": "",
    "hs": "",
    "shelfLife": "",
    "applications": [
      "Food ingredients",
      "Wholesale trading",
      "Milling"
    ],
    "specs": [
      {
        "label": "Product",
        "value": "Pearl Millet"
      },
      {
        "label": "Packing",
        "value": "Bulk export bags"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": true
  },
  {
    "slug": "finger-millet",
    "title": "Finger Millet",
    "category": "Millets",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192163149-q8r29mc1dz.jpg",
    "tagline": "Indian finger millet for international B2B buyers",
    "description": "GOPU Exports supplies Indian finger millet to international importers, distributors, wholesalers and food businesses. Specify grain variety, cleaning requirements, packing and intended use. Availability and export terms are confirmed during quotation.",
    "origin": "India",
    "moq": "Confirm during quotation",
    "packaging": "25 kg / 50 kg bags",
    "lead": "",
    "hs": "",
    "shelfLife": "",
    "applications": [
      "Milling",
      "Food ingredients",
      "Retail packing"
    ],
    "specs": [
      {
        "label": "Product",
        "value": "Finger Millet"
      },
      {
        "label": "MOQ",
        "value": "By enquiry"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "sesame-seeds",
    "title": "Sesame Seeds",
    "category": "Oil Seeds",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192227413-wzzu4i9mh8q.jpg",
    "tagline": "Indian sesame seeds for international B2B buyers",
    "description": "GOPU Exports supplies Indian sesame seeds to international importers, distributors, wholesalers and food businesses. Specify grade, purity, intended use and packing. Availability and export terms are confirmed during quotation.",
    "origin": "India",
    "moq": "Confirm based on grade and destination",
    "packaging": "25 kg / 50 kg bags",
    "lead": "",
    "hs": "",
    "shelfLife": "",
    "applications": [
      "Bakery",
      "Tahini production",
      "Food processing",
      "Wholesale trading"
    ],
    "specs": [
      {
        "label": "Product",
        "value": "Sesame Seeds"
      },
      {
        "label": "Packing",
        "value": "Bulk export bags"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "mustard-seeds",
    "title": "Mustard Seeds",
    "category": "Oil Seeds",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192272492-bwa4u20v8y4.webp",
    "tagline": "Indian mustard seeds for international B2B buyers",
    "description": "GOPU Exports supplies Indian mustard seeds to international importers, distributors, wholesalers and food businesses. Specify grade, purity, intended use and packing. Availability and export terms are confirmed during quotation.",
    "origin": "India",
    "moq": "By enquiry",
    "packaging": "25 kg / 50 kg bags",
    "lead": "",
    "hs": "",
    "shelfLife": "",
    "applications": [
      "Spice processing",
      "Oilseed use",
      "Food manufacturing"
    ],
    "specs": [
      {
        "label": "Product",
        "value": "Mustard Seeds"
      },
      {
        "label": "Packing",
        "value": "Bulk bags"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "ginger-powder",
    "title": "Ginger Powder",
    "category": "Spices",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192316996-w5qdd05i8kr.webp",
    "tagline": "Indian ginger powder for international B2B buyers",
    "description": "GOPU Exports supplies Indian ginger powder to international importers, distributors, wholesalers and food businesses. Specify grade, physical form, purity and packing, together with destination-country requirements. Availability and export terms are confirmed during quotation.",
    "origin": "India",
    "moq": "Confirm by packaging format",
    "packaging": "Bulk bags or buyer-specific packs",
    "lead": "",
    "hs": "",
    "shelfLife": "",
    "applications": [
      "Spice blends",
      "Food processing",
      "Private label",
      "Beverages"
    ],
    "specs": [
      {
        "label": "Product",
        "value": "Ginger Powder"
      },
      {
        "label": "Packing",
        "value": "Bulk or private-label options"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "garam-masala",
    "title": "Garam Masala",
    "category": "Spice Powders & Blends",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192357205-uocqciyk3tp.jpg",
    "tagline": "Indian garam masala for international B2B buyers",
    "description": "Garam masala for international food-service businesses, distributors and private-label buyers. Share the required recipe, ingredient and allergen declarations, pack size and destination. Blend composition and partner processing arrangements are agreed for each order.",
    "origin": "India",
    "moq": "Depends on pack size and label requirement",
    "packaging": "Bulk, pouch, or buyer-brand packs by enquiry",
    "lead": "",
    "hs": "",
    "shelfLife": "",
    "applications": [
      "Private label",
      "Retail spice brands",
      "Food service",
      "Food manufacturing"
    ],
    "specs": [
      {
        "label": "Product",
        "value": "Garam Masala"
      },
      {
        "label": "Label options",
        "value": "Buyer-specific discussion"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": true
  },
  {
    "slug": "dehydrated-onion-flakes",
    "title": "Dehydrated Onion Flakes",
    "category": "Processed Agricultural Products",
    "image": "https://images.unsplash.com/photo-1508747703725-719777637510?w=900&auto=format&fit=crop",
    "tagline": "Indian dehydrated onion flakes for international B2B buyers",
    "description": "GOPU Exports supplies Indian dehydrated onion flakes to international importers, distributors, wholesalers and food businesses. Specify form, ingredient declaration, packing and intended food application. Availability and export terms are confirmed during quotation.",
    "origin": "India",
    "moq": "Confirm by grade and pack format",
    "packaging": "Bulk cartons or bags based on requirement",
    "lead": "",
    "hs": "",
    "shelfLife": "",
    "applications": [
      "Seasonings",
      "Ready meals",
      "Food processing",
      "Ingredient distribution"
    ],
    "specs": [
      {
        "label": "Product",
        "value": "Dehydrated Onion Flakes"
      },
      {
        "label": "Packing",
        "value": "Bulk ingredient packing"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "basmati-1121-rice",
    "title": "1121 Basmati Rice",
    "category": "Rice & Grains",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192468975-hnun2fpgdal.jpeg",
    "tagline": "Indian 1121 basmati rice for international B2B buyers",
    "description": "GOPU Exports supplies Indian 1121 basmati rice to international importers, distributors, wholesalers and food businesses. Specify variety, processing method, broken percentage and bag size. Availability and export terms are confirmed during quotation.",
    "origin": "Punjab / Haryana, India",
    "moq": "1 x 20 ft container",
    "packaging": "25 kg / 50 kg PP bags or buyer brand packs",
    "lead": "10-15 days",
    "hs": "1006",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "Punjab / Haryana, India"
      },
      {
        "label": "Packing",
        "value": "25 kg / 50 kg PP bags or buyer brand packs"
      },
      {
        "label": "MOQ",
        "value": "1 x 20 ft container"
      },
      {
        "label": "Lead time",
        "value": "10-15 days"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": true
  },
  {
    "slug": "sona-masoori-rice",
    "title": "Sona Masoori Rice",
    "category": "Rice & Grains",
    "image": "/products/rice.webp",
    "tagline": "Indian sona masoori rice for international B2B buyers",
    "description": "GOPU Exports supplies Indian sona masoori rice to international importers, distributors, wholesalers and food businesses. Specify variety, processing method, broken percentage and bag size. Availability and export terms are confirmed during quotation.",
    "origin": "Telangana / Andhra Pradesh, India",
    "moq": "1 x 20 ft container",
    "packaging": "25 kg / 50 kg bags",
    "lead": "10-15 days",
    "hs": "1006",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "Telangana / Andhra Pradesh, India"
      },
      {
        "label": "Packing",
        "value": "25 kg / 50 kg bags"
      },
      {
        "label": "MOQ",
        "value": "1 x 20 ft container"
      },
      {
        "label": "Lead time",
        "value": "10-15 days"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "foxtail-millet",
    "title": "Foxtail Millet",
    "category": "Millets",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192583170-vdddnvewtlq.webp",
    "tagline": "Indian foxtail millet for international B2B buyers",
    "description": "GOPU Exports supplies Indian foxtail millet to international importers, distributors, wholesalers and food businesses. Specify grain variety, cleaning requirements, packing and intended use. Availability and export terms are confirmed during quotation.",
    "origin": "Karnataka / Telangana, India",
    "moq": "1 MT",
    "packaging": "25 kg bags / retail packs on request",
    "lead": "10-14 days",
    "hs": "1008",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "Karnataka / Telangana, India"
      },
      {
        "label": "Packing",
        "value": "25 kg bags / retail packs on request"
      },
      {
        "label": "MOQ",
        "value": "1 MT"
      },
      {
        "label": "Lead time",
        "value": "10-14 days"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "red-chilli-powder",
    "title": "Red Chilli Powder",
    "category": "Spice Powders & Blends",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192629812-khap621c7ih.webp",
    "tagline": "Indian red chilli powder for international B2B buyers",
    "description": "Indian red chilli powder for importers, food manufacturers and wholesalers. Specify the required heat, colour, mesh and ingredient declaration. GOPU Exports reviews batch requirements, packaging and destination documentation before confirming export supply.",
    "origin": "Guntur, Andhra Pradesh, India",
    "moq": "1 MT",
    "packaging": "25 kg food-grade bags / private label packs",
    "lead": "10-15 days",
    "hs": "0904",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "Guntur, Andhra Pradesh, India"
      },
      {
        "label": "Packing",
        "value": "25 kg food-grade bags / private label packs"
      },
      {
        "label": "MOQ",
        "value": "1 MT"
      },
      {
        "label": "Lead time",
        "value": "10-15 days"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": true
  },
  {
    "slug": "coriander-powder",
    "title": "Coriander Powder",
    "category": "Spice Powders & Blends",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779191234664-om0209zor8l.jpg",
    "tagline": "Indian coriander powder for international B2B buyers",
    "description": "GOPU Exports supplies Indian coriander powder to international importers, distributors, wholesalers and food businesses. Specify mesh, ingredient and allergen declarations, packing and intended food application. Availability and export terms are confirmed during quotation.",
    "origin": "Rajasthan / Madhya Pradesh, India",
    "moq": "1 MT",
    "packaging": "25 kg bags / retail pouches on request",
    "lead": "10-15 days",
    "hs": "0909",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "Rajasthan / Madhya Pradesh, India"
      },
      {
        "label": "Packing",
        "value": "25 kg bags / retail pouches on request"
      },
      {
        "label": "MOQ",
        "value": "1 MT"
      },
      {
        "label": "Lead time",
        "value": "10-15 days"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "curry-powder",
    "title": "Curry Powder Blend",
    "category": "Spice Powders & Blends",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192690861-3w59q0a6eva.jpg",
    "tagline": "Indian curry powder blend for international B2B buyers",
    "description": "GOPU Exports supplies Indian curry powder blend to international importers, distributors, wholesalers and food businesses. Specify mesh, ingredient and allergen declarations, packing and intended food application. Availability and export terms are confirmed during quotation.",
    "origin": "India",
    "moq": "1 MT",
    "packaging": "Bulk bags / private label pouches",
    "lead": "12-18 days",
    "hs": "0910",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "India"
      },
      {
        "label": "Packing",
        "value": "Bulk bags / private label pouches"
      },
      {
        "label": "MOQ",
        "value": "1 MT"
      },
      {
        "label": "Lead time",
        "value": "12-18 days"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "garlic-powder",
    "title": "Garlic Powder",
    "category": "Processed Agricultural Products",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192753781-388x1mmi1no.jpg",
    "tagline": "Indian garlic powder for international B2B buyers",
    "description": "GOPU Exports supplies Indian garlic powder to international importers, distributors, wholesalers and food businesses. Specify form, ingredient declaration, packing and intended food application. Availability and export terms are confirmed during quotation.",
    "origin": "Gujarat / Madhya Pradesh, India",
    "moq": "1 MT",
    "packaging": "20 kg / 25 kg food-grade bags",
    "lead": "12-18 days",
    "hs": "0712",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "Gujarat / Madhya Pradesh, India"
      },
      {
        "label": "Packing",
        "value": "20 kg / 25 kg food-grade bags"
      },
      {
        "label": "MOQ",
        "value": "1 MT"
      },
      {
        "label": "Lead time",
        "value": "12-18 days"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "fresh-onion",
    "title": "Fresh Onion",
    "category": "Fresh Vegetables",
    "image": "https://images.unsplash.com/photo-1508747703725-719777637510?w=900&auto=format&fit=crop",
    "tagline": "Indian fresh onion for international B2B buyers",
    "description": "GOPU Exports supplies Indian fresh onion to international importers, distributors, wholesalers and food businesses. Specify size or grade, packing, destination and shipment timing. Availability and handling requirements depend on the season and route. Availability and export terms are confirmed during quotation.",
    "origin": "Maharashtra / Karnataka, India",
    "moq": "1 x 20 ft container",
    "packaging": "Mesh bags as per buyer requirement",
    "lead": "7-12 days",
    "hs": "0703",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "Maharashtra / Karnataka, India"
      },
      {
        "label": "Packing",
        "value": "Mesh bags as per buyer requirement"
      },
      {
        "label": "MOQ",
        "value": "1 x 20 ft container"
      },
      {
        "label": "Lead time",
        "value": "7-12 days"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "fresh-potato",
    "title": "Fresh Potato",
    "category": "Fresh Vegetables",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192826686-4xsg47u4f7.jpg",
    "tagline": "Indian fresh potato for international B2B buyers",
    "description": "GOPU Exports supplies Indian fresh potato to international importers, distributors, wholesalers and food businesses. Specify size or grade, packing, destination and shipment timing. Availability and handling requirements depend on the season and route. Availability and export terms are confirmed during quotation.",
    "origin": "Gujarat / Uttar Pradesh, India",
    "moq": "1 x 20 ft container",
    "packaging": "Jute / mesh bags",
    "lead": "7-12 days",
    "hs": "0701",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "Gujarat / Uttar Pradesh, India"
      },
      {
        "label": "Packing",
        "value": "Jute / mesh bags"
      },
      {
        "label": "MOQ",
        "value": "1 x 20 ft container"
      },
      {
        "label": "Lead time",
        "value": "7-12 days"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "green-gram-whole",
    "title": "Green Gram Whole",
    "category": "Pulses",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192861135-mvlt7fe6kw.jpg",
    "tagline": "Indian green gram whole for international B2B buyers",
    "description": "GOPU Exports supplies Indian green gram whole to international importers, distributors, wholesalers and food businesses. Specify variety, whole or split form, grade and bag size. Availability and export terms are confirmed during quotation.",
    "origin": "Rajasthan / Maharashtra, India",
    "moq": "1 MT",
    "packaging": "25 kg / 50 kg bags",
    "lead": "10-14 days",
    "hs": "0713",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "Rajasthan / Maharashtra, India"
      },
      {
        "label": "Packing",
        "value": "25 kg / 50 kg bags"
      },
      {
        "label": "MOQ",
        "value": "1 MT"
      },
      {
        "label": "Lead time",
        "value": "10-14 days"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "groundnut-kernels",
    "title": "Groundnut Kernels",
    "category": "Oil Seeds",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192897936-arroz1vsg3q.jpeg",
    "tagline": "Indian groundnut kernels for international B2B buyers",
    "description": "GOPU Exports supplies Indian groundnut kernels to international importers, distributors, wholesalers and food businesses. Specify grade, purity, intended use and packing. Availability and export terms are confirmed during quotation.",
    "origin": "Gujarat / Andhra Pradesh, India",
    "moq": "1 MT",
    "packaging": "25 kg / 50 kg bags",
    "lead": "10-15 days",
    "hs": "1202",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "Gujarat / Andhra Pradesh, India"
      },
      {
        "label": "Packing",
        "value": "25 kg / 50 kg bags"
      },
      {
        "label": "MOQ",
        "value": "1 MT"
      },
      {
        "label": "Lead time",
        "value": "10-15 days"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "fresh-tomato",
    "title": "Fresh Tomato",
    "category": "Fresh Vegetables",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779192990754-jqhwsdm6h7n.jpg",
    "tagline": "Indian fresh tomato for international B2B buyers",
    "description": "GOPU Exports supplies Indian fresh tomato to international importers, distributors, wholesalers and food businesses. Specify size or grade, packing, destination and shipment timing. Availability and handling requirements depend on the season and route. Availability and export terms are confirmed during quotation.",
    "origin": "Karnataka / Maharashtra, India",
    "moq": "Discuss by destination",
    "packaging": "Crates / cartons as per buyer requirement",
    "lead": "Subject to season and route",
    "hs": "0702",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "Karnataka / Maharashtra, India"
      },
      {
        "label": "Packing",
        "value": "Crates / cartons as per buyer requirement"
      },
      {
        "label": "MOQ",
        "value": "Discuss by destination"
      },
      {
        "label": "Lead time",
        "value": "Subject to season and route"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "okra-ladies-finger",
    "title": "Okra (Ladies Finger)",
    "category": "Fresh Vegetables",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/fbe12c01-7a4a-4603-9a53-9501bd9e4bd0.png",
    "tagline": "Indian okra (ladies finger) for international B2B buyers",
    "description": "GOPU Exports supplies Indian okra (ladies finger) to international importers, distributors, wholesalers and food businesses. Specify size or grade, packing, destination and shipment timing. Availability and handling requirements depend on the season and route. Availability and export terms are confirmed during quotation.",
    "origin": "Gujarat / Maharashtra / Telangana, India",
    "moq": "Discuss by destination",
    "packaging": "Ventilated cartons / crates",
    "lead": "Subject to route and season",
    "hs": "0709",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "Gujarat / Maharashtra / Telangana, India"
      },
      {
        "label": "Packing",
        "value": "Ventilated cartons / crates"
      },
      {
        "label": "MOQ",
        "value": "Discuss by destination"
      },
      {
        "label": "Lead time",
        "value": "Subject to route and season"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "cashew-kernels",
    "title": "Cashew Kernels",
    "category": "Processed Agricultural Products",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779193026091-56sle7t7iqn.jpeg",
    "tagline": "Indian cashew kernels for international B2B buyers",
    "description": "GOPU Exports supplies Indian cashew kernels to international importers, distributors, wholesalers and food businesses. Specify form, ingredient declaration, packing and intended food application. Availability and export terms are confirmed during quotation.",
    "origin": "India",
    "moq": "500 kg",
    "packaging": "Vacuum tins / cartons",
    "lead": "12-18 days",
    "hs": "0801",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "India"
      },
      {
        "label": "Packing",
        "value": "Vacuum tins / cartons"
      },
      {
        "label": "MOQ",
        "value": "500 kg"
      },
      {
        "label": "Lead time",
        "value": "12-18 days"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "jaggery-powder",
    "title": "Jaggery Powder",
    "category": "Processed Agricultural Products",
    "image": "https://fqepkwnjdlmauskofafd.supabase.co/storage/v1/object/public/products/1779193058902-z6w94evg48r.webp",
    "tagline": "Indian jaggery powder for international B2B buyers",
    "description": "GOPU Exports supplies Indian jaggery powder to international importers, distributors, wholesalers and food businesses. Specify form, ingredient declaration, packing and intended food application. Availability and export terms are confirmed during quotation.",
    "origin": "Maharashtra / Karnataka, India",
    "moq": "1 MT",
    "packaging": "25 kg bags / retail packs on request",
    "lead": "12-18 days",
    "hs": "1701",
    "shelfLife": "Discuss by product and packing",
    "applications": [
      "Wholesale import",
      "Retail packing",
      "Food service or processing"
    ],
    "specs": [
      {
        "label": "Origin",
        "value": "Maharashtra / Karnataka, India"
      },
      {
        "label": "Packing",
        "value": "25 kg bags / retail packs on request"
      },
      {
        "label": "MOQ",
        "value": "1 MT"
      },
      {
        "label": "Lead time",
        "value": "12-18 days"
      }
    ],
    "benefits": [
      "Buyer specifications reviewed before quotation",
      "Packing and order quantity confirmed for the destination",
      "Testing and inspection requirements subject to availability and agreed scope"
    ],
    "related": [],
    "featured": false
  },
  {
    "slug": "onion",
    "title": "Red Onion",
    "category": "Fresh Vegetables",
    "image": "https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop",
    "tagline": "Indian red onion for export",
    "description": "GOPU Exports supplies Indian red onion to international B2B buyers. Product grade, packing and availability are confirmed during quotation.",
    "origin": "Nashik / Pune, Maharashtra, India",
    "moq": "1 FCL (25 MT)",
    "packaging": "25 kg mesh bags / 50 kg jute bags",
    "lead": "7–12 Days",
    "hs": "0703 10 19",
    "shelfLife": "3–6 months",
    "applications": [
      "Retail wholesale",
      "Food processing",
      "Industrial dehydration",
      "Restaurant supply"
    ],
    "specs": [
      {
        "label": "Variety",
        "value": "Nashik Red, Poona Red"
      },
      {
        "label": "Size",
        "value": "35–55mm / 55–75mm / 75mm+"
      },
      {
        "label": "Dry Matter",
        "value": "≥ 12%"
      },
      {
        "label": "Skin",
        "value": "3–4 outer skins intact"
      },
      {
        "label": "Shelf Life",
        "value": "3–6 months"
      }
    ],
    "benefits": [],
    "related": [
      "mango",
      "banana"
    ],
    "featured": true
  }
];

export function getProductBySlug(slug: string) { return PRODUCTS.find((product) => product.slug === slug); }
