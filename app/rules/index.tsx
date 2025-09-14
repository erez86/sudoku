import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/Button';
import { Body, Display, Heading, Label } from '../../components/Typography';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.7;
const CELL_SIZE = BOARD_SIZE / 9;

// Board with given numbers (black) and empty cells (0)
const GIVEN_BOARD = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// Player-filled numbers (blue) - these will be animated
const PLAYER_FILLED_BOARD = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

const RULES = [
  {
    title: "Rule 1: No Repeats in Rows",
    description: "Each row must contain all digits from 1 to 9 without repetition",
    icon: "arrow-forward-outline",
    animationType: "row"
  },
  {
    title: "Rule 2: No Repeats in Columns", 
    description: "Each column must contain all digits from 1 to 9 without repetition",
    icon: "arrow-down-outline",
    animationType: "column"
  }
];

export default function RulesScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: Animated.Value }>({});
  const [highlightedCells, setHighlightedCells] = useState<{ row: number; col: number }[]>([]);
  const [playerFilledCells, setPlayerFilledCells] = useState<{ [key: string]: number }>({});

  // Initialize animated values for each cell
  useEffect(() => {
    const values: { [key: string]: Animated.Value } = {};
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        values[`${row}-${col}`] = new Animated.Value(0);
      }
    }
    setAnimatedValues(values);
  }, []);

  const animateCellFill = (row: number, col: number, delay: number = 0) => {
    const cellKey = `${row}-${col}`;
    if (animatedValues[cellKey]) {
      Animated.timing(animatedValues[cellKey], {
        toValue: 1,
        duration: 800,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  };

  const animateHighlight = (cells: { row: number; col: number }[]) => {
    setHighlightedCells(cells);
    setTimeout(() => setHighlightedCells([]), 2000);
  };

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPlayerFilledCells({});
    
    // Reset all animated values
    Object.values(animatedValues).forEach(value => value.setValue(0));
    
    // Animate filling only the empty cells (player-filled numbers)
    let delay = 0;
    const newPlayerFilled: { [key: string]: number } = {};
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (GIVEN_BOARD[row][col] === 0) {
          // This is an empty cell that should be filled by player
          const cellKey = `${row}-${col}`;
          newPlayerFilled[cellKey] = PLAYER_FILLED_BOARD[row][col];
          animateCellFill(row, col, delay);
          delay += 200;
        }
      }
    }
    
    // Update player filled cells after animation starts
    setTimeout(() => {
      setPlayerFilledCells(newPlayerFilled);
    }, delay / 2);
    
    // Complete animation after all cells are filled
    setTimeout(() => setIsAnimating(false), delay + 1000);
  };

  const demonstrateRule = (ruleIndex: number) => {
    setCurrentStep(ruleIndex);
    
    // Reset player filled cells
    setPlayerFilledCells({});
    
    // Reset all animated values
    Object.values(animatedValues).forEach(value => value.setValue(0));
    
    const rule = RULES[ruleIndex];
    const newPlayerFilled: { [key: string]: number } = {};
    
    if (rule.animationType === "row") {
      // Animate filling empty cells in the first row
      const targetRow = 0;
      let delay = 0;
      
      // Animate only empty cells in the row
      for (let col = 0; col < 9; col++) {
        if (GIVEN_BOARD[targetRow][col] === 0) {
          const cellKey = `${targetRow}-${col}`;
          newPlayerFilled[cellKey] = PLAYER_FILLED_BOARD[targetRow][col];
          animateCellFill(targetRow, col, delay);
          delay += 300;
        }
      }
      
      // Update player filled cells
      setTimeout(() => {
        setPlayerFilledCells(newPlayerFilled);
      }, delay / 2);
      
      // Highlight the row
      animateHighlight([
        { row: targetRow, col: 0 }, { row: targetRow, col: 1 }, { row: targetRow, col: 2 },
        { row: targetRow, col: 3 }, { row: targetRow, col: 4 }, { row: targetRow, col: 5 },
        { row: targetRow, col: 6 }, { row: targetRow, col: 7 }, { row: targetRow, col: 8 }
      ]);
      
    } else if (rule.animationType === "column") {
      // Animate filling empty cells in the first column
      const targetCol = 0;
      let delay = 0;
      
      // Animate only empty cells in the column
      for (let row = 0; row < 9; row++) {
        if (GIVEN_BOARD[row][targetCol] === 0) {
          const cellKey = `${row}-${targetCol}`;
          newPlayerFilled[cellKey] = PLAYER_FILLED_BOARD[row][targetCol];
          animateCellFill(row, targetCol, delay);
          delay += 300;
        }
      }
      
      // Update player filled cells
      setTimeout(() => {
        setPlayerFilledCells(newPlayerFilled);
      }, delay / 2);
      
      // Highlight the column
      animateHighlight([
        { row: 0, col: targetCol }, { row: 1, col: targetCol }, { row: 2, col: targetCol },
        { row: 3, col: targetCol }, { row: 4, col: targetCol }, { row: 5, col: targetCol },
        { row: 6, col: targetCol }, { row: 7, col: targetCol }, { row: 8, col: targetCol }
      ]);
    }
  };

  const renderDemoCell = (value: number, row: number, col: number) => {
    const isHighlighted = highlightedCells.some(cell => cell.row === row && cell.col === col);
    const isBoxBottom = (row + 1) % 3 === 0 && row < 8;
    const isBoxRight = (col + 1) % 3 === 0 && col < 8;
    
    const cellKey = `${row}-${col}`;
    const isGiven = GIVEN_BOARD[row][col] !== 0;
    const playerValue = playerFilledCells[cellKey];
    
    // Always show given numbers, show player numbers if they exist
    const displayValue = isGiven ? GIVEN_BOARD[row][col] : (playerValue || 0);
    
    const animatedValue = animatedValues[cellKey];
    const scale = animatedValue ? animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    }) : 1;

    return (
      <Animated.View
        key={cellKey}
        style={[
          styles.demoCell,
          {
            width: CELL_SIZE,
            height: CELL_SIZE,
            backgroundColor: isHighlighted ? '#FFE082' : 'white',
            borderRightWidth: isBoxRight ? 2 : 1,
            borderBottomWidth: isBoxBottom ? 2 : 1,
            borderColor: '#CCCCCC',
            transform: [{ scale }],
          },
        ]}
      >
        {displayValue !== 0 && (
          <Text style={[
            styles.demoCellText,
            { color: isGiven ? 'black' : 'blue' }
          ]}>
            {displayValue}
          </Text>
        )}
      </Animated.View>
    );
  };

  return (
    <LinearGradient colors={['#6F4E6B', '#9C5C74']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Display color="white" style={{ fontSize: 28 }}>SUDOKU RULES</Display>
        </View>

        {/* Demo Board */}
        <View style={styles.demoSection}>
          <Heading color="white">Interactive Demo</Heading>
          <View style={styles.boardContainer}>
            <View style={[styles.demoBoard, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
              {GIVEN_BOARD.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.demoRow}>
                  {row.map((cell, colIndex) => renderDemoCell(cell, rowIndex, colIndex))}
                </View>
              ))}
            </View>
          </View>
          <Button
            title={isAnimating ? "Animating..." : "Watch Demo"}
            onPress={startAnimation}
            variant="primary"
            size="medium"
            icon="play"
            disabled={isAnimating}
            style={styles.demoButton}
          />
        </View>

        {/* Rules List */}
        <View style={styles.rulesSection}>
          <Heading color="white">The Rules</Heading>
          {RULES.map((rule, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.ruleCard,
                currentStep === index && styles.activeRuleCard
              ]}
              onPress={() => demonstrateRule(index)}
            >
              <View style={styles.ruleHeader}>
                <Ionicons 
                  name={rule.icon as any} 
                  size={24} 
                  color={currentStep === index ? '#333' : '#666'} 
                />
                <Label style={[
                  styles.ruleTitle,
                  currentStep === index && styles.activeRuleTitle
                ] as any}>
                  {rule.title}
                </Label>
              </View>
              <Body style={styles.ruleDescription}>{rule.description}</Body>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Heading color="white">Pro Tips</Heading>
          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={20} color="#FFC107" />
            <Body color="white" style={styles.tipText}>
              Start by looking for cells that can only have one possible number
            </Body>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="search" size={20} color="#FFC107" />
            <Body color="white" style={styles.tipText}>
              Use the process of elimination to narrow down possibilities
            </Body>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="checkmark-circle" size={20} color="#FFC107" />
            <Body color="white" style={styles.tipText}>
              Take your time - there's no time limit in Sudoku!
            </Body>
          </View>
        </View>

        {/* Back to Game Button */}
        <View style={styles.actionSection}>
          <Button
            title="START PLAYING"
            onPress={() => router.push('/')}
            variant="success"
            size="large"
            icon="play"
            fullWidth
            style={styles.playButton}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  demoSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  boardContainer: {
    marginBottom: 20,
  },
  demoBoard: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: 'white',
  },
  demoRow: {
    flexDirection: 'row',
  },
  demoCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoCellText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Quicksand-Regular',
  },
  demoButton: {
    marginTop: 10,
  },
  rulesSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  ruleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  activeRuleCard: {
    borderColor: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleTitle: {
    marginLeft: 12,
  },
  activeRuleTitle: {
    color: '#333',
  },
  ruleDescription: {
    lineHeight: 20,
  },
  tipsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tipText: {
    marginLeft: 12,
    flex: 1,
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  playButton: {
    marginBottom: 20,
  },
});
