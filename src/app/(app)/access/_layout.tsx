import Tabs from '../../../components/Tabs';

export default function AccessLayout() {
  return (
    <Tabs
      initialRouteName="permissions"
      tabs={[
        { name: 'permissions', title: 'Permisos', icon: 'key' },
        { name: 'reservations', title: 'Reservas', icon: 'calendar-check' },
        { name: 'validations', title: 'Validaciones', icon: 'check-decagram', badge: 5 },
      ]}
    />
  );
}
