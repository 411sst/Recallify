import React, { createContext, useContext, useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";
import { getSettings, updateSetting } from "../services/database";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colorMode, setColorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      const settings = await getSettings();
      const darkModeEnabled = settings.dark_mode_enabled === "true";
      setColorMode(darkModeEnabled ? "dark" : "light");
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  }

  async function toggleTheme() {
    const newMode = colorMode === "light" ? "dark" : "light";
    setColorMode(newMode);
    try {
      await updateSetting("dark_mode_enabled", String(newMode === "dark"));
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
