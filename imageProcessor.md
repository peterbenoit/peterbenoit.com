# ImageProcessor — Technical Overview

## What Is ImageProcessor?

**ImageProcessor** (v1.0.1) is a lightweight, dependency-free JavaScript library that performs image processing directly in the browser using the HTML5 Canvas API. It lets you apply filters, crop, resize, rotate, and watermark images entirely on the client side — no server round trips, no backend image processing pipeline, and no third-party dependencies required.

```html
<script src="path/to/ImageProcessor.js"></script>
```

```javascript
new ImageProcessor('https://example.com/photo.jpg', {
    width: 800,
    grayscale: 'grayscale(100%)',
    watermark: '© 2024 Peter Benoit',
    targetElement: document.getElementById('output'),
});
```

---

## Why I Built It

The web already has CSS filters — so why write a JavaScript library?

The short answer: **CSS filters are visual-only**. They change how an image *looks* without touching the underlying data. ImageProcessor was built to close that gap and provide capabilities CSS simply cannot offer:

| Capability | CSS Filters | ImageProcessor |
|---|---|---|
| Apply visual effects (blur, brightness, etc.) | ✅ | ✅ |
| Export / save the modified image | ❌ | ✅ |
| Crop or resize the actual pixel data | ❌ | ✅ |
| Add dynamic text or image watermarks | ❌ | ✅ |
| Process images conditionally at runtime | ❌ | ✅ |
| Batch-process multiple images | ❌ | ✅ |
| Adapt output quality for performance | ❌ | ✅ |
| Work consistently across browsers | Partial | ✅ |

The motivating use cases were:
- **Content protection** — stamping images with watermarks that are baked into the pixel data rather than layered on top with CSS (which is trivially bypassed).
- **Client-side thumbnailing** — generating resized previews before uploading to a server, reducing bandwidth and server load.
- **Dynamic content pipelines** — transforming images based on user preferences, screen size, or network conditions without a backend call.
- **Sensitive image handling** — blurring images by default with a toggle-to-reveal UX pattern, with the blur applied at the canvas level rather than through a CSS class.

---

## Target Audience

ImageProcessor is written for **front-end and full-stack web developers** who need client-side image processing without the overhead of a backend service or a heavy library like sharp or ImageMagick.

It is a good fit if you:

- Build content-management tools, portfolios, or media platforms and need lightweight image manipulation on the client.
- Want to add watermarks to images before a user downloads or shares them.
- Need to generate resized or cropped image previews in the browser before uploading.
- Are building accessible UIs and want fine-grained control over image attributes (`alt`, `loading`, `decoding`, `referrerPolicy`).
- Want to retrofit existing `<img>` tags with processing via `data-*` attributes — no JavaScript required for simple cases.

It is **not** a replacement for server-side processing when you need to persist transformed images at scale, generate multiple format variants, or enforce security on the output file itself.

---

## How It Works

ImageProcessor wraps the browser's native **Canvas API**. When you instantiate `new ImageProcessor(...)`, the following happens:

1. A hidden `<img>` element loads the source URL with the specified `crossOrigin`, `loading`, `decoding`, and `referrerpolicy` attributes.
2. On load, the image is drawn onto an off-screen `<canvas>` with the Canvas 2D rendering context's `filter` property set to the composed CSS filter string.
3. Crop, resize, and rotation transforms are applied during `drawImage()` using the canvas coordinate system.
4. If a watermark is specified, it is drawn on top of the canvas — either as composed text or as a second image composited via `drawImage()`.
5. The canvas is exported to a data URL (`canvas.toDataURL(format, quality)`) and injected into the target DOM element as an `<img>` tag.
6. Lifecycle callbacks (`onProcessingStart`, `onProcessed`, `onError`) fire at the appropriate steps.

Because everything happens on the canvas, the output is a **new image** — the original source is untouched, and the processed result can be saved, uploaded, or displayed independently.

---

## Installation

No package manager required. Drop the script into your page:

```html
<script src="path/to/ImageProcessor.js"></script>
```

Or use it via the CDN / your own asset pipeline. The library exposes a single global `ImageProcessor` class with no dependencies.

---

## Usage

### Programmatic API

Pass a URL (or array of image objects) and an options object:

```javascript
// Single image
new ImageProcessor('https://example.com/image.jpg', {
    width: 400,
    height: 300,
    brightness: 'brightness(1.4)',
    contrast: 'contrast(1.2)',
    altText: 'Enhanced photo',
    targetElement: document.getElementById('output'),
    onProcessed: ({ imageUrl }) => console.log('Done:', imageUrl),
});
```

```javascript
// Batch processing
new ImageProcessor([
    { url: 'photo1.jpg', options: { grayscale: 'grayscale(100%)', targetElement: el1 } },
    { url: 'photo2.jpg', options: { sepia: 'sepia(80%)',          targetElement: el2 } },
]);
```

### Data Attribute API

For zero-JavaScript usage, add `data-img` to any element and instantiate with no arguments. ImageProcessor will scan the page and process all matching elements automatically:

```html
<div
    data-img="photo.jpg"
    data-width="600"
    data-grayscale="true"
    data-watermark="© My Site"
    data-alt="Grayscale photo with watermark"
></div>

<script>
    new ImageProcessor(); // processes all [data-img] elements on the page
</script>
```

---

## Options Reference

### Dimensions & Cropping

| Option | Type | Default | Description |
|---|---|---|---|
| `width` | `Number` | `null` | Output image width in pixels. Uses source width if omitted. |
| `height` | `Number` | `null` | Output image height in pixels. Uses source height if omitted. |
| `cropX` | `Number` | `0` | X offset of the crop region on the source image. |
| `cropY` | `Number` | `0` | Y offset of the crop region on the source image. |
| `cropWidth` | `Number` | `null` | Width of the crop region. Uses full image width if omitted. |
| `cropHeight` | `Number` | `null` | Height of the crop region. Uses full image height if omitted. |
| `rotate` | `Number` | `0` | Rotation angle in degrees. |

### Filters

All filter values follow the CSS filter function syntax.

| Option | Type | Default | Example |
|---|---|---|---|
| `grayscale` | `String` | `''` | `'grayscale(100%)'` |
| `sepia` | `String` | `''` | `'sepia(80%)'` |
| `invert` | `String` | `''` | `'invert(100%)'` |
| `brightness` | `String` | `'brightness(1)'` | `'brightness(1.5)'` |
| `contrast` | `String` | `'contrast(1)'` | `'contrast(1.2)'` |
| `blur` | `String` | `''` | `'blur(4px)'` |
| `saturation` | `String` | `'saturate(1)'` | `'saturate(2)'` |
| `hueRotate` | `String` | `''` | `'hue-rotate(90deg)'` |
| `opacity` | `String` | `'opacity(1)'` | `'opacity(0.6)'` |

### Watermark

| Option | Type | Default | Description |
|---|---|---|---|
| `watermark` | `String` | `null` | Text string or image URL to use as the watermark. |
| `watermarkPosition` | `String` | `'bottom-right'` | Placement: `'top-left'`, `'top-right'`, `'center'`, `'bottom-left'`, `'bottom-right'`. |
| `watermarkRepeat` | `String` | `'no-repeat'` | `'no-repeat'`, `'repeat'`, or `'cover'`. |
| `watermarkAngle` | `Number` | `0` | Rotation angle for text watermarks, in degrees. |
| `watermarkStyle` | `Object` | See below | Style object for text watermarks. |

**Default `watermarkStyle`:**
```javascript
{
    fontSize: '24px',
    fontFamily: 'Arial',
    color: 'rgba(255, 255, 255, 0.5)',
    opacity: 0.5,
}
```

### Output

| Option | Type | Default | Description |
|---|---|---|---|
| `outputFormat` | `String` | `'image/png'` | Canvas export format. Use `'image/jpeg'` for photos. |
| `quality` | `Number` | `0.92` | Quality for lossy formats (0.0–1.0). |

### Image Loading Attributes

These map directly to standard HTML image attributes applied before the image loads.

| Option | Type | Default | Description |
|---|---|---|---|
| `loading` | `String` | `'auto'` | `'lazy'`, `'eager'`, or `'auto'`. |
| `crossorigin` | `String` | `'anonymous'` | `'anonymous'` or `'use-credentials'`. |
| `decoding` | `String` | `'auto'` | `'sync'`, `'async'`, or `'auto'`. |
| `referrerPolicy` | `String` | `'no-referrer'` | Standard `referrerpolicy` values. |
| `srcset` | `String` | `''` | Responsive image `srcset` descriptor. |
| `sizes` | `String` | `''` | Responsive image `sizes` descriptor. |

### Accessibility

| Option | Type | Default | Description |
|---|---|---|---|
| `altText` | `String` | `'Processed image'` | `alt` attribute for the output `<img>`. Always set a meaningful value. |

### DOM Wrapping

| Option | Type | Default | Description |
|---|---|---|---|
| `wrapperTag` | `String` | `null` | HTML element to wrap the output image in (e.g., `'div'`, `'figure'`). |
| `wrapperClassList` | `String` | `''` | Space-separated class names applied to the wrapper element. |
| `style` | `Object` | `{}` | Inline styles applied to the output `<img>`. |
| `targetElement` | `Element` | `null` | DOM node where the processed image will be injected. Required for programmatic usage. |

### Event Callbacks

| Option | Type | Description |
|---|---|---|
| `onProcessingStart` | `Function` | Called immediately when processing begins. Receives `{ imageUrl, targetElement }`. |
| `onProcessed` | `Function` | Called when the image has been rendered to the DOM. Receives `{ imageUrl, targetElement }`. |
| `onError` | `Function` | Called on load failure or missing target. Receives `{ imageUrl, error, targetElement }`. |
| `onClick` | `Function` | Click handler attached to the output `<img>`. |
| `onHover` | `Function` | Hover handler attached to the output `<img>`. |

---

## Advanced Features

### Sensitive Image Blurring

ImageProcessor has a built-in pattern for "reveal on click" sensitive content. Mark a container with the class `sensitive-image` alongside a `data-img` attribute, and the image will be rendered blurred by default. Clicking it toggles between the blurred and original views — with the blur applied at the canvas level, not via CSS.

```html
<div class="sensitive-image" data-img="photo.jpg" data-alt="Sensitive content"></div>
<script>new ImageProcessor();</script>
```

### Batch Processing

Pass an array of image descriptors for efficient batch processing:

```javascript
const images = [
    { url: 'img1.jpg', options: { grayscale: 'grayscale(100%)', targetElement: document.getElementById('img1') } },
    { url: 'img2.jpg', options: { sepia: 'sepia(100%)',         targetElement: document.getElementById('img2') } },
    { url: 'img3.jpg', options: { brightness: 'brightness(0.5)', targetElement: document.getElementById('img3') } },
];

new ImageProcessor(images);
```

### Responsive Images

Use `srcset` and `sizes` together with ImageProcessor options to serve appropriately sized images while still applying client-side transformations:

```javascript
new ImageProcessor('photo.jpg', {
    width: 800,
    srcset: 'photo-400w.jpg 400w, photo-800w.jpg 800w',
    sizes: '(max-width: 600px) 400px, 800px',
    loading: 'lazy',
    targetElement: document.getElementById('output'),
});
```

---

## Cross-Origin Images

Processing images from external domains requires the server to send the appropriate `Access-Control-Allow-Origin` header. ImageProcessor defaults to `crossorigin: 'anonymous'`, which satisfies most public image CDNs. If your images require authentication, set:

```javascript
new ImageProcessor('https://protected.example.com/image.jpg', {
    crossorigin: 'use-credentials',
    targetElement: document.getElementById('output'),
});
```

Without a valid CORS header, the canvas will be tainted and `toDataURL()` will throw a security error.

---

## Performance Tips

- **Use `loading: 'lazy'`** for images below the fold to defer network requests until they enter the viewport.
- **Use `outputFormat: 'image/jpeg'`** for photographs — PNG is lossless and significantly larger.
- **Tune `quality`** (0.0–1.0) when exporting JPEG to balance file size and fidelity. `0.85` is a good starting point.
- **Downscale before processing** — set `width` and `height` to the actual display size rather than processing at the source resolution and letting the browser scale down.
- **Batch where possible** — a single `new ImageProcessor([...])` call processes images sequentially without blocking the main thread between images.

---

## Accessibility Checklist

- Always set `altText` to a meaningful description. The default `'Processed image'` is a placeholder, not a real description.
- Use `wrapperTag: 'figure'` with a `<figcaption>` for images that need captions.
- Avoid using `opacity` or `blur` filters in a way that reduces legibility for low-vision users.
- For sensitive image blurring, ensure the toggle interaction is keyboard-accessible in your implementation.

---

## Browser Support

ImageProcessor relies on:
- **Canvas 2D API** — supported in all modern browsers.
- **Canvas `filter` property** — supported in Chrome 47+, Firefox 49+, Safari 18+, Edge 79+. Not supported in IE.
- **`crossOrigin` on `HTMLImageElement`** — universally supported in modern browsers.

No polyfills are included. If you need IE11 support, you would need to replace the `ctx.filter` assignment with manual pixel manipulation.

---

## Live Examples

See ImageProcessor in action on CodePen: [ImageProcessor.js on CodePen](https://codepen.io/peterbenoit/pen/XWLOmpj)

---

## Related Documentation

- [README.md](README.md) — Quick start and feature overview
- [CODING_GUIDE.md](CODING_GUIDE.md) — Full options table and best practices
- [FAQ.md](FAQ.md) — Why JavaScript instead of CSS filters? (detailed comparison)

---

## License

MIT © 2024 Peter Benoit. See [LICENSE](LICENSE) for full terms.
