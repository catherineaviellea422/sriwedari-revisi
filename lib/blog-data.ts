export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'filosofi-bedhaya-ketawang',
    title: 'Filosofi Sembilan Penari dalam Sakralitas Tari Bedhaya Ketawang',
    category: 'Filosofi Seni',
    date: '20 Oktober 2026',
    readTime: '5 menit',
    excerpt: 'Menguak makna mistis dan simbolisme arah mata angin pada tarian sakral keraton peninggalan Sultan Agung.',
    image: '/images/tari-jawa-stage.png',
  },
  {
    slug: 'anatomi-omprok-gandrung',
    title: 'Mengenal Anatomi & Keanggunan Mahkota Omprok Gandrung Banyuwangi',
    category: 'Busana Pusaka',
    date: '14 Oktober 2026',
    readTime: '4 menit',
    excerpt: 'Kisah ornamen garuda mungkur dan untaian manik emas yang mencerminkan keteguhan hati para penari Blambangan.',
    image: '/images/tari-gandrung-banyuwangi.png',
  },
  {
    slug: 'sejarah-wayang-orang-sriwedari',
    title: 'Perjalanan 125 Tahun Wayang Orang Sriwedari: Dari Istana ke Rakyat',
    category: 'Sejarah Lakon',
    date: '02 Oktober 2026',
    readTime: '7 menit',
    excerpt: 'Bagaimana Sriwedari menjadi benteng terakhir pertunjukan klasik Jawa tanpa pernah memadamkan lampu panggungnya.',
    image: '/images/tari-jawa-dramatic-stage.png',
  },
];
