import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    primary: {
      50: "var(--mythic-primary-50, #e6f3e7)",
      100: "var(--mythic-primary-100, #c0dfc2)",
      200: "var(--mythic-primary-200, #99cb9c)",
      300: "var(--mythic-primary-300, #73b775)",
      400: "var(--mythic-primary-400, #4da34f)",
      500: "var(--mythic-primary, #005108)", // Main - uses CSS variable
      600: "var(--mythic-primary-600, #004107)",
      700: "var(--mythic-primary-700, #003105)",
      800: "var(--mythic-primary-800, #002004)",
      900: "var(--mythic-primary-900, #001002)",
    },
    teal: {
      500: "var(--mythic-secondary, #1EA896)", // Main teal accent - uses CSS variable
      600: "#188577",
      700: "#126358",
    },
    background: {
      main: "#FBFFF1", // Off-white
      card: "#FFFFFF", // White
    },
    text: {
      primary: "#0A122A", // Dark navy
      secondary: "#2F2F2F", // Dark gray
      tertiary: "#6B6B6B", // Medium gray
    },
    status: {
      success: "#1EA896", // Teal
      due: "var(--mythic-accent, #F59E0B)", // Orange/Amber - uses CSS variable
      overdue: "#DC2626", // Red
      future: "#3B82F6", // Blue
    },
  },
  fonts: {
    heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
  },
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "20px",
    xl: "24px",
    "2xl": "32px",
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#0A122A' : 'background.main',
        color: props.colorMode === 'dark' ? '#FBFFF1' : 'text.secondary',
        fontSize: "sm",
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "semibold",
        borderRadius: "6px",
      },
      variants: {
        solid: {
          bg: "primary.500",
          color: "background.main",
          _hover: {
            bg: "primary.600",
          },
        },
        outline: {
          borderColor: "primary.500",
          color: "primary.500",
          borderWidth: "2px",
          _hover: {
            bg: "rgba(0, 81, 8, 0.1)",
          },
        },
      },
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === 'dark' ? '#2F2F2F' : 'background.card',
          borderRadius: "8px",
          boxShadow: props.colorMode === 'dark'
            ? "0 1px 3px rgba(255,255,255,0.1)"
            : "0 1px 3px rgba(0,0,0,0.1)",
          _hover: {
            boxShadow: props.colorMode === 'dark'
              ? "0 4px 6px rgba(255,255,255,0.1)"
              : "0 4px 6px rgba(0,0,0,0.1)",
          },
        },
      }),
    },
    Input: {
      defaultProps: {
        focusBorderColor: "primary.500",
      },
    },
  },
});

export default theme;
