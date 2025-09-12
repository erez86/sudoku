import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomModal from '../Modal';

describe('CustomModal', () => {
  const mockButtons = [
    { text: 'OK', onPress: jest.fn() },
    { text: 'Cancel', onPress: jest.fn(), style: 'cancel' as const }
  ];

  it('renders correctly when visible', () => {
    const { getByText } = render(
      <CustomModal
        visible={true}
        title="Test Title"
        message="Test Message"
        buttons={mockButtons}
        onClose={jest.fn()}
      />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Message')).toBeTruthy();
    expect(getByText('OK')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('calls onPress when button is pressed', () => {
    const mockOnPress = jest.fn();
    const buttons = [{ text: 'Test', onPress: mockOnPress }];
    
    const { getByText } = render(
      <CustomModal
        visible={true}
        title="Test"
        message="Test"
        buttons={buttons}
        onClose={jest.fn()}
      />
    );

    fireEvent.press(getByText('Test'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <CustomModal
        visible={false}
        title="Test Title"
        message="Test Message"
        buttons={mockButtons}
        onClose={jest.fn()}
      />
    );

    expect(queryByText('Test Title')).toBeNull();
  });
});
