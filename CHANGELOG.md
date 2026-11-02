# Changelog

All notable changes to the Dobsonville Community Foundation website are recorded here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-11-02
### Added
- Comprehensive `README.md` covering the overview, pages, features, setup, Formspree email setup, SEO, accessibility, testing, deployment, screenshots, references and author.
- This `CHANGELOG.md`.
- Screenshots in `docs/screenshots/`.

## [0.11.0] - 2026-11-02
### Fixed
- Year counter on the homepage showed "2 020" because of locale number formatting; added a `data-plain` option.
- Mobile search box on the Programmes page stretched to 280 px tall in the stacked toolbar.
### Changed
- Shortened the Enquiry, Programmes and References page titles to 60 characters or fewer, and the Enquiry description to 160 characters.
- Darkened the lightbox backdrop so captions are easier to read.
### Tested
- Automated Chrome tests on all 9 pages at desktop and mobile widths: no console errors, failed requests, broken images or horizontal overflow. All interaction tests pass.

## [0.10.0] - 2026-11-02
### Added
- `references.html` listing every source, library, tutorial and AI tool in Harvard style.
- Custom `404.html` page for GitHub Pages.

## [0.9.0] - 2026-11-02
### Added
- `contact.html` with contact details, live opening hours (highlights today and shows open/closed status) and a contact form.
- Contact form sends email through Formspree, with a loading spinner, success and error messages, and a honeypot spam trap.
- Interactive Leaflet/OpenStreetMap map with branded marker, directions popup, scale bar, click-to-enable scroll zoom and a re-centre button.

## [0.8.0] - 2026-11-02
### Added
- Reusable `js/validation.js` with rules for name, email, South African phone, future date, quantity range, minimum message length and consent.
- `enquiry.html` with real-time inline validation, conditional fields and pre-selection from URL parameters.
- Enquiry processing: cost estimates, sponsorship tier matching, parcel and volunteer-hour calculations, next-available-date logic (Sundays, Saturdays, public holidays, notice periods) and reference numbers.
- `js/config.js` holding the Formspree endpoint.

## [0.7.0] - 2026-11-02
### Added
- `partner.html` with reasons to partner, three sponsorship tiers, ways-to-give tabs and a partner logo showcase.

## [0.6.0] - 2026-11-02
### Added
- `gallery.html` with a lazy-loaded image grid, category filters and a lightbox (next/previous, Esc, arrow keys, swipe, click-outside, focus trap).

## [0.5.0] - 2026-11-02
### Added
- `js/data.js` programme data and `services.html` rendered from it.
- Live, case-insensitive multi-word search with highlighted matches, result count, no-results message and category filters.

## [0.4.0] - 2026-11-02
### Added
- `about.html` with a history timeline, mission, vision, founder, keyboard-accessible goal tabs, target audience and an FAQ accordion.

## [0.3.0] - 2026-11-02
### Changed
- Rebuilt `index.html` with valid semantic HTML (the draft had unclosed tags and attribute typos).
### Added
- Shared `js/main.js`: hamburger navigation, sticky header shadow, back-to-top button, scroll reveal, image slider, tabs, accordion and animated counters.
- SEO title, description, keywords and Open Graph tags.

## [0.2.0] - 2026-11-02
### Added
- New stylesheet `css/style.css` with an earthy colour system, responsive layout and component styles, replacing the draft `style.css`, which had invalid CSS syntax.
- SVG logo and compressed JPG images with descriptive, hyphenated file names.

## [0.1.0] - 2026-11-02
### Added
- Original draft `index.html` and `style.css` committed as the project baseline.
