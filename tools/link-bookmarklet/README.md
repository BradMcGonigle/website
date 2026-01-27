# Save Link Bookmarklet

A tool for quickly saving interesting links to your website's `/links` page with full control over metadata and images.

## Features

- **Preview & Edit**: See and modify title, description, and tags before saving
- **Image Selection**: Choose from all images found on the page
- **Screenshot Option**: Take a page screenshot if no suitable images exist
- **Local Image Storage**: Images are saved to your repo (no hotlinking)
- **Works Everywhere**: Desktop bookmarklet + iOS Shortcut support

## How It Works

1. Click the bookmarklet (or use iOS Shortcut) on any page
2. A popup opens with the Save Link form
3. Edit the title, description, and tags as needed
4. Select an image from the page, take a screenshot, or choose no image
5. Click Save - the link and image are committed to your GitHub repo
6. On the next deploy, the link appears on your `/links` page

## Setup

### 1. Environment Variables

Add these to your deployment environment (Vercel, Netlify, etc.):

```bash
# Secret key for authenticating requests
LINKS_API_KEY=generate-a-random-string-here

# GitHub Personal Access Token with 'repo' scope
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# Your repository (default shown)
GITHUB_REPO=BradMcGonigle/website

# Branch to commit to (default: main)
GITHUB_BRANCH=main
```

### 2. Desktop Bookmarklet

1. Open `index.html` in a browser (or host it somewhere)
2. Enter your site URL and API key
3. Click "Generate Bookmarklet"
4. Drag the "Save Link" button to your bookmarks bar

### 3. iOS Shortcut

Create a Shortcut with these actions:

1. **Receive input from Share Sheet** (accept URLs)
2. **Get URLs from Input**
3. **Open URLs**
   - URL: `https://yoursite.com/links/new?url=[Shortcut Input]&key=YOUR_API_KEY`

Enable "Show in Share Sheet" in the shortcut settings.

## Usage

### Desktop

1. Navigate to any interesting page
2. Click the "Save Link" bookmarklet
3. A popup opens with the page preview
4. Edit metadata and select an image
5. Click "Save Link"

### iOS

1. On any page, tap the Share button
2. Select your "Save Link" shortcut
3. Safari opens with the Save Link form
4. Edit and select image
5. Tap "Save Link"

## Technical Details

### API Endpoints

- `GET /api/links/preview?url=...` - Fetches page metadata and all images
- `GET /api/links/screenshot?url=...` - Takes a page screenshot (uses Puppeteer)
- `POST /api/links` - Saves the link (downloads image, commits to GitHub)

### Image Handling

When you select an image:
1. The API downloads the image from the source URL (or decodes base64 for screenshots)
2. Saves it to `public/images/links/` in your repo via GitHub API
3. References the local path in the MDX frontmatter

### Security

- API key required for all save operations
- Key can be passed via URL param (stored in sessionStorage) or request body
- The `/links/new` page is marked as `noindex, nofollow`

## Customization

### Filtering Images

The preview API filters out common non-content images:
- Favicons and icons
- Tracking pixels
- SVGs (usually icons)
- Images with "logo" + "small" in the path

You can modify `apps/web/src/app/api/links/preview/route.ts` to adjust filtering.

### Screenshot Settings

Screenshots are taken at 1200x630 resolution (standard OG image size). Modify `apps/web/src/app/api/links/screenshot/route.ts` to change dimensions or quality.
