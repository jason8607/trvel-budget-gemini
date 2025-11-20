export const CURRENCIES = [
  { code: 'TWD', symbol: 'NT$', name: '新台幣' },
  { code: 'JPY', symbol: '¥', name: '日圓' },
  { code: 'USD', symbol: '$', name: '美金' },
  { code: 'KRW', symbol: '₩', name: '韓元' },
];

export const CATEGORIES = [
  { id: 'food', name: '餐飲', icon: '🍽️', color: '#f87171' }, // red-400
  { id: 'transport', name: '交通', icon: '🚆', color: '#60a5fa' }, // blue-400
  { id: 'stay', name: '住宿', icon: '🏨', color: '#818cf8' }, // indigo-400
  { id: 'shopping', name: '購物', icon: '🛍️', color: '#f472b6' }, // pink-400
  { id: 'tickets', name: '娛樂', icon: '🎫', color: '#fbbf24' }, // amber-400
  { id: 'other', name: '其他', icon: '📦', color: '#94a3b8' }, // slate-400
];

export const MOCK_DATA_IF_EMPTY = [
  { id: '1', amount: 1200, currency: 'TWD', category: 'transport', date: '2023-10-01', description: '高鐵票', timestamp: 1696118400000 },
  { id: '2', amount: 350, currency: 'TWD', category: 'food', date: '2023-10-01', description: '鐵路便當', timestamp: 1696140000000 },
  { id: '3', amount: 4500, currency: 'TWD', category: 'stay', date: '2023-10-01', description: '飯店第一晚', timestamp: 1696160000000 },
  { id: '4', amount: 2000, currency: 'TWD', category: 'shopping', date: '2023-10-02', description: '紀念品', timestamp: 1696240000000 },
];