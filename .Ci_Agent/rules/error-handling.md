# Error Handling Rules

- Handle HTTP errors directly in Axios calls inside Zustand actions.
- Log errors through a centralized Logging helper.
- Throw clean, component-friendly errors back to React components.
- Use a global React error boundary to catch rendering errors.
