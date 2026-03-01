# ☕ Café Elite - Interactive Coffee Brewing Experience

A sophisticated single-page web application that simulates an interactive coffee brewing experience with stunning visual effects, dynamic video playback, and particle animations.

## 🎯 Features

### Main Screens
- **S1 - Coffee Selection**: Browse 9 coffee varieties with 3D hover effects (Cappuccino & Espresso fully functional)
- **S2 - Brewing Visualization**: Real-time video playback with:
  - Smooth dual-video transitions (seamless at 0.3s before end)
  - Dynamic phase text ("Pulling espresso", "Steaming milk", etc.)
  - Canvas-based falling sugar particle system with physics
  - Sugar count controls (+/- buttons)
  - Coffee-specific steam animations
  
- **S3 - Sugar Adjustment**: Interactive sugar panel with:
  - Add/remove sugar with visual feedback
  - 5-sugar maximum limit
  - Sugar cube indicators
  - Quick "no sugar" option
  
- **S4 - Result Card**: Personalized order summary with:
  - Coffee-specific image display with dynamic sizing
  - Color-coded layout per coffee type
  - Data grid (Volume, Caffeine, Roast Level, Calories, Rating)
  - Dark footer with full coffee details

### Visual Effects
- **3D Text Effect**: Coffee names with layered text transforms on hover
  - Gold (#C8903A) and Cream (#F5EDD8) colored layers
  - Responsive offset animations
  
- **Sugar Particle Physics**: 
  - Gravity-based falling system (0.55 accel)
  - Rotation effects
  - Dissolve animation
  - Coffee-specific sink depths (Espresso: 30px, Cappuccino: 80px)
  
- **Video System**:
  - Dual-video architecture for seamless transitions
  - Pre-trigger loading (0.3s before video 1 ends)
  - Automatic looping on video 2
  - Coffee-specific video sources

## 🛠️ Technology Stack

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with:
  - CSS Grid & Flexbox layouts
  - CSS keyframe animations (steamRise, sugarFall)
  - CSS transitions (smooth fading, transforms)
  - Gradient backgrounds
  - Text stroke effects (-webkit-text-stroke)
  
- **Vanilla JavaScript**: Zero frameworks, pure ES6+
  - Canvas 2D API for particle system
  - HTML5 Audio/Video API
  - RequestAnimationFrame for smooth animations
  - DOM manipulation with event listeners

- **Assets**: 
  - MP4 video files (video1capuccino.mp4, video2capuccino.mp4, vide01.mp4, videopermanent.mp4)
  - PNG images (grok-image for Cappuccino, imageespresso.png)

## 📁 Project Structure

```
coffe nice/
├── index.html          # Main HTML structure (S1-S4 screens)
├── index.js            # Core JavaScript logic
│   ├── COFFEES array   # Coffee data (2 active: Cappuccino id:0, Espresso id:1)
│   ├── Particle system (dropSugar, tickSugarParts, renderSugarParts)
│   ├── Video management (source switching, auto-transitions)
│   ├── Sugar controls  (updateSugarUI, Sugar panel show/hide)
│   └── Screen routing  (show function, S1→S2→S3→S4 flow)
├── style.css           # Complete styling (830+ lines)
│   ├── S1 coffee list styling (clist, cbtn, cname - 3D effects)
│   ├── S2 brewing view (grid layout, video container, canvas)
│   ├── S3 sugar panel (sliding animation, controls)
│   └── S4 result card (color-coded per coffee, footer styling)
└── assets/
    ├── video1capuccino.mp4    (Cappuccino brewing video 1)
    ├── video2capuccino.mp4    (Cappuccino looping video 2)
    ├── vide01.mp4             (Espresso brewing video 1)
    ├── videopermanent.mp4     (Espresso looping video 2)
    ├── grok-image-*.png       (Cappuccino result image)
    └── imageespresso.png      (Espresso result image)
```

## 🚀 Getting Started

### Installation
1. Clone the repository
2. Ensure all video and image assets are in the `assets/` folder
3. Open `index.html` in a modern web browser

### Browser Requirements
- Modern browser with ES6+ support
- Canvas API support
- HTML5 Video support
- CSS Grid/Flexbox support

## 💻 How It Works

### Coffee Selection (S1)
- Click any coffee button (Cappuccino or Espresso for full experience)
- Button has 3D hover effect with gold and cream colored text layers
- Other buttons show hover effect but are placeholder-only

### Brewing Process (S2)
1. Video 1 plays automatically
2. Phase text updates in 4 stages (customized per coffee type)
3. Sugar can be added/removed during brewing
4. When video 1 has ~0.3s remaining, video 2 starts loading
5. Smooth opacity transition creates seamless effect
6. Video 2 loops indefinitely

### Sugar System
- Canvas-based particles fall from top of cup
- Physics: gravity acceleration, rotation, x-axis drift
- Particles dissolve when they reach bottom (coffee-specific depth)
- Count displayed on right with cube indicators
- Persists until sugar amount confirmed

### Result Screen (S4)
- Displays final coffee order with sugar count
- Coffee-specific colors and images
- Data grid shows scientific values:
  - **Cappuccino**: 180ml, 63mg caffeine, 120 kcal
  - **Espresso**: 30ml, 63mg caffeine, 5 kcal
- "Order another" button returns to S1

## 🎨 Color Scheme

### Cappuccino
- Primary: Warm brown gradient (#C4885A to #8B6340)
- Text: Dark brown (#3A2818)
- Info bg: Light tan (#D4C9B8)
- 3D effect: Aurium (#C8903A) + Cream (#F5EDD8)

### Espresso
- Primary: Dark brown gradient (#3A2010 to #130602)
- Text: White on dark (#FFFFFF)
- Info bg: Deep black (#0C0806)
- 3D effect: Gold (#C8903A) + Cream (#F5EDD8)

## 📊 Data Structure

Each coffee in COFFEES array contains:
```javascript
{
  id: number,                    // Array index
  name: string,                  // Display name
  sub: string,                   // Subtitle
  price: string,                 // EUR price
  origin: string,                // Origin country
  bg: string,                    // CSS gradient for card
  glow: string,                  // Glow effect color
  info: [volume, caffeine, roast, calories, rating],
  video1: string,                // Brewing video source
  video2: string,                // Looping video source
  image: string,                 // Result card image path
  imageTop: string,              // CSS top positioning
  imageWidth: string,            // Dynamic width
  imageHeight: string,           // Dynamic height
  cardTextMain: string,          // Primary text color
  cardTextSub: string,           // Secondary text color
  cardEye: string,               // Eye label color
  infoBg: string,                // Footer background
  infoText: string,              // Footer text color
  rcilColor: string,             // Small label color
  sugarBotDist: number           // Sugar dissolve depth (px)
}
```

## 🎬 Video Specifications

- **Format**: MP4 (H.264 codec)
- **Duration**: ~8 seconds (video 1)
- **Resolution**: Recommended 720p+ for quality
- **Video 1**: Shows brewing/steaming process
- **Video 2**: Looping showcase (ready state)

## 🌟 Key Implementation Details

### Particle System
- Uses Canvas 2D for high-performance rendering
- Each particle: velocity, rotation, alpha fade, dissolution
- Physics: `vy += 0.55` gravity per frame
- Optimized with RequestAnimationFrame loop

### Video Transitions
- Pre-loads video 2 with `preload="metadata"`
- Triggers at `timeRemaining <= 0.3s`
- CSS opacity transition + setTimeout delay (150ms) for DOM sync
- Fallback timeout ensures panel shows even if video events miss

### Sugar Panel
- Slides in from right with transform animation
- 0.6s duration with 0.3s delay (staggered with card fade)
- Cubic-bezier easing for natural motion
- Removes on "confirm" or screen transition

## 🔧 Customization

### Add New Coffee
1. Add object to COFFEES array with required properties
2. Add HTML button with `data-id` attribute
3. Provide video files (video1, video2)
4. Provide result image file

### Adjust Sugar Physics
- Change `0.55` in `tickSugarParts()` for gravity
- Change `sugarBotDist` per coffee for dissolve depth
- Modify particle size: `20 + Math.random() * 8` in `dropSugar()`

### Modify Colors
- Update CSS variables or directly change hex values
- S2 colors tied to coffee `bg` property
- S4 colors tied to `cardTextMain`, `cardTextSub`, `infoBg` properties

## 📝 Code Quality

- **No external dependencies** (pure HTML/CSS/JS)
- **Modular functions**: dropSugar, tickSugarParts, renderSugarParts, etc.
- **Clear variable naming**: selCoffee, sugarCount, PhaseTexts, etc.
- **Comments throughout** for complex logic
- **Error-safe**: null checks, default values, graceful fallbacks

## 🎯 Performance

- Canvas rendering: ~60 FPS (RequestAnimationFrame)
- CSS animations: GPU-accelerated (transforms, opacity)
- Video loading: Lazy-loaded per selection
- Memory: Efficient particle cleanup on dissolve
- No memory leaks: timers cleared on screen change

## 🤝 Contributing

This is a demonstration project. For modifications:
1. Test all coffee types (Cappuccino, Espresso)
2. Verify video transitions at 0.3s threshold
3. Check sugar particle birthplace (rimY - 120)
4. Validate color contrast on S4 layouts

## 📄 License

Created as an interactive project demonstration. Free to use and modify.

## 👨‍💻 Author

Developed as a complete single-page application with advanced CSS animations, Canvas graphics, and vanilla JavaScript - no frameworks, pure web standards.

---

**Status**: ✅ Complete & Tested  
**Last Updated**: March 1, 2026  
**Browsers**: Chrome, Firefox, Safari, Edge (modern versions)
