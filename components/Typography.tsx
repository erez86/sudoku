import React from 'react';
import { Platform, StyleSheet, Text, TextStyle } from 'react-native';

interface TypographyProps {
  children: React.ReactNode;
  color?: string;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  numberOfLines?: number;
  onPress?: () => void;
  style?: TextStyle;
}

// Display Typography - For main titles and large headings
export const Display: React.FC<TypographyProps> = ({
  children,
  color = 'black',
  fontWeight = 'bold',
  fontStyle = 'normal',
  textDecorationLine = 'none',
  textAlign = 'center',
  numberOfLines,
  onPress,
  style,
}) => {
  return (
    <Text
      style={[
        styles.display,
        {
          color,
          fontWeight,
          fontStyle,
          textDecorationLine,
          textAlign,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  );
};

// Heading Typography - For section titles and medium headings
export const Heading: React.FC<TypographyProps> = ({
  children,
  color = 'black',
  fontWeight = 'bold',
  fontStyle = 'normal',
  textDecorationLine = 'none',
  textAlign = 'left',
  numberOfLines,
  onPress,
  style,
}) => {
  return (
    <Text
      style={[
        styles.heading,
        {
          color,
          fontWeight,
          fontStyle,
          textDecorationLine,
          textAlign,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  );
};

// Body Typography - For regular text content
export const Body: React.FC<TypographyProps> = ({
  children,
  color = 'black',
  fontWeight = 'normal',
  fontStyle = 'normal',
  textDecorationLine = 'none',
  textAlign = 'left',
  numberOfLines,
  onPress,
  style,
}) => {
  return (
    <Text
      style={[
        styles.body,
        {
          color,
          fontWeight,
          fontStyle,
          textDecorationLine,
          textAlign,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  );
};

// Caption Typography - For small text and captions
export const Caption: React.FC<TypographyProps> = ({
  children,
  color = '#666',
  fontWeight = 'normal',
  fontStyle = 'normal',
  textDecorationLine = 'none',
  textAlign = 'left',
  numberOfLines,
  onPress,
  style,
}) => {
  return (
    <Text
      style={[
        styles.caption,
        {
          color,
          fontWeight,
          fontStyle,
          textDecorationLine,
          textAlign,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  );
};

// Label Typography - For form labels and small headings
export const Label: React.FC<TypographyProps> = ({
  children,
  color = 'black',
  fontWeight = '600',
  fontStyle = 'normal',
  textDecorationLine = 'none',
  textAlign = 'left',
  numberOfLines,
  onPress,
  style,
}) => {
  return (
    <Text
      style={[
        styles.label,
        {
          color,
          fontWeight,
          fontStyle,
          textDecorationLine,
          textAlign,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  );
};

// Button Typography - For button text
export const ButtonText: React.FC<TypographyProps> = ({
  children,
  color = 'black',
  fontWeight = 'bold',
  fontStyle = 'normal',
  textDecorationLine = 'none',
  textAlign = 'center',
  numberOfLines,
  onPress,
  style,
}) => {
  return (
    <Text
      style={[
        styles.buttonText,
        {
          color,
          fontWeight,
          fontStyle,
          textDecorationLine,
          textAlign,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontFamily: Platform.select({
      android: 'Quicksand',
      ios: 'Quicksand-Bold',
    }),
    fontWeight: '700',
    letterSpacing: 2,
  },
  heading: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: Platform.select({
      android: 'Quicksand',
      ios: 'Quicksand-SemiBold',
    }),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Platform.select({
      android: 'Quicksand',
      ios: 'Quicksand-Regular',
    }),
    fontWeight: '400',
    letterSpacing: 0,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: Platform.select({
      android: 'Quicksand',
      ios: 'Quicksand-Regular',
    }),
    fontWeight: '400',
    letterSpacing: 0,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Platform.select({
      android: 'Quicksand',
      ios: 'Quicksand-SemiBold',
    }),
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Platform.select({
      android: 'Quicksand',
      ios: 'Quicksand-SemiBold',
    }),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
