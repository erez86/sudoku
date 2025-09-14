import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Button from '../../components/Button';
import CustomModal from '../../components/Modal';
import { useModal } from '../../hooks/useModal';
import { useUserManagement } from '../../hooks/useUserManagement';
import { formatTime } from '../../utils/sudokuLogic';

export default function PlayerStatsScreen() {
  const router = useRouter();
  const {
    users,
    currentUser,
    addUser,
    switchUser,
    deleteUser,
    isLoading,
  } = useUserManagement();

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserAvatar, setNewUserAvatar] = useState('person');
  const { modalState, hideModal, showAlert, showDestructiveConfirm } = useModal();

  const avatarOptions = [
    'person', 'person-circle', 'happy', 'star', 'heart', 'diamond',
    'flame', 'leaf', 'snow', 'sunny', 'moon', 'flash'
  ];

  const handleAddUser = async () => {
    if (!newUserName.trim()) {
      showAlert('Error', 'Please enter a name for the new user');
      return;
    }

    try {
      await addUser(newUserName.trim(), newUserAvatar);
      setNewUserName('');
      setNewUserAvatar('person');
      setShowAddUserModal(false);
      showAlert('Success', 'New user created successfully!');
    } catch (error) {
      showAlert('Error', 'Failed to create new user');
    }
  };

  const handleSwitchUser = async (userId: string) => {
    try {
      await switchUser(userId);
      showAlert('Success', 'User switched successfully!');
    } catch (error) {
      showAlert('Error', 'Failed to switch user');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (users.length <= 1) {
      showAlert('Error', 'Cannot delete the last user');
      return;
    }

    showDestructiveConfirm(
      'Delete User',
      `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      async () => {
        try {
          await deleteUser(userId);
          showAlert('Success', 'User deleted successfully!');
        } catch (error) {
          showAlert('Error', 'Failed to delete user');
        }
      }
    );
  };

  const getDifficultyStats = (difficulty: string) => {
    if (!currentUser?.stats.gamesByDifficulty[difficulty]) {
      return {
        gamesPlayed: 0,
        totalTime: 0,
        bestTime: 0,
        averageTime: 0,
      };
    }
    return currentUser.stats.gamesByDifficulty[difficulty];
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#6F4E6B', '#9C5C74']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#6F4E6B', '#9C5C74']} style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        removeClippedSubviews={Platform.OS === 'android'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Button
            onPress={() => router.back()}
            variant="info"
            size="small"
            icon="arrow-back"
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Player Statistics</Text>
          <Button
            onPress={() => setShowAddUserModal(true)}
            variant="success"
            size="small"
            icon="add"
            style={styles.addButton}
          />
        </View>

        {/* Current User Stats */}
        {currentUser && (
          <View style={styles.currentUserSection}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Ionicons name={currentUser.user.avatar as any} size={40} color="white" />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{currentUser.user.name}</Text>
                <Text style={styles.userSubtext}>
                  Playing since {new Date(currentUser.user.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {/* Overall Stats */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{currentUser.stats.totalGamesPlayed}</Text>
                <Text style={styles.statLabel}>Games Played</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formatTime(currentUser.stats.totalTimePlayed)}</Text>
                <Text style={styles.statLabel}>Total Time</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{currentUser.stats.totalHintsUsed}</Text>
                <Text style={styles.statLabel}>Hints Used</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{currentUser.stats.totalMistakes}</Text>
                <Text style={styles.statLabel}>Mistakes</Text>
              </View>
            </View>

            {/* Difficulty Stats */}
            <View style={styles.difficultySection}>
              <Text style={styles.sectionTitle}>Difficulty Breakdown</Text>
              {['Easy', 'Medium', 'Hard', 'Expert'].map((difficulty) => {
                const stats = getDifficultyStats(difficulty);
                return (
                  <View key={difficulty} style={styles.difficultyCard}>
                    <Text style={styles.difficultyName}>{difficulty}</Text>
                    <View style={styles.difficultyStats}>
                      <Text style={styles.difficultyStat}>
                        Games: {stats.gamesPlayed}
                      </Text>
                      <Text style={styles.difficultyStat}>
                        Best: {stats.bestTime === Infinity ? 'N/A' : formatTime(stats.bestTime)}
                      </Text>
                      <Text style={styles.difficultyStat}>
                        Avg: {stats.averageTime === 0 ? 'N/A' : formatTime(Math.round(stats.averageTime))}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Switch User Section */}
        <View style={styles.switchUserSection}>
          <Text style={styles.sectionTitle}>Switch User</Text>
          {users.map((user) => (
            <TouchableOpacity
              key={user.user.id}
              style={[
                styles.userItem,
                currentUser?.user.id === user.user.id && styles.currentUserItem,
              ]}
              onPress={() => handleSwitchUser(user.user.id)}
            >
              <View style={styles.userItemContent}>
                <View style={styles.userItemAvatar}>
                  <Ionicons name={user.user.avatar as any} size={24} color="white" />
                </View>
                <View style={styles.userItemDetails}>
                  <Text style={styles.userItemName}>{user.user.name}</Text>
                  <Text style={styles.userItemStats}>
                    {user.stats.totalGamesPlayed} games • {formatTime(user.stats.totalTimePlayed)}
                  </Text>
                </View>
                {currentUser?.user.id === user.user.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                )}
              </View>
              {users.length > 1 && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteUser(user.user.id, user.user.name)}
                >
                  <Ionicons name="trash" size={16} color="#F44336" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add User Modal */}
      <Modal
        visible={showAddUserModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddUserModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New User</Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Enter user name"
              value={newUserName}
              onChangeText={setNewUserName}
              placeholderTextColor="#999"
            />

            <Text style={styles.avatarLabel}>Choose Avatar:</Text>
            <View style={styles.avatarGrid}>
              {avatarOptions.map((avatar) => (
                <TouchableOpacity
                  key={avatar}
                  style={[
                    styles.avatarOption,
                    newUserAvatar === avatar && styles.selectedAvatar,
                  ]}
                  onPress={() => setNewUserAvatar(avatar)}
                >
                  <Ionicons name={avatar as any} size={24} color="white" />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowAddUserModal(false)}
                variant="secondary"
                style={styles.modalButton}
              />
              <Button
                title="Add User"
                onPress={handleAddUser}
                variant="primary"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

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
    ...(Platform.OS === 'android' && {
      minHeight: '100%',
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 40,
  },
  headerTitle: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Quicksand-Regular',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 40,
  },
  currentUserSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A4A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Quicksand-Regular',
  },
  userSubtext: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#3D2A7A',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  statValue: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Quicksand-Regular',
  },
  statLabel: {
    color: '#333',
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'Quicksand-Regular',
  },
  difficultySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'Quicksand-Regular',
  },
  difficultyCard: {
    backgroundColor: '#3D2A7A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  difficultyName: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Quicksand-Regular',
  },
  difficultyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyStat: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
  },
  switchUserSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  userItem: {
    backgroundColor: '#3D2A7A',
    borderRadius: 12,
    marginBottom: 10,
    position: 'relative',
  },
  currentUserItem: {
    backgroundColor: '#4A2C5A',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  userItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  userItemAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A4A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  userItemDetails: {
    flex: 1,
  },
  userItemName: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Quicksand-Regular',
  },
  userItemStats: {
    color: '#333',
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'Quicksand-Regular',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#3D2A7A',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Quicksand-Regular',
  },
  textInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    color: 'black',
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'Quicksand-Regular',
  },
  avatarLabel: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Quicksand-Regular',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  avatarOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A4A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  selectedAvatar: {
    backgroundColor: '#4CAF50',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});
