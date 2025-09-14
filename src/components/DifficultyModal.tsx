import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';

interface DifficultyModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDifficulty: (difficulty: string) => void;
}

export default function DifficultyModal({ visible, onClose, onSelectDifficulty }: DifficultyModalProps) {
  const difficulties = [
    { key: 'EASY', name: 'Easy', icon: 'leaf' as keyof typeof Ionicons.glyphMap, color: '#4CAF50' },
    { key: 'MEDIUM', name: 'Medium', icon: 'flame' as keyof typeof Ionicons.glyphMap, color: '#FF9800' },
    { key: 'HARD', name: 'Hard', icon: 'skull' as keyof typeof Ionicons.glyphMap, color: '#F44336' },
  ];

  const handleDifficultySelect = (difficulty: string) => {
    onSelectDifficulty(difficulty);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#6F4E6B', '#9C5C74']}
            style={styles.modalContent}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Select Difficulty</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.difficultyContainer}>
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty.key}
                  title={difficulty.name}
                  onPress={() => handleDifficultySelect(difficulty.key)}
                  variant="primary"
                  size="large"
                  icon={difficulty.icon}
                  fullWidth
                  style={[styles.difficultyButton, { backgroundColor: difficulty.color }] as any}
                />
              ))}
            </View>

            <Button
              title="Close"
              onPress={onClose}
              variant="secondary"
              size="medium"
              icon="close"
              fullWidth
              style={styles.closeButtonBottom}
            />
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Homenaje-Regular',
  },
  closeButton: {
    padding: 8,
  },
  difficultyContainer: {
    marginBottom: 20,
  },
  difficultyButton: {
    marginBottom: 12,
  },
  closeButtonBottom: {
    marginTop: 10,
  },
});
