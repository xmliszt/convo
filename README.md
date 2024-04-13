# Hello 👋 I'm A Next13 TypeScript Template!

boostrapped with `TailwindCSS` and `ESLint`, configured with `PWA` and `SEO`, created by [Li Yuxuan](https://xmliszt.github.io)

**NPM Package: https://www.npmjs.com/package/create-easy-next13-template-ts**

## Run the Sample App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Create a build

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## (If you install Jest)

To test

```bash
npm run test
```

## (If you install Cypress)

To test

```bash
npm run cypress
```

## (If you install Playwright)

To test

```bash
npm run test:e2e
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Template Introduction

A few things to take notes before you start:

- This is a TypeScript template. JavaScript is currently not supported.
- The template will install the latest **NextJS** version (Next13), with the "App Router" mode enabled. If you are more familiar with the traditional "Pages Router", feel free to change the example application. (For more details about "App Router" vs "Pages Router", visit [NextJS Documentation](https://nextjs.org/docs) to find out more!)
- The template will also by default include the followings. Feel free to modify or remove any of them if you don't want to include them in your project. **Instructions on how to remove them are documented at the end of this README.**
  - Install TailwindCSS
  - Install ESLint
  - Set up PWA
  - Set up SEO

## How to use

- simply run `npx create-easy-next13-template-ts@latest` and follow on screen instructions!

```bash
npx create-easy-next13-template-ts@latest
```

## Features

- A TypeScript Next 13 (App Router) template with
  [TailwindCSS](https://tailwindcss.com) and [ESLint](https://eslint.org) supported by default.
- Optional UI library [Chakra UI](https://chakra-ui.com), [Material UI](https://mui.com) to be installed.
- [Progressive Web App (PWA)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) enabled (with next-pwa)
- [Search Engine Optimization (SEO)](https://support.google.com/webmasters/answer/7451184?hl=en/) is included (with [NextJS Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata))
- Optional third-party libraries such as: [React Icons](https://react-icons.github.io/react-icons/), [NextAuth.js](https://next-auth.js.org), [Lodash](https://lodash.com), [Moment.js](https://momentjs.com) to be installed.
- Optional Testing frameworks to be installed: [Jest](https://jestjs.io), [Cypress](https://www.cypress.io), [Playwright](https://playwright.dev)
- Optional markdown files support, with [React-Markdown](https://github.com/remarkjs/react-markdown)
- Optional linter(s) and formatter(s) to be installed: [Stylelint](https://github.com/remarkjs/react-markdown), [Prettier](https://prettier.io)
- [Husky](https://typicode.github.io/husky/) can be installed for adding git hooks to your project
- MIT License

## Remove Search Engine Optimization (SEO)

The project is automatically configured with sample SEO approach. You can find the details in `app/layout.tsx`, where you see the `export const metadata: Metadata = {...}` is being defined. If you wish to remove SEO, simply remove the entire metdata block. For more information about metdata in Next13, check out: https://nextjs.org/docs/app/building-your-application/optimizing/metadata

## Remove Progressive Web App (PWA)

The project is by default boostrapped with PWA using `next-pwa`. If you wish to remove PWA, you can follow the below steps:

1. Go to `next.config.js` in root directory, remove anything related to PWA, namely `withPWA` and change `module.exports = withPWA(nextConfig);` into `module.exports = nextConfig;`
2. Go to `public/` and remove `manifest.json`
3. Go to `app/layout.tsx`, (assuming you have SEO enabled), in the `metadata` block, remove `manifest`, `appleWebApp` fields.

## Remove ESLint

The project is by default installed with ESLint. If you wish to remove it, simply remove the `.eslintrc.json` in root directory. You can also remove the `lint` field in the `scripts` field in `package.json`.

## Remove TailwindCSS

The project is by default installed with TailwindCSS integration with Next13. If you wish to remove it, follow the below steps:

1. At root directory, remove `postcss.config.js` and `tailwind.config.js`
2. In `app/globals.css`, remove the `@tailwind` lines at the top, and any lines that start with `@apply`

> Note: once you remove tailwindCSS, all the tailwindCSS syntax in `className` will not work anymore! You have to remove them or create your own CSS classes.

---

Feel free to remove / modify any pre-installed packages to suit your own needs!

😈 Happy Hacking!
