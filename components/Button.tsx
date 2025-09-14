import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { ButtonText } from './Typography';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  circular?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
  circular = false,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.button, styles[`${variant}Button`], styles[`${size}Button`]];
    
    if (circular) {
      baseStyle.push(styles.circular);
    }
    
    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle: any[] = [styles.text, styles[`${variant}Text`], styles[`${size}Text`]];
    
    if (disabled) {
      baseTextStyle.push(styles.disabledText);
    }
    
    if (textStyle) {
      baseTextStyle.push(textStyle);
    }
    
    return baseTextStyle;
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
    const iconColor = disabled ? '#999' : variant === 'primary' ? 'white' : '#2D1B69';
    
    // For icon-only buttons, don't add margins
    const iconStyle = title ? 
      (iconPosition === 'right' ? styles.iconRight : styles.iconLeft) : 
      styles.iconOnly;
    
    return (
      <Ionicons 
        name={icon} 
        size={iconSize} 
        color={iconColor}
        style={iconStyle}
      />
    );
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {title ? (
        <>
          {icon && iconPosition === 'left' && renderIcon()}
          <ButtonText style={[getTextStyle(), { flex: 1 } as any]}>{title}</ButtonText>
          {icon && iconPosition === 'right' && renderIcon()}
        </>
      ) : (
        renderIcon()
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    elevation: 0, // Flat style - no elevation
    shadowOpacity: 0, // Flat style - no shadow
  },
  
  // Variant styles
  primaryButton: {
    backgroundColor: '#FF6B6B', // Red/coral
  },
  secondaryButton: {
    backgroundColor: '#4ECDC4', // Teal
  },
  dangerButton: {
    backgroundColor: '#FF5722', // Red
  },
  successButton: {
    backgroundColor: '#4CAF50', // Green
  },
  warningButton: {
    backgroundColor: '#FFE66D', // Yellow
  },
  infoButton: {
    backgroundColor: '#95A5A6', // Gray
  },
  
  // Size styles
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  
  // State styles
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  circular: {
    borderRadius: 30,
  },
  
  // Text styles
  text: {
    fontFamily: 'Quicksand-SemiBold',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Text variant styles
  primaryText: {
    color: 'black',
  },
  secondaryText: {
    color: 'black',
  },
  dangerText: {
    color: 'black',
  },
  successText: {
    color: 'black',
  },
  warningText: {
    color: '#2D1B69',
  },
  infoText: {
    color: 'black',
  },
  
  // Text size styles
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  disabledText: {
    color: '#666',
  },
  
  // Icon styles
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  iconOnly: {
    // No margins for icon-only buttons to ensure perfect centering
  },
});
