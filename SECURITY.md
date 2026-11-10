# Security notes

This repository is a frontend portfolio prototype. It stores demo data and the
current session in the browser's `localStorage`; it does not include a backend,
server-side authorization, or a production authentication system.

The bundled administrator credentials are intentionally public demo credentials.
Do not reuse the current authentication approach, credentials, or client-side
authorization checks in a production deployment.

Before adapting the project for real users, add a trusted backend, hashed
password storage, server-side access control, input validation, CSRF protection,
rate limiting, secure file handling, and a formal privacy/data-retention policy.

If you discover an issue in this portfolio project, please open a GitHub issue
without including personal data or active secrets.
