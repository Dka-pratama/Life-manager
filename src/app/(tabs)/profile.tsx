import { View, Text, Button } from 'react-native';

import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileScreen() {
  const { colors, changeTheme, themeMode } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
      }}
    >
      <Text
      style={{ 
        color: colors.text,
        marginBottom: 20
       }}>Theme : {themeMode}</Text>

       <Button
        title="Light Mode"
        onPress={() => changeTheme('light')}
        color={colors.primary}
       />
        <Button
        title="Dark Mode"
        onPress={() => changeTheme('dark')}
        color={colors.primary}
       />
       <Button
        title="System Default"
        onPress={() => changeTheme('system')}
        color={colors.primary}
       />
    </View>
  );
}