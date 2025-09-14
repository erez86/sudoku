import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { BackHandler, Platform, StyleSheet, View } from 'react-native';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import DifficultyModal from '../components/DifficultyModal';
import CustomModal from '../components/Modal';
import { Body, Display } from '../components/Typography';
import { useGameState } from '../hooks/useGameState';
import { useModal } from '../hooks/useModal';

export default function HomeScreen() {
  const router = useRouter();
  const { startNewGame, currentUser, userLoading } = useGameState();
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const { modalState, hideModal, showAlert, showConfirm } = useModal();

  const handleNewGame = (difficulty: string) => {
    startNewGame(difficulty as 'EASY' | 'MEDIUM' | 'HARD');
    router.push('/game');
  };

  const handleStartGamePress = () => {
    setShowDifficultyModal(true);
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleRules = () => {
    router.push('/rules');
  };

  const handleAvatarPress = () => {
    router.push('/player-stats');
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

  // Show loading state while user data is being loaded
  if (userLoading || !currentUser) {
    return (
      <LinearGradient colors={['#6F4E6B', '#9C5C74']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Body color="white">Loading...</Body>
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
        <Display color="black">SUDOKU</Display>
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
  header: {
    paddingTop: 60,
    paddingLeft: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
