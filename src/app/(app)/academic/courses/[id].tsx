/**
 * Pantalla para editar un curso existente
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, ActivityIndicator, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '../../../../theme';
import { useCourse, useUpdateCourse } from '../../../../hooks/queries/useCourses';
import { CourseForm } from '../../../../components/CourseForm';
import { CourseFormData } from '../../../../schemas/course.schema';
import { StyledSnackbar } from '../../../../components/StyledSnackbar';

export default function EditCourseScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const courseId = parseInt(id);

  const { data: course, isLoading, error, refetch } = useCourse(courseId);
  const updateCourse = useUpdateCourse();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (data: Partial<CourseFormData>) => {
    if (!course) return;
    
    try {
      // Asegurar que academicYearCode esté presente
      const updateData = {
        ...data,
        academicYearCode: data.academicYearCode || course.academicYears[0]?.code || '2025-2026',
      };
      await updateCourse.mutateAsync({ courseId, data: updateData });
      setSnackbarMessage('Curso actualizado exitosamente');
      setSnackbarType('success');
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      setSnackbarMessage(error.message || 'Error al actualizar el curso');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.secondary }}>Cargando curso...</Text>
      </View>
    );
  }

  if (error || !course) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: theme.colors.error, marginBottom: 16 }}>
          Error al cargar el curso
        </Text>
        <Button mode="contained" onPress={() => refetch()}>
          Reintentar
        </Button>
      </View>
    );
  }

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
            Editar Curso
          </Text>
        </View>
      </View>

      <CourseForm
        mode="edit"
        initialData={course}
        onSubmit={handleSubmit}
        isLoading={updateCourse.isPending}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
