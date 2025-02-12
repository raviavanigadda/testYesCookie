// Debug function to log cookie states
function logCookieStates() {
    const consent = CookieYes.getConsent();
    console.group('CookieYes Consent Status:');
    console.log('Analytics:', consent.analytics);
    console.log('Marketing:', consent.marketing);
    console.log('Necessary:', consent.necessary);
    console.log('Functional:', consent.functional);
    console.groupEnd();
}

// Function to initialize Google Analytics
function initializeGA() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX', {
        'cookie_flags': 'max-age=7200;secure;samesite=none'
    });
    console.log('Google Analytics initialized');
}

// Handle cookie consent changes
window.addEventListener('cookieyes_consent_update', function(event) {
    console.log('Consent Update Event Triggered:', event);
    const consent = CookieYes.getConsent();
    logCookieStates();

    if (consent.analytics === true) {
        console.log("Analytics cookies enabled - initializing GA");
        initializeGA();
    } else {
        console.log("Analytics cookies disabled - removing GA cookies");
        // Remove Google Analytics cookies
        document.cookie = '_ga=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = '_gid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = '_gat=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        console.log("GA cookies removed");
    }
});

// Initial consent check on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - checking initial consent status');
    logCookieStates();
    
    // Check if analytics is already allowed
    const initialConsent = CookieYes.getConsent();
    if (initialConsent.analytics === true) {
        console.log("Analytics pre-approved - initializing GA");
        initializeGA();
    }
});

// Debug function to list all cookies
function listAllCookies() {
    console.group('Current Cookies:');
    document.cookie.split(';').forEach(function(cookie) {
        console.log(cookie.trim());
    });
    console.groupEnd();
}

// Add debug button to page (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const debugButton = document.createElement('button');
    debugButton.textContent = 'Debug Cookies';
    debugButton.style.position = 'fixed';
    debugButton.style.bottom = '10px';
    debugButton.style.right = '10px';
    debugButton.style.zIndex = '9999';
    debugButton.onclick = function() {
        console.clear();
        logCookieStates();
        listAllCookies();
    };
    document.body.appendChild(debugButton);
}
