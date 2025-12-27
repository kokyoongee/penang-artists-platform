-- Seed data for Penang Artists Platform
-- Run this after the migrations to populate with sample data

-- First, create an admin user profile (you'll need to create the auth user separately)
-- INSERT INTO profiles (id, email, role) VALUES
--   ('your-admin-uuid', 'admin@example.com', 'admin');

-- Sample Artists
INSERT INTO artists (
  id, slug, display_name, profile_photo, tagline, bio, location, email,
  primary_medium, secondary_mediums, styles, experience, featured_image,
  whatsapp, whatsapp_public, instagram, facebook, website,
  open_for_commissions, open_for_collaboration, open_for_events,
  price_range, status, featured, verified
) VALUES
(
  'a1000000-0000-0000-0000-000000000001',
  'chen-wei-lin',
  'Chen Wei Lin',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'Capturing the soul of Penang through watercolors',
  'A Georgetown-based watercolor artist with over 15 years of experience capturing the heritage architecture and street life of Penang. My work has been exhibited internationally and is collected by art lovers worldwide. I specialize in architectural scenes that showcase the unique blend of cultures that make Penang special.',
  'georgetown',
  'chenwei@example.com',
  'visual-art',
  ARRAY['illustration'],
  ARRAY['Traditional', 'Heritage', 'Landscape'],
  'established',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop',
  '60123456789',
  true,
  'https://instagram.com/chenwei',
  'https://facebook.com/chenwei',
  'https://chenweilin.art',
  true, true, true,
  'mid',
  'approved',
  true,
  true
),
(
  'a1000000-0000-0000-0000-000000000002',
  'maya-tan',
  'Maya Tan',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  'Contemporary ceramics with Peranakan influences',
  'Blending traditional Peranakan motifs with modern ceramic techniques. Each piece tells a story of cultural heritage meeting contemporary design. My studio in Air Itam welcomes visitors by appointment, where you can see the creative process firsthand.',
  'air-itam',
  'maya@example.com',
  'craft',
  ARRAY[]::text[],
  ARRAY['Contemporary', 'Heritage', 'Minimalist'],
  'established',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop',
  '60198765432',
  true,
  'https://instagram.com/mayaceramics',
  NULL,
  'https://mayatan.studio',
  true, false, true,
  'premium',
  'approved',
  true,
  true
),
(
  'a1000000-0000-0000-0000-000000000003',
  'ahmad-razak',
  'Ahmad Razak',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  'Street art that tells our stories',
  'From the walls of Hin Bus Depot to international murals, I bring Penang''s multicultural spirit to life through large-scale street art. My work explores themes of identity, community, and the changing urban landscape. Commissioned works available for businesses and public spaces.',
  'georgetown',
  'ahmad.razak@example.com',
  'murals-street-art',
  ARRAY['illustration'],
  ARRAY['Urban', 'Contemporary', 'Folk'],
  'established',
  'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=600&fit=crop',
  '60112223344',
  false,
  'https://instagram.com/ahmadrazakart',
  'https://facebook.com/ahmadrazakart',
  NULL,
  true, true, false,
  'contact',
  'approved',
  true,
  true
),
(
  'a1000000-0000-0000-0000-000000000004',
  'lim-siew-mei',
  'Lim Siew Mei',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  'Documentary photography of everyday life',
  'I document the changing face of Penang — from its hawker culture to disappearing trades. My photographs have been published in National Geographic and featured in major exhibitions across Asia. Through my lens, I capture the stories of the people who make Penang unique.',
  'georgetown',
  'siewmei@example.com',
  'photography',
  ARRAY[]::text[],
  ARRAY['Documentary', 'Portrait', 'Heritage'],
  'master',
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop',
  '60177889900',
  true,
  'https://instagram.com/siewmeiphoto',
  NULL,
  'https://limsiewmei.com',
  true, true, true,
  'premium',
  'approved',
  false,
  true
),
(
  'a1000000-0000-0000-0000-000000000005',
  'raj-kumar',
  'Raj Kumar',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  'Traditional Indian art meets Penang',
  'Trained in classical Indian art forms, I create vibrant paintings that celebrate the Indian diaspora in Penang. My work features rich colors and intricate patterns inspired by Hindu mythology and local culture. I also conduct workshops at local art centers.',
  'jelutong',
  'raj@example.com',
  'visual-art',
  ARRAY[]::text[],
  ARRAY['Traditional', 'Folk', 'Contemporary'],
  'established',
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=600&fit=crop',
  '60165544332',
  true,
  'https://instagram.com/rajkumarart',
  'https://facebook.com/rajkumarart',
  NULL,
  true, false, true,
  'mid',
  'approved',
  false,
  true
),
(
  'a1000000-0000-0000-0000-000000000006',
  'sarah-wong',
  'Sarah Wong',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  'Emerging batik artist with modern twist',
  'Fresh graduate from USM Fine Arts, exploring new expressions of traditional batik. I combine ancient wax-resist techniques with contemporary abstract designs, creating pieces that honor tradition while pushing boundaries. Looking to connect with fellow artists and exhibition opportunities.',
  'bayan-lepas',
  'sarah.wong@example.com',
  'craft',
  ARRAY['visual-art'],
  ARRAY['Contemporary', 'Abstract', 'Nature'],
  'emerging',
  'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&h=600&fit=crop',
  '60143322110',
  true,
  'https://instagram.com/sarahbatik',
  NULL,
  NULL,
  true, true, true,
  'budget',
  'approved',
  false,
  false
),
(
  'a1000000-0000-0000-0000-000000000007',
  'david-lee',
  'David Lee',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
  'Jazz musician and composer',
  'Bringing the sounds of Penang to life through original jazz compositions. My music blends traditional Penang influences with contemporary jazz, creating a unique sound that reflects the multicultural spirit of our island. Regular performances at ChinaHouse and other venues.',
  'georgetown',
  'david.lee@example.com',
  'music',
  ARRAY['performance'],
  ARRAY['Jazz', 'Fusion', 'Contemporary'],
  'established',
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=600&fit=crop',
  '60129998877',
  true,
  'https://instagram.com/davidleejazz',
  NULL,
  'https://davidleejazz.com',
  false, true, true,
  'contact',
  'approved',
  false,
  true
),
(
  'a1000000-0000-0000-0000-000000000008',
  'fatimah-abdullah',
  'Fatimah Abdullah',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  'Traditional Malay weaving and textiles',
  'Preserving the art of traditional Malay songket and tenun weaving. Each piece takes weeks to complete using time-honored techniques passed down through generations. My work has been featured in cultural exhibitions and worn by dignitaries.',
  'balik-pulau',
  'fatimah@example.com',
  'craft',
  ARRAY[]::text[],
  ARRAY['Traditional', 'Heritage', 'Textile'],
  'master',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=600&fit=crop',
  '60166677788',
  true,
  'https://instagram.com/fatimahweaves',
  'https://facebook.com/fatimahweaves',
  NULL,
  true, false, true,
  'premium',
  'approved',
  false,
  true
);

-- Portfolio Items for Chen Wei Lin
INSERT INTO portfolio_items (id, artist_id, image_url, thumbnail_url, title, description, sort_order) VALUES
(
  'p1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
  'Armenian Street Heritage',
  'Watercolor painting capturing the iconic shophouses and street art of Armenian Street in Georgetown. The piece showcases the vibrant colors and architectural details that make this UNESCO World Heritage site so special.',
  0
),
(
  'p1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
  'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400',
  'Clan Jetties at Dawn',
  'Early morning light over the historic Chew Jetty, one of Penang''s UNESCO heritage sites. This piece captures the golden hour reflections on the water.',
  1
),
(
  'p1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400',
  'Kopitiam Morning',
  'A typical morning scene at a traditional Penang coffee shop, capturing the essence of local life and the warm interactions between regulars.',
  2
),
(
  'p1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
  'Temple Street Scene',
  'Vibrant depiction of the temples and traditional architecture along Penang Road, showcasing the multicultural heritage of Georgetown.',
  3
);

-- Portfolio Items for Maya Tan
INSERT INTO portfolio_items (id, artist_id, image_url, thumbnail_url, title, description, sort_order) VALUES
(
  'p1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
  'Peranakan Vase Collection',
  'A series of hand-crafted vases featuring traditional Nyonya motifs with a contemporary twist. Each piece is wheel-thrown and hand-painted.',
  0
),
(
  'p1000000-0000-0000-0000-000000000006',
  'a1000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800',
  'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=400',
  'Tea Set Series',
  'Functional art pieces designed for everyday use, celebrating the tea culture of Penang. Features delicate floral patterns inspired by Peranakan tiles.',
  1
),
(
  'p1000000-0000-0000-0000-000000000007',
  'a1000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
  'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
  'Modern Minimalist Bowls',
  'Clean, modern ceramic bowls with subtle Peranakan-inspired glazes. Perfect for contemporary homes that appreciate heritage touches.',
  2
);

-- Portfolio Items for Ahmad Razak
INSERT INTO portfolio_items (id, artist_id, image_url, thumbnail_url, title, description, sort_order) VALUES
(
  'p1000000-0000-0000-0000-000000000008',
  'a1000000-0000-0000-0000-000000000003',
  'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800',
  'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=400',
  'Unity Mural',
  'Large-scale mural depicting the harmony of Penang''s diverse communities. Located at Hin Bus Depot, this 50-foot piece took 3 weeks to complete.',
  0
),
(
  'p1000000-0000-0000-0000-000000000009',
  'a1000000-0000-0000-0000-000000000003',
  'https://images.unsplash.com/photo-1561059488-916d69792237?w=800',
  'https://images.unsplash.com/photo-1561059488-916d69792237?w=400',
  'Heritage Faces',
  'Portrait series celebrating the faces of Penang - from hawkers to trishaw riders. Painted on the walls of heritage buildings in Georgetown.',
  1
),
(
  'p1000000-0000-0000-0000-000000000010',
  'a1000000-0000-0000-0000-000000000003',
  'https://images.unsplash.com/photo-1551913902-c92207136625?w=800',
  'https://images.unsplash.com/photo-1551913902-c92207136625?w=400',
  'Abstract Traditions',
  'Contemporary interpretation of traditional motifs, blending street art aesthetics with cultural symbolism.',
  2
);

-- Portfolio Items for Lim Siew Mei
INSERT INTO portfolio_items (id, artist_id, image_url, thumbnail_url, title, description, sort_order) VALUES
(
  'p1000000-0000-0000-0000-000000000011',
  'a1000000-0000-0000-0000-000000000004',
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
  'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400',
  'The Hawker',
  'Intimate portrait of a char koay teow hawker at work. Part of the "Disappearing Trades" series documenting Penang''s culinary heritage.',
  0
),
(
  'p1000000-0000-0000-0000-000000000012',
  'a1000000-0000-0000-0000-000000000004',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
  'Morning Market',
  'Documentary photograph of the bustling morning market in Air Itam, capturing the energy and colors of daily life.',
  1
),
(
  'p1000000-0000-0000-0000-000000000013',
  'a1000000-0000-0000-0000-000000000004',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  'The Umbrella Maker',
  'One of the last traditional umbrella makers in Penang, photographed in his workshop where he has worked for over 50 years.',
  2
),
(
  'p1000000-0000-0000-0000-000000000014',
  'a1000000-0000-0000-0000-000000000004',
  'https://images.unsplash.com/photo-1518005068251-37900150dfca?w=800',
  'https://images.unsplash.com/photo-1518005068251-37900150dfca?w=400',
  'Temple Festival',
  'Vibrant celebration at the Nine Emperor Gods Festival, showcasing the rich religious traditions of Penang.',
  3
);

-- Portfolio Items for Raj Kumar
INSERT INTO portfolio_items (id, artist_id, image_url, thumbnail_url, title, description, sort_order) VALUES
(
  'p1000000-0000-0000-0000-000000000015',
  'a1000000-0000-0000-0000-000000000005',
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800',
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400',
  'Goddess Lakshmi',
  'Traditional depiction of Goddess Lakshmi using classical Indian painting techniques. Commissioned for a local temple.',
  0
),
(
  'p1000000-0000-0000-0000-000000000016',
  'a1000000-0000-0000-0000-000000000005',
  'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
  'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
  'Thaipusam Procession',
  'Vibrant painting capturing the energy and devotion of Penang''s famous Thaipusam festival.',
  1
),
(
  'p1000000-0000-0000-0000-000000000017',
  'a1000000-0000-0000-0000-000000000005',
  'https://images.unsplash.com/photo-1584448097764-374f81551427?w=800',
  'https://images.unsplash.com/photo-1584448097764-374f81551427?w=400',
  'Little India',
  'Street scene from Penang''s Little India, celebrating the vibrant Indian community and their cultural contributions.',
  2
);

-- Portfolio Items for Sarah Wong
INSERT INTO portfolio_items (id, artist_id, image_url, thumbnail_url, title, description, sort_order) VALUES
(
  'p1000000-0000-0000-0000-000000000018',
  'a1000000-0000-0000-0000-000000000006',
  'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800',
  'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=400',
  'Ocean Waves Batik',
  'Modern batik piece inspired by the waves of Penang''s beaches. Uses traditional wax-resist technique with contemporary abstract design.',
  0
),
(
  'p1000000-0000-0000-0000-000000000019',
  'a1000000-0000-0000-0000-000000000006',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400',
  'Tropical Flora',
  'Batik artwork featuring local tropical flowers and plants, celebrating Penang''s natural beauty.',
  1
),
(
  'p1000000-0000-0000-0000-000000000020',
  'a1000000-0000-0000-0000-000000000006',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400',
  'Abstract Heritage',
  'Contemporary batik piece that abstracts traditional Peranakan tile patterns into flowing organic forms.',
  2
);

-- Portfolio Items for David Lee
INSERT INTO portfolio_items (id, artist_id, image_url, thumbnail_url, title, description, sort_order) VALUES
(
  'p1000000-0000-0000-0000-000000000021',
  'a1000000-0000-0000-0000-000000000007',
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400',
  'Live at ChinaHouse',
  'Performance at ChinaHouse''s jazz night. Playing original compositions inspired by Penang''s multicultural soundscape.',
  0
),
(
  'p1000000-0000-0000-0000-000000000022',
  'a1000000-0000-0000-0000-000000000007',
  'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
  'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400',
  'Studio Session',
  'Recording session for the upcoming album "Georgetown Nights" at a local studio.',
  1
),
(
  'p1000000-0000-0000-0000-000000000023',
  'a1000000-0000-0000-0000-000000000007',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
  'Jazz Festival Performance',
  'Headlining the Penang Jazz Festival with the David Lee Quartet.',
  2
);

-- Portfolio Items for Fatimah Abdullah
INSERT INTO portfolio_items (id, artist_id, image_url, thumbnail_url, title, description, sort_order) VALUES
(
  'p1000000-0000-0000-0000-000000000024',
  'a1000000-0000-0000-0000-000000000008',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400',
  'Royal Songket',
  'Traditional songket woven with gold and silver threads. This piece took 3 months to complete using techniques passed down through generations.',
  0
),
(
  'p1000000-0000-0000-0000-000000000025',
  'a1000000-0000-0000-0000-000000000008',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
  'Tenun Pahang',
  'Intricate tenun weaving featuring traditional Malay geometric patterns in rich earth tones.',
  1
),
(
  'p1000000-0000-0000-0000-000000000026',
  'a1000000-0000-0000-0000-000000000008',
  'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=800',
  'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=400',
  'Wedding Collection',
  'Bespoke bridal songket commissioned for a traditional Malay wedding ceremony.',
  2
);

-- Sample Inquiries
INSERT INTO inquiries (id, artist_id, name, email, phone, inquiry_type, message) VALUES
(
  'i1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'John Smith',
  'john.smith@example.com',
  '60123456789',
  'commission',
  'I would love to commission a watercolor painting of my family home in Georgetown. It''s a heritage shophouse on Lebuh Chulia. Could you please let me know your rates and availability?'
),
(
  'i1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000001',
  'Tourism Board',
  'events@penang-tourism.gov.my',
  '0642628888',
  'event',
  'We are organizing the Penang Heritage Art Festival in March and would like to invite you to participate as a featured artist. Please contact us for more details.'
),
(
  'i1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000002',
  'Sarah Johnson',
  'sarah.j@example.com',
  NULL,
  'purchase',
  'I saw your Peranakan vases at a gallery and I''m interested in purchasing a set for my home. Do you have any available pieces or can I commission a custom set?'
),
(
  'i1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000003',
  'Hotel Manager',
  'art@easternandoriental.com',
  '0422221234',
  'commission',
  'We are renovating our hotel lobby and would like to commission a large mural that celebrates Penang''s heritage. Would you be available to discuss this project?'
);
