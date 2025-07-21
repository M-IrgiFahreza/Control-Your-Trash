// Waste types configuration
export const wasteTypes = [
  {
    id: 'bottles',
    name: 'Plastic Bottles',
    icon: '🍶',
    pointsPerKg: 50,
    description: 'Plastic water bottles, soda bottles, etc.',
  },
  {
    id: 'cans',
    name: 'Aluminum Cans',
    icon: '🥤',
    pointsPerKg: 80,
    description: 'Beverage cans, food cans, etc.',
  },
  {
    id: 'cardboard',
    name: 'Cardboard',
    icon: '📦',
    pointsPerKg: 30,
    description: 'Cardboard boxes, packaging materials',
  },
  {
    id: 'paper',
    name: 'Paper',
    icon: '📄',
    pointsPerKg: 25,
    description: 'Newspapers, magazines, office paper',
  },
  {
    id: 'glass',
    name: 'Glass',
    icon: '🍾',
    pointsPerKg: 60,
    description: 'Glass bottles, jars, containers',
  },
  {
    id: 'electronic',
    name: 'Electronics',
    icon: '📱',
    pointsPerKg: 100,
    description: 'Old phones, batteries, small electronics',
  },
];

// Reward options
export const rewardOptions = [
  {
    id: 'gopay',
    name: 'GoPay',
    logo: '💚',
    minPoints: 1000,
    rate: 100, // 100 points = 1000 IDR
    description: 'Transfer to your GoPay wallet',
  },
  {
    id: 'shopee',
    name: 'ShopeePay',
    logo: '🛒',
    minPoints: 1000,
    rate: 100,
    description: 'Transfer to your ShopeePay wallet',
  },
  {
    id: 'ovo',
    name: 'OVO',
    logo: '💜',
    minPoints: 1000,
    rate: 100,
    description: 'Transfer to your OVO wallet',
  },
];

// Application constants
export const APP_CONFIG = {
  name: 'EcoPoints',
  version: '1.0.0',
  pointsToIDR: 10, // 1 point = 10 IDR
  minRedeemAmount: 1000, // Minimum IDR 1,000
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
};
