# Sudoku Mobile App

A beautiful and feature-rich Sudoku mobile app built with React Native, Expo, and TypeScript. The app stores all data locally on the device using AsyncStorage.

## Features

- **Three Difficulty Levels**: Easy, Medium, and Hard
- **Smart Game Logic**: Complete Sudoku puzzle generation and validation
- **Notes System**: Add pencil marks to cells for planning
- **Hints**: Get up to 3 hints per game
- **Timer**: Track your solving time
- **Conflict Detection**: Visual highlighting of invalid moves
- **Auto-Save**: Game progress is automatically saved
- **Settings**: Customize your gaming experience
- **Local Storage**: All data stored on device (no internet required)

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for screen navigation
- **AsyncStorage** for local data persistence
- **EAS Build** for deployment

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- EAS CLI (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Sudoku
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or use iOS Simulator/Android Emulator

### Development Commands

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

## Deployment with EAS

### Setup EAS

1. Install EAS CLI:
```bash
npm install -g @expo/eas-cli
```

2. Login to your Expo account:
```bash
eas login
```

3. Configure the project (already done):
```bash
eas init
```

### Build for Production

1. **Android APK (for testing):**
```bash
eas build --platform android --profile preview
```

2. **Android AAB (for Play Store):**
```bash
eas build --platform android --profile production
```

3. **iOS (for App Store):**
```bash
eas build --platform ios --profile production
```

### Submit to App Stores

1. **Google Play Store:**
```bash
eas submit --platform android
```

2. **Apple App Store:**
```bash
eas submit --platform ios
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── SudokuBoard.tsx  # Main game board component
│   ├── NumberPad.tsx    # Number input pad
│   └── GameHeader.tsx   # Game header with stats
├── screens/            # App screens
│   ├── HomeScreen.tsx   # Main menu screen
│   ├── GameScreen.tsx   # Game play screen
│   └── SettingsScreen.tsx # Settings screen
├── hooks/              # Custom React hooks
│   └── useGameState.ts  # Game state management
├── types/              # TypeScript type definitions
│   └── game.ts         # Game-related types
└── utils/              # Utility functions
    └── sudokuLogic.ts  # Sudoku game logic
```

## Game Features

### Difficulty Levels
- **Easy**: 40 cells removed (more given numbers)
- **Medium**: 50 cells removed (balanced)
- **Hard**: 60 cells removed (challenging)

### Game Mechanics
- **Notes Mode**: Toggle to add/remove pencil marks
- **Hints**: Reveal correct numbers (limited to 3 per game)
- **Conflict Detection**: Invalid moves are highlighted in red
- **Auto-Save**: Progress saved automatically
- **Timer**: Track solving time

### Settings
- Show/hide timer
- Enable/disable hints
- Toggle conflict highlighting
- Auto-save preferences
- Sound and vibration settings
- Clear all data option

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
