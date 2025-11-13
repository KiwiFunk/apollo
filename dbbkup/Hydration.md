---
title: "What is Hydration?"
description: "Demystifying the concept of 'hydration' and how Astro uses it to bring static HTML to life."
publishDate: "2025-11-08"
category: "Astro"
---

# What is Hydration?

Hydration is the process of "breathing life" into static HTML that was rendered on a server. It's how a fast-loading but non-interactive page becomes a fully dynamic web application in the user's browser.

### The Blueprint and the Crew Analogy

1.  **The Blueprint (Static HTML):** When an Astro site is built, the server generates a complete HTML "blueprint" of the page. The browser can render this blueprint instantly. It looks correct, but none of the buttons or interactive elements work yet. It's just a visual shell.
2.  **The Crew (JavaScript):** Hydration is the process where the JavaScript "crew" arrives. They walk through the HTML blueprint, find the interactive components, and attach all the necessary event listeners (`onClick`, etc.) and state management.

After hydration, the static page is "hydrated" and fully interactive.

### Astro's Secret: Partial Hydration

The magic of Astro is that it doesn't hydrate the entire page. This is a common practice in other frameworks that can be slow and wasteful. Astro pioneers a technique called **Partial Hydration**.

This means that by default, **nothing is hydrated**. Your page remains pure, static HTML.

You choose which components should be interactive by adding a `client:*` directive to them. These components are called **"islands of interactivity."**

```astro
---
import MyInteractiveComponent from '../components/MyInteractiveComponent.jsx';
import MyStaticComponent from '../components/MyStaticComponent.astro';
---

<!-- This component is just static HTML. No JS will be sent for it. -->
<MyStaticComponent />

<!-- This component WILL be hydrated. Astro will send its JS to the browser. -->
<MyInteractiveComponent client:load />
```

Astro is smart about this, only sending the JavaScript needed for the specific components you mark as interactive. This is a primary reason why Astro websites are so performant. You get the benefit of interactivity precisely where you need it, without paying the cost for it everywhere else.