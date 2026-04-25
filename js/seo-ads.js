/* ================================================================
   SEO & GOOGLE ADS CONFIGURATION
   ================================================================ */

(function() {
  'use strict';

  // ============================================================
  // STRUCTURED DATA (JSON-LD) for SEO
  // ============================================================
  function addStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Saphal Lamsal",
      "url": "https://safallamsal.com.np",
      "image": "https://safallamsal.com.np/images/profile.png",
      "sameAs": [
        "https://www.linkedin.com/in/saphallamsal/",
        "https://github.com/safalamsall",
        "https://www.researchgate.net/profile/Saphal-Lamsal",
        "https://scholar.google.com/citations?user=XLno0v0AAAAJ"
      ],
      "jobTitle": "Front-End Developer & Cybersecurity Enthusiast",
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance"
      },
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "ISMT College / University of Sunderland"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nawalpur",
        "addressCountry": "Nepal"
      },
      "email": "info@safallamsal.com.np",
      "telephone": "+977-9865506710",
      "knowsAbout": [
        "Web Development",
        "Cybersecurity",
        "Machine Learning",
        "Network Engineering",
        "Blockchain",
        "Ethical Hacking"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  // ============================================================
  // GOOGLE ADS INITIALIZATION
  // ============================================================
  function initGoogleAds() {
    // Replace 'ca-pub-XXXXXXXXXXXXXXXX' with your actual Google AdSense publisher ID
    const adsenseId = 'ca-pub-XXXXXXXXXXXXXXXX';
    
    // Load AdSense script
    const adsScript = document.createElement('script');
    adsScript.async = true;
    adsScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
    adsScript.crossOrigin = 'anonymous';
    document.head.appendChild(adsScript);
  }

  // ============================================================
  // GOOGLE ANALYTICS (GA4)
  // ============================================================
  function initGoogleAnalytics() {
    // Replace 'G-XXXXXXXXXX' with your actual GA4 measurement ID
    const measurementId = 'G-XXXXXXXXXX';
    
    // Load GA4 script
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(gaScript);
    
    // Initialize GA4
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', measurementId);
    
    // Make gtag available globally
    window.gtag = gtag;
  }

  // ============================================================
  // CREATE AD SLOTS
  // ============================================================
  function createAdSlots() {
    const adSlots = document.querySelectorAll('.ad-slot');
    
    adSlots.forEach((slot, index) => {
      const adType = slot.getAttribute('data-ad-type') || 'display';
      const adSlotId = slot.getAttribute('data-ad-slot') || '';
      
      if (!adSlotId) return;
      
      // Create ad container
      const adContainer = document.createElement('ins');
      adContainer.className = 'adsbygoogle';
      adContainer.style.display = 'block';
      adContainer.setAttribute('data-ad-client', 'ca-pub-XXXXXXXXXXXXXXXX');
      adContainer.setAttribute('data-ad-slot', adSlotId);
      
      // Set ad format based on type
      switch(adType) {
        case 'banner':
          adContainer.setAttribute('data-ad-format', 'horizontal');
          adContainer.style.width = '100%';
          adContainer.style.height = '90px';
          break;
        case 'sidebar':
          adContainer.setAttribute('data-ad-format', 'vertical');
          adContainer.style.width = '300px';
          adContainer.style.height = '600px';
          break;
        case 'in-article':
          adContainer.setAttribute('data-ad-format', 'fluid');
          adContainer.setAttribute('data-ad-layout-key', '-fb+5w+4e-db+86');
          break;
        default:
          adContainer.setAttribute('data-ad-format', 'auto');
          adContainer.setAttribute('data-full-width-responsive', 'true');
      }
      
      slot.appendChild(adContainer);
      
      // Push ad
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.log('AdSense not loaded yet');
      }
    });
  }

  // ============================================================
  // LAZY LOAD ADS (Performance optimization)
  // ============================================================
  function lazyLoadAds() {
    const adSlots = document.querySelectorAll('.ad-slot');
    
    if ('IntersectionObserver' in window) {
      const adObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.classList.contains('ad-loaded')) {
            entry.target.classList.add('ad-loaded');
            // Ad will be loaded by createAdSlots when visible
          }
        });
      }, {
        rootMargin: '200px'
      });
      
      adSlots.forEach(slot => adObserver.observe(slot));
    }
  }

  // ============================================================
  // PERFORMANCE MONITORING
  // ============================================================
  function monitorPerformance() {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({entryTypes: ['largest-contentful-paint']});
      
      // Monitor First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({entryTypes: ['first-input']});
    }
  }

  // ============================================================
  // INITIALIZE ALL
  // ============================================================
  function init() {
    // Add structured data for SEO
    addStructuredData();
    
    // Initialize Google Analytics
    // initGoogleAnalytics(); // Uncomment when you have GA4 ID
    
    // Initialize Google Ads
    // initGoogleAds(); // Uncomment when you have AdSense ID
    
    // Create ad slots after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        createAdSlots();
        lazyLoadAds();
      }, 1000);
    });
    
    // Monitor performance
    monitorPerformance();
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
