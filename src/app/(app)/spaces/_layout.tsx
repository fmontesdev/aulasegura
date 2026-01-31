import Tabs from '../../../components/Tabs';

export default function SpacesLayout() {
  return (
    <Tabs
      initialRouteName="classrooms"
      tabs={[
        { name: 'classrooms', title: 'Aulas', icon: 'door' },
        { name: 'readers', title: 'Lectores', icon: 'card-search' },
        { name: 'map', title: 'Plano del Centro', icon: 'map-marker-radius' },
      ]}
    />
  );
}
