import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Appbar } from 'react-native-paper';
import { useAppTheme } from '../../../theme';
import { UserForm } from '../../../components/UserForm';
import { StyledSnackbar } from '../../../components/StyledSnackbar';
import { useCreateUser } from '../../../hooks/queries/useUsers';
import { UserFormData } from '../../../schemas/user.schema';

export default function CreateUserScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const createUser = useCreateUser();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = async (data: UserFormData) => {
    try {
      await createUser.mutateAsync(data);
      router.back();
    } catch (error: any) {
      console.error('Error creating user:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al crear el usuario';
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
              <Appbar.BackAction onPress={() => router.back()} />
              <Appbar.Content title="Crear Usuario" />
            </Appbar.Header>
          ),
        }}
      />
      <View style={styles.container}>
        <UserForm mode="create" onSubmit={handleSubmit} isLoading={createUser.isPending} />
      </View>
      <StyledSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        variant="error"
        action={{
          label: 'Cerrar',
          onPress: () => setSnackbarVisible(false),
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
