import { useState } from 'react';

interface ModalState {
  visible: boolean;
  title: string;
  message: string;
  buttons: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive' | 'secondary';
  }>;
}

const initialModalState: ModalState = {
  visible: false,
  title: '',
  message: '',
  buttons: [],
};

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>(initialModalState);

  const showModal = (title: string, message: string, buttons: ModalState['buttons']) => {
    setModalState({
      visible: true,
      title,
      message,
      buttons,
    });
  };

  const hideModal = () => {
    setModalState(initialModalState);
  };

  const showAlert = (title: string, message: string, onPress?: () => void) => {
    showModal(title, message, [
      {
        text: 'OK',
        onPress: () => {
          hideModal();
          onPress?.();
        },
        style: 'default',
      },
    ]);
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    showModal(title, message, [
      {
        text: 'Cancel',
        onPress: () => {
          hideModal();
          onCancel?.();
        },
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: () => {
          hideModal();
          onConfirm();
        },
        style: 'destructive',
      },
    ]);
  };

  const showActionSheet = (
    title: string,
    message: string,
    actions: Array<{
      text: string;
      onPress: () => void;
      style?: 'default' | 'cancel' | 'destructive' | 'secondary';
    }>
  ) => {
    showModal(title, message, actions);
  };

  const showDestructiveConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    showModal(title, message, [
      {
        text: 'Cancel',
        onPress: () => {
          hideModal();
          onCancel?.();
        },
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          hideModal();
          onConfirm();
        },
        style: 'destructive',
      },
    ]);
  };

  return {
    modalState,
    showModal,
    hideModal,
    showAlert,
    showConfirm,
    showDestructiveConfirm,
    showActionSheet,
  };
};
