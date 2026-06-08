# Security Rules

- React is XSS-safe by default.
- Use `SafeHTMLPipe` for any HTML rendering.
- Never use raw `fetch()`; use Axios for HTTP requests.
- Do not log PII.
- Do not include sensitive data in URL parameters.
- Add a Content Security Policy (CSP) meta tag.
