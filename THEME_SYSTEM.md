# Theme System Documentation

## Overview

The Codju Arena platform now supports both dark and light themes with a comprehensive theme system built using React Context.

## Features

- **Dark Theme** (default): Professional dark interface with blue/green accents
- **Light Theme**: Clean light interface with modern colors
- **Theme Toggle**: Easy switching between themes with a button in the navigation
- **Persistent Storage**: Theme preference is saved in localStorage
- **Smooth Transitions**: All theme changes include smooth CSS transitions

## Usage

### Using the Theme Context

```tsx
import { useTheme } from "../context/ThemeContext";

const MyComponent = () => {
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <div style={{ background: colors.background, color: colors.text }}>
      <button onClick={toggleTheme}>
        Switch to {theme === "dark" ? "light" : "dark"} theme
      </button>
    </div>
  );
};
```

### Available Colors

The theme system provides these color tokens:

- `colors.background` - Main background color
- `colors.surface` - Card/surface background
- `colors.surfaceSecondary` - Secondary surface color
- `colors.text` - Primary text color
- `colors.textSecondary` - Secondary text color
- `colors.textMuted` - Muted/disabled text color
- `colors.border` - Border color
- `colors.borderLight` - Light border color
- `colors.accent` - Primary accent color (green)
- `colors.accentSecondary` - Secondary accent color (blue)
- `colors.success` - Success color
- `colors.warning` - Warning color
- `colors.error` - Error color
- `colors.gradient` - Primary gradient
- `colors.cardBackground` - Card background
- `colors.navBackground` - Navigation background

## Theme Colors

### Dark Theme

- Background: `#0F1419`
- Surface: `#1E2333`
- Text: `#F0EEE8`
- Accent: `#5DCAA5` (green)
- Secondary: `#378ADD` (blue)

### Light Theme

- Background: `#FFFFFF`
- Surface: `#F8F9FA`
- Text: `#1A1A1A`
- Accent: `#10B981` (green)
- Secondary: `#3B82F6` (blue)

## Implementation

### Setup

1. Wrap your app with `ThemeProvider`:

```tsx
import { ThemeProvider } from "./context/ThemeContext";

const App = () => (
  <ThemeProvider>
    <YourApp />
  </ThemeProvider>
);
```

### Components Updated

The following components have been updated to support themes:

- `HomeScreen` - Full theme support with toggle button (simplified, progress moved to separate tab)
- `ProgressScreen` - Dedicated progress tab with learning progression and daily streak
- `TabBar` - Theme-aware navigation with new Progress tab
- Global styles with CSS custom properties

### Navigation Structure

The app now includes a dedicated Progress tab:

- **Home** 🏠 - Player overview, quick actions, and stats
- **Arena** ⚔️ - Battle arena and matchmaking
- **Practice** 📚 - Solo practice sessions
- **Progress** 📊 - Learning progression, daily streak, and detailed stats
- **Ranks** 🏆 - Leaderboard and rankings

### Progress Tab Features

The new Progress tab (`ProgressScreen`) includes:

- **Current Level Overview** - Enhanced level display with larger avatar
- **Learning Progression** - Interactive timeline with all education levels
- **Daily Streak** - Enhanced streak tracking with weekly view
- **Performance Stats** - Detailed battle statistics and win rates

### Theme Toggle

The theme toggle button is located in the navigation bar of the HomeScreen. It shows:

- ☀️ (sun) when in dark mode (click to switch to light)
- 🌙 (moon) when in light mode (click to switch to dark)

## Extending Themes

To add new colors or modify existing ones, update the theme objects in `src/context/ThemeContext.tsx`:

```tsx
const darkTheme: ThemeColors = {
  // Add new color
  newColor: "#FF6B6B",
  // ... existing colors
};

const lightTheme: ThemeColors = {
  // Add corresponding light color
  newColor: "#EF4444",
  // ... existing colors
};
```

## Best Practices

1. Always use theme colors instead of hardcoded values
2. Test both themes when adding new components
3. Use semantic color names (e.g., `colors.text` instead of specific hex values)
4. Ensure sufficient contrast in both themes for accessibility
5. Use CSS transitions for smooth theme switching

## Future Enhancements

- System theme detection (auto dark/light based on OS preference)
- Additional theme variants (high contrast, colorblind-friendly)
- Theme customization options
- Per-component theme overrides
