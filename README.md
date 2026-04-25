# Saphal Lamsal — Cinematic Portfolio

An ultra-premium, cinematic, futuristic personal portfolio website for **Saphal Lamsal** — Developer, Cybersecurity Enthusiast & Researcher from Nepal.

Built as a **completely static frontend-only website** — no backend, no database, no auth, no APIs. Ready to deploy on Vercel, Netlify, GitHub Pages, or any static host.

## 🚀 Features

### Core Features
- ✅ **Terminal Boot Screen** - Interactive command-line entrance
- ✅ **9 Pages** - Complete portfolio with all sections
- ✅ **5 Games** - Cyberpunk-themed arcade games
- ✅ **Dynamic Research Loader** - Auto-fetches from Zenodo & Google Scholar
- ✅ **Contact Form** - With epic "hacked" success page
- ✅ **3D Background** - Three.js particle field with parallax

### SEO & Performance
- ✅ **Full SEO Optimization** - Meta tags, Open Graph, Twitter Cards
- ✅ **Structured Data** - JSON-LD for rich snippets
- ✅ **Sitemap & Robots.txt** - Search engine ready
- ✅ **Mobile Responsive** - Works perfectly on all devices
- ✅ **PWA Support** - Installable as app
- ✅ **Performance Optimized** - Lazy loading, caching, compression
- ✅ **Accessibility** - WCAG compliant, keyboard navigation

### Security
- ✅ **Security Headers** - XSS, clickjacking, MIME sniffing protection
- ✅ **Content Security Policy** - Prevents XSS attacks
- ✅ **HTTPS Ready** - Force HTTPS configuration
- ✅ **No Vulnerabilities** - Static site, no server-side code

### Monetization
- ✅ **Google AdSense Ready** - Ad slots configured
- ✅ **Google Analytics** - GA4 integration ready
- ✅ **Lazy Load Ads** - Performance-optimized ad loading

## 📄 Pages

1. **Home** (`index.html`) - Hero with 3D workstation, stats, expertise grid
2. **About** (`about.html`) - Profile with photo, bio, timeline
3. **Skills** (`skills.html`) - Skill orbit, proficiency bars, tech chips
4. **Projects** (`projects.html`) - Dynamic research + static projects
5. **Experience** (`experience.html`) - Career timeline with metrics
6. **Certifications** (`certifications.html`) - Verified credentials
7. **Cyber Lab** (`cyberlab.html`) - Command center dashboard
8. **Tech Stack** (`techstack.html`) - Technology cards
9. **Game** (`game.html`) - 5 playable games
10. **Contact** (`contact.html`) - Contact form
11. **Success** (`success.html`) - Form submission confirmation
12. **404** (`404.html`) - Custom error page

## 🎮 Games

1. **Cyber Runner** - Endless runner (jump obstacles)
2. **Neon Snake** - Classic snake with neon aesthetics
3. **Hack Invaders** - Space Invaders clone
4. **Memory Grid** - Memory matching game
5. **Code Breaker** - Mastermind puzzle

## 🔧 Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Custom properties, glassmorphism, animations
- **Vanilla JavaScript** - No frameworks, pure JS
- **Three.js (r128)** - 3D particle field
- **Google Fonts** - Space Grotesk, Inter, JetBrains Mono

## 📦 File Structure

```
portfolio/
├── index.html              # Home page
├── about.html
├── skills.html
├── projects.html
├── experience.html
├── certifications.html
├── cyberlab.html
├── techstack.html
├── game.html
├── contact.html
├── success.html
├── 404.html
├── robots.txt              # SEO
├── sitemap.xml             # SEO
├── manifest.json           # PWA
├── .htaccess               # Security & performance
├── css/
│   └── style.css           # Complete design system
├── js/
│   ├── main.js             # Core interactions
│   ├── three-scene.js      # WebGL background
│   ├── terminal-boot.js    # Boot screen
│   ├── research-loader.js  # Dynamic research
│   ├── cyber-runner.js     # Game 1
│   ├── neon-snake.js       # Game 2
│   ├── all-games.js        # Games 3-5
│   ├── game-manager.js     # Game switcher
│   └── seo-ads.js          # SEO & ads
├── images/
│   └── profile.png         # Profile photo
└── README.md
```

## 📧 Email Setup (IMPORTANT!)

The contact form needs to be configured to send emails to **saphallamsal9@gmail.com**.

### Quick Setup (5 minutes):

1. **Sign up at Formspree** (FREE)
   - Go to: https://formspree.io/
   - Create account with saphallamsal9@gmail.com
   - Create a new form
   - Get your form ID (e.g., `xyzabc123`)

2. **Update contact.html**
   - Open `contact.html`
   - Line 62: Replace `YOUR_FORM_ID` with your actual form ID
   - Example: `action="https://formspree.io/f/xyzabc123"`

3. **Deploy and Test**
   - Deploy your website
   - Submit a test message
   - Check your Gmail inbox!

**See EMAIL-SETUP.md for detailed instructions and alternatives.**

---

## 🚀 Deployment

### Vercel
```bash
npm i -g vercel
cd portfolio
vercel
```

### Netlify
Drag and drop the `portfolio` folder onto [app.netlify.com](https://app.netlify.com).

### GitHub Pages
1. Push to GitHub repository
2. Settings → Pages → Source: `main` / root

### Local Preview
```bash
# Python
cd portfolio && python3 -m http.server 5173

# Node
npx serve portfolio
```

## 🔍 SEO Setup

### 1. Update Sitemap
Edit `sitemap.xml` and replace `https://safallamsal.com.np/` with your actual domain.

### 2. Google Search Console
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property
3. Verify ownership
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

### 3. Google Analytics
1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get Measurement ID (G-XXXXXXXXXX)
3. Edit `js/seo-ads.js` line 72: Replace `'G-XXXXXXXXXX'` with your ID
4. Uncomment line 127: `// initGoogleAnalytics();`

### 4. Google AdSense
1. Apply at [adsense.google.com](https://www.google.com/adsense)
2. Get Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
3. Edit `js/seo-ads.js` line 56: Replace with your Publisher ID
4. Edit line 91: Replace with your Publisher ID
5. Uncomment line 130: `// initGoogleAds();`
6. Add ad slot IDs in HTML ad-slot elements

### 5. Meta Tags
Update meta tags in all HTML files with your actual:
- Domain name
- Social media links
- Profile image URL

## 📱 Mobile Optimization

- ✅ Responsive design (320px - 4K)
- ✅ Touch-friendly buttons (44px minimum)
- ✅ Mobile navigation menu
- ✅ Optimized images
- ✅ Fast loading (< 3s)
- ✅ PWA installable

## 🔒 Security Features

- ✅ XSS Protection
- ✅ Clickjacking Prevention
- ✅ MIME Sniffing Protection
- ✅ Content Security Policy
- ✅ HTTPS Enforcement (when enabled)
- ✅ Secure Headers
- ✅ No SQL Injection (static site)
- ✅ No Server Vulnerabilities

## ⚡ Performance

- ✅ GZIP Compression
- ✅ Browser Caching
- ✅ Lazy Loading
- ✅ Minified Assets
- ✅ CDN for libraries
- ✅ Optimized images
- ✅ Preconnect hints

## 📊 Analytics & Monitoring

Track:
- Page views
- User behavior
- Traffic sources
- Device types
- Geographic data
- Conversion rates

## 🎨 Customization

### Colors
Edit CSS variables in `css/style.css`:
```css
:root {
  --neon-cyan: #00f0ff;
  --elec-blue: #3d7aff;
  --term-green: #3bffa0;
  /* ... */
}
```

### Content
Update text in HTML files directly.

### Research
Add publications to `js/research-loader.js` fallbackData array.

## 📞 Contact

- **Email:** info@safallamsal.com.np
- **Phone:** +977 9865506710
- **Website:** [safallamsal.com.np](https://safallamsal.com.np)
- **LinkedIn:** [linkedin.com/in/saphallamsal](https://www.linkedin.com/in/saphallamsal/)
- **GitHub:** [github.com/safalamsall](https://github.com/safalamsall)

## 📄 License

© 2026 Saphal Lamsal. All rights reserved.

---

**Built with ❤️ by Saphal Lamsal**
