import Tabs from '../../../components/Tabs';

export default function CredentialsLayout() {
  return (
    <Tabs
      initialRouteName="rfid"
      tabs={[
        { name: 'rfid', title: 'RFID', icon: 'contactless-payment' },
        { name: 'nfc', title: 'NFC', icon: 'nfc-variant' },
      ]}
    />
  );
}
