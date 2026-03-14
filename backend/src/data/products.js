const products = [
  {
    name: 'Quantum Series 7 Ultra',
    sku: 'QS7-ULTRA-001',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aac291ba59e?w=800&q=80'
    ],
    description: 'The pinnacle of wearable intelligence. The Quantum Series 7 Ultra features a sapphire crystal display, aerospace-grade titanium casing, and a proprietary bio-sensor suite that tracks 150+ health metrics in real-time.',
    brand: 'Aether',
    category: 'Electronics',
    price: 899.99,
    countInStock: 12,
    rating: 4.9,
    numReviews: 245,
    isFeatured: true,
    tags: ['trending', 'new-arrival'],
    specifications: [
      { key: 'Display', value: '2.1" Always-On Retina OLED' },
      { key: 'Material', value: 'Aerospace Grade Titanium' },
      { key: 'Battery', value: 'Up to 72 hours' },
      { key: 'Water Resistance', value: '100m (WR100)' }
    ]
  },
  {
    name: 'Sonic Onyx Pro X',
    sku: 'SO-PROX-99',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80'
    ],
    description: 'Studio-grade spatial audio that adapts to your environment. The Sonic Onyx Pro X utilizes dual-core neural processors to cancel up to 45dB of ambient noise while preserving every detail of your high-fidelity tracks.',
    brand: 'Sonic',
    category: 'Electronics',
    price: 349.50,
    countInStock: 42,
    rating: 4.8,
    numReviews: 189,
    isFeatured: true,
    tags: ['exclusive', 'high-fidelity'],
    specifications: [
      { key: 'Audio', value: 'Custom 50mm dynamic drivers' },
      { key: 'Noise Cancellation', value: 'Hybrid Active (ANC)' },
      { key: 'Connectivity', value: 'Bluetooth 5.3, LDAC Support' },
      { key: 'Battery Life', value: '50 hours with ANC' }
    ]
  },
  {
    name: 'Nordic Artisan Desk',
    sku: 'NAD-OAK-02',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80',
      'https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?w=800&q=80'
    ],
    description: 'Handcrafted from sustainably sourced solid white oak. This minimalist desk integrates invisible wireless charging, a magnetic cable management system, and a touch-responsive dimmable warm light under the lip.',
    brand: 'Fjord Home',
    category: 'Lifestyle',
    price: 1250.00,
    countInStock: 5,
    rating: 5.0,
    numReviews: 14,
    isFeatured: false,
    tags: ['trending', 'minimalist'],
    specifications: [
      { key: 'Dimensions', value: '160cm x 80cm x 75cm' },
      { key: 'Wood Type', value: 'Solid White Oak' },
      { key: 'Features', value: 'Qi Wireless Charging, Integrated LEDs' },
      { key: 'Assembly', value: '15-minute quick setup' }
    ]
  },
  {
    name: 'Velocity X-Carbon Ghost',
    sku: 'VX-GHOST-42',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'
    ],
    description: 'Engineering for breaking records. The Velocity X-Carbon features a full-length carbon fiber plate and nitrogen-infused foam for 15% more energy return than previous models. Limited Ghost Edition.',
    brand: 'Stride',
    category: 'Footwear',
    price: 275.00,
    countInStock: 18,
    rating: 4.9,
    numReviews: 112,
    isFeatured: true,
    tags: ['exclusive', 'limited-edition'],
    specifications: [
      { key: 'Weight', value: '190g (Size 9)' },
      { key: 'Plate', value: 'Full-length 3D Carbon' },
      { key: 'Stack Height', value: '40mm / 32mm' },
      { key: 'Upper', value: 'Aero-mesh precision fit' }
    ]
  },
  {
    name: 'Titanium Edge V2',
    sku: 'TE-V2-BLK',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80'
    ],
    description: 'Precision optics meets industrial design. The Titanium Edge V2 features laser-cut titanium frames and Zeiss Clarity lenses with blue-light protection and anti-reflective coating.',
    brand: 'Optic',
    category: 'Accessories',
    price: 320.00,
    countInStock: 25,
    rating: 4.7,
    numReviews: 45,
    isFeatured: false,
    tags: ['trending', 'eyewear'],
    specifications: [
      { key: 'Frame', value: '100% Pure Titanium' },
      { key: 'Lens', value: 'Zeiss Clarity Blue-Protect' },
      { key: 'Weight', value: '12 grams' },
      { key: 'Hinges', value: 'Screwless flex-mount' }
    ]
  },
  {
    name: 'Luxe Crimson Noir',
    sku: 'LCN-PARFUM-50',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80'
    ],
    description: 'An enigmatic blend of dark rose, smoked oud, and black pepper. Luxe Crimson Noir is a high-concentration parfum designed for the modern individual who commands presence.',
    brand: 'Vogue',
    category: 'Accessories',
    price: 210.00,
    countInStock: 60,
    rating: 4.6,
    numReviews: 67,
    isFeatured: false,
    tags: ['exclusive', 'fragrance'],
    specifications: [
      { key: 'Concentration', value: 'Extrait de Parfum (25%)' },
      { key: 'Top Notes', value: 'Black Pepper, Bergamot' },
      { key: 'Middle Notes', value: 'Dark Crimson Rose, Incense' },
      { key: 'Base Notes', value: 'Smoked Oud, Amber, Leather' }
    ]
  },
  {
    name: 'Aether Nano Pro 14',
    sku: 'ANP-14-M3',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80'
    ],
    description: 'Unprecedented power in a 14mm chassis. The Nano Pro is powered by the M3 Genesis chip, delivering 40 teraflops of compute power while maintaining active cooling silence.',
    brand: 'Aether',
    category: 'Computing',
    price: 2499.00,
    countInStock: 10,
    rating: 4.9,
    numReviews: 89,
    isFeatured: true,
    tags: ['exclusive', 'high-performance'],
    specifications: [
      { key: 'Processor', value: 'M3 Genesis (12-core CPU)' },
      { key: 'Memory', value: '32GB Unified LPDDR5X' },
      { key: 'Storage', value: '1TB PCIe Gen5 SSD' },
      { key: 'Display', value: '14" 120Hz Liquid Crystal' }
    ]
  },
  {
    name: 'Zenith Mechanical Keyboard',
    sku: 'ZENT-MK1-ALU',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80'
    ],
    description: 'A typing experience like no other. CNC-milled aluminum case, gasket mount system, and pre-lubed silent tactile switches. Includes high-profile PBT keycaps.',
    brand: 'Sonic',
    category: 'Computing',
    price: 450.00,
    countInStock: 20,
    rating: 4.8,
    numReviews: 54,
    isFeatured: false,
    tags: ['trending', 'peripherals'],
    specifications: [
      { key: 'Case', value: '6061 CNC Aluminum' },
      { key: 'Switches', value: 'Sonic Whisper Tactile' },
      { key: 'Layout', value: '75% Explosive' },
      { key: 'RGB', value: 'Underglow + Per-key' }
    ]
  }
];

module.exports = products;
