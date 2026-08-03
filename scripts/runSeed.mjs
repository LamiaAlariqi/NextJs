import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://lamiaaltayeb6_db_user:ac3iKxiy1fea1cxO@cluster0.o8dfrha.mongodb.net/test";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    stocks: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

const SEED_PRODUCTS = [
  // Electronics
  {
    title: "MacBook Pro 16 M3 Max 36GB",
    description: "Ultimate power workstation featuring Apple M3 Max chip, Liquid Retina XDR display, and 22-hour battery life.",
    price: "2499",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    category: "Electronics",
    stocks: 8,
  },
  {
    title: "Sony PlayStation 5 Pro Console",
    description: "Next-generation gaming console with 2TB SSD, AI-enhanced ray tracing, and ultra 4K 120Hz graphics.",
    price: "699",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80",
    category: "Electronics",
    stocks: 12,
  },
  {
    title: "Samsung Galaxy S24 Ultra 512GB",
    description: "Titanium frame smartphone with Galaxy AI capabilities, 200MP camera, and built-in S Pen.",
    price: "1199",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
    category: "Electronics",
    stocks: 10,
  },
  {
    title: "iPad Pro 12.9 M2 Liquid Retina",
    description: "Ultra-thin tablet with M2 chip, ProMotion 120Hz XDR screen, Thunderbolt 4, and Apple Pencil hover.",
    price: "1099",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    category: "Electronics",
    stocks: 15,
  },

  // Furniture
  {
    title: "Eames Lounge Chair & Ottoman",
    description: "Iconic mid-century modern lounge chair crafted with premium black leather and molded walnut wood veneer.",
    price: "899",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
    category: "Furniture",
    stocks: 5,
  },
  {
    title: "Nordic Minimalist Oak Standing Desk",
    description: "Solid Scandinavian oak electric height-adjustable standing desk with dual whisper-quiet motors.",
    price: "450",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80",
    category: "Furniture",
    stocks: 7,
  },
  {
    title: "Velvet Emerald Accent Armchair",
    description: "Luxurious deep emerald green velvet armchair supported by brushed brass gold steel legs.",
    price: "320",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
    category: "Furniture",
    stocks: 9,
  },
  {
    title: "Modular Italian Leather Sofa Set",
    description: "Handcrafted Italian full-grain leather sectional sofa designed for ultimate living room comfort.",
    price: "1450",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&auto=format&fit=crop&q=80",
    category: "Furniture",
    stocks: 4,
  },

  // Cars
  {
    title: "Porsche 911 GT3 RS 2024",
    description: "Naturally aspirated 4.0L flat-six engine delivering 518hp with active aerodynamic drag reduction system.",
    price: "245000",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80",
    category: "Cars",
    stocks: 2,
  },
  {
    title: "Mercedes-AMG G 63 V8 Biturbo",
    description: "Legendary luxury off-roader featuring twin-turbo V8 engine, Nappa leather interior, and side-pipe exhaust.",
    price: "185000",
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&auto=format&fit=crop&q=80",
    category: "Cars",
    stocks: 3,
  },
  {
    title: "Tesla Cybertruck Cyberbeast 845hp",
    description: "Ultra-hard stainless steel exoskeleton electric truck capable of 0-60 mph in 2.6 seconds.",
    price: "99000",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80",
    category: "Cars",
    stocks: 4,
  },
  {
    title: "BMW M4 Competition Coupe xDrive",
    description: "Track-focused luxury coupe with M TwinPower Turbo inline 6-cylinder engine producing 503 horsepower.",
    price: "85000",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80",
    category: "Cars",
    stocks: 3,
  },

  // Makeup & Beauty
  {
    title: "Dior Sauvage Elixir Parfum 100ml",
    description: "Concentrated luxury fragrance infused with spicy cardamom, lavender, and rich amber woods.",
    price: "180",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    category: "Makeup & Beauty",
    stocks: 25,
  },
  {
    title: "La Mer Crème de la Mer 60ml",
    description: "Ultra-rich moisturizing cream formulated with cell-renewing Miracle Broth to soothe and hydrate skin.",
    price: "380",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80",
    category: "Makeup & Beauty",
    stocks: 18,
  },
  {
    title: "Fenty Beauty Gloss Bomb Universal",
    description: "High-shine lip luminizer offering explosive shine and nourishment with shea butter.",
    price: "45",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
    category: "Makeup & Beauty",
    stocks: 30,
  },

  // Clothing & Fashion
  {
    title: "Oversized Heavyweight Cashmere Hoodie",
    description: "Crafted from 100% pure Grade-A Mongolian cashmere with relaxed drop-shoulder tailoring.",
    price: "195",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    category: "Clothing & Fashion",
    stocks: 14,
  },
  {
    title: "Italian Tailored Slim-Fit Wool Suit",
    description: "Precision-cut two-piece suit constructed from Super 130s Italian virgin wool.",
    price: "650",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
    category: "Clothing & Fashion",
    stocks: 8,
  },
  {
    title: "Designer Lambskin Leather Biker Jacket",
    description: "Classic asymmetrical motorcycle jacket made from buttery-soft supple lambskin with silver hardware.",
    price: "480",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
    category: "Clothing & Fashion",
    stocks: 10,
  },

  // Audio
  {
    title: "Aura Sound Arc Wireless ANC Headphones",
    description: "Flagship audiophile noise-canceling headphones featuring custom titanium drivers and spatial audio.",
    price: "349",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    category: "Audio",
    stocks: 20,
  },
  {
    title: "Apple AirPods Max Space Gray",
    description: "Over-ear headphones engineered with Apple H1 chips, active noise cancellation, and mesh canopy.",
    price: "549",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    category: "Audio",
    stocks: 16,
  },
  {
    title: "Bang & Olufsen Beosound Bluetooth Speaker",
    description: "Portable wireless speaker delivering 360-degree room-filling acoustic power in aluminum housing.",
    price: "750",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    category: "Audio",
    stocks: 11,
  },

  // Wearables
  {
    title: "Apple Watch Ultra 2 Titanium 49mm",
    description: "Rugged smartwatch built for endurance athletes with dual-frequency GPS and 3000-nit display.",
    price: "799",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    category: "Wearables",
    stocks: 14,
  },
  {
    title: "Garmin Fenix 7 Pro Solar Multisport",
    description: "Solar-charging GPS smartwatch with built-in LED flashlight, endurance score, and topographic maps.",
    price: "699",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    category: "Wearables",
    stocks: 10,
  },
  {
    title: "Oura Ring Gen3 Horizon Smart Ring",
    description: "Sleek titanium smart ring tracking sleep stages, heart rate variability, body temperature, and readiness.",
    price: "349",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80",
    category: "Wearables",
    stocks: 22,
  },

  // Ambient Home
  {
    title: "Dyson Purifier Cool Air Purifying Fan",
    description: "Automatically senses, captures, and traps 99.97% of microscopic allergens with HEPA filtration.",
    price: "499",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
    category: "Ambient Home",
    stocks: 12,
  },
  {
    title: "Philips Hue Smart Gradient Floor Lamp",
    description: "Seamless color-blending smart LED floor lamp syncable with music, movies, and smart home routines.",
    price: "220",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    category: "Ambient Home",
    stocks: 18,
  },
  {
    title: "Smart Sunset Projection Ambient Light",
    description: "RGB 16-color optical crystal glass sunset projector creating warm therapeutic room atmospheres.",
    price: "65",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80",
    category: "Ambient Home",
    stocks: 32,
  },
];

async function seed() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  let count = 0;
  for (const p of SEED_PRODUCTS) {
    const existing = await Product.findOne({ title: p.title });
    if (!existing) {
      await Product.create(p);
      console.log(`+ Added [${p.category}]: ${p.title}`);
      count++;
    } else {
      console.log(`= Exists [${p.category}]: ${p.title}`);
    }
  }

  const total = await Product.countDocuments();
  console.log(`\nDONE! Inserted ${count} new products. Total products in database: ${total}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
