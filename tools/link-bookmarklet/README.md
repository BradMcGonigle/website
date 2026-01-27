# Save Link Bookmarklet

A simple tool for quickly saving interesting links to your website's `/links` page.

## How It Works

1. You click the bookmarklet (or use the iOS Shortcut) while viewing any webpage
2. The bookmarklet sends the URL to your website's API
3. The API fetches the page and extracts metadata (title, description, OG image)
4. The API creates a new MDX file in your content folder via the GitHub API
5. On the next build/deploy, the link appears on your `/links` page

## Setup

### 1. Environment Variables

Add these to your deployment environment (Vercel, Netlify, etc.):

```bash
# Secret key for authenticating bookmarklet requests
LINKS_API_KEY=generate-a-random-string-here

# GitHub Personal Access Token with 'repo' scope
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# Your repository (default shown)
GITHUB_REPO=BradMcGonigle/website

# Branch to commit to (default: main)
GITHUB_BRANCH=main
```

### 2. Desktop Bookmarklet

1. Open `index.html` in a browser
2. Enter your API URL and API key
3. Click "Generate Bookmarklet"
4. Drag the "Save Link" button to your bookmarks bar

### 3. iOS Shortcut

Create a Shortcut with these actions:

1. **Receive input from Share Sheet** (accept URLs)
2. **Get URLs from Input**
3. **Get Contents of URL**
   - URL: `https://yoursite.com/api/links`
   - Method: POST
   - Headers:
     - `x-api-key`: your API key
     - `Content-Type`: application/json
   - Request Body: JSON
     - `url`: Shortcut Input
4. **Show Notification**: "Link saved!"

Enable "Show in Share Sheet" in the shortcut settings.

## Usage

### Desktop
Click the bookmarklet while on any page. You'll see a brief notification confirming the link was saved.

### iOS
1. Tap the Share button on any page
2. Select your "Save Link" shortcut
3. Done!

## Security Notes

- The API key is embedded in the bookmarklet/shortcut, so keep it private
- Consider rotating the API key periodically
- The GitHub token should have minimal required permissions (just `repo` scope)

## Customization

### Adding Tags

The API supports optional tags:

```json
{
  "url": "https://example.com",
  "tags": ["development", "tools"]
}
```

You could modify the bookmarklet to prompt for tags, or create multiple shortcuts for different categories.
