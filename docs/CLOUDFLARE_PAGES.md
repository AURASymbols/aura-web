# Cloudflare Pages preparation

This branch prepares the existing AURA frontend for a Cloudflare Pages preview.

## Preview deployment settings

- Framework preset: None
- Build command: leave blank
- Build output directory: `public`
- Root directory: repository root
- Do not attach `aurasymbol.com` or change DNS until the preview is reviewed.

## Scope and limitations

Cloudflare Pages serving the `public` directory provides the static website, artwork, and Windows RAR download. It does not run the Express server in `server.js`.

The following features depend on the Express API and therefore will not work on a static-only Pages deployment until they are moved to Pages Functions/Workers or connected to a separately hosted backend:

- `/api/health`
- `/api/status`
- `/api/wallet/:address`
- `/api/nfts/*`
- `/api/identity/*`

The browser scripts may show an unavailable/not-configured state for these features on the static preview. This is expected and must not be represented as a successful backend deployment.

## Security changes in this branch

- Removed the startup import that fetched encrypted remote data and executed the decrypted response with `eval()`.
- Removed the exposed legacy configuration module containing a hard-coded authentication value.
- Added a server-side deny rule for the legacy module paths as defense in depth.
- Added the stylesheet and script references to `public/index.html` so the static page receives the same visual refinements previously injected by Express.
- Added basic Cloudflare Pages response headers in `public/_headers`.

## Before production

1. Review the Cloudflare preview URL and confirm the original AURA artwork and download work.
2. Rotate any real credentials that may have been placed in the removed configuration file or elsewhere in Git history.
3. Review the complete API and database implementation.
4. Decide where the Express API will run, or migrate each required API route to Cloudflare Pages Functions.
5. Test the API independently before connecting the custom domain.
