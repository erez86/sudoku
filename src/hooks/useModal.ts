import { useState, useCallback } from 'react';

interface ModalButton {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive' | 'secondary';
}

interface ModalState {
  visible: boolean;
  title: string;
  message: string;
  buttons: ModalButton[];
}

export function useModal() {
  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    title: '',
    message: '',
    buttons: []
  });

  const showModal = useCallback((
    title: string, 
    message: string, 
    buttons: ModalButton[]
  ) => {
    setModalState({
      visible: true,
      title,
      message,
      buttons
    });
  }, []);

  const hideModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      visible: false
    }));
  }, []);

  // Convenience methods for common alert patterns
  const showAlert = useCallback((
    title: string, 
    message: string, 
    onPress?: () => void
  ) => {
    showModal(title, message, [
      { text: 'OK', onPress: onPress || (() => {}) }
    ]);
  }, [showModal]);

  const showConfirm = useCallback((
    title: string, 
    message: string, 
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    showModal(title, message, [
      { text: 'Cancel', onPress: onCancel || (() => {}), style: 'cancel' },
      { text: 'Confirm', onPress: onConfirm, style: 'default' }
    ]);
  }, [showModal]);

  const showDestructiveConfirm = useCallback((
    title: string, 
    message: string, 
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    showModal(title, message, [
      { text: 'Cancel', onPress: onCancel || (() => {}), style: 'cancel' },
      { text: 'Delete', onPress: onConfirm, style: 'destructive' }
    ]);
  }, [showModal]);

  const showActionSheet = useCallback((
    title: string, 
    message: string, 
    actions: Array<{ text: string; onPress: () => void; style?: 'default' | 'cancel' | 'destructive' | 'secondary' }>
  ) => {
    showModal(title, message, actions);
  }, [showModal]);

  return {
    modalState,
    showModal,
    hideModal,
    showAlert,
    showConfirm,
    showDestructiveConfirm,
    showActionSheet
  };
}
