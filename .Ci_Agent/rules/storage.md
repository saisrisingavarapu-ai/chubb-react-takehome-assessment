# Storage Rules

- Create a single helper module for local/session storage access.
- Never access raw `localStorage` or `sessionStorage` directly from components or stores.
- Handle storage errors inside the helper and return safe defaults.
- Use Zustand `persist` middleware for preference persistence.
