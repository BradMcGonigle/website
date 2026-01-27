/**
 * Save Link Bookmarklet
 *
 * This bookmarklet sends the current page URL to the Links API,
 * which extracts metadata and creates a new link entry.
 *
 * Configuration:
 * - API_URL: Your website's API endpoint
 * - API_KEY: Your secret API key (set in environment variables)
 */

(function () {
  // Configuration - UPDATE THESE VALUES
  const API_URL = "https://www.bradmcgonigle.com/api/links";
  const API_KEY = "YOUR_API_KEY_HERE";

  // Get current page URL
  const url = window.location.href;

  // Show loading indicator
  const overlay = document.createElement("div");
  overlay.id = "save-link-overlay";
  overlay.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1a1a1a;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    ">
      <span id="save-link-status">Saving link...</span>
    </div>
  `;
  document.body.appendChild(overlay);

  const statusEl = document.getElementById("save-link-status");

  // Send to API
  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ url }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        statusEl.textContent = "Link saved!";
        statusEl.style.color = "#4ade80";
      } else {
        statusEl.textContent = "Error: " + (data.error || "Unknown error");
        statusEl.style.color = "#f87171";
      }
    })
    .catch((error) => {
      statusEl.textContent = "Error: " + error.message;
      statusEl.style.color = "#f87171";
    })
    .finally(() => {
      // Remove overlay after 2 seconds
      setTimeout(() => {
        overlay.remove();
      }, 2000);
    });
})();
