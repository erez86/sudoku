import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGameState } from '../hooks/useGameState';
import { useModal } from '../hooks/useModal';
import { GameSettings } from '../types/game';
import Button from '../components/Button';
import CustomModal from '../components/Modal';

interface SettingsScreenProps {
  navigation: any;
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { settings, saveSettings, clearGame } = useGameState();
  const { modalState, hideModal, showDestructiveConfirm, showAlert } = useModal();

  const handleSettingChange = async (key: keyof GameSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    await saveSettings(newSettings);
  };

  const handleClearData = () => {
    showDestructiveConfirm(
      'Clear All Data',
      'This will delete all saved games and settings. This action cannot be undone.',
      () => {
        clearGame();
        showAlert('Success', 'All data has been cleared.');
      }
    );
  };

  const SettingItem = ({ 
    title, 
    description, 
    value, 
    onValueChange 
  }: {
    title: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E0E0E0', true: '#2196F3' }}
        thumbColor={value ? '#1976D2' : '#F4F3F4'}
      />
    </View>
  );

  return (
    <LinearGradient
      colors={['#6F4E6B', '#9C5C74']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Button
          title=""
          onPress={() => navigation.goBack()}
          variant="info"
          size="small"
          icon="arrow-back"
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Settings</Text>
          
          <SettingItem
            title="Show Timer"
            description="Display elapsed time during gameplay"
            value={settings.showTimer}
            onValueChange={(value) => handleSettingChange('showTimer', value)}
          />
          
          <SettingItem
            title="Show Hints"
            description="Enable hint button in game"
            value={settings.showHints}
            onValueChange={(value) => handleSettingChange('showHints', value)}
          />
          
          <SettingItem
            title="Highlight Conflicts"
            description="Highlight cells with invalid numbers"
            value={settings.highlightConflicts}
            onValueChange={(value) => handleSettingChange('highlightConflicts', value)}
          />
          
          <SettingItem
            title="Auto Save"
            description="Automatically save game progress"
            value={settings.autoSave}
            onValueChange={(value) => handleSettingChange('autoSave', value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound & Vibration</Text>
          
          <SettingItem
            title="Sound Effects"
            description="Play sounds for game actions"
            value={settings.soundEnabled}
            onValueChange={(value) => handleSettingChange('soundEnabled', value)}
          />
          
          <SettingItem
            title="Vibration"
            description="Vibrate for game feedback"
            value={settings.vibrationEnabled}
            onValueChange={(value) => handleSettingChange('vibrationEnabled', value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <Button
            title="Clear All Data"
            onPress={handleClearData}
            variant="danger"
            size="medium"
            icon="trash"
            fullWidth
            style={styles.dangerButton}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Sudoku Mobile v1.0.0</Text>
      </View>

      <CustomModal
        visible={modalState.visible}
        title={modalState.title}
        message={modalState.message}
        buttons={modalState.buttons}
        onClose={hideModal}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Homenaje-Regular',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
    fontFamily: 'Homenaje-Regular',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'Homenaje-Regular',
  },
  settingDescription: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Homenaje-Regular',
  },
  dangerButton: {
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Homenaje-Regular',
  },
});
