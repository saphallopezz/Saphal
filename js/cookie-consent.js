/* ================================================================
   COOKIE CONSENT BANNER
   GDPR-compliant cookie consent with preferences
   ================================================================ */

(function() {
  'use strict';

  // Check if user has already consented
  if (localStorage.getItem('cookieConsent')) {
    return; // User already made a choice
  }

  // Create cookie banner HTML
  const bannerHTML = `
    <div id="cookie-consent" class="cookie-consent">
      <div class="cookie-content">
        <div class="cookie-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="8" cy="10" r="1" fill="currentColor"/>
            <circle cx="16" cy="10" r="1" fill="currentColor"/>
            <circle cx="12" cy="15" r="1" fill="currentColor"/>
            <circle cx="8" cy="16" r="1" fill="currentColor"/>
            <circle cx="16" cy="16" r="1" fill="currentColor"/>
          </svg>
        </div>
        <div class="cookie-text">
          <h3>We Value Your Privacy</h3>
          <p>This website uses cookies to enhance your browsing experience, analyze site traffic, and serve personalized content. By clicking "Accept All", you consent to our use of cookies.</p>
        </div>
        <div class="cookie-actions">
          <button id="cookie-accept-all" class="cookie-btn primary">Accept All</button>
          <button id="cookie-accept-necessary" class="cookie-btn secondary">Necessary Only</button>
          <button id="cookie-settings" class="cookie-btn text">Settings</button>
        </div>
      </div>
    </div>

    <div id="cookie-settings-modal" class="cookie-modal" style="display:none">
      <div class="cookie-modal-content">
        <div class="cookie-modal-header">
          <h2>Cookie Preferences</h2>
          <button id="cookie-modal-close" class="cookie-close">&times;</button>
        </div>
        <div class="cookie-modal-body">
          <p class="text-dim" style="margin-bottom:24px">Manage your cookie preferences. You can enable or disable different types of cookies below.</p>
          
          <div class="cookie-category">
            <div class="cookie-category-header">
              <div>
                <h4>Necessary Cookies</h4>
                <p class="text-dim">Required for the website to function properly. Cannot be disabled.</p>
              </div>
              <label class="cookie-toggle">
                <input type="checkbox" checked disabled>
                <span class="cookie-slider"></span>
              </label>
            </div>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <div>
                <h4>Analytics Cookies</h4>
                <p class="text-dim">Help us understand how visitors interact with our website.</p>
              </div>
              <label class="cookie-toggle">
                <input type="checkbox" id="cookie-analytics" checked>
                <span class="cookie-slider"></span>
              </label>
            </div>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <div>
                <h4>Marketing Cookies</h4>
                <p class="text-dim">Used to deliver personalized advertisements.</p>
              </div>
              <label class="cookie-toggle">
                <input type="checkbox" id="cookie-marketing" checked>
                <span class="cookie-slider"></span>
              </label>
            </div>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <div>
                <h4>Preference Cookies</h4>
                <p class="text-dim">Remember your preferences and settings.</p>
              </div>
              <label class="cookie-toggle">
                <input type="checkbox" id="cookie-preferences" checked>
                <span class="cookie-slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="cookie-modal-footer">
          <button id="cookie-save-preferences" class="cookie-btn primary">Save Preferences</button>
          <button id="cookie-accept-all-modal" class="cookie-btn secondary">Accept All</button>
        </div>
      </div>
    </div>
  `;

  // Inject banner into page
  document.body.insertAdjacentHTML('beforeend', bannerHTML);

  // Get elements
  const banner = document.getElementById('cookie-consent');
  const modal = document.getElementById('cookie-settings-modal');
  const acceptAllBtn = document.getElementById('cookie-accept-all');
  const acceptNecessaryBtn = document.getElementById('cookie-accept-necessary');
  const settingsBtn = document.getElementById('cookie-settings');
  const modalClose = document.getElementById('cookie-modal-close');
  const savePreferencesBtn = document.getElementById('cookie-save-preferences');
  const acceptAllModalBtn = document.getElementById('cookie-accept-all-modal');

  // Cookie preferences
  const analyticsCheckbox = document.getElementById('cookie-analytics');
  const marketingCheckbox = document.getElementById('cookie-marketing');
  const preferencesCheckbox = document.getElementById('cookie-preferences');

  // Accept all cookies
  function acceptAll() {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    hideBanner();
    loadOptionalScripts(consent);
  }

  // Accept necessary only
  function acceptNecessary() {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    hideBanner();
    loadOptionalScripts(consent);
  }

  // Save custom preferences
  function savePreferences() {
    const consent = {
      necessary: true,
      analytics: analyticsCheckbox.checked,
      marketing: marketingCheckbox.checked,
      preferences: preferencesCheckbox.checked,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    hideModal();
    hideBanner();
    loadOptionalScripts(consent);
  }

  // Hide banner
  function hideBanner() {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => {
      banner.remove();
    }, 300);
  }

  // Show modal
  function showModal() {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }

  // Hide modal
  function hideModal() {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }

  // Load optional scripts based on consent
  function loadOptionalScripts(consent) {
    // Load Google Analytics if analytics cookies accepted
    if (consent.analytics && typeof initGoogleAnalytics === 'function') {
      initGoogleAnalytics();
    }

    // Load Google Ads if marketing cookies accepted
    if (consent.marketing && typeof initGoogleAds === 'function') {
      initGoogleAds();
    }

    // Dispatch custom event for other scripts
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consent }));
  }

  // Event listeners
  acceptAllBtn.addEventListener('click', acceptAll);
  acceptNecessaryBtn.addEventListener('click', acceptNecessary);
  settingsBtn.addEventListener('click', showModal);
  modalClose.addEventListener('click', hideModal);
  savePreferencesBtn.addEventListener('click', savePreferences);
  acceptAllModalBtn.addEventListener('click', () => {
    analyticsCheckbox.checked = true;
    marketingCheckbox.checked = true;
    preferencesCheckbox.checked = true;
    savePreferences();
  });

  // Close modal on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });

  // Show banner with animation
  setTimeout(() => {
    banner.classList.add('active');
  }, 1000);

})();

// Export function to check consent
window.getCookieConsent = function() {
  const consent = localStorage.getItem('cookieConsent');
  return consent ? JSON.parse(consent) : null;
};

// Export function to reset consent (for testing)
window.resetCookieConsent = function() {
  localStorage.removeItem('cookieConsent');
  location.reload();
};
