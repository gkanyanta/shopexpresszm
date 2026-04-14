import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.shipmentTrackingEvent.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.buyForMeQuote.deleteMany();
  await prisma.buyForMeRequest.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendorApplication.deleteMany();
  await prisma.vendorProfile.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.category.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("Password123", 12);

  // ─── USERS ──────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@shopexpresszm.com",
      password: hashedPassword,
      role: "ADMIN",
      phone: "+260970000001",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "Mwansa Chanda",
      email: "mwansa@example.com",
      password: hashedPassword,
      role: "CUSTOMER",
      phone: "+260971000001",
      customerProfile: { create: {} },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Grace Tembo",
      email: "grace@example.com",
      password: hashedPassword,
      role: "CUSTOMER",
      phone: "+260971000002",
      customerProfile: { create: {} },
    },
  });

  const vendorUser1 = await prisma.user.create({
    data: {
      name: "David Phiri",
      email: "david@techzone.zm",
      password: hashedPassword,
      role: "VENDOR",
      phone: "+260972000001",
    },
  });

  const vendorUser2 = await prisma.user.create({
    data: {
      name: "Chileshe Mwila",
      email: "chileshe@zedfashion.zm",
      password: hashedPassword,
      role: "VENDOR",
      phone: "+260972000002",
    },
  });

  const vendorUser3 = await prisma.user.create({
    data: {
      name: "Bwalya Mutale",
      email: "bwalya@homestyle.zm",
      password: hashedPassword,
      role: "VENDOR",
      phone: "+260972000003",
    },
  });

  // ─── ADDRESSES ────────────────────────────────────────
  await prisma.address.create({
    data: {
      userId: customer1.id,
      label: "Home",
      firstName: "Mwansa",
      lastName: "Chanda",
      phone: "+260971000001",
      address1: "Plot 42, Gardenia Road",
      city: "Lusaka",
      province: "Lusaka",
      isDefault: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: customer2.id,
      label: "Home",
      firstName: "Grace",
      lastName: "Tembo",
      phone: "+260971000002",
      address1: "15 Independence Avenue",
      city: "Lusaka",
      province: "Lusaka",
      isDefault: true,
    },
  });

  // ─── CATEGORIES ───────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electronics",
        slug: "electronics",
        description: "Phones, laptops, gadgets, and accessories",
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: "Fashion",
        slug: "fashion",
        description: "Clothing, shoes, and accessories for men and women",
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: "Beauty",
        slug: "beauty",
        description: "Skincare, makeup, and personal care products",
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: "Home & Kitchen",
        slug: "home-kitchen",
        description: "Furniture, appliances, kitchenware, and decor",
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: "Groceries & Household",
        slug: "groceries-household",
        description: "Everyday essentials, food items, and household goods",
        sortOrder: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: "Office Supplies",
        slug: "office-supplies",
        description: "Stationery, furniture, and business equipment",
        sortOrder: 6,
      },
    }),
    prisma.category.create({
      data: {
        name: "Automotive Accessories",
        slug: "automotive-accessories",
        description: "Car parts, accessories, and maintenance products",
        sortOrder: 7,
      },
    }),
    prisma.category.create({
      data: {
        name: "Imported Special Orders",
        slug: "imported-special-orders",
        description: "Products sourced from USA, UK, and China",
        sortOrder: 8,
      },
    }),
  ]);

  const [electronics, fashion, beauty, homeKitchen, , officeSup] = categories;

  // ─── VENDOR PROFILES ──────────────────────────────────
  const vendor1 = await prisma.vendorProfile.create({
    data: {
      userId: vendorUser1.id,
      businessName: "TechZone Lusaka",
      slug: "techzone-lusaka",
      description:
        "Your one-stop shop for the latest electronics and gadgets in Lusaka. We stock genuine products with warranty.",
      phone: "+260972000001",
      email: "sales@techzone.zm",
      address: "Cairo Road, Lusaka",
      city: "Lusaka",
      isVerified: true,
      status: "APPROVED",
      application: {
        create: {
          businessType: "Retail Electronics",
          status: "APPROVED",
          reviewedAt: new Date(),
        },
      },
    },
  });

  const vendor2 = await prisma.vendorProfile.create({
    data: {
      userId: vendorUser2.id,
      businessName: "Zed Fashion Hub",
      slug: "zed-fashion-hub",
      description:
        "Authentic Zambian fashion and African-inspired designs. Chitenge, Ankara, and modern styles.",
      phone: "+260972000002",
      email: "hello@zedfashion.zm",
      address: "Manda Hill, Lusaka",
      city: "Lusaka",
      isVerified: true,
      status: "APPROVED",
      application: {
        create: {
          businessType: "Fashion & Clothing",
          status: "APPROVED",
          reviewedAt: new Date(),
        },
      },
    },
  });

  const vendor3 = await prisma.vendorProfile.create({
    data: {
      userId: vendorUser3.id,
      businessName: "HomeStyle Zambia",
      slug: "homestyle-zambia",
      description:
        "Quality home and kitchen products at affordable prices. Making your home beautiful.",
      phone: "+260972000003",
      email: "info@homestyle.zm",
      address: "Levy Junction, Lusaka",
      city: "Lusaka",
      isVerified: true,
      status: "APPROVED",
      application: {
        create: {
          businessType: "Home & Kitchen",
          status: "APPROVED",
          reviewedAt: new Date(),
        },
      },
    },
  });

  // ─── PRODUCTS ─────────────────────────────────────────
  const products = await Promise.all([
    prisma.product.create({
      data: {
        title: "Samsung Galaxy A15 - 128GB Dual SIM",
        slug: "samsung-galaxy-a15-128gb",
        sku: "TECH-001",
        description:
          "The Samsung Galaxy A15 features a 6.5-inch Super AMOLED display, 50MP triple camera system, and a long-lasting 5000mAh battery. Perfect for everyday use with 128GB storage.",
        shortDescription: "6.5\" AMOLED, 50MP Camera, 5000mAh Battery",
        price: 3200,
        compareAtPrice: 3800,
        stock: 25,
        brand: "Samsung",
        isLocal: true,
        isFeatured: true,
        categoryId: electronics.id,
        vendorId: vendor1.id,
        images: {
          create: [
            { url: "/images/products/galaxy-a15.jpg", alt: "Samsung Galaxy A15", sortOrder: 0 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Ankara Print Maxi Dress - Zambian Design",
        slug: "ankara-print-maxi-dress",
        sku: "FASH-001",
        description:
          "Beautiful Ankara print maxi dress featuring traditional Zambian-inspired patterns. Handcrafted with premium African wax print fabric. Available in multiple sizes.",
        shortDescription: "Handcrafted African wax print, multiple sizes",
        price: 450,
        compareAtPrice: 600,
        stock: 40,
        brand: "Zed Fashion",
        isLocal: true,
        isFeatured: true,
        categoryId: fashion.id,
        vendorId: vendor2.id,
        images: {
          create: [
            { url: "/images/products/ankara-dress.jpg", alt: "Ankara Maxi Dress", sortOrder: 0 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "JBL Flip 6 Portable Bluetooth Speaker",
        slug: "jbl-flip-6-bluetooth-speaker",
        sku: "TECH-002",
        description:
          "The JBL Flip 6 delivers powerful JBL Original Pro Sound with an optimized racetrack-shaped driver, IP67 waterproof and dustproof rating, and 12 hours of playtime.",
        shortDescription: "Waterproof, 12hr battery, powerful bass",
        price: 1850,
        stock: 15,
        brand: "JBL",
        isLocal: false,
        isFeatured: true,
        categoryId: electronics.id,
        vendorId: vendor1.id,
        images: {
          create: [
            { url: "/images/products/jbl-flip6.jpg", alt: "JBL Flip 6", sortOrder: 0 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Organic Shea Butter Body Cream - 500ml",
        slug: "organic-shea-butter-cream",
        sku: "BEAU-001",
        description:
          "100% natural organic shea butter body cream. Deeply moisturizing and nourishing for all skin types. Made with locally sourced ingredients.",
        shortDescription: "100% natural, locally sourced",
        price: 120,
        compareAtPrice: 180,
        stock: 100,
        brand: "Natural Glow",
        isLocal: true,
        isFeatured: true,
        categoryId: beauty.id,
        vendorId: vendor3.id,
        images: {
          create: [
            { url: "/images/products/shea-butter.jpg", alt: "Shea Butter Cream", sortOrder: 0 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Non-Stick Cookware Set - 10 Piece",
        slug: "non-stick-cookware-set-10pc",
        sku: "HOME-001",
        description:
          "Complete 10-piece non-stick cookware set including frying pans, saucepans, and stockpot. PFOA-free coating with ergonomic handles.",
        shortDescription: "10-piece set, PFOA-free, ergonomic handles",
        price: 890,
        compareAtPrice: 1200,
        stock: 30,
        brand: "HomeStyle",
        isLocal: true,
        isFeatured: false,
        categoryId: homeKitchen.id,
        vendorId: vendor3.id,
        images: {
          create: [
            { url: "/images/products/cookware-set.jpg", alt: "Cookware Set", sortOrder: 0 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Apple AirPods Pro (2nd Generation)",
        slug: "apple-airpods-pro-2nd-gen",
        sku: "TECH-003",
        description:
          "Apple AirPods Pro (2nd generation) with Active Noise Cancellation, Transparency mode, and Adaptive Audio. USB-C charging case with precision finding.",
        shortDescription: "ANC, Adaptive Audio, USB-C case",
        price: 4500,
        compareAtPrice: 5200,
        stock: 10,
        brand: "Apple",
        isLocal: false,
        isFeatured: true,
        categoryId: electronics.id,
        vendorId: vendor1.id,
        images: {
          create: [
            { url: "/images/products/airpods-pro.jpg", alt: "AirPods Pro 2", sortOrder: 0 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Office Executive Chair - Ergonomic",
        slug: "office-executive-chair-ergonomic",
        sku: "OFFC-001",
        description:
          "Premium ergonomic executive office chair with lumbar support, adjustable armrests, and breathable mesh back. Supports up to 150kg.",
        shortDescription: "Ergonomic, lumbar support, mesh back",
        price: 2800,
        stock: 12,
        brand: "OfficePro",
        isLocal: true,
        isFeatured: false,
        categoryId: officeSup.id,
        vendorId: vendor3.id,
        images: {
          create: [
            { url: "/images/products/office-chair.jpg", alt: "Executive Chair", sortOrder: 0 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Chitenge Fabric Bundle - 6 Yards Premium",
        slug: "chitenge-fabric-bundle-6yards",
        sku: "FASH-002",
        description:
          "Premium quality chitenge fabric bundle, 6 yards. Perfect for traditional and modern fashion designs. Vibrant, colourfast prints.",
        shortDescription: "6 yards, premium quality, vibrant prints",
        price: 350,
        compareAtPrice: 450,
        stock: 60,
        brand: "Zed Fashion",
        isLocal: true,
        isFeatured: true,
        categoryId: fashion.id,
        vendorId: vendor2.id,
        images: {
          create: [
            { url: "/images/products/chitenge-fabric.jpg", alt: "Chitenge Fabric", sortOrder: 0 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "HP Laptop 15 - Intel Core i5, 8GB RAM",
        slug: "hp-laptop-15-i5-8gb",
        sku: "TECH-004",
        description:
          "HP Laptop 15 with Intel Core i5 processor, 8GB RAM, 512GB SSD. Full HD display with Windows 11. Ideal for work and study.",
        shortDescription: "i5, 8GB RAM, 512GB SSD, Windows 11",
        price: 8500,
        compareAtPrice: 9800,
        stock: 8,
        brand: "HP",
        isLocal: false,
        isFeatured: true,
        categoryId: electronics.id,
        vendorId: vendor1.id,
        images: {
          create: [
            { url: "/images/products/hp-laptop.jpg", alt: "HP Laptop 15", sortOrder: 0 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        title: "Men's African Print Shirt - Short Sleeve",
        slug: "mens-african-print-shirt",
        sku: "FASH-003",
        description:
          "Stylish men's African print short sleeve shirt. Perfect for casual and semi-formal occasions. Available in sizes S to XXL.",
        shortDescription: "African print, casual fit, S-XXL",
        price: 280,
        compareAtPrice: 350,
        stock: 50,
        brand: "Zed Fashion",
        isLocal: true,
        isFeatured: false,
        categoryId: fashion.id,
        vendorId: vendor2.id,
        images: {
          create: [
            { url: "/images/products/african-shirt.jpg", alt: "African Print Shirt", sortOrder: 0 },
          ],
        },
      },
    }),
  ]);

  // ─── REVIEWS ──────────────────────────────────────────
  await Promise.all([
    prisma.review.create({
      data: {
        userId: customer1.id,
        productId: products[0].id,
        rating: 5,
        title: "Great phone!",
        comment: "Excellent value for money. Battery lasts all day and camera is impressive for the price.",
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer2.id,
        productId: products[1].id,
        rating: 5,
        title: "Beautiful dress",
        comment: "The quality of the fabric is amazing. Fits perfectly and the pattern is gorgeous.",
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer1.id,
        productId: products[3].id,
        rating: 4,
        title: "Very moisturizing",
        comment: "Leaves skin so soft and smooth. Love that it's made with local ingredients.",
        isApproved: true,
      },
    }),
    prisma.review.create({
      data: {
        userId: customer2.id,
        productId: products[5].id,
        rating: 5,
        title: "Best earbuds ever",
        comment: "Noise cancellation is incredible. Worth every kwacha!",
        isApproved: true,
      },
    }),
  ]);

  // ─── DELIVERY ZONES ──────────────────────────────────
  await Promise.all([
    prisma.deliveryZone.create({
      data: { name: "Lusaka Central", province: "Lusaka", baseFee: 35, expressFee: 75 },
    }),
    prisma.deliveryZone.create({
      data: { name: "Lusaka Suburbs", province: "Lusaka", baseFee: 50, expressFee: 100 },
    }),
    prisma.deliveryZone.create({
      data: { name: "Copperbelt", province: "Copperbelt", baseFee: 120, expressFee: 200 },
    }),
    prisma.deliveryZone.create({
      data: { name: "Southern Province", province: "Southern", baseFee: 150, expressFee: 250 },
    }),
    prisma.deliveryZone.create({
      data: { name: "Central Province", province: "Central", baseFee: 100, expressFee: 180 },
    }),
    prisma.deliveryZone.create({
      data: { name: "Eastern Province", province: "Eastern", baseFee: 180, expressFee: 300 },
    }),
    prisma.deliveryZone.create({
      data: { name: "Northern Province", province: "Northern", baseFee: 200, expressFee: 350 },
    }),
    prisma.deliveryZone.create({
      data: { name: "North-Western Province", province: "North-Western", baseFee: 200, expressFee: 350 },
    }),
    prisma.deliveryZone.create({
      data: { name: "Western Province", province: "Western", baseFee: 220, expressFee: 380 },
    }),
    prisma.deliveryZone.create({
      data: { name: "Luapula Province", province: "Luapula", baseFee: 220, expressFee: 380 },
    }),
  ]);

  // ─── COUPONS ──────────────────────────────────────────
  await Promise.all([
    prisma.coupon.create({
      data: {
        code: "WELCOME10",
        description: "10% off your first order",
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: 100,
        maxUses: 1000,
        expiresAt: new Date("2026-12-31"),
      },
    }),
    prisma.coupon.create({
      data: {
        code: "FREESHIP",
        description: "Free delivery on orders over K500",
        discountType: "fixed",
        discountValue: 50,
        minOrderAmount: 500,
        maxUses: 500,
        expiresAt: new Date("2026-06-30"),
      },
    }),
  ]);

  // ─── BUY FOR ME REQUESTS ─────────────────────────────
  await prisma.buyForMeRequest.create({
    data: {
      userId: customer1.id,
      productUrl: "https://www.amazon.com/dp/B0EXAMPLE",
      productName: "Sony WH-1000XM5 Wireless Headphones",
      productDescription: "Looking for the Sony WH-1000XM5 in black. Noise cancelling wireless headphones.",
      sourceCountry: "USA",
      quantity: 1,
      status: "QUOTED",
      quotes: {
        create: {
          productCost: 2800,
          shippingCost: 450,
          serviceFee: 200,
          totalCost: 3450,
          estimatedDays: 14,
        },
      },
    },
  });

  await prisma.buyForMeRequest.create({
    data: {
      userId: customer2.id,
      productName: "iPhone 15 Pro Max Case - MagSafe Compatible",
      productDescription: "Looking for a premium MagSafe case for iPhone 15 Pro Max in dark blue.",
      sourceCountry: "UK",
      quantity: 2,
      status: "SUBMITTED",
    },
  });

  // ─── FAQs ─────────────────────────────────────────────
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse our shop, add items to your cart, proceed to checkout, enter your delivery address, select a payment method, and confirm your order. You'll receive an email confirmation with your order details.",
      category: "Orders",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Visa and Mastercard, mobile money (MTN, Airtel, Zamtel), and bank transfers. For bank transfers, you'll need to upload proof of payment which our team will verify.",
      category: "Payments",
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery within Lusaka takes 2-3 business days. Express delivery is same day or next day within Lusaka. Nationwide courier to other provinces takes 3-7 business days.",
      category: "Delivery",
    },
    {
      question: "How does the Buy For Me service work?",
      answer: "Submit a request with the product link or description. Our team will review it, provide a quotation including product cost, shipping, and service fee. Once you accept and pay, we order the product and ship it to you in Zambia.",
      category: "International",
    },
    {
      question: "Can I return a product?",
      answer: "Yes, you can request a return within 7 days of delivery if the product is defective or not as described. Please contact our support team to initiate a return. Some conditions apply.",
      category: "Returns",
    },
    {
      question: "How do I become a vendor?",
      answer: "Visit our 'Sell With Us' page and fill out the vendor application form. Our team will review your application and get back to you within 2-3 business days.",
      category: "Vendors",
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, all payments are processed through secure, encrypted payment gateways. We do not store your card details on our servers.",
      category: "Payments",
    },
    {
      question: "Can I track my order?",
      answer: "Yes! Once your order is dispatched, you'll receive a tracking number. Use it on our Track Order page to see real-time updates on your delivery status.",
      category: "Orders",
    },
  ];

  await Promise.all(
    faqs.map((faq, index) =>
      prisma.fAQ.create({
        data: { ...faq, sortOrder: index },
      })
    )
  );

  // ─── BANNERS ──────────────────────────────────────────
  await Promise.all([
    prisma.banner.create({
      data: {
        title: "Shop Local, Support Zambian Businesses",
        subtitle: "Discover amazing products from verified local sellers",
        imageUrl: "/images/banners/banner-1.jpg",
        linkUrl: "/shop",
        sortOrder: 0,
      },
    }),
    prisma.banner.create({
      data: {
        title: "Buy From Abroad - USA, UK & China",
        subtitle: "Can't find it locally? We'll source it for you",
        imageUrl: "/images/banners/banner-2.jpg",
        linkUrl: "/buy-for-me",
        sortOrder: 1,
      },
    }),
    prisma.banner.create({
      data: {
        title: "New Arrivals This Week",
        subtitle: "Fresh products added daily from top vendors",
        imageUrl: "/images/banners/banner-3.jpg",
        linkUrl: "/shop?sort=newest",
        sortOrder: 2,
      },
    }),
  ]);

  // ─── SITE CONTENT ─────────────────────────────────────
  await Promise.all([
    prisma.siteContent.create({
      data: {
        key: "about",
        title: "About SHOP EXPRESS ZM",
        content: {
          heading: "About Us",
          body: "SHOP EXPRESS ZM is a multi-vendor e-commerce marketplace powered by Inland Express Zambia. We connect local retailers and wholesalers with customers across Zambia, while also offering international product sourcing from the USA, UK, and China. Our mission is to make quality products accessible to every Zambian through reliable delivery and secure online shopping.",
          mission: "To be Zambia's most trusted online marketplace, connecting local businesses with customers and bringing the world to Zambian doorsteps.",
          vision: "A Zambia where everyone has access to quality products — local and international — delivered with care and reliability.",
        },
      },
    }),
    prisma.siteContent.create({
      data: {
        key: "delivery-info",
        title: "Delivery Information",
        content: {
          heading: "Delivery Information",
          body: "We deliver to Lusaka and all major towns across Zambia's 10 provinces. Delivery fees vary by location and method chosen at checkout.",
        },
      },
    }),
    prisma.siteContent.create({
      data: {
        key: "payment-info",
        title: "Payment Information",
        content: {
          heading: "Payment Information",
          body: "We accept multiple payment methods including Visa, Mastercard, MTN Mobile Money, Airtel Money, Zamtel Kwacha, and bank transfers. All online payments are securely processed.",
        },
      },
    }),
  ]);

  console.log("Database seeded successfully!");
  console.log("─────────────────────────────────────");
  console.log("Demo accounts:");
  console.log("  Admin:    admin@shopexpresszm.com / Password123");
  console.log("  Customer: mwansa@example.com / Password123");
  console.log("  Customer: grace@example.com / Password123");
  console.log("  Vendor:   david@techzone.zm / Password123");
  console.log("  Vendor:   chileshe@zedfashion.zm / Password123");
  console.log("  Vendor:   bwalya@homestyle.zm / Password123");
  console.log("─────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
