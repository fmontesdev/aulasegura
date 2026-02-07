/**
 * Pantalla para crear un nuevo curso
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useCreateCourse } from '../../../../hooks/queries/useCourses';
import { CourseForm } from '../../../../components/CourseForm';
import { CourseFormData } from '../../../../schemas/course.schema';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';

export default function CreateCourseScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const createCourse = useCreateCourse();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (data: CourseFormData) => {
    try {
      await createCourse.mutateAsync(data);
      setSnackbarMessage('Curso creado exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      setSnackbarMessage(error.message || 'Error al crear el curso');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon="arrow-left"
            size={22}
            onPress={() => router.back()}
            iconColor={theme.colors.secondary}
          />
          <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
            Nuevo Curso
          </Text>
        </View>
      </View>

      <CourseForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={createCourse.isPending}
      />

      <StyledSnackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        variant={snackbarType}
        action={{
          label: 'Cerrar',
          onPress: () => setSnackbarVisible(false),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: -6,
    paddingTop: 18,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
