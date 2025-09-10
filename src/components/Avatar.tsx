import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvatarProps {
  name: string;
  avatar: string;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  onPress?: () => void;
  style?: any;
}

export default function Avatar({
  name,
  avatar,
  size = 'medium',
  showName = true,
  onPress,
  style,
}: AvatarProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { width: 30, height: 30, borderRadius: 15 },
          icon: 16,
          text: 14,
        };
      case 'large':
        return {
          container: { width: 60, height: 60, borderRadius: 30 },
          icon: 32,
          text: 20,
        };
      default: // medium
        return {
          container: { width: 40, height: 40, borderRadius: 20 },
          icon: 24,
          text: 18,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const AvatarContent = () => (
    <View style={styles.avatarContainer}>
      <View style={[styles.profilePicture, sizeStyles.container]}>
        <Ionicons name={avatar as any} size={sizeStyles.icon} color="white" />
      </View>
      {showName && (
        <Text style={[styles.profileName, { fontSize: sizeStyles.text }]}>
          {name}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <AvatarContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <AvatarContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Container styles can be customized via style prop
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    backgroundColor: '#4A4A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileName: {
    color: 'black',
    fontWeight: '500',
    fontFamily: 'PoiretOne_400Regular',
  },
});
