import Tabs from '../../../components/Tabs';

export default function SupervisionLayout() {
  return (
    <Tabs
      initialRouteName="logs"
      tabs={[
        { name: 'logs', title: 'Logs de Accesos', icon: 'file-document-multiple' },
        { name: 'incidents', title: 'Incidencias', icon: 'alert-circle' },
        { name: 'analytics', title: 'Analíticas', icon: 'chart-box' },
      ]}
    />
  );
}
