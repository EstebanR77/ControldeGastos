import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Categorías',
        }}
      />

      <Tabs.Screen
        name="gastos"
        options={{
          title: 'Gastos',
        }}
      />
    </Tabs>
  );
}