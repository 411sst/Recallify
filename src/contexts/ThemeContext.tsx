import React, { createContext, useContext, useState, useEffect } from "react";
import { getSettings, updateSetting } from "../services/database";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      const settings = await getSettings();
      const darkModeEnabled = settings.dark_mode_enabled === "true";
      setIsDarkMode(darkModeEnabled);
      applyTheme(darkModeEnabled);
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  }

  async function toggleTheme() {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    applyTheme(newMode);
    try {
      await updateSetting("dark_mode_enabled", String(newMode));
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  }

  function applyTheme(darkMode: boolean) {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
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
