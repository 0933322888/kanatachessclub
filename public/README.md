# Public Assets

This folder contains static assets that are served by Next.js.

## Images

Place your images here. For example:
- `logo.png` - Club logo
- `hero-chess.jpg` - Hero image for homepage
- `gathering.jpg` - Image of chess gatherings
- `tournament.jpg` - Tournament image

## Usage

Reference images in your code like this:
```jsx
import Image from 'next/image';

<Image 
  src="/logo.png" 
  alt="Kanata Chess Club Logo" 
  width={100} 
  height={100}
/>
```

Or for regular img tags:
```jsx
<img src="/logo.png" alt="Kanata Chess Club Logo" />
```

