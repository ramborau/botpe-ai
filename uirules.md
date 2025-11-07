# ShadCN UI — Design & Implementation Rules

> Theme, tokens, and component rules for using **ShadCN UI** components across projects. Primary goal: consistent, accessible UI matching the BotPe brand palette and the San Francisco font.

---

## 1. Purpose

These rules standardize colors, typography, spacing, and component behavior for all ShadCN UI components used in our products. Follow them when building pages, components, or when customizing ShadCN primitives.

## 2. Color tokens (CSS variables)

Define these variables at the root (`:root`) and update in dark-mode wrappers when required.

```css
:root {
	--color-primary: #00c307; /* Primary */
	--color-primary-foreground: #ffffff;

	--color-secondary: #128c7e; /* Secondary */
	--color-secondary-foreground: #ffffff;

	--color-dark: #075e54; /* Dark / brand deep */
	--color-light: #dcf8c6; /* Light background */
	--color-light-2: #ece5dd; /* Secondary light */

	--radius-sm: 8px;
	--radius-md: 12px;
	--radius-lg: 20px;

	--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
	--shadow-md: 0 6px 18px rgba(0, 0, 0, 0.08);
}

/* Dark theme overrides (example) */
.dark {
	--color-light: #052f2b;
	--color-light-2: #073233;
}
```

> Keep color usage to tokens. Do not hard-code hex values in components — use the variables.

## 3. Typography

Use the San Francisco font provided below and ensure fallbacks are sensible for web rendering.

```css
/* San Francisco font faces (use exactly as provided) */
@font-face {
	font-family: 'San Francisco';
	font-weight: 100;
	src: url('https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-ultralight-webfont.woff');
}
@font-face {
	font-family: 'San Francisco';
	font-weight: 200;
	src: url('https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-thin-webfont.woff');
}
@font-face {
	font-family: 'San Francisco';
	font-weight: 400;
	src: url('https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-regular-webfont.woff');
}
@font-face {
	font-family: 'San Francisco';
	font-weight: 500;
	src: url('https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-medium-webfont.woff');
}
@font-face {
	font-family: 'San Francisco';
	font-weight: 600;
	src: url('https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-semibold-webfont.woff');
}
@font-face {
	font-family: 'San Francisco';
	font-weight: 700;
	src: url('https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-bold-webfont.woff');
}

:root {
	--font-sans: 'San Francisco', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}

* {
	font-family: var(--font-sans);
}

h1 {
	font-weight: 700;
}
h2 {
	font-weight: 600;
}
h3 {
	font-weight: 500;
}
p {
	font-weight: 400;
}
```

> Use `font-weight` to create visual hierarchy — prefer `700/600/500/400` for headings and body.

## 4. Tailwind / shadcn theme integration (recommended)

Add the color tokens to `tailwind.config.js` or your theme file and map them to CSS variables for consistency.

```js
// tailwind.config.js (snippet)
module.exports = {
	theme: {
		extend: {
			colors: {
				primary: 'var(--color-primary)',
				'primary-foreground': 'var(--color-primary-foreground)',
				secondary: 'var(--color-secondary)',
				dark: 'var(--color-dark)',
				light: 'var(--color-light)',
				'light-2': 'var(--color-light-2)',
			},
			borderRadius: {
				sm: 'var(--radius-sm)',
				md: 'var(--radius-md)',
				lg: 'var(--radius-lg)',
			},
			boxShadow: {
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
			},
		},
	},
};
```

When customizing ShadCN components, prefer `cn()` class composition and token classes (`bg-primary`, `text-primary-foreground`, `rounded-md`) rather than inline styles.

## 5. Component rules (global)

-   **Always** use accessible labels (`aria-label`, `<label>`) for inputs and controls.
-   Use `focus-visible` outlines rather than removing focus styles. Example: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`.
-   Keep button sizes consistent: small (`h-8 px-3`), medium (`h-10 px-4`), large (`h-12 px-6`).
-   Use `rounded-md` for main UI, `rounded-lg` for cards and modals.
-   Maintain 8px baseline spacing scale (8, 16, 24, 32...). Do not invent ad-hoc spacing values.

## 6. Buttons

-   Primary button: `bg-primary text-primary-foreground hover:brightness-95 active:brightness-90`.
-   Secondary button: `bg-secondary text-secondary-foreground`.
-   Ghost button: `bg-transparent border border-light-2 text-dark` (use light2 for subtle border).

**Example (shadcn button component)**

```jsx
<Button className="rounded-md px-4 h-10 bg-primary text-primary-foreground hover:brightness-95">Save</Button>
```

## 7. Inputs & Form elements

-   Inputs: `bg-white border border-light-2 rounded-md h-10 px-3`.
-   Placeholder color should be muted: `placeholder:text-light-2`.
-   Error state: `border-red-500 ring-red-200` (use accessible contrast).

### Phone input

For phone number UI use the ShadCN-compatible phone input implementation:

-   Demo / reference: `https://shadcn-phone-input.vercel.app/`
-   MCP / package reference: `https://context7.com/omeralpi/shadcn-phone-input/llms.txt`

**Rules for phone input**

-   Always show country flag and calling code.
-   Provide a clear example placeholder `e.g. +91 98765 43210`.
-   Validate on blur and show inline error messages; avoid blocking submission for formatting warnings.
-   When saving/displaying, normalize to E.164 format.

## 8. Cards & Elevation

-   Cards use `rounded-lg` with `box-shadow: var(--shadow-md)` and `padding: 16px`.
-   Keep card background on light theme: `--color-light-2` and on dark theme use `rgba(255,255,255,0.02)` variants.

## 9. Icons & Images

-   Use `lucide-react` icons for parity with ShadCN components. Keep icon stroke `1.5` or `2` for consistent weight.
-   Icons should align to 16px/20px grid. Use `w-5 h-5` for inline, `w-6 h-6` for principal actions.

## 10. Accessibility

-   All interactive elements must be keyboard reachable and have visible focus styles.
-   Use `aria-*` attributes for components where the state isn't obvious (e.g., `aria-expanded` for dropdowns).
-   Color contrast: ensure text on `--color-primary` meets WCAG AA (use `--color-primary-foreground` for text on primary).

## 11. Dark mode

-   Provide `.dark` or `data-theme="dark"` wrappers that flip token values.
-   Avoid switching component structure between themes; only color and subtle shadows change.

## 12. Motion & Interaction

-   Use subtle motion: `transition: box-shadow 160ms, transform 160ms, background-color 160ms`.
-   Avoid long/slow animations. Use `prefers-reduced-motion` to disable non-essential animations.

## 13. Examples (class utility patterns)

```html
<!-- Primary CTA -->
<button
	class="rounded-md h-12 px-6 bg-primary text-primary-foreground shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
>
	Get started
</button>

<!-- Input -->
<input class="h-10 rounded-md border border-light-2 px-3 placeholder:text-light-2" placeholder="Enter your name" />

<!-- Card -->
<div class="rounded-lg p-4 shadow-md bg-light-2">
	<h3 class="text-lg font-semibold">Title</h3>
	<p class="text-sm">Card body...</p>
</div>
```

## 14. Theming & Tokens change procedure

-   Any change to core tokens (colors, radius, shadows) must be documented in the design-system changelog and reviewed by the UI owner.
-   Small adjustments for a single screen may be made locally but consider promoting to global token if reused.

## 15. Developer notes

-   Prefer `cn()` helper to compose class names.
-   Keep shadcn component props untouched unless you are intentionally overriding behavior.
-   For big component overrides, fork the component and add a comment header explaining the deviation.

## 16. References & assets

-   ShadCN UI docs: [https://www.shadcn.io/](https://www.shadcn.io/)
-   Phone input demo: [https://shadcn-phone-input.vercel.app/](https://shadcn-phone-input.vercel.app/)
-   MCP Phone Input reference: [https://context7.com/omeralpi/shadcn-phone-input/llms.txt](https://context7.com/omeralpi/shadcn-phone-input/llms.txt)

---

If you want, I can also export this as a `RULES.md` file in the repo structure or convert token snippets to a `tokens.css` or `tailwind.config.js` file for direct use — tell me which format you prefer.
