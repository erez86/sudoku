import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Cell } from '../types/game';

interface SudokuBoardProps {
  board: Cell[][];
  selectedCell: { row: number; col: number } | null;
  onCellPress: (row: number, col: number) => void;
  highlightConflicts: boolean;
}

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.9;
const CELL_SIZE = BOARD_SIZE / 9;

export default function SudokuBoard({ 
  board, 
  selectedCell, 
  onCellPress, 
  highlightConflicts 
}: SudokuBoardProps) {
  
  const renderCell = (cell: Cell, row: number, col: number) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isInSameRow = selectedCell?.row === row;
    const isInSameCol = selectedCell?.col === col;
    const isInSameBox = 
      Math.floor(selectedCell?.row || 0 / 3) === Math.floor(row / 3) &&
      Math.floor(selectedCell?.col || 0 / 3) === Math.floor(col / 3);
    
    const isHighlighted = isSelected || isInSameRow || isInSameCol;
    
    // Determine border styles for 3x3 grid separation
    const isBoxBottom = (row + 1) % 3 === 0 && row < 8;
    const isBoxRight = (col + 1) % 3 === 0 && col < 8;
    
    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          styles.cell,
          {
            width: CELL_SIZE,
            height: CELL_SIZE,
            backgroundColor: isSelected ? '#E3F2FD' : isHighlighted ? '#F5F5F5' : 'white',
            borderRightWidth: isBoxRight ? 2 : 1,
            borderBottomWidth: isBoxBottom ? 2 : 1,
            borderColor: '#CCCCCC',
          },
          // Highlight conflicts
          highlightConflicts && cell.hasConflict && styles.conflictCell,
        ]}
        onPress={() => onCellPress(row, col)}
      >
        {cell.value !== 0 ? (
          <Text
            style={[
              styles.cellText,
              {
                color: cell.isGiven ? '#000' : '#333',
                fontWeight: cell.isGiven ? 'bold' : 'normal',
              },
            ]}
          >
            {cell.value}
          </Text>
        ) : cell.notes.length > 0 ? (
          <View style={styles.notesContainer}>
            {cell.notes.map((note, index) => (
              <Text key={index} style={styles.noteText}>
                {note}
              </Text>
            ))}
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    
  },
  board: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  conflictCell: {
    backgroundColor: '#FFCDD2',
  },
  cellText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'PoiretOne_600Regular',
  },
  notesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    padding: 2,
  },
  noteText: {
    fontSize: 8,
    color: '#666',
    width: '33.33%',
    textAlign: 'center',
    lineHeight: 10,
    fontFamily: 'PoiretOne_400Regular',
  },
});
