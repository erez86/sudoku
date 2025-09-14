import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import GameHeader from '../../components/GameHeader';
import CustomModal from '../../components/Modal';
import NumberPad from '../../components/NumberPad';
import SudokuBoard from '../../components/SudokuBoard';
import { useGameState } from '../../hooks/useGameState';
import { useModal } from '../../hooks/useModal';

export default function GameScreen() {
  const router = useRouter();
  const {
    gameState,
    settings,
    currentUser,
    setCellValue,
    clearCell,
    toggleNotesMode,
    setSelectedCell,
    getHint,
    undo,
    autoFill,
    clearGame,
  } = useGameState();

  const { modalState, hideModal, showAlert, showConfirm, showActionSheet } = useModal();

  // Handle back button
  useEffect(() => {
    const backAction = () => {
      showConfirm(
        'Exit Game',
        'Are you sure you want to exit? Your progress will be saved.',
        () => router.back()
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [router, showConfirm]);

  // Show completion alert
  useEffect(() => {
    if (gameState.isComplete) {
      const timeString = `${Math.floor(gameState.elapsedTime / 60)}:${(gameState.elapsedTime % 60).toString().padStart(2, '0')}`;
      showActionSheet(
        'Congratulations!',
        `${currentUser?.user?.name || 'Player'}, you solved the ${gameState.difficulty} puzzle in ${timeString}!`,
        [
          { text: 'New Game', onPress: () => router.push('/') },
          { text: 'View Stats', onPress: () => router.push('/player-stats') },
          { text: 'Continue', onPress: () => {}, style: 'cancel' },
        ]
      );
    }
  }, [gameState.isComplete, gameState.difficulty, gameState.elapsedTime, currentUser, router, showActionSheet]);

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
      showAlert('No More Hints', 'You have used all 3 hints for this game.');
      return;
    }
    
    showConfirm(
      'Use Hint',
      'This will reveal one correct number. Continue?',
      getHint
    );
  };

  const handleMenuPress = () => {
    showActionSheet(
      'Game Menu',
      'What would you like to do?',
      [
        { text: 'Exit Game', onPress: () => router.back(), style: 'destructive' },
        { text: 'Rules', onPress: () => router.push('/rules'), style: 'secondary' },
        { text: 'Settings', onPress: () => router.push('/settings') },
        { text: 'Close', onPress: () => {}, style: 'cancel' },
      ]
    );
  };

  const handleAvatarPress = () => {
    router.push('/player-stats');
  };

  const handleResetBoard = () => {
    showConfirm(
      'Reset Board',
      'Are you sure you want to reset the board? This will clear all your progress.',
      clearGame
    );
  };

  const handleAutoFill = () => {
    showConfirm(
      'Auto Fill Board',
      'This will fill in all remaining cells with the correct solution. Are you sure?',
      autoFill
    );
  };

  return (
    <LinearGradient
      colors={['#87CEEB', '#B0E0E6', '#E0F6FF']}
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
        onResetBoard={handleResetBoard}
        onUndo={undo}
        onAutoFill={handleAutoFill}
        disabled={gameState.isComplete}
      />

      <CustomModal
        visible={modalState.visible}
        title={modalState.title}
        message={modalState.message}
        buttons={modalState.buttons}
        onClose={hideModal}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
  },
});
