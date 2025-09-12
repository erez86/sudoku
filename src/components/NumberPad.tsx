import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Button from './Button';

interface NumberPadProps {
  onNumberPress: (number: number) => void;
  onClearPress: () => void;
  isNotesMode: boolean;
  onToggleNotes: () => void;
  onResetBoard: () => void;
  onUndo: () => void;
  onAutoFill: () => void;
  disabled?: boolean;
}

const { width } = Dimensions.get('window');
const PAD_WIDTH = width - 32; // Full width minus 16px margins on each side

export default function NumberPad({ 
  onNumberPress, 
  onClearPress, 
  isNotesMode, 
  onToggleNotes,
  onResetBoard,
  onUndo,
  onAutoFill,
  disabled = false 
}: NumberPadProps) {
  const firstRowNumbers = [1, 2, 3, 4, 5];
  const secondRowNumbers = [6, 7, 8, 9];

  return (
    <View style={styles.container}>
      {/* First row of numbers (1-5) */}
      <View style={styles.numberRow}>
        {firstRowNumbers.map((number) => (
          <TouchableOpacity
            key={number}
            style={[
              styles.numberButton,
              disabled && styles.disabledButton
            ]}
            onPress={() => !disabled && onNumberPress(number)}
            disabled={disabled}
          >
            <Text style={[
              styles.numberText,
              disabled && styles.disabledText
            ]}>
              {number}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Second row of numbers (6-9) */}
      <View style={styles.numberRow}>
        {secondRowNumbers.map((number) => (
          <TouchableOpacity
            key={number}
            style={[
              styles.numberButton,
              disabled && styles.disabledButton
            ]}
            onPress={() => !disabled && onNumberPress(number)}
            disabled={disabled}
          >
            <Text style={[
              styles.numberText,
              disabled && styles.disabledText
            ]}>
              {number}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Action buttons - two columns */}
      <View style={styles.actionButtonsContainer}>
        <View style={styles.actionButtonsRow}>
          <Button
            title="Reset"
            onPress={onResetBoard}
            variant="warning"
            size="small"
            icon="refresh"
            disabled={disabled}
            style={styles.actionButton}
          />
          
          <Button
            title="Undo"
            onPress={onUndo}
            variant="secondary"
            size="small"
            icon="arrow-undo"
            disabled={disabled}
            style={styles.actionButton}
          />
        </View>
        
        <View style={styles.actionButtonsRow}>
          <Button
            title={isNotesMode ? "Notes ✓" : "Notes"}
            onPress={onToggleNotes}
            variant={isNotesMode ? "primary" : "secondary"}
            size="small"
            icon="create"
            disabled={disabled}
            style={styles.actionButton}
          />
          
          <Button
            title="Auto Fill"
            onPress={onAutoFill}
            variant="success"
            size="small"
            icon="checkmark-circle"
            disabled={disabled}
            style={styles.actionButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: PAD_WIDTH,
    marginHorizontal: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
    gap: 8,
  },
  numberButton: {
    width: 50,
    height: 50,
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  numberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D1B69',
    fontFamily: 'PoiretOne_400Regular',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
  actionButtonsContainer: {
    width: '100%',
    marginTop: 10,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    minHeight: 40,
  },
});
