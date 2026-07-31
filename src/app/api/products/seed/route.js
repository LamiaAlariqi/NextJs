import connection from "@/app/db/conn";
import Product from "@/app/models/productModel";

export const INITIAL_PRODUCTS = [
  // Electronics
  {
    title: "Apple MacBook Pro M3 Max 16-inch",
    description: "Ultimate workstation powered by the M3 Max chip with 36GB unified memory, Liquid Retina XDR display, and 1TB SSD.",
    price: "2499",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    stocks: 10,
  },
  {
    title: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise-canceling wireless headphones with dual processors, crystal-clear hands-free calling, and 30hr battery.",
    price: "349",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    stocks: 15,
  },
  {
    title: "iPhone 15 Pro Max Titanium 256GB",
    description: "Forged in titanium featuring the groundbreaking A17 Pro chip, customizable Action button, and 5x Optical Telephoto camera.",
    price: "1199",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
    stocks: 12,
  },

  // Furniture
  {
    title: "Nordic Luxury Leather Sofa",
    description: "Handcrafted genuine leather sofa with high-density foam cushions and solid oak wooden legs for contemporary living rooms.",
    price: "899",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
    stocks: 5,
  },
  {
    title: "Minimalist Solid Oak Dining Table",
    description: "Sleek 6-seater dining table crafted from sustainably sourced solid oak with a scratch-resistant satin finish.",
    price: "650",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&auto=format&fit=crop&q=80",
    stocks: 8,
  },
  {
    title: "Modern Brass Arch Floor Lamp",
    description: "Architectural floor lamp featuring a warm ambient LED globe and brushed brass metallic finish for bedrooms and studies.",
    price: "180",
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    stocks: 20,
  },

  // Cars
  {
    title: "BMW M4 Competition Coupe 2024",
    description: "High-performance sports coupe with 503 hp M TwinPower Turbo inline 6-cylinder engine and M xDrive all-wheel drive.",
    price: "84900",
    category: "Cars",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80",
    stocks: 2,
  },
  {
    title: "Mercedes-AMG G63 SUV",
    description: "Iconic off-road luxury SUV equipped with a handcrafted 577 hp 4.0L V8 biturbo engine and premium Nappa leather interior.",
    price: "179000",
    category: "Cars",
    image: "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?w=800&auto=format&fit=crop&q=80",
    stocks: 1,
  },
  {
    title: "Tesla Model S Plaid Electric",
    description: "Tri-motor all-wheel drive flagship sedan delivering 1,020 hp, 0-60 mph in 1.99s, and up to 396 miles range.",
    price: "89990",
    category: "Cars",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80",
    stocks: 3,
  },

  // Makeup & Beauty
  {
    title: "Tom Ford Beauty Eye & Lip Collection",
    description: "Curated luxury cosmetics palette including ultra-pigmented eyeshadows and satin hydration lip color.",
    price: "240",
    category: "Makeup & Beauty",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    stocks: 25,
  },
  {
    title: "Advanced Hydrating Facial Serum",
    description: "Concentrated Hyaluronic Acid and Vitamin C glow formula for deep skin hydration and radiance restoration.",
    price: "75",
    category: "Makeup & Beauty",
    image: "https://images.unsplash.com/photo-1608248597263-00079e96e7c1?w=800&auto=format&fit=crop&q=80",
    stocks: 40,
  },
  {
    title: "Dior Sauvage Elixir Parfum 100ml",
    description: "An extraordinarily concentrated fragrance steeped in the iconic freshness of Sauvage with an intoxicating heart of spices.",
    price: "190",
    category: "Makeup & Beauty",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=80",
    stocks: 18,
  },

  // Clothing & Fashion
  {
    title: "Vintage Italian Genuine Leather Jacket",
    description: "Handcrafted 100% full-grain leather motorcycle jacket with tailored fit, heavy-duty YKK zippers, and insulated lining.",
    price: "299",
    category: "Clothing & Fashion",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
    stocks: 14,
  },
  {
    title: "Haute Couture Silk Evening Gown",
    description: "Floor-length silk gown with elegant drape, delicate straps, and timeless silhouette for formal galas and weddings.",
    price: "350",
    category: "Clothing & Fashion",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80",
    stocks: 11,
  },
  {
    title: "Nike Air Max Urban Sneakers",
    description: "Lightweight urban running sneakers engineered with responsive Air cushioning and breathable Flyknit mesh.",
    price: "165",
    category: "Clothing & Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    stocks: 30,
  },
];

export async function GET() {
  try {
    await connection();
    // Refresh database with initial English products
    await Product.deleteMany({});
    await Product.insertMany(INITIAL_PRODUCTS);

    return Response.json({
      success: true,
      message: `Database refreshed with ${INITIAL_PRODUCTS.length} English products!`,
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
