# Repository Guidelines

## Project Structure & Module Organization
- The repository currently contains a single planning document at the root: `人生模拟器头脑风暴.docx`.
- There are no source-code, test, or asset directories at this time.
- If you add new materials, keep top-level documents grouped with clear names (e.g., `design-notes.docx`, `requirements.md`) and update this guide accordingly.

## Build, Test, and Development Commands
- No build, test, or runtime commands are defined in this repository.
- If you need to export or convert the document, use your local tooling. Example (if available):
  - `libreoffice --headless --convert-to pdf 人生模拟器头脑风暴.docx`
- When adding automation (scripts, Makefile, package.json), document the exact commands and their purpose here.

## Coding Style & Naming Conventions
- This project is document-centric; follow clear, descriptive filenames and keep names consistent in case and language.
- Prefer ASCII for new filenames and headings unless non-ASCII is required for accuracy.
- Keep content structured with headings, short paragraphs, and bullet lists for readability.

## Testing Guidelines
- There are no automated tests or coverage requirements in this repository.
- If you introduce code or data that should be validated, define a test location (e.g., `tests/`) and add run instructions.

## Commit & Pull Request Guidelines
- Git is initialized for this repository; start with small, focused commits.
- Commit messages: short imperative subject, optional body for context. Example: `Add brainstorming outline`.
- Pull requests: include a concise summary, link related issues if any, and attach exported artifacts (e.g., PDF) when the doc is the primary change.

## Security & Configuration Tips
- Avoid committing sensitive personal data if the document contains private information.
- If configuration files are added later, document required environment variables and local setup steps here.
