import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    // Primary colors - uses CSS variables set by theme
    primary: {
      50: "var(--mythic-primary-50, #e6f3e7)",
      100: "var(--mythic-primary-100, #c0dfc2)",
      200: "var(--mythic-primary-200, #99cb9c)",
      300: "var(--mythic-primary-300, #73b775)",
      400: "var(--mythic-primary-400, #4da34f)",
      500: "var(--mythic-primary, #005108)",
      600: "var(--mythic-primary-600, #004107)",
      700: "var(--mythic-primary-700, #003105)",
      800: "var(--mythic-primary-800, #002004)",
      900: "var(--mythic-primary-900, #001002)",
    },

    // Secondary/accent colors
    teal: {
      500: "var(--mythic-secondary, #1EA896)",
      600: "#188577",
      700: "#126358",
    },

    // Background colors - now use theme CSS variables
    background: {
      main: "var(--theme-background, #FBFFF1)",
      card: "var(--theme-card-bg, #FFFFFF)",
    },

    // Text colors - now use theme CSS variables
    text: {
      primary: "var(--theme-text-primary, #0A122A)",
      secondary: "var(--theme-text-secondary, #2F2F2F)",
      tertiary: "var(--theme-text-tertiary, #6B6B6B)",
    },

    // Status colors - now use theme CSS variables
    status: {
      success: "var(--theme-status-success, #059669)",
      due: "var(--theme-status-warning, #F59E0B)",
      overdue: "var(--theme-status-error, #DC2626)",
      future: "var(--theme-status-info, #0284C7)",
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
    global: () => ({
      body: {
        // Use theme CSS variables for background and text
        bg: "var(--theme-background)",
        color: "var(--theme-text-secondary)",
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
          bg: "var(--theme-button-primary-bg)",
          color: "var(--theme-button-primary-text)",
          _hover: {
            bg: "var(--theme-button-primary-hover)",
          },
        },
        outline: {
          borderColor: "var(--theme-button-secondary-border)",
          color: "var(--mythic-primary)",
          borderWidth: "2px",
          _hover: {
            bg: "var(--theme-button-secondary-hover)",
          },
        },
      },
    },
    Card: {
      baseStyle: () => ({
        container: {
          bg: "var(--theme-card-bg)",
          borderRadius: "8px",
          borderWidth: "1px",
          borderColor: "var(--theme-border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          _hover: {
            bg: "var(--theme-card-hover)",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          },
        },
      }),
    },
    Input: {
      defaultProps: {
        focusBorderColor: "var(--theme-input-border-focus)",
      },
      variants: {
        outline: {
          field: {
            bg: "var(--theme-input-bg)",
            borderColor: "var(--theme-input-border)",
            _hover: {
              borderColor: "var(--mythic-primary)",
            },
            _focus: {
              borderColor: "var(--theme-input-border-focus)",
              boxShadow: "0 0 0 1px var(--theme-input-border-focus)",
            },
          },
        },
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: "var(--theme-input-border-focus)",
      },
      variants: {
        outline: {
          bg: "var(--theme-input-bg)",
          borderColor: "var(--theme-input-border)",
          _hover: {
            borderColor: "var(--mythic-primary)",
          },
          _focus: {
            borderColor: "var(--theme-input-border-focus)",
            boxShadow: "0 0 0 1px var(--theme-input-border-focus)",
          },
        },
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: "var(--theme-input-border-focus)",
      },
      variants: {
        outline: {
          field: {
            bg: "var(--theme-input-bg)",
            borderColor: "var(--theme-input-border)",
            _hover: {
              borderColor: "var(--mythic-primary)",
            },
            _focus: {
              borderColor: "var(--theme-input-border-focus)",
              boxShadow: "0 0 0 1px var(--theme-input-border-focus)",
            },
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: "var(--theme-card-bg)",
          borderColor: "var(--theme-border)",
        },
        header: {
          color: "var(--theme-text-primary)",
        },
        body: {
          color: "var(--theme-text-secondary)",
        },
      },
    },
    Drawer: {
      baseStyle: {
        dialog: {
          bg: "var(--theme-card-bg)",
        },
        header: {
          color: "var(--theme-text-primary)",
        },
        body: {
          color: "var(--theme-text-secondary)",
        },
      },
    },
    Divider: {
      baseStyle: {
        borderColor: "var(--theme-border)",
      },
    },
    Heading: {
      baseStyle: {
        color: "var(--theme-text-primary)",
      },
    },
    Text: {
      baseStyle: {
        color: "var(--theme-text-secondary)",
      },
    },
  },
});

export default theme;
