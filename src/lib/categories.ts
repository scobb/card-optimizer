import { RewardCategory } from '../types'

// Keywords matched against lowercase merchant name
const CATEGORY_KEYWORDS: Array<{ category: RewardCategory; keywords: string[] }> = [
  {
    category: 'dining',
    keywords: [
      'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'sushi', 'taco',
      'mcdonald', 'starbucks', 'subway', 'chipotle', 'domino', 'panera',
      'chick-fil-a', 'chick fil a', 'wendy', 'dunkin', 'panda express',
      'doordash', 'ubereats', 'uber eats', 'grubhub', 'postmates', 'seamless',
      'diner', 'grill', 'bistro', 'eatery', 'kitchen', 'bbq', 'steakhouse',
      'bar & grill', 'bar&grill', 'pub', 'tavern', 'brewery', 'boba',
      'smoothie', 'juice bar', 'bakery', 'donut', 'waffle', 'ihop',
      'denny', 'olive garden', 'applebee', 'chili', 'outback', 'red lobster',
      'cracker barrel', 'buffalo wild', 'five guys', 'shake shack', 'in-n-out',
      'popeye', 'kfc', 'taco bell', 'jack in the box', 'dairy queen',
      'sonic drive', 'whataburger', 'hardee', 'carl\'s jr', 'arby',
      'noodle', 'ramen', 'pho', 'thai', 'chinese', 'indian', 'greek',
      'italian', 'mexican', 'sushi', 'hibachi', 'dim sum', 'dim-sum',
    ],
  },
  {
    category: 'groceries',
    keywords: [
      'grocery', 'groceries', 'supermarket', 'market', 'whole foods',
      'trader joe', 'safeway', 'kroger', 'publix', 'wegman', 'aldi',
      'costco', 'sam\'s club', 'walmart', 'target', 'heb', 'meijer',
      'stop & shop', 'stop and shop', 'food lion', 'winn-dixie', 'winco',
      'sprouts', 'fresh market', 'giant', 'shoprite', 'vons', 'ralphs',
      'albertson', 'smith\'s', 'king soopers', 'fry\'s', 'food 4 less',
      'lucky', 'raley', 'stater bros', 'hannaford', 'hy-vee', 'acme',
    ],
  },
  {
    category: 'gas',
    keywords: [
      'gas station', 'shell', 'chevron', 'bp ', 'exxon', 'mobil',
      'sunoco', 'marathon', 'speedway', 'circle k', 'wawa', 'sheetz',
      'casey\'s', 'pilot', 'flying j', 'loves travel', 'kwik trip',
      'kwik star', 'racetrac', 'murphy', 'valero', 'petroleum',
      'fuel', 'gasoline', '76 gas', 'arco',
    ],
  },
  {
    category: 'travel',
    keywords: [
      'airline', 'airlines', 'airways', 'delta', 'united air', 'american air',
      'southwest air', 'jetblue', 'alaska air', 'spirit air', 'frontier air',
      'hotel', 'marriott', 'hilton', 'hyatt', 'ihg', 'radisson', 'westin',
      'sheraton', 'four seasons', 'ritz-carlton', 'fairfield', 'courtyard',
      'hampton inn', 'holiday inn', 'best western', 'motel', 'airbnb',
      'vrbo', 'expedia', 'booking.com', 'priceline', 'travelocity', 'kayak',
      'hertz', 'enterprise rent', 'avis', 'budget car', 'national car',
      'alamo', 'car rental', 'rental car', 'amtrak', 'greyhound',
      'cruise', 'carnival', 'royal caribbean', 'norwegian cruise',
    ],
  },
  {
    category: 'transit',
    keywords: [
      'uber ', 'lyft', 'taxi', 'cab ', 'metro', 'subway transit',
      'bus pass', 'transit', 'parking', 'toll', 'ezpass', 'ez pass',
      'clipper', 'smartrip', 'orca card', 'bart ', 'mta ', 'wmata',
      'commuter', 'park&ride', 'zipcar', 'bird ', 'lime ',
    ],
  },
  {
    category: 'streaming',
    keywords: [
      'netflix', 'hulu', 'disney+', 'disney plus', 'hbo', 'max ',
      'spotify', 'apple music', 'amazon prime', 'amazon music',
      'youtube premium', 'youtube music', 'peacock', 'paramount+',
      'showtime', 'starz', 'discovery+', 'sling', 'fubo', 'philo',
      'tidal', 'deezer', 'pandora', 'sirius xm', 'audible',
    ],
  },
  {
    category: 'online_shopping',
    keywords: [
      'amazon', 'amazon.com', 'amzn', 'ebay', 'etsy', 'shopify',
      'chewy', 'wayfair', 'overstock', 'zappos', 'newegg', 'b&h photo',
      'adorama', 'bhphotovideo', 'bestbuy.com', 'apple.com', 'apple store online',
      'paypal ', 'venmo ', 'shop ', 'marketplace',
    ],
  },
  {
    category: 'entertainment',
    keywords: [
      'movie', 'cinema', 'theater', 'theatre', 'amc ', 'regal ', 'cinemark',
      'concert', 'ticketmaster', 'stubhub', 'live nation', 'eventbrite',
      'museum', 'zoo', 'aquarium', 'amusement', 'six flags', 'universal',
      'disneyland', 'disney world', 'seaworld', 'bowling', 'golf', 'mini golf',
      'escape room', 'arcade', 'dave & buster', 'topgolf', 'sports',
      'nba ', 'nfl ', 'mlb ', 'nhl ', 'mls ', 'fitness', 'gym ',
      'peloton', 'planet fitness', 'la fitness', 'anytime fitness',
      'equinox', 'crunch fitness', 'ymca', 'gaming', 'steam ', 'playstation',
      'xbox ', 'nintendo',
    ],
  },
]

// Bank-provided categories to reward category mapping
const BANK_CATEGORY_MAP: Record<string, RewardCategory> = {
  'food & drink': 'dining',
  'food and drink': 'dining',
  'restaurants': 'dining',
  'dining': 'dining',
  'fast food': 'dining',
  'coffee shops': 'dining',
  'bars': 'dining',
  'groceries': 'groceries',
  'supermarkets & groceries': 'groceries',
  'gas': 'gas',
  'gas stations': 'gas',
  'gas & fuel': 'gas',
  'fuel & utilities': 'gas',
  'travel': 'travel',
  'air travel': 'travel',
  'airlines': 'travel',
  'hotels': 'travel',
  'lodging': 'travel',
  'car rental': 'travel',
  'vacation': 'travel',
  'transit': 'transit',
  'transportation': 'transit',
  'ride share': 'transit',
  'rideshare': 'transit',
  'parking': 'transit',
  'tolls': 'transit',
  'streaming': 'streaming',
  'music': 'streaming',
  'video streaming': 'streaming',
  'entertainment': 'entertainment',
  'movies & dvds': 'entertainment',
  'sports': 'entertainment',
  'fitness & gyms': 'entertainment',
  'recreation': 'entertainment',
  'shopping': 'online_shopping',
  'online shopping': 'online_shopping',
  'merchandise': 'online_shopping',
}

export function categorizeByMerchant(merchant: string): RewardCategory {
  const lower = merchant.toLowerCase()
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) return category
    }
  }
  return 'other'
}

export function categorizeByBankCategory(bankCategory: string): RewardCategory | null {
  if (!bankCategory) return null
  const key = bankCategory.toLowerCase().trim()
  return BANK_CATEGORY_MAP[key] ?? null
}

export function categorize(merchant: string, bankCategory?: string): RewardCategory {
  if (bankCategory) {
    const mapped = categorizeByBankCategory(bankCategory)
    if (mapped) return mapped
  }
  return categorizeByMerchant(merchant)
}
