# Apato — agent instructions

## IMPORTANT: always use the `/ponytail` plugin to code

Before writing, editing or refactoring any code in this repository, invoke the
`/ponytail` plugin and follow its workflow. Do not write code without it.
If the plugin is not installed or available, stop and ask the user to enable it
instead of coding without it.

## Project

Next.js (App Router, TypeScript, Tailwind) landlord dashboard for kos/boarding
houses, built from the "Apato Landlord Dashboard" design canvas
(https://claude.ai/artifact/2GPRD4wmWTReD6Eun9wXF2). UI copy is Indonesian.

## Architecture (clean architecture)

- `src/domain` — entities and repository interfaces. No framework imports.
- `src/application` — use cases; depend only on domain interfaces.
- `src/infrastructure` — repository implementations (in-memory seed data for now).
- `src/presentation` — React components and view helpers.
- `src/app` — Next.js routes; thin, they call use cases via the container.

Dependencies point inward only: app/presentation → application → domain;
infrastructure implements domain interfaces.
