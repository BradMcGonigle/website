/**
 * Save Link Bookmarklet
 *
 * This bookmarklet opens the Save Link page with the current URL,
 * allowing you to preview the page, select an image, and save the link.
 *
 * Configuration:
 * - SITE_URL: Your website URL
 * - API_KEY: Your secret API key
 */

(function () {
  // Configuration - UPDATE THESE VALUES
  const SITE_URL = "https://www.bradmcgonigle.com";
  const API_KEY = "YOUR_API_KEY_HERE";

  // Get current page URL
  const pageUrl = encodeURIComponent(window.location.href);

  // Open the save link page
  window.open(
    `${SITE_URL}/links/new?url=${pageUrl}&key=${API_KEY}`,
    "_blank",
    "width=800,height=900,scrollbars=yes"
  );
})();
