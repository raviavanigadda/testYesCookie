// Example: Handle cookie states based on consent preferences
window.addEventListener('cookieyes_consent_update', function() {
    const consent = CookieYes.getConsent();

    if (consent.analytics === true) {
        console.log("Analytics cookies are allowed.");
        enableAnalyticsCookies();
    } else {
        console.log("Analytics cookies are blocked.");
        disableAnalyticsCookies();
    }

    if (consent.marketing === true) {
        console.log("Marketing cookies are allowed.");
        enableMarketingCookies();
    } else {
        console.log("Marketing cookies are blocked.");
        disableMarketingCookies();
    }
});

// Example functions to manage cookies dynamically
function enableAnalyticsCookies() {
    // Enable Analytics (e.g., Google Analytics)
    console.log("Google Analytics script added.");
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID";
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'YOUR-GA-ID');
}

function disableAnalyticsCookies() {
    // Remove Analytics cookies or block further tracking
    document.cookie = "_ga=; Max-Age=0";
    document.cookie = "_gid=; Max-Age=0";
}

function enableMarketingCookies() {
    console.log("Enabling marketing cookies...");
    // Add Facebook Pixel or other marketing tracking scripts here
}

function disableMarketingCookies() {
    console.log("Disabling marketing cookies...");
    // Clear cookies or stop marketing tracking
}
