# H&M Bakery — Final Project

A responsive multi-page bakery website for customers browsing the menu, products, gallery, team, and contact details. The project is a front-end demonstration built with HTML, CSS, and JavaScript.

## Start the website

Open this folder in VS Code and start Live Server from `index.html`. The recipe feature uses TheMealDB and requires an internet connection. Bootstrap and jQuery are loaded from public CDNs. Local images and the other pages work as static files.

## Main pages

- `index.html` — home, customer favorites, interactive features, and dessert recipes from TheMealDB.
- `menu.html` — bakery menu.
- `products.html` — product catalog with live search, category filters, and saved filter settings.
- `gallery.html` — bakery photo gallery.
- `team.html` — team page.
- `contact.html` — contact form with inline validation and local account registration.
- `login.html` and `profile.html` — local sign-in and profile demonstration.

All primary pages share the same navigation, responsive layout, and saved light/dark theme. The theme choice is stored using `localStorage`.

## Interactive features

- Product search, suggestions, result count, and highlighted matches.
- Product category filtering with localStorage persistence.
- Registration and sign-in simulation with a profile page.
- Manual validation for email, Kazakhstan phone number, password length/complexity, matching passwords, and required fields. Forms use `novalidate` and display messages on the page.
- Dessert recipes loaded from TheMealDB, with loading, error, and retry states.
- Shopping cart, filters, FAQ accordion, scroll progress, statistics, copy button, and subtle button effects.

Account data is stored in this browser only. This is a class project simulation, not a secure production authentication system; do not use a real password.

## Project structure

```text
HM_Bakery_Final/
├── index.html, menu.html, products.html, gallery.html
├── team.html, contact.html, login.html, profile.html
├── css/       shared and page-specific styles
├── js/        interactive features and validation
├── images/    local website photography
└── archive/   preserved earlier typography/card exercises
```

## Team

Mariyam Baltabaeva and Hadiya Sarwari — Group SE-2510.
