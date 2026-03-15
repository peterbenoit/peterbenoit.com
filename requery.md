# reQuery — Technical Overview

> A jQuery 4 plugin that adds reactive state and declarative DOM binding — without a build step, a virtual DOM, or a component model.

---

## What It Is

reQuery is a small, dependency-free jQuery plugin that brings reactive data binding to jQuery-based projects. You store state on a DOM element, annotate your HTML with `data-rq-*` attributes, and the DOM stays in sync automatically. When state changes, affected elements update. When a user types into an input, state updates.

It is **not** a component framework. It has no render functions, no virtual DOM, no JSX, and no lifecycle hooks. It is designed to complement existing jQuery code, not replace it.

---

## Why It Exists

Most jQuery projects hit the same wall at some point: a piece of UI depends on more than one or two values, and keeping the DOM manually in sync with that state gets messy fast.

```js
// Vanilla jQuery — imperative, brittle
$('#inc').on('click', function () {
  count++;
  $('.counter-display').text(count);
  $('.step-tracker').text(`Step ${count} of 10`);
  if (count >= 10) $('.done-msg').show();
  updateProgressBar(count);
});
```

Every time `count` changes, you have to remember every element that depends on it and update each one manually. Every time you add something new to the UI that reflects `count`, you go back and add another line to every event handler that modifies it. Miss one and you have a stale-display bug.

reQuery inverts that relationship. State is the source of truth; the HTML declares what depends on it:

```html
<span data-rq-text="count"></span>
<span data-rq-text="count" id="step-tracker"></span>
<div data-rq-show="isDone">All done!</div>
```

```js
$('#app').rqState({ count: 0, isDone: false });

$('#inc').on('click', () =>
  $('#app').rqMutate('count', n => {
    const next = n + 1;
    $('#app').rqSet('isDone', next >= 10);
    return next;
  })
);
```

Adding a new element that displays `count` means adding one HTML attribute, not editing event handlers. The event handlers only change state — they no longer care about the DOM.

---

## Who It's For

reQuery is built for a specific audience:

- **jQuery developers** who want reactive data binding without abandoning the jQuery mental model (selectors, chaining, direct DOM access).
- **Teams maintaining existing jQuery codebases** — WordPress themes, Laravel Blade views, legacy admin panels — who need to make specific sections reactive without a full rewrite.
- **Projects built on server-rendered or CMS-driven HTML** where a full SPA framework would be overkill, but plain jQuery event handlers are becoming unmanageable.
- **Developers who value transparency** — reQuery has no compiler, no ahead-of-time transformation, and no magic. You can read the source and understand exactly what is happening.

reQuery is explicitly **not** targeted at greenfield SPA development. If you are building a complex, large-scale application from scratch, Vue, React, or Svelte are better fits.

---

## Core Design Decisions

### State is scoped to a DOM element

State lives in a `WeakMap` keyed to the root element. It does not live in a global store, a module-level variable, or `$.data()`. Two separate `#app` elements can have completely independent state.

```js
$('#widget-a').rqState({ count: 0 });
$('#widget-b').rqState({ count: 100 });

$('#widget-a').rqGet('count'); // → 0
$('#widget-b').rqGet('count'); // → 100
```

This makes reQuery safe to use for self-contained widgets, embeds, or multiple instances of the same UI on a single page.

### No virtual DOM — direct DOM writes

When state changes, reQuery walks the DOM subtree beneath the root element, finds any `data-rq-*` bindings that reference the changed key, and updates those nodes directly. There is no diffing step, no reconciler, and no intermediate representation. This keeps the implementation small and the behaviour predictable.

### API follows jQuery conventions

All methods are registered on `$.fn` and follow jQuery's own naming and chaining patterns:

- Methods read as `$element.rqVerb('key', ...)` — selector first, verb second.
- All write methods return `this` for chaining.
- The one exception is `rqGet`, which returns the value — consistent with how jQuery's own `.val()` and `.text()` behave when called with no arguments.

### No build step for consumers

`dist/requery.umd.js` is a single file that works via a `<script>` tag alongside jQuery 4 from a CDN. There is nothing to transpile, bundle, or configure. This keeps the barrier to adoption minimal for the projects most likely to benefit from reQuery.

---

## How It Works

### State initialization

`rqState(obj)` stores an initial state object on the element via a `WeakMap`. It then runs an initial DOM binding pass to reflect the starting values into any `data-rq-*` elements found inside the root.

### DOM binding

`applyBindings(root, key, value)` is called after any state write. It scans the subtree for elements with relevant `data-rq-*` attributes and applies the update:

| Attribute | Effect |
|---|---|
| `data-rq-text="key"` | Sets `textContent` |
| `data-rq-html="key"` | Sets `innerHTML` |
| `data-rq-val="key"` | Sets input value; also wires the `input`/`change` event for two-way binding |
| `data-rq-show="key"` | Toggles visibility (via `display`) based on truthiness |
| `data-rq-attr-[name]="key"` | Sets an HTML attribute; passes `null` to remove it |
| `data-rq-class-[name]="key"` | Adds or removes a CSS class based on truthiness |
| `data-rq-each="key"` | Clones a `<template>` child for each item in an array |
| `data-rq-on-[event]="action"` | Wires an event to a named handler from `opts.actions` |

### Reactive writes

`rqSet(key, value)` writes the new value to the state store, then runs computed recalculation and watcher callbacks, then calls `applyBindings`. `rqMutate(key, fn)` calls the function with the current value and passes the result to `rqSet`.

### Computed values

`rqComputed(key, fn)` registers a derived value. The function receives the full state object and returns a value that is written back into state under `key`. Computeds re-run whenever any key they depend on is written (via `rqSet` or `rqMutate`).

### Watchers

`rqWatch(key, fn)` registers a callback that fires after state is written but before `applyBindings` runs. The callback receives `(newValue, oldValue)`.

---

## API Summary

| Method | Returns | Description |
|---|---|---|
| `$.fn.rqState(obj, opts?)` | `this` | Initialize state on an element |
| `$.fn.rqGet(key)` | value | Read a state value |
| `$.fn.rqSet(key, value)` | `this` | Write a state value |
| `$.fn.rqMutate(key, fn)` | `this` | Update state via callback |
| `$.fn.rqWatch(key, fn)` | `this` | Register a change watcher |
| `$.fn.rqComputed(key, fn)` | `this` | Register a derived value |

---

## Comparison with Alternatives

| | reQuery | Vanilla jQuery | Vue / React / Svelte |
|---|---|---|---|
| Requires a build step | No | No | Yes |
| Requires rewriting existing code | No | — | Yes |
| Reactive data binding | Yes | No | Yes |
| Virtual DOM / diffing | No | No | Yes (React, Vue) |
| Component model | No | No | Yes |
| Works inside CMS-rendered HTML | Yes | Yes | Difficult |
| Full SPA capability | No | No | Yes |
| Bundle size (approx.) | ~5 KB | ~30 KB | 30–100+ KB |

---

## Project Structure

```
src/
  requery.js          ← entry point; registers $.fn.rq* methods
  core/
    state.js          ← WeakMap store, rqState / rqGet / rqSet / rqMutate
    binding.js        ← data-rq-* DOM binding engine
    watch.js          ← rqWatch + rqComputed
    lists.js          ← data-rq-each list rendering
    events.js         ← data-rq-on-* declarative events
dist/
  requery.umd.js      ← script-tag build (jQuery 4 peer dependency)
  requery.esm.js      ← ES module build
test/
  *.test.js           ← Vitest + happy-dom
examples/
  *.html              ← plain HTML demos, no build step, CDN jQuery 4
```

---

## Requirements

- **jQuery 4** (peer dependency; not bundled)
- A modern browser (ES2020+ — jQuery 4 dropped IE11 support)
- No bundler required for consumers

---

## Getting Started

**Script tag:**

```html
<script src="https://code.jquery.com/jquery-4.0.0.min.js"></script>
<script src="dist/requery.umd.js"></script>
```

**ESM / npm:**

```js
import $ from 'jquery';
import 'requery';
```

**Minimal example:**

```html
<div id="app">
  <p>Count: <strong data-rq-text="count"></strong></p>
  <button id="inc">+</button>
</div>

<script>
  $('#app').rqState({ count: 0 });
  $('#inc').on('click', () => $('#app').rqMutate('count', n => n + 1));
</script>
```

No compilation. No configuration. No framework to learn.
