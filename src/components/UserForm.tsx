import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Button, HelperText } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextInput } from './FormTextInput';
import { FormSegmentedButtons } from './FormSegmentedButtons';
import { FormMenuSelect } from './FormMenuSelect';
import { useAppTheme } from '../theme';
import { UserSchema, UserFormData } from '../schemas/user.schema';
import { User, RoleName } from '../types/User';
import { API_CONFIG } from '../constants';
import { useDepartments } from '../hooks/queries/useDepartments';
import { getRoleLabel } from '../utils/roleUtils';
import { AVATARS } from '../data/avatars';

interface UserFormProps {
  mode: 'create' | 'edit';
  initialData?: User;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
}

export function UserForm({ mode, initialData, onSubmit, isLoading = false }: UserFormProps) {
  const theme = useAppTheme();
  const [selectedRoles, setSelectedRoles] = useState<RoleName[]>(initialData?.roles || [RoleName.TEACHER]);
  const { data: departments, isLoading: departmentsLoading } = useDepartments();

  const {control, handleSubmit, watch, setValue, formState: { errors }} = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
  defaultValues : mode === 'edit' && initialData
    ? {
        name: initialData.name,
        lastname: initialData.lastname,
        email: initialData.email,
        password: '',
        roles: initialData.roles,
        avatar: initialData.avatar,
        departmentId: initialData.department?.departmentId,
      }
    : {
        name: '',
        lastname: '',
        email: '',
        password: '',
        roles: [RoleName.TEACHER],
        avatar: 'avatar.png',
      }
  });

  const watchedRoles = watch('roles');
  const watchedAvatar = watch('avatar');

  // Actualizar selectedRoles cuando cambia en el formulario
  useEffect(() => {
    if (watchedRoles) {
      setSelectedRoles(watchedRoles);
    }
  }, [watchedRoles]);

  // Función para enviar solo los campos modificados en modo edición
  const handleFormSubmit = (data: UserFormData) => {
    if (mode === 'edit' && initialData) {
      const changedFields: Partial<UserFormData> = {};
      
      // Comparar cada campo con el valor inicial
      if (data.name !== initialData.name) changedFields.name = data.name;
      if (data.lastname !== initialData.lastname) changedFields.lastname = data.lastname;
      if (data.email !== initialData.email) changedFields.email = data.email;
      if (data.password && data.password !== '') changedFields.password = data.password;
      if (data.avatar !== initialData.avatar) changedFields.avatar = data.avatar;
      
      // Comparar arrays de roles
      const rolesChanged = JSON.stringify(data.roles.sort()) !== JSON.stringify(initialData.roles.sort());
      if (rolesChanged) changedFields.roles = data.roles;
      
      // Comparar departmentId
      if (data.departmentId !== initialData.department?.departmentId) {
        changedFields.departmentId = data.departmentId;
      }
      onSubmit(changedFields as UserFormData);
    } else {
      // En modo create, enviar todos los datos
      onSubmit(data);
    }
  };

  // Determinar qué avatares mostrar
  const availableAvatars = React.useMemo(() => {
    if (mode === 'edit' && initialData?.avatar && !AVATARS.includes(initialData.avatar)) {
      // Si es modo edición y el avatar del usuario no está en los predeterminados, agregarlo
      return [initialData.avatar, ...AVATARS];
    }
    return AVATARS;
  }, [mode, initialData?.avatar]);

  return (
    <ScrollView style={styles.container}>
      {/* Contenedor responsive para los primeros 6 campos */}
      <View style={styles.formGrid}>
        {/* TextInput Nombre */}
        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="name"
            label="Nombre"
            errors={errors}
          />
        </View>

        {/* TextInput Apellidos */}
        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="lastname"
            label="Apellidos"
            errors={errors}
          />
        </View>

        {/* TextInputEmail */}
        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="email"
            label="Email"
            errors={errors}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* TextInput Contraseña */}
        <View style={styles.formGridItem}>
          <FormTextInput
            control={control}
            name="password"
            label={mode === 'create' ? 'Contraseña' : 'Contraseña (dejar vacía para no cambiar)'}
            errors={errors}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* Selector para Roles */}
        <View style={styles.formGridItem}>
          <FormSegmentedButtons
            control={control}
            name="roles"
            label="Roles"
            errors={errors}
            options={Object.values(RoleName).map((role) => ({
              value: role,
              label: getRoleLabel(role),
            }))}
            multiSelect
            onValueChange={(newValue) => {
              // Limpiar departmentId si no hay teacher en los roles
              if (!Array.isArray(newValue) || !newValue.includes(RoleName.TEACHER)) {
                setValue('departmentId', undefined);
              }
            }}
          />
        </View>

        {/* Select de Departamentos (solo para profesores) */}
        <View style={styles.formGridItem}>
          {selectedRoles.includes(RoleName.TEACHER) ? (
            <View style={{ marginTop: 20 }}>
              <FormMenuSelect
                control={control}
                name="departmentId"
                label="Departamento"
                errors={errors}
                options={
                  departments
                    ?.filter((dept) => dept.isActive)
                    .map((dept) => ({
                      value: dept.departmentId,
                      label: dept.name,
                    })) || []
                }
                isLoading={departmentsLoading}
                loadingText="Cargando departamentos..."
                emptyText="No hay departamentos disponibles"
              />
            </View>
          ) : (
            <View/>
          )}
        </View>
      </View>

      {/* Avatar */}
      <View>
        <Text variant="labelLarge" style={{ marginBottom: 8, color: theme.colors.onSurface }}>
          Avatar
        </Text>
        <Controller
          control={control}
          name="avatar"
          render={({ field: { onChange, value } }) => (
            <View style={styles.avatarGrid}>
              {availableAvatars.map((avatar) => (
                <TouchableOpacity
                  key={avatar}
                  style={[
                    styles.avatarOption,
                    value === avatar && {
                      borderColor: theme.colors.tertiary,
                      borderWidth: 3,
                    },
                  ]}
                  onPress={() => onChange(avatar)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: `${API_CONFIG.IMAGE_SERVER_URL}/${avatar}` }}
                    style={styles.avatarImage}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
        {errors.avatar && (
          <HelperText type="error" visible={!!errors.avatar}>
            {errors.avatar.message}
          </HelperText>
        )}
      </View>

      {/* Botón Submit */}
      <View style={styles.submitButtonContainer}>
        <Button
          icon="plus"
          mode="contained"
          onPress={handleSubmit(handleFormSubmit)}
          loading={isLoading}
          disabled={isLoading}
          buttonColor={mode === 'create' ? theme.colors.success : theme.colors.tertiary}
        >
          {mode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  formGridItem: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 280,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avatarOption: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 60,
    height: 60,
  },
  submitButtonContainer: {
    alignItems: 'flex-start',
    marginTop: 32,
    marginBottom: 32,
  },
});
