---
title: "The Basics of TypeScript"
description: "A brief introduction to what TypeScript is and why it's useful."
publishDate: "2025-11-08"
category: "TypeScript"
---

# The Basics of TypeScript

TypeScript is a programming language developed by Microsoft. It is a strict syntactical **superset of JavaScript**, which means that any valid JavaScript code is also valid TypeScript code.

The primary feature TypeScript adds to JavaScript is **static typing**.

### What is Static Typing?

In plain JavaScript, you can do this:

```javascript
let myVariable = "hello"; // myVariable is a string
myVariable = 5;           // Now it's a number. JavaScript is fine with this.
```

TypeScript allows you to "lock" a variable to a specific type. If you try to assign a value of a different type, TypeScript will show an error *before you even run the code*.

```typescript
let myVariable: string = "hello"; // myVariable must always be a string
myVariable = 5; // ERROR: Type 'number' is not assignable to type 'string'.
```

This helps catch bugs early and makes your code easier to understand and maintain, especially in large projects. The code you fixed earlier with `Record<string, ...>` is a perfect example of using TypeScript's type system to make your code more robust.

### A Real-World Example: Grouping Notes

In our knowledge base, we had this code to group notes by category:

```javascript
// The initial, incorrect code
const notesByCategory = allNotes.reduce((acc, note) => {
    const category = note.frontmatter.category || 'Uncategorized';
    if (!acc[category]) { // <-- TypeScript Error Here
        acc[category] = [];
    }
    acc[category].push(note);
    return acc;
}, {}); // <-- The problem starts here
```

**The Problem:** We start the `reduce` function with an empty object `{}`. TypeScript sees this and infers that the type of `acc` is `{}`, an object with no properties. When we try to access `acc[category]`, TypeScript throws an error because it doesn't know that a property with the name stored in the `category` variable is allowed on this empty object type.

**The Solution:** We need to tell TypeScript what the *final shape* of our object will be. We do this with a type assertion.

```typescript
// The corrected code
const notesByCategory = allNotes.reduce((acc, note) => {
    const category = note.frontmatter.category || 'Uncategorized';
    if (!acc[category]) {
        acc[category] = [];
    }
    acc[category].push(note);
    return acc;
}, {} as Record<string, typeof allNotes>); // <-- The fix
```

By adding `as Record<string, typeof allNotes>`, we are telling TypeScript:
"Treat this empty object `{}` as a `Record` (an object map) where the keys will be `string`s and the values will be arrays of notes (`typeof allNotes`)."

This gives TypeScript the information it needs to understand our code's intent and removes the error.