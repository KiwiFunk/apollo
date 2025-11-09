---
title: "Understanding Hooks"
description: "A beginner-friendly guide to what hooks are in Preact/React and how to use them."
publishDate: "2025-11-09"
category: "Component Architecture"
---
# Understanding Hooks: A Beginner's Guide

Imagine your components are simple chefs. In the old days, only "Class Chefs" were allowed to have their own refrigerators (`state`) or timers that went off after cooking (`lifecycle methods`). "Function Chefs" were just simple helpers who could only follow a recipe and present a dish; they couldn't remember anything or do things on their own.

**Hooks are special tools that give our simple "Function Chefs" superpowers.** They let our simple function components have memory, react to changes, and interact with the outside world.

A hook is just a special function provided by Preact/React. The only rule is that their names **always start with `use`**.

---

## The Two Golden Rules of Hooks

Before you start, memorize these two rules. They will save you from many headaches!

1.  **Only Call Hooks at the Top Level.** Don't call hooks inside loops, conditions (`if` statements), or nested functions. Always use them at the top level of your component.
2.  **Only Call Hooks from Components or Custom Hooks.** You can't call a hook from a regular JavaScript function.

---

## Your First Tools: The Core Hooks

You'll use these two hooks in almost every component you build.

### 1. `useState`: The Memory Hook

This is the most important hook. It gives your component a "memory".

-   **Purpose:** To declare a piece of state that your component can remember between renders.
-   **Syntax:** `const [value, setValue] = useState(initialValue);`

It gives you back an array with two things:
1.  `value`: The current value of your state.
2.  `setValue`: A special function to **update** that value. Calling this function tells the component to re-render itself with the new value.

**Example: A Simple Counter**
```tsx
import { useState } from 'preact/hooks';

function Counter() {
  // 1. Declare a state variable named 'count', initialized to 0.
  const [count, setCount] = useState(0);

  // 2. When the button is clicked, call setCount to update the state.
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
2. useEffect: The Side Effect Hook
This hook lets your component do things that affect the "outside world." This is called a "side effect."

Purpose: To run code after your component has rendered. This is perfect for API calls, setting up event listeners, or manually changing the document.
Syntax: useEffect(() => { /* The effect code */ }, [/* The dependencies */]);
It takes two arguments:

The Effect Function: The code you want to run.
The Dependency Array: This is crucial. It tells useEffect when to run.
[] (empty array): The effect runs only once, after the component first renders. Perfect for initial setup.
[count] (with state): The effect runs after the first render and any time the count state changes.
No array (omitted): The effect runs after every single render. (Use this with caution, it can cause infinite loops!)

#### Example: Changing the Document Title
```tsx
import { useState, useEffect } from 'preact/hooks';

function TitleChanger() {
  const [count, setCount] = useState(0);

  // This effect will run every time 'count' changes.
  useEffect(() => {
    console.log('The count changed, updating the title!');
    document.title = `You clicked ${count} times`;
  }, [count]); // The dependency array

  return (
    <button onClick={() => setCount(count + 1)}>
      Update Title
    </button>
  );
}
```
## Custom Hooks: Creating Your Own Tools
This is where hooks become truly powerful. A custom hook is just a function you write that starts with use and contains other hooks inside it. It lets you bundle up complex, stateful logic into a reusable package.

Remember how our Sidebar.tsx component was getting messy with sorting logic and state management? We cleaned it up by creating custom hooks.

### Before (Messy Component):
```
function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [sortType, setSortType] = useState('alphaAsc');
  // ... a lot more logic for sorting ...
  // ... a lot more logic for event listeners ...

  return (/* ... a lot of JSX ... */);
}
```
### After (Clean Component with Custom Hooks):
```
// In a separate file: useSidebarState.ts
function useSidebarState() {
  const [isOpen, setIsOpen] = useState(false);
  // ... all the logic for opening/closing ...
  return { isOpen, ... };
}

// In another file: useCategorySorter.ts
function useCategorySorter() {
  const [sortType, setSortType] = useState('alphaAsc');
  // ... all the logic for sorting ...
  return { sortedCategories, ... };
}

// The final, clean component:
function Sidebar() {
  const { isOpen } = useSidebarState();
  const { sortedCategories } = useCategorySorter();

  return (/* ... clean JSX that just uses isOpen and sortedCategories ... */);
}
```
By creating useSidebarState and useCategorySorter, we made our Sidebar component incredibly easy to read. Its only job is to display the UI, while the complex logic is neatly tucked away in our custom hooks.