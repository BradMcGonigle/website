# Link Bookmarklet

A simple bookmarklet to quickly save links to your website's links collection.

## Setup

### Desktop Browsers (Chrome, Firefox, Safari, Edge)

1. Create a new bookmark in your browser
2. Name it "Save to Links" (or whatever you prefer)
3. For the URL, paste the following code:

```javascript
javascript:(function(){window.open('https://bradmcgonigle.com/links/new?url='+encodeURIComponent(window.location.href),'_blank')})();
```

### iOS (Safari)

Bookmarklets on iOS require a few extra steps:

1. First, bookmark any page in Safari
2. Edit the bookmark and change the URL to the bookmarklet code above
3. Save the bookmark
4. When you want to save a link, tap the bookmark while viewing the page

### iOS Shortcut (Recommended for Mobile)

For a better mobile experience, create an iOS Shortcut:

1. Open the Shortcuts app
2. Create a new Shortcut
3. Add a "Get URLs from Input" action (set to receive from Share Sheet)
4. Add an "Open URLs" action with this URL:
   ```
   https://bradmcgonigle.com/links/new?url=[URL]
   ```
   (Replace `[URL]` with the "URLs" variable from the previous action)
5. Name the Shortcut "Save to Links"
6. Enable "Show in Share Sheet"

Now you can use the Share Sheet from any app to save links.

## Usage

1. Navigate to any webpage you want to save
2. Click/tap the bookmarklet or use the iOS Shortcut
3. The /links/new page will open with the URL pre-filled
4. Enter your API key (only needed once - it's stored locally)
5. Click "Fetch Preview" to load the page metadata
6. Edit the title/description if needed
7. Select an image (or choose "No image")
8. Add optional tags
9. Click "Save Link"

The link will be committed directly to your GitHub repository.

## Environment Variables

The following environment variables are required for the API:

- `LINKS_API_KEY` - A secret key for authenticating API requests
- `GITHUB_TOKEN` - A GitHub personal access token with repo write access
- `GITHUB_REPO` - The repository in format `owner/repo` (default: `BradMcGonigle/website`)

## Security

- The API key is stored in browser localStorage for convenience
- All API requests require the Bearer token authentication
- The GitHub token is only used server-side and never exposed to the client
