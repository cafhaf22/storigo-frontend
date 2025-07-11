import { Product, User, DashboardStats } from '../types';

// Generate random ID
const generateId = () => Math.random().toString(36).substring(2, 10);

// Realistic product data
const productTemplates = [
  { name: 'iPhone 15 Pro', category: 'Electronics', basePrice: 999, image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'MacBook Air M2', category: 'Electronics', basePrice: 1199, image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'AirPods Pro', category: 'Electronics', basePrice: 249, image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Samsung Galaxy S24', category: 'Electronics', basePrice: 899, image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Nike Air Max 270', category: 'Footwear', basePrice: 150, image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Adidas Ultraboost 22', category: 'Footwear', basePrice: 180, image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Levi\'s 501 Jeans', category: 'Clothing', basePrice: 89, image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Champion Hoodie', category: 'Clothing', basePrice: 65, image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Ray-Ban Aviators', category: 'Accessories', basePrice: 154, image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Apple Watch Series 9', category: 'Electronics', basePrice: 399, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Sony WH-1000XM5', category: 'Electronics', basePrice: 399, image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Patagonia Fleece Jacket', category: 'Clothing', basePrice: 179, image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Hydro Flask Water Bottle', category: 'Accessories', basePrice: 45, image: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Yeti Rambler Tumbler', category: 'Accessories', basePrice: 35, image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Nintendo Switch OLED', category: 'Electronics', basePrice: 349, image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Kindle Paperwhite', category: 'Electronics', basePrice: 139, image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Converse Chuck Taylor', category: 'Footwear', basePrice: 65, image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'North Face Backpack', category: 'Accessories', basePrice: 89, image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Canon EOS R6', category: 'Electronics', basePrice: 2499, image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { name: 'Instant Pot Duo 7-in-1', category: 'Home & Kitchen', basePrice: 99, image: 'https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

// Generate mock products with realistic data
export const generateMockProducts = (count: number): Product[] => {
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const template = productTemplates[i % productTemplates.length];
    const priceVariation = (Math.random() - 0.5) * 0.2; // ±10% price variation
    const price = parseFloat((template.basePrice * (1 + priceVariation)).toFixed(2));
    const quantity = Math.floor(Math.random() * 100);
    
    products.push({
      id: generateId(),
      name: template.name,
      price,
      quantity,
      category: template.category,
      image: template.image,
      createdAt: new Date(Date.now() - Math.random() * 10000000000),
      updatedAt: new Date(),
    });
  }

  return products;
};

// Generate mock users
export const generateMockUsers = (count: number): User[] => {
  const roles: ('admin' | 'manager' | 'employee')[] = ['admin', 'manager', 'employee'];
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    
    users.push({
      id: generateId(),
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role,
      avatar: `https://i.pravatar.cc/150?u=${i}`,
      createdAt: new Date(Date.now() - Math.random() * 10000000000),
    });
  }

  return users;
};

// Generate mock dashboard stats
export const generateMockDashboardStats = (): DashboardStats => {
  const topSellingProducts = Array.from({ length: 5 }, (_, i) => ({
    id: generateId(),
    name: `Top Product ${i + 1}`,
    sold: Math.floor(Math.random() * 500 + 100),
    revenue: parseFloat((Math.random() * 10000 + 1000).toFixed(2)),
  }));

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const monthlyRevenue = months.map(month => ({
    month,
    revenue: parseFloat((Math.random() * 50000 + 10000).toFixed(2)),
  }));

  return {
    totalProducts: Math.floor(Math.random() * 1000 + 200),
    totalValue: parseFloat((Math.random() * 1000000 + 100000).toFixed(2)),
    lowStockItems: Math.floor(Math.random() * 50 + 5),
    topSellingProducts,
    monthlyRevenue,
  };
};

// Initial mock data
export const mockProducts = generateMockProducts(20);
export const mockUsers = generateMockUsers(10);
export const mockDashboardStats = generateMockDashboardStats();