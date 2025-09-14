import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, BackHandler, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGameState } from '../hooks/useGameState';
import { useModal } from '../hooks/useModal';
import { DIFFICULTY_LEVELS } from '../utils/sudokuLogic';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import DifficultyModal from '../components/DifficultyModal';
import CustomModal from '../components/Modal';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { gameState, startNewGame, currentUser, userLoading } = useGameState();
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const { modalState, hideModal, showAlert, showConfirm } = useModal();

  const handleNewGame = (difficulty: string) => {
    startNewGame(difficulty);
    navigation.navigate('Game');
  };

  const handleStartGamePress = () => {
    setShowDifficultyModal(true);
  };

  const handleContinueGame = () => {
    if (gameState.board.some(row => row.some(cell => cell.value !== 0))) {
      navigation.navigate('Game');
    } else {
      showAlert('No Game in Progress', 'Start a new game to begin playing!');
    }
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleRules = () => {
    navigation.navigate('Rules');
  };

  const handleAvatarPress = () => {
    navigation.navigate('PlayerStats');
  };

  const handleExitGame = () => {
    showConfirm(
      'Exit Game',
      'Are you sure you want to exit the game?',
      () => {
        if (Platform.OS === 'android') {
          BackHandler.exitApp();
        } else {
          // On iOS, we can't programmatically exit the app
          // Show a message to the user
          showAlert(
            'Exit Game',
            'Please use the home button or swipe up to exit the app.'
          );
        }
      }
    );
  };

  const hasGameInProgress = gameState.board.some(row => row.some(cell => cell.value !== 0));

  // Show loading state while user data is being loaded
  if (userLoading || !currentUser) {
    return (
      <LinearGradient colors={['#6F4E6B', '#9C5C74']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#6F4E6B', '#9C5C74']}
      style={styles.container}
    >
      {/* Header with profile picture and name */}
      <View style={styles.header}>
        <Avatar
          key={currentUser?.user?.id || 'default'}
          name={currentUser?.user?.name || 'Player'}
          avatar={currentUser?.user?.avatar || 'person'}
          size="medium"
          onPress={handleAvatarPress}
        />
      </View>

      {/* Main title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>SUDOKU</Text>
      </View>

      {/* Menu buttons */}
      <View style={styles.menuContainer}>
        <Button
          title="START GAME"
          onPress={handleStartGamePress}
          variant="primary"
          size="large"
          icon="play"
          fullWidth
          style={styles.menuButton}
        />

        <Button
          title="TIPS"
          onPress={() => {}}
          variant="secondary"
          size="large"
          icon="bulb"
          fullWidth
          style={styles.menuButton}
        />

        <Button
          title="RULES"
          onPress={handleRules}
          variant="success"
          size="large"
          icon="book"
          fullWidth
          style={styles.menuButton}
        />

        <Button
          title="SETTINGS"
          onPress={handleSettings}
          variant="warning"
          size="large"
          icon="settings"
          fullWidth
          style={styles.menuButton}
        />

        <Button
          title="EXIT GAME"
          onPress={handleExitGame}
          variant="info"
          size="large"
          icon="power"
          fullWidth
          style={styles.menuButton}
        />
      </View>

      <DifficultyModal
        visible={showDifficultyModal}
        onClose={() => setShowDifficultyModal(false)}
        onSelectDifficulty={handleNewGame}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Homenaje-Regular',
  },
  header: {
    paddingTop: 60,
    paddingLeft: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
    letterSpacing: 2,
    fontFamily: 'Homenaje-Regular',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  menuButton: {
    marginBottom: 15,
  },
});
