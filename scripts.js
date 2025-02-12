// Debug function to log cookie states
function logCookieStates() {
    const consent = CookieYes.getConsent();
    console.group('CookieYes Consent Status:');
    console.log('Analytics:', consent.analytics);
    console.log('Marketing:', consent.marketing);
    console.log('Necessary:', consent.necessary);
    console.log('Functional:', consent.functional);
    console.log('GTM Status:', window.google_tag_manager ? 'Loaded' : 'Not Loaded');
    console.groupEnd();
}

// Function to initialize Google Analytics
function initializeGA() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GTM-5S8T487L', {
        'cookie_flags': 'max-age=7200;secure;samesite=none',
        'debug_mode': true
    });
    console.log('Google Analytics initialized with GTM-5S8T487L');
    
    // Log dataLayer contents
    console.group('DataLayer Contents:');
    console.log(JSON.stringify(window.dataLayer, null, 2));
    console.groupEnd();
}

// Handle cookie consent changes
window.addEventListener('cookieyes_consent_update', function(event) {
    console.log('Consent Update Event Triggered:', new Date().toISOString());
    const consent = CookieYes.getConsent();
    logCookieStates();

    if (consent.analytics === true) {
        console.log("Analytics cookies enabled - initializing GA");
        initializeGA();
    } else {
        console.log("Analytics cookies disabled - removing GA cookies");
        // Remove Google Analytics cookies
        document.cookie = '_ga=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=' + window.location.hostname;
        document.cookie = '_gid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=' + window.location.hostname;
        document.cookie = '_gat=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=' + window.location.hostname;
        console.log("GA cookies removed");
    }
});

// Initial consent check on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - checking initial consent status:', new Date().toISOString());
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
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    console.table(cookies.map(cookie => {
        const [name, value] = cookie.split('=');
        return { name, value };
    }));
    console.groupEnd();
}

// Add debug panel (visible on all environments for testing)
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

const debugButton = document.createElement('button');
debugButton.textContent = 'Debug Cookies';
debugButton.style.marginRight = '5px';
debugButton.onclick = function() {
    console.clear();
    console.log('Debug requested at:', new Date().toISOString());
    console.log('Page URL:', window.location.href);
    logCookieStates();
    listAllCookies();
};

const clearButton = document.createElement('button');
clearButton.textContent = 'Clear Cookies';
clearButton.onclick = function() {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        const [name] = cookie.split('=');
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=${window.location.hostname}`;
    });
    console.log('All cookies cleared');
    listAllCookies();
};

debugPanel.appendChild(debugButton);
debugPanel.appendChild(clearButton);

// Add the debug panel after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.body.appendChild(debugPanel);
});
