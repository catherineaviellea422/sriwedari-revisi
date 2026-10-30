---
name: Nusantara Heritage Elegance
colors:
  surface: '#fef9ef'
  surface-dim: '#dedad0'
  surface-bright: '#fef9ef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3e9'
  surface-container: '#f2ede3'
  surface-container-high: '#ede8de'
  surface-container-highest: '#e7e2d8'
  on-surface: '#1d1c16'
  on-surface-variant: '#414944'
  inverse-surface: '#32302a'
  inverse-on-surface: '#f5f0e6'
  outline: '#717974'
  outline-variant: '#c0c8c3'
  surface-tint: '#3c6755'
  primary: '#033325'
  on-primary: '#ffffff'
  primary-container: '#1f4a3a'
  on-primary-container: '#8cb9a4'
  inverse-primary: '#a3d0bb'
  secondary: '#785918'
  on-secondary: '#ffffff'
  secondary-container: '#fed487'
  on-secondary-container: '#795a19'
  tertiary: '#0d3227'
  on-tertiary: '#ffffff'
  tertiary-container: '#26493c'
  on-tertiary-container: '#92b7a7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#beedd7'
  primary-fixed-dim: '#a3d0bb'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#244e3e'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c175'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#c4ebd9'
  tertiary-fixed-dim: '#a8cfbe'
  on-tertiary-fixed: '#002117'
  on-tertiary-fixed-variant: '#2a4d40'
  background: '#fef9ef'
  on-background: '#1d1c16'
  surface-variant: '#e7e2d8'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style
The design system delivers an authentic cultural sanctuary rooted in traditional Indonesian performing arts, dance theater, and royal Javanese heritage. Balancing reverence for ancestral traditions with refined, contemporary mobile usability, the interface targets cultural enthusiasts, dancers, students, and institutional administrators.

The visual style merges **Warm Editorial Heritage** with **Minimalist Cultural Modernism**. Deep forest greens evoke sacred palace courtyards (*kraton*) and lush archipelago landscapes, paired with radiant warm golds reminiscent of gilded *prada* cloth and brass gamelan instruments. Cream and ivory parchment backdrops establish an inviting, organic tone distinct from clinical white interfaces. Subtle batik filigree accents (*parang* and *kawung* floral motifs) frame key touchpoints without overwhelming functional utility.

## Colors
The color architecture relies on high-dignity natural tones grounded in deep botanical and mineral pigments:

- **Primary & Surface Brand (`#1F4A3A` & `#14382C`):** Deep royal botanical green and shadowy deepest green establish focal authority, primary CTAs, active tab highlights, and immersive dark login hero viewports.
- **Accent Gold (`#C8A25A`):** Gilded warmth reserved for cultural highlights, ornamental emblems, step counters, badges, and high-value interactive states.
- **Canvas & Elevation Tones:**
  - Base Background: Canvas Cream (`#F6F1E7`).
  - Card & Container Surface: Soft Parchment (`#FBF8F2`).
  - Elevated Popovers & Dialogs: Crisp Ivory (`#FFFFFF`).
- **Semantic & State Accents:**
  - Destructive & Error: Crimson Red (`#D64545`).
  - Form Placeholder & Inactive Border: Warm Gray (`#9A9A94`).
  - Low-Contrast Divider: Muted Cream Border (`#E8E0D2`).
- **Administrative Stat Metric Surfaces:**
  - Mint Surface: `#DDEBE3` (Total Galeri / positive metrics).
  - Peach Surface: `#F6E1D6` (Total Pengguna / registration metrics).
  - Light Peach Surface: `#F9EBE3` (Pesanan Masuk / incoming orders).
  - Gray-Lavender Surface: `#E6E8EE` (Kegiatan / events & schedule metrics).

## Typography
The typographic hierarchy establishes deliberate friction between literary tradition and technical precision:

- **Headings (Playfair Display):** Conveys the artistic, storytelling quality of Indonesian performance art. Employed across section headers, gallery performance titles, dialog greetings, and royal hero statements.
- **Body & Data UI (Inter):** Highly legible, neutral workhorse that delivers effortless readability for catalog specifications, ticket dates, inventory IDs, and administrative metrics.
- Keep numbers inside metric cards and pricing figures in **Inter Medium** or **SemiBold** to guarantee crisp legibility against pastel containers.

## Layout & Spacing
Designed precisely for standard mobile viewport proportions (390 × 844 px), utilizing an 8-point base spatial cadence:

- **Horizontal Canvas Margin:** A constant `1.25rem` (20px) margin maintains safe touch zones from viewport edges.
- **Grid Structure:** 2-column card layouts use a tight `0.75rem` (12px) gutter for two-up gallery cards and costume rental listings. Single-column lists and detail sheets utilize full container width.
- **Bottom Navigation Bar:** Fixed at 64px height with safe area inset padding (`padding-bottom: env(safe-area-inset-bottom)`), elevating active tabs with top-centered indicator dots or filled icons in `#1F4A3A`.
- **Vertical Section Rhythm:** Category headers use `space-xl` (24px) top margin to separate narrative collections cleanly.

## Elevation & Depth
Depth is rendered through warmth and tonal layering rather than harsh digital drop shadows:

- **Surface Tiers:**
  - Level 0 (Base Canvas): `#F6F1E7` background canvas.
  - Level 1 (Card & List Tile): `#FBF8F2` with subtle hairline outline `1px solid rgba(31, 74, 58, 0.08)` and ambient shadow `0 2px 8px rgba(20, 56, 44, 0.04)`.
  - Level 2 (Floating Action & Modal Surfaces): Pure ivory white `#FFFFFF` with ambient tint `0 8px 24px rgba(20, 56, 44, 0.12)`.
  - Level 3 (Dimmed Modal Scrim): Deepest green scrim `rgba(20, 56, 44, 0.65)` layered beneath confirmation prompts (e.g., *Keluar dari akun?* dialogs).
- **Ornamental Elevation:** Gold filigree borders use faint metallic glow overlays (`drop-shadow(0 1px 2px rgba(200, 162, 90, 0.35))`).

## Shapes
The shape system balances soft comfort with structured mobile alignment:

- **Cards & Content Tiles:** `14px` border radius (`rounded-lg`), softening photographic imagery of traditional dances while fitting comfortably on compact screens.
- **Buttons (Primary, Secondary, Ghost):** `10px` border radius, creating tactile, finger-friendly targets.
- **Form Inputs & Search Fields:** `8px` border radius, matching precise administrative form entry standards.
- **Chips, Category Pills & Step Indicators:** Fully rounded pill (`9999px`), offering distinct affordance for selectable filters.
- **Thumbnails:** Gallery thumbnails inherit a uniform `10px` inner radius when nested within `14px` parent cards.

## Components

### Buttons
- **Primary Action:** Solid Dark Green `#1F4A3A` fill, white `#FFFFFF` text (Inter SemiBold, 14px), 10px corner radius, 48px standard touch height. On press: `#14382C`.
- **Secondary / Outline:** 1.5px solid `#1F4A3A` with transparent background and `#1F4A3A` text.
- **Accent Action (Gold CTA):** Solid `#C8A25A` fill with white or `#14382C` text for special cultural booking paths.
- **Destructive Action:** Solid `#D64545` fill for confirmed exit or delete actions; outlined for cancellation prompts.

### Chips & Filter Pills
- Fully rounded (`9999px`), 32px height, 12px horizontal padding.
- **Active State:** `#1F4A3A` background with crisp white typography.
- **Inactive State:** Transparent or Parchment `#FBF8F2` background with `#9A9A94` or `#1F4A3A` text and a subtle `1px solid rgba(31,74,58,0.15)` border.

### Input Fields & Search Bars
- 44px height, 8px radius, background `#FFFFFF` or `#FBF8F2`.
- Border `1px solid rgba(154, 154, 148, 0.4)`. Active focus transition to `1.5px solid #1F4A3A`.
- Placeholder text in `#9A9A94` (Inter 13px Regular).
- Prefix icons (e.g., search magnifying glass) sized at 18px in `#1F4A3A`.

### Cards & Tile Lists
- **Gallery Item Card:** Vertical stack with `14px` radius, image container fixed at 1:1 or 4:3 aspect ratio, `#FBF8F2` parchment base, headline in Playfair Display (15px), tag in Inter 11px.
- **Admin Metric Card:** Colored tinted container (`#DDEBE3`, `#F6E1D6`, `#F9EBE3`, `#E6E8EE`), 14px radius, padded with 16px, displaying large stat figures (Inter 20px Bold) and label (Inter 12px Regular).
- **List Rows (Settings / Profile):** Full-width card row, 14px radius, icon with rounded square background, title in Inter 14px Medium, chevron-right icon in `#9A9A94`.

### Navigation Bar & Tab Architecture
- **User Role (4 Tabs):** *Beranda*, *Galeri*, *Pesanan*, *Profil*.
- **Admin Role (5 Tabs):** *Dashboard*, *Galeri*, *Pesanan*, *Pengguna*, *Pengaturan*.
- Background: `#FBF8F2` with top border `1px solid rgba(31, 74, 58, 0.08)`. Active tab displays filled icon in `#1F4A3A` with bold label; inactive in `#9A9A94`.