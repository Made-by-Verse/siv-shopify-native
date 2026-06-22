# SIV — Shopify Theme

Custom Shopify theme for [SIV](https://sivcare.myshopify.com), built on a customized
[Dawn](https://github.com/Shopify/dawn) base with a modern front-end build pipeline
(Vite + Tailwind CSS + Alpine.js).

- **Store:** `sivcare.myshopify.com`
- **Base:** Dawn (Online Store 2.0)
- **Build:** Vite, with `vite-plugin-shopify` compiling `frontend/` into `assets/`
- **Styling:** Tailwind CSS + SCSS
- **Interactivity:** Alpine.js, with Lenis (smooth scroll), Swiper (carousels), and Motion (animation)

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS) and [Yarn](https://yarnpkg.com/)
- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli)
- Access to the `sivcare` Shopify store

### Install

```sh
yarn install
```

### Develop

Runs the Shopify theme dev server and the Vite dev server together (hot reload):

```sh
yarn dev
```

This proxies the live store through a local preview and rebuilds `frontend/` assets on change.
You can also run them independently:

```sh
yarn vite:dev       # Vite dev server only
yarn shopify:dev    # Shopify theme dev server only
```

### Build

Compiles `frontend/` into the `assets/` directory (these compiled files are committed,
as Shopify uploads everything in `assets/`):

```sh
yarn build
```

### Lint Liquid

```sh
shopify theme check
```

Configuration lives in [`.theme-check.yml`](.theme-check.yml).

## Project structure

Standard Shopify theme directories, plus a `frontend/` source tree that Vite compiles
into `assets/`.

```
frontend/              # Front-end source (compiled by Vite into assets/)
  entrypoints/         # Vite entrypoints (theme.js, theme.scss)
  js/
    core/              # App bootstrap, Base class, constants, bundle-freebie logic
    AlpineData/         # Alpine stores & data components (Cart, MegaMenu, Product, …)
    components/         # Imperative managers (Header, Carousel, Video, Recommendations, …)
  scss/                # SCSS partials (components/*, variables)
  assets/fonts/        # Source web fonts

sections/              # Liquid sections (~59)
snippets/              # Reusable Liquid snippets (~63)
blocks/                # Theme blocks (incl. AI-generated blocks)
templates/             # OS 2.0 JSON templates (incl. B2B `.context.b2b` variants)
layout/                # theme.liquid, password.liquid
config/                # settings_schema.json, settings_data.json
locales/               # Translations
assets/                # Compiled JS/CSS output + static assets (committed)
```

### Front-end architecture

`frontend/js/index.js` boots an `App` instance on `DOMContentLoaded`
([`core/App.js`](frontend/js/core/App.js)), which:

1. Initializes Alpine and registers all Alpine data/stores via
   [`AlpineData/index.js`](frontend/js/AlpineData/index.js).
2. Sets up Lenis smooth scrolling (toggleable via the `toggle-lenis` window event).
3. Instantiates component managers (header, carousels, video, recommendations).

Cart interactions are handled by an Alpine store in
[`AlpineData/Cart.js`](frontend/js/AlpineData/Cart.js), including the bundle-freebie /
auto-discount logic in [`core/bundleFreebies.js`](frontend/js/core/bundleFreebies.js).

## Notes

- **B2B:** Several templates have `.context.b2b.json` variants for wholesale customers.
- **Compiled assets are committed.** After changing anything in `frontend/`, run
  `yarn build` and commit the regenerated files in `assets/`.

## License

See [LICENSE.md](LICENSE.md).
