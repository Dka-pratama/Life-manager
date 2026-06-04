import {
    createContext,
    useContext,
    useMemo,
    useState,
    useEffect,
    ReactNode,
} from 'react';

import { useColorScheme } from 'react-native';
import { Colors } from '../constants/colors';
import { getSetting , setSetting} from '../repositories/SettingsRepository';


export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextType = {
    themeMode: ThemeMode;
    changeTheme: (mode: ThemeMode) => Promise<void>;
    colors: typeof Colors.light;
    isDark: boolean;
};
// buat context untuk theme (light/dark) dan buat provider untuk mengelola state theme
const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
    children,
}: {
    children: ReactNode;
}) {
    // baca sistem color scheme (light/dark) dari device
    const systemColorScheme = useColorScheme();

    const [themeMode, setThemeMode] = 
    useState<ThemeMode>('system');
    // fungsi untuk mengubah theme mode dan simpan ke database
    useEffect(() => {
        async function loadTheme() {
            const setting = await getSetting('theme_mode');

            if (setting?.value) {
                setThemeMode(setting.value as ThemeMode);
            }
        }

        loadTheme();
    }, []);
    // tentukan apakah theme yang aktif adalah dark mode atau light mode berdasarkan thememode dan system color scheme
    const isDark = useMemo(() => {
        if (themeMode === 'system') {
            return systemColorScheme === 'dark';
        }
        return themeMode === 'dark';
    }, [themeMode, systemColorScheme]);

    // tentukan warna yang digunakan berdasarkan apakah dark mode aktif atau tidak
    const colors = isDark 
    ? Colors.dark 
    : Colors.light;

    const changeTheme = async (
        mode: ThemeMode
    ) => {
        setThemeMode(mode);
        await setSetting('theme_mode', mode);
    };
    return (
        <ThemeContext.Provider 
        value={{ 
            themeMode, 
            changeTheme, 
            colors, 
            isDark }}>
                {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}