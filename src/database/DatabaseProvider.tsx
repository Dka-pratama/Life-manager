import { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { runMigrations } from './migrations';

export default function DatabaseProvider({
  children,
}: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        await runMigrations();
        setIsReady(true);
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    }

    initializeDatabase();
  }, []);

  if (!isReady) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return children;
}