import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Button from './Button';

interface NumberPadProps {
  onNumberPress: (number: number) => void;
  onClearPress: () => void;
  isNotesMode: boolean;
  onToggleNotes: () => void;
  disabled?: boolean;
}

const { width } = Dimensions.get('window');
const PAD_WIDTH = width * 0.9;

export default function NumberPad({ 
  onNumberPress, 
  onClearPress, 
  isNotesMode, 
  onToggleNotes,
  disabled = false 
}: NumberPadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <View style={styles.container}>
      {/* First row: 1-5 */}
      <View style={styles.numbersRow}>
        {numbers.slice(0, 5).map((number) => (
          <Button
            key={number}
            title={number.toString()}
            onPress={() => onNumberPress(number)}
            variant="info"
            size="medium"
            disabled={disabled}
            circular
            style={styles.numberButton}
          />
        ))}
      </View>
      
      {/* Second row: 6-9 */}
      <View style={styles.numbersRow}>
        {numbers.slice(5, 9).map((number) => (
          <Button
            key={number}
            title={number.toString()}
            onPress={() => onNumberPress(number)}
            variant="info"
            size="medium"
            disabled={disabled}
            circular
            style={styles.numberButton}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: PAD_WIDTH,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  numbersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: '100%',
  },
  numberButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 60,
  },
});
