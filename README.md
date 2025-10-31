# widgets-notion

A collection of embeddable, responsive web widgets built with pure HTML, CSS, and JavaScript. No dependencies required!

## Image Slider Widget

A fully-featured, responsive image slider that can be embedded anywhere and loads images from JSON files.

### Features

- **Zero Dependencies**: Pure HTML, CSS, and JavaScript
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Multiple Navigation Methods**:
  - Arrow buttons (previous/next)
  - Dot indicators (jump to any slide)
  - Keyboard navigation (arrow keys)
  - Touch/swipe support
  - Mouse drag support
- **URL Parameter Support**: Load custom JSON data via query parameters
- **Accessible**: Includes ARIA labels and keyboard support
- **GitHub Pages Ready**: Can be hosted directly from GitHub Pages

### Usage

#### Basic Usage (Default Data)

Simply open `index.html` in a browser or host it on GitHub Pages:

```
https://your-username.github.io/widgets-notion/
```

This will load the default example data from `widgets/example.json`.

#### Custom Data File

Pass a custom JSON file path via the `data` URL parameter:

```
https://your-username.github.io/widgets-notion/?data=widgets/custom.json
```

### JSON Data Format

Create a JSON file with the following structure:

```json
{
  "title": "Your Slider Title",
  "images": [
    {
      "url": "path/to/image1.jpg",
      "alt": "Description of image 1",
      "caption": "Optional caption for image 1"
    },
    {
      "url": "path/to/image2.jpg",
      "alt": "Description of image 2",
      "caption": "Optional caption for image 2"
    }
  ]
}
```

### File Structure

```
/
├── index.html          # Main slider widget
├── assets/             # Example images
│   ├── image1.svg
│   ├── image2.svg
│   ├── image3.svg
│   ├── image4.svg
│   └── image5.svg
└── widgets/            # Example JSON data
    ├── example.json    # 5-slide example
    └── custom.json     # 2-slide custom example
```

### Embedding in Other Sites

You can embed the slider in other websites using an iframe:

```html
<iframe 
  src="https://your-username.github.io/widgets-notion/?data=widgets/example.json"
  width="100%" 
  height="600" 
  frameborder="0">
</iframe>
```

### Navigation Controls

- **Arrow Buttons**: Click the left/right arrow buttons on the sides
- **Dot Indicators**: Click any dot below the slider to jump to that slide
- **Keyboard**: Use Left/Right arrow keys to navigate
- **Touch**: Swipe left/right on touch devices
- **Mouse**: Click and drag left/right on desktop

### Customization

The slider is fully self-contained in `index.html`. You can customize:

- Colors and styles in the `<style>` section
- Transition speed and effects
- Button styles and positioning
- Responsive breakpoints
- Add autoplay functionality
- Add thumbnail previews

### Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### License

This project is open source and available for use in your projects.