// Initialize dataLayer before GTM loads
window.dataLayer = window.dataLayer || [];

// GTM and GA Configuration
const GTM_ID = 'GTM-5S8T487L';
const GA4_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 Measurement ID

// Wait for CookieYes to be ready
function waitForCookieYes(callback) {
    if (window.CookieYes && typeof window.CookieYes.getConsent === 'function') {
        callback();
    } else {
        setTimeout(() => waitForCookieYes(callback), 100);
    }
}

// Debug function to log cookie states and GTM/GA status
function logCookieStates() {
    const consent = window.CookieYes.getConsent();
    console.group('Consent and Tracking Status:');
    console.log('CookieYes Consent:', consent);
    console.log('GTM Status:', window.google_tag_manager ? 'Loaded' : 'Not Loaded');
    console.log('GA4 Status:', window.gtag ? 'Available' : 'Not Available');
    console.log('DataLayer Length:', window.dataLayer.length);
    console.groupEnd();
}

// Function to handle GTM consent state
function updateGTMConsent(consent) {
    // Push consent state to dataLayer
    window.dataLayer.push({
        event: 'consent_updated',
        consent_state: {
            analytics_storage: consent.analytics ? 'granted' : 'denied',
            ad_storage: consent.marketing ? 'granted' : 'denied',
            functionality_storage: consent.functional ? 'granted' : 'denied',
            security_storage: 'granted', // Always granted for essential cookies
            personalization_storage: consent.functional ? 'granted' : 'denied'
        }
    });

    // Push detailed consent data for GTM variables
    window.dataLayer.push({
        cookieyes_consent: consent,
        event: 'cookieyes_consent_update'
    });

    // Log consent update
    console.log('Consent State Updated:', new Date().toISOString());
    logCookieStates();
}

// Function to track page view in GA4 (through GTM)
function trackPageView() {
    window.dataLayer.push({
        event: 'page_view',
        page: {
            title: document.title,
            location: window.location.href,
            path: window.location.pathname
        }
    });
}

// Function to track custom events
function trackEvent(eventName, eventParams = {}) {
    window.dataLayer.push({
        event: eventName,
        ...eventParams
    });
}

// Initialize GTM consent mode
function initializeGTMConsent() {
    const consent = window.CookieYes.getConsent();
    
    // Set default consent state (privacy-first approach)
    window.dataLayer.push({
        'event': 'default_consent',
        'consent_default': {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'functionality_storage': 'denied',
            'personalization_storage': 'denied',
            'security_storage': 'granted'
        }
    });
    
    // Update with actual consent state
    updateGTMConsent(consent);
}

// Initialize everything once CookieYes is ready
function initialize() {
    console.log('Initializing consent management...');
    initializeGTMConsent();
    
    // Track initial page view after consent is established
    if (window.CookieYes.getConsent().analytics) {
        trackPageView();
    }

    // Setup debug panel
    setupDebugPanel();
}

// Setup debug panel
function setupDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 9999;
        font-family: monospace;
        font-size: 12px;
    `;

    // Add debug buttons
    const debugButton = document.createElement('button');
    debugButton.textContent = 'Debug Tracking';
    debugButton.style.marginRight = '5px';
    debugButton.onclick = function() {
        console.clear();
        console.group('Tracking Debug Info');
        console.log('Time:', new Date().toISOString());
        console.log('URL:', window.location.href);
        logCookieStates();
        console.log('DataLayer Contents:', window.dataLayer);
        console.groupEnd();
    };

    const testEventButton = document.createElement('button');
    testEventButton.textContent = 'Test Event';
    testEventButton.style.marginRight = '5px';
    testEventButton.onclick = function() {
        trackEvent('test_event', {
            test_param: 'test_value',
            timestamp: new Date().toISOString()
        });
        console.log('Test event pushed to dataLayer');
    };

    debugPanel.appendChild(debugButton);
    debugPanel.appendChild(testEventButton);
    document.body.appendChild(debugPanel);
}

// Handle CookieYes consent changes
window.addEventListener('cookieyes_consent_update', function(event) {
    const consent = window.CookieYes.getConsent();
    updateGTMConsent(consent);
});

// Start initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    waitForCookieYes(initialize);
});
