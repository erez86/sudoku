import React from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGameState } from '../hooks/useGameState';
import { DIFFICULTY_LEVELS } from '../utils/sudokuLogic';
import Button from '../components/Button';

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { gameState, startNewGame } = useGameState();

  const handleNewGame = (difficulty: string) => {
    startNewGame(difficulty);
    navigation.navigate('Game');
  };

  const handleContinueGame = () => {
    if (gameState.board.some(row => row.some(cell => cell.value !== 0))) {
      navigation.navigate('Game');
    } else {
      Alert.alert('No Game in Progress', 'Start a new game to begin playing!');
    }
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const hasGameInProgress = gameState.board.some(row => row.some(cell => cell.value !== 0));

  return (
    <LinearGradient
      colors={['#6F4E6B', '#9C5C74']}
      style={styles.container}
    >
      {/* Header with profile picture and name */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.profilePicture}>
            <Ionicons name="person" size={24} color="white" />
          </View>
          <Text style={styles.profileName}>Jack Sparrow</Text>
        </View>
      </View>

      {/* Main title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>SUDOKU</Text>
      </View>

      {/* Menu buttons */}
      <View style={styles.menuContainer}>
        <Button
          title="START GAME"
          onPress={() => handleNewGame('Easy')}
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
          title="OPTIONS"
          onPress={handleSettings}
          variant="warning"
          size="large"
          icon="settings"
          fullWidth
          style={styles.menuButton}
        />

        <Button
          title="EXIT GAME"
          onPress={() => {}}
          variant="info"
          size="large"
          icon="power"
          fullWidth
          style={styles.menuButton}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingLeft: 20,
    paddingBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A4A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'PoiretOne_400Regular',
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
    fontFamily: 'PoiretOne_400Regular',
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
