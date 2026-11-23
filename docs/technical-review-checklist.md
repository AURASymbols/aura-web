# AURA Technical Review Checklist

This checklist is a review guide, not a statement that every item has been audited or completed.

## Reproducible setup
- [ ] Confirm documented Node.js version and installation steps.
- [ ] Run the project locally using README instructions.
- [ ] Confirm the site works without optional secrets or database configuration.
- [ ] Record setup failures with OS, command and exact error.
- [ ] Check tracked files for secrets and credentials.

## Frontend
- [ ] Check responsive behavior on desktop, tablet and mobile.
- [ ] Check keyboard-only navigation and visible focus states.
- [ ] Check semantic headings, link names, image alt text and form labels.
- [ ] Check color contrast and accessibility basics.
- [ ] Check external links, downloads and browser console errors.

## Backend and API
- [ ] Verify `/api/health` with and without optional database configuration.
- [ ] Verify `/api/status` does not expose secrets or private infrastructure details.
- [ ] Verify input validation and consistent error responses.
- [ ] Review request size limits, rate limiting needs and security headers.
- [ ] Ensure logs do not expose credentials, signatures or unnecessary personal data.
- [ ] Document production deployment assumptions accurately.

## Ethereum and wallet interaction
- [ ] Validate Ethereum mainnet chain ID where required.
- [ ] Reject invalid wallet addresses safely.
- [ ] Confirm NFT verification is read-only and requests no unnecessary transaction permissions.
- [ ] Handle RPC timeouts and provider failures clearly.
- [ ] Confirm contract address and token IDs are consistent.
- [ ] Ensure the UI never implies ownership when verification is unavailable.
- [ ] Never request or handle seed phrases or private keys.

## Identity and signatures
- [ ] Confirm challenges are unpredictable, short-lived and single-use where applicable.
- [ ] Bind signatures to the intended address and application context.
- [ ] Verify expiry and replay protection.
- [ ] Use a well-maintained signature verification library.
- [ ] Require proof of wallet control before identity creation.
- [ ] Minimize personal data and document retention/deletion behavior.

## Database
- [ ] Review schema constraints and migration strategy.
- [ ] Check parameterized queries and injection resistance.
- [ ] Check least-privilege credentials.
- [ ] Document backup, recovery and retention assumptions before production.
- [ ] Document expected behavior when the database is offline.

## Smart contracts and deployment
- [ ] Do not deploy new contracts without an approved specification and threat model.
- [ ] Require tests, independent review and a deployment checklist.
- [ ] Verify contract source and deployment parameters where applicable.
- [ ] Document administrative permissions and upgradeability assumptions.
- [ ] Do not treat local tests as a security audit.

## Review report format
For each finding, include severity (Critical / High / Medium / Low / Informational), affected file or route, reproduction steps, expected versus actual behavior, practical impact, suggested remediation, and whether the finding is verified or hypothetical.

## Boundary
This checklist is not a penetration test, formal security audit, legal review or guarantee of production readiness. Reproduce and prioritize findings before describing them as confirmed vulnerabilities.
