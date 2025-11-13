---
title: "Understanding Interfaces"
description: "How to use interfaces to define contracts for your code's data structures."
publishDate: "2025-11-08"
category: "TypeScript"
---

# Understanding Interfaces in TypeScript

An **interface** is a way to define the structure or "shape" of an object. It acts like a contract, ensuring that any object claiming to be of that interface type has the required properties.

This is incredibly useful for things like the `frontmatter` in your notes. You expect every note to have a `title` and a `description`. An interface can enforce that.

### Defining an Interface

You can define an interface for your note's frontmatter like this:

```typescript
interface NoteFrontmatter {
    title: string;
    description: string;
    publishDate: string;
    category?: string; // The '?' makes this property optional
}
```

### Using an Interface

Now, you can use this interface to ensure your objects conform to the shape you expect.

```typescript
const myNote: NoteFrontmatter = {
    title: "My Awesome Note",
    description: "This is a great note.",
    publishDate: "2025-11-08",
    category: "TypeScript"
};

// TypeScript would show an error here because 'title' is missing:
const badNote: NoteFrontmatter = {
    description: "This note is incomplete.",
    publishDate: "2025-11-08"
};
```

Interfaces don't exist in the final JavaScript code; they are a development-time tool used by TypeScript to help you write safer, more predictable code.