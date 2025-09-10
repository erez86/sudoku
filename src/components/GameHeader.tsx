import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { formatTime } from '../utils/sudokuLogic';
import Button from './Button';
import Avatar from './Avatar';

interface GameHeaderProps {
  elapsedTime: number;
  hintsUsed: number;
  mistakes: number;
  onHintPress: () => void;
  onMenuPress: () => void;
  onAvatarPress: () => void;
  showTimer: boolean;
  showHints: boolean;
  isComplete: boolean;
  currentUser?: any;
}

export default function GameHeader({
  elapsedTime,
  hintsUsed,
  mistakes,
  onHintPress,
  onMenuPress,
  onAvatarPress,
  showTimer,
  showHints,
  isComplete,
  currentUser
}: GameHeaderProps) {
  return (
    <LinearGradient
      colors={['#6F4E6B', '#9C5C74']}
      style={styles.container}
    >
      {/* Top header with profile and close button */}
      <View style={styles.topHeader}>
        <Avatar
          name={currentUser?.user?.name || 'Player'}
          avatar={currentUser?.user?.avatar || 'person'}
          size="small"
          showName={false}
          onPress={onAvatarPress}
        />
        
        <Text style={styles.difficultyText}>Easy</Text>
        
        <Button
          title=""
          onPress={onMenuPress}
          variant="info"
          size="small"
          icon="close"
          style={styles.closeButton}
        />
      </View>
      
      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statSection}>
          <Text style={styles.statLabel}>Error Count:</Text>
          <Text style={styles.statValue}>{mistakes}</Text>
        </View>
        
        <View style={styles.statSection}>
          <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
        </View>
        
        <View style={styles.statSection}>
          <Text style={styles.statLabel}>Hint Used:</Text>
          <Text style={styles.statValue}>{hintsUsed}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 10,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  difficultyText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'PoiretOne_400Regular',
  },
  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 35,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#3D2A7A', // Slightly lighter purple
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  statSection: {
    alignItems: 'center',
  },
  statLabel: {
    color: 'black',
    fontSize: 14,
    marginBottom: 2,
    fontFamily: 'PoiretOne_400Regular',
  },
  statValue: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'PoiretOne_400Regular',
  },
});
