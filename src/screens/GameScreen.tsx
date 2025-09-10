import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameState } from '../hooks/useGameState';
import SudokuBoard from '../components/SudokuBoard';
import NumberPad from '../components/NumberPad';
import GameHeader from '../components/GameHeader';

interface GameScreenProps {
  navigation: any;
}

export default function GameScreen({ navigation }: GameScreenProps) {
  const {
    gameState,
    settings,
    currentUser,
    setCellValue,
    clearCell,
    toggleNotesMode,
    setSelectedCell,
    getHint,
  } = useGameState();

  // Handle back button
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Exit Game',
        'Are you sure you want to exit? Your progress will be saved.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => navigation.goBack() },
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  // Show completion alert
  useEffect(() => {
    if (gameState.isComplete) {
      const timeString = `${Math.floor(gameState.elapsedTime / 60)}:${(gameState.elapsedTime % 60).toString().padStart(2, '0')}`;
      Alert.alert(
        'Congratulations!',
        `${currentUser?.user?.name || 'Player'}, you solved the ${gameState.difficulty} puzzle in ${timeString}!`,
        [
          { text: 'New Game', onPress: () => navigation.navigate('Home') },
          { text: 'View Stats', onPress: () => navigation.navigate('PlayerStats') },
          { text: 'Continue', style: 'cancel' },
        ]
      );
    }
  }, [gameState.isComplete, gameState.difficulty, gameState.elapsedTime, currentUser, navigation]);

  const handleCellPress = (row: number, col: number) => {
    if (gameState.board[row][col].isGiven) return;
    setSelectedCell(row, col);
  };

  const handleNumberPress = (number: number) => {
    if (!gameState.selectedCell) return;
    
    const { row, col } = gameState.selectedCell;
    setCellValue(row, col, number);
  };

  const handleClearPress = () => {
    if (!gameState.selectedCell) return;
    
    const { row, col } = gameState.selectedCell;
    clearCell(row, col);
  };

  const handleHintPress = () => {
    if (gameState.hintsUsed >= 3) {
      Alert.alert('No More Hints', 'You have used all 3 hints for this game.');
      return;
    }
    
    Alert.alert(
      'Use Hint',
      'This will reveal one correct number. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Use Hint', onPress: getHint },
      ]
    );
  };

  const handleMenuPress = () => {
    Alert.alert(
      'Game Menu',
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'New Game', onPress: () => navigation.navigate('Home') },
        { text: 'Settings', onPress: () => navigation.navigate('Settings') },
      ]
    );
  };

  const handleAvatarPress = () => {
    navigation.navigate('PlayerStats');
  };

  return (
    <LinearGradient
      colors={['#6F4E6B', '#9C5C74']}
      style={styles.container}
    >
      <GameHeader
        elapsedTime={gameState.elapsedTime}
        hintsUsed={gameState.hintsUsed}
        mistakes={gameState.mistakes}
        onHintPress={handleHintPress}
        onMenuPress={handleMenuPress}
        onAvatarPress={handleAvatarPress}
        showTimer={settings.showTimer}
        showHints={settings.showHints}
        isComplete={gameState.isComplete}
        currentUser={currentUser}
      />

      <View style={styles.gameContainer}>
        <SudokuBoard
          board={gameState.board}
          selectedCell={gameState.selectedCell}
          onCellPress={handleCellPress}
          highlightConflicts={settings.highlightConflicts}
        />

        <NumberPad
          onNumberPress={handleNumberPress}
          onClearPress={handleClearPress}
          isNotesMode={gameState.isNotesMode}
          onToggleNotes={toggleNotesMode}
          disabled={gameState.isComplete}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
