/* ================================================================
   RESEARCH LOADER
   Automatically fetches and displays research publications
   ================================================================ */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    // Your profiles
    zenodoUserId: null, // Zenodo user uploads require authentication
    googleScholarId: 'XLno0v0AAAAJ',
    researchGateProfile: 'https://www.researchgate.net/profile/Saphal-Lamsal',
    
    // Search queries
    authorName: 'Saphal Lamsal',
    
    // Fallback: Manual research data (update this when you publish new research)
    fallbackData: [
      {
        title: 'Comparative Analysis of 2.4 GHz and 5 GHz Bands in Wi-Fi 6 and Wi-Fi 7: Effects of Bandwidth and Interference on Network Performance',
        authors: 'Saphal Lamsal',
        year: 2026,
        month: 'April',
        journal: 'ResearchGate',
        doi: '10.13140/RG.2.2.10742.36166',
        url: 'https://doi.org/10.13140/RG.2.2.10742.36166',
        abstract: 'Comparative analysis examining the effects of bandwidth and interference on network performance across 2.4 GHz and 5 GHz frequency bands in Wi-Fi 6 and Wi-Fi 7 technologies.',
        tags: ['Wi-Fi 6', 'Wi-Fi 7', 'Network Performance', 'Wireless', '5G'],
        type: 'Research Paper'
      },
      {
        title: 'Strategic Analysis of Nepal\'s Data Center Market for Foreign Investment',
        authors: 'Saphal Lamsal',
        year: 2026,
        month: 'April',
        journal: 'ResearchGate',
        doi: '10.13140/RG.2.2.16668.45442',
        url: 'https://doi.org/10.13140/RG.2.2.16668.45442',
        abstract: 'Strategic analysis of Nepal\'s emerging data center market, examining opportunities and challenges for foreign investment in the country\'s digital infrastructure sector.',
        tags: ['Data Centers', 'Nepal', 'Foreign Investment', 'Digital Infrastructure', 'Market Analysis'],
        type: 'Research Paper'
      },
      {
        title: 'IPSec vs. SSL VPN: A Comprehensive Analysis of Security, Performance, and Scalability',
        authors: 'Saphal Lamsal',
        year: 2026,
        month: 'March',
        journal: 'Zenodo',
        doi: '10.5281/zenodo.19244000',
        url: 'https://doi.org/10.5281/zenodo.19244000',
        abstract: 'Comprehensive comparative analysis of IPSec and SSL VPN technologies, evaluating their security mechanisms, performance characteristics, and scalability in enterprise environments.',
        tags: ['VPN', 'IPSec', 'SSL', 'Network Security', 'Cybersecurity'],
        type: 'Research Paper'
      },
      {
        title: 'Privacy Preservation Techniques in Modern Digital Systems',
        authors: 'Saphal Lamsal',
        year: 2026,
        month: 'January',
        journal: 'ResearchGate',
        doi: '10.13140/RG.2.2.26703.65449',
        url: 'https://doi.org/10.13140/RG.2.2.26703.65449',
        abstract: 'Explores modern privacy preservation techniques and methodologies employed in contemporary digital systems to protect user data and maintain confidentiality.',
        tags: ['Privacy', 'Data Protection', 'Digital Systems', 'Security', 'GDPR'],
        type: 'Research Paper'
      },
      {
        title: 'Exploring the Effectiveness of Blockchain in Enhancing Data Security in Healthcare Systems',
        authors: 'Saphal Lamsal',
        year: 2026,
        month: 'January',
        journal: 'Zenodo',
        doi: '10.5281/zenodo.18247744',
        url: 'https://doi.org/10.5281/zenodo.18247744',
        abstract: 'Investigates how decentralised, immutable and transparent properties of blockchain address critical vulnerabilities in Electronic Health Record systems — unauthorised access, data tampering and privacy breaches.',
        tags: ['Blockchain', 'EHR', 'Data Privacy', 'Distributed Ledger', 'Health Informatics'],
        type: 'Journal Article'
      },
      {
        title: 'Ethical Issues and Bias in Artificial Intelligence Systems',
        authors: 'Saphal Lamsal',
        year: 2025,
        month: 'April',
        journal: 'ResearchGate',
        doi: '10.13140/RG.2.2.21532.86405',
        url: 'https://doi.org/10.13140/RG.2.2.21532.86405',
        abstract: 'Examines ethical challenges and bias issues in artificial intelligence systems, exploring fairness, accountability, transparency, and the societal implications of AI deployment.',
        tags: ['AI Ethics', 'Bias', 'Artificial Intelligence', 'Fairness', 'Machine Learning'],
        type: 'Research Paper'
      }
    ],
    
    // Cache duration (24 hours)
    cacheDuration: 24 * 60 * 60 * 1000
  };

  // Try to fetch from ORCID API (if you have ORCID ID)
  async function fetchFromORCID(orcidId) {
    try {
      const response = await fetch(`https://pub.orcid.org/v3.0/${orcidId}/works`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        return parseORCIDData(data);
      }
    } catch (error) {
      console.log('ORCID fetch failed, using fallback data');
    }
    return null;
  }

  // Try to fetch from CrossRef API using DOI
  async function fetchFromCrossRef(doi) {
    try {
      const response = await fetch(`https://api.crossref.org/works/${doi}`);
      if (response.ok) {
        const data = await response.json();
        return parseCrossRefData(data);
      }
    } catch (error) {
      console.log('CrossRef fetch failed');
    }
    return null;
  }

  // Try to fetch from Google Scholar (using Serpapi or scraping service)
  async function fetchFromGoogleScholar(scholarId) {
    try {
      // Note: Google Scholar doesn't have an official API
      // Using a public proxy service (may be rate-limited)
      const response = await fetch(`https://serpapi.com/search.json?engine=google_scholar_author&author_id=${scholarId}&api_key=demo`);
      if (response.ok) {
        const data = await response.json();
        return parseGoogleScholarData(data);
      }
    } catch (error) {
      console.log('Google Scholar fetch failed');
    }
    return null;
  }

  // Parse Google Scholar data
  function parseGoogleScholarData(data) {
    if (!data.articles) return [];
    
    return data.articles.map(item => ({
      title: item.title || 'Untitled',
      authors: item.authors || 'Saphal Lamsal',
      year: item.year || new Date().getFullYear(),
      month: null,
      journal: item.publication || 'Google Scholar',
      doi: null,
      url: item.link || `https://scholar.google.com/citations?user=${CONFIG.googleScholarId}`,
      abstract: item.description || '',
      tags: [],
      type: 'Publication',
      citations: item.cited_by?.value || 0
    }));
  }

  // Try to fetch from Zenodo API (public records by author)
  async function fetchFromZenodo(query = 'Saphal Lamsal') {
    try {
      // Fetch all records by author name
      const response = await fetch(`https://zenodo.org/api/records/?q=creators.name:"${encodeURIComponent(query)}"&sort=mostrecent&size=100`);
      if (response.ok) {
        const data = await response.json();
        return parseZenodoData(data);
      }
    } catch (error) {
      console.log('Zenodo fetch failed');
    }
    return null;
  }

  // Parse Zenodo data
  function parseZenodoData(data) {
    if (!data.hits || !data.hits.hits) return [];
    
    return data.hits.hits.map(item => {
      const metadata = item.metadata;
      return {
        title: metadata.title || 'Untitled',
        authors: metadata.creators ? metadata.creators.map(c => c.name).join(', ') : 'Unknown',
        year: metadata.publication_date ? new Date(metadata.publication_date).getFullYear() : null,
        month: metadata.publication_date ? new Date(metadata.publication_date).toLocaleString('en', { month: 'long' }) : null,
        journal: metadata.journal?.title || metadata.imprint?.publisher || 'Zenodo',
        doi: metadata.doi || null,
        url: item.links?.html || item.links?.self || null,
        abstract: metadata.description || '',
        tags: metadata.keywords || [],
        type: metadata.resource_type?.title || 'Publication'
      };
    });
  }

  // Parse ORCID data
  function parseORCIDData(data) {
    // Implementation for ORCID data parsing
    return [];
  }

  // Parse CrossRef data
  function parseCrossRefData(data) {
    // Implementation for CrossRef data parsing
    return [];
  }

  // Get cached data
  function getCachedData() {
    try {
      const cached = localStorage.getItem('research_cache');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CONFIG.cacheDuration) {
          return data;
        }
      }
    } catch (error) {
      console.log('Cache read failed');
    }
    return null;
  }

  // Set cached data
  function setCachedData(data) {
    try {
      localStorage.setItem('research_cache', JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.log('Cache write failed');
    }
  }

  // Main fetch function
  async function fetchResearchData() {
    // Try cache first
    const cached = getCachedData();
    if (cached) {
      console.log('Using cached research data');
      return cached;
    }

    let allResearch = [];

    // Try Zenodo API
    const zenodoData = await fetchFromZenodo(CONFIG.authorName);
    if (zenodoData && zenodoData.length > 0) {
      console.log(`Fetched ${zenodoData.length} publications from Zenodo`);
      allResearch = allResearch.concat(zenodoData);
    }

    // Try Google Scholar (note: may be rate-limited)
    const scholarData = await fetchFromGoogleScholar(CONFIG.googleScholarId);
    if (scholarData && scholarData.length > 0) {
      console.log(`Fetched ${scholarData.length} publications from Google Scholar`);
      // Merge with Zenodo data, avoiding duplicates by title
      scholarData.forEach(item => {
        const exists = allResearch.some(r => 
          r.title.toLowerCase() === item.title.toLowerCase()
        );
        if (!exists) {
          allResearch.push(item);
        }
      });
    }

    // If we got data from APIs, use it
    if (allResearch.length > 0) {
      // Sort by year (newest first)
      allResearch.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const aMonth = monthOrder.indexOf(a.month) || 0;
        const bMonth = monthOrder.indexOf(b.month) || 0;
        return bMonth - aMonth;
      });
      
      console.log(`Total unique publications: ${allResearch.length}`);
      setCachedData(allResearch);
      return allResearch;
    }

    // Fallback to manual data
    console.log('Using fallback research data');
    return CONFIG.fallbackData;
  }

  // Render research cards
  function renderResearchCards(data, container) {
    if (!container) return;

    container.innerHTML = '';

    data.forEach((item, index) => {
      const card = document.createElement('article');
      card.className = 'project-card reveal';
      card.style.animationDelay = `${index * 0.1}s`;

      const visual = document.createElement('div');
      visual.className = 'project-visual pv-blockchain';
      card.appendChild(visual);

      const body = document.createElement('div');
      body.className = 'project-body';

      const tag = document.createElement('div');
      tag.className = 'project-tag';
      tag.innerHTML = `<span>●</span> ${item.type.toUpperCase()} · ${item.year}`;
      body.appendChild(tag);

      const title = document.createElement('h3');
      title.className = 'project-title';
      title.textContent = item.title;
      body.appendChild(title);

      const desc = document.createElement('p');
      desc.className = 'project-desc';
      desc.textContent = item.abstract.substring(0, 200) + (item.abstract.length > 200 ? '...' : '');
      body.appendChild(desc);

      if (item.tags && item.tags.length > 0) {
        const techDiv = document.createElement('div');
        techDiv.className = 'project-tech';
        item.tags.slice(0, 5).forEach(tag => {
          const span = document.createElement('span');
          span.textContent = tag;
          techDiv.appendChild(span);
        });
        body.appendChild(techDiv);
      }

      if (item.url) {
        const link = document.createElement('a');
        link.href = item.url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.className = 'btn';
        link.style.marginTop = '18px';
        link.style.padding = '10px 18px';
        link.style.fontSize = '11px';
        link.innerHTML = '<span>View Publication</span><span class="arr">↗</span>';
        body.appendChild(link);
      }

      card.appendChild(body);
      container.appendChild(card);
    });

    // Trigger reveal animations
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14 });

      container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
  }

  // Initialize
  async function init() {
    const container = document.getElementById('research-container');
    if (!container) return;

    // Show loading state
    container.innerHTML = '<div class="loading-state" style="text-align:center;padding:60px 20px;color:var(--ink-60);font-family:var(--font-mono);font-size:12px;letter-spacing:0.2em">LOADING RESEARCH DATA...</div>';

    try {
      const data = await fetchResearchData();
      renderResearchCards(data, container);
    } catch (error) {
      console.error('Failed to load research data:', error);
      container.innerHTML = '<div class="error-state" style="text-align:center;padding:60px 20px;color:var(--alert-red);font-family:var(--font-mono);font-size:12px">FAILED TO LOAD RESEARCH DATA</div>';
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose refresh function globally
  window.refreshResearchData = async function() {
    localStorage.removeItem('research_cache');
    await init();
  };

})();
