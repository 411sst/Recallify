import { useEffect, useState, useCallback, useRef } from "react";
import { Box, VStack, Text, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { getRevisionsDueToday } from "../services/database";
import { useIsMythicFeatureActive } from "../stores/mythicStore";
import { KitsuneTails, KitsuneTailsCompact } from "./mythic/KitsuneTails";
import { FoxFireGlow } from "./mythic/FoxFireGlow";
import { KitsuneHaikuTooltip } from "./mythic/KitsuneHaikuTooltip";

const menuItems = [
  { path: "/", label: "Subjects", icon: "📚" },
  { path: "/pomodoro", label: "Pomodoro", icon: "🍅" },
  { path: "/streaks", label: "Streaks", icon: "🔥" },
  { path: "/analytics", label: "Analytics", icon: "📊" },
  { path: "/pomodoro-history", label: "Sessions", icon: "🕐" },
  { path: "/tags", label: "Tags", icon: "🏷️" },
  { path: "/calendar", label: "Calendar", icon: "📅" },
  { path: "/history", label: "History", icon: "📜" },
  { path: "/badges", label: "Badges", icon: "🏆" },
  { path: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const location = useLocation();
  const [dueCount, setDueCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });
  const isLoadingRef = useRef(false);
  const lastLoadTimeRef = useRef<number>(0);

  // Mythic mode
  const isKitsuneModeActive = useIsMythicFeatureActive('kitsuneSidebar');

  // Theme colors - now uses CSS variables set by theme
  const bgColor = "var(--theme-sidebar-bg)";
  const borderColor = "var(--theme-border)";
  const textColor = "var(--theme-sidebar-text)";
  const hoverBg = "var(--theme-sidebar-hover)";
  const activeBg = "var(--theme-sidebar-active)";
  const activeColor = "var(--theme-sidebar-active)";

  // Memoized load function with debouncing
  const loadDueCount = useCallback(async () => {
    // Prevent concurrent loads
    if (isLoadingRef.current) return;

    // Debounce: Don't load if we loaded less than 2 seconds ago
    const now = Date.now();
    if (now - lastLoadTimeRef.current < 2000) return;

    try {
      isLoadingRef.current = true;
      lastLoadTimeRef.current = now;
      const revisions = await getRevisionsDueToday();
      setDueCount(revisions.length);
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  // Initial load and periodic refresh
  useEffect(() => {
    loadDueCount();

    // Refresh every 10 seconds when page is visible
    // Refresh every 60 seconds when page is hidden
    let interval: number;

    const handleVisibilityChange = () => {
      clearInterval(interval);
      const refreshInterval = document.hidden ? 60000 : 10000;
      interval = setInterval(loadDueCount, refreshInterval);
    };

    // Set initial interval
    interval = setInterval(loadDueCount, 10000);

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadDueCount]);

  // Reload when navigating to certain pages
  useEffect(() => {
    // Refresh count when visiting pages where revisions might change
    if (location.pathname.startsWith('/subjects/') || location.pathname === '/calendar') {
      loadDueCount();
    }
  }, [location.pathname, loadDueCount]);

  // Keyboard shortcut: Ctrl/Cmd + B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleCollapse();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsed]);

  function toggleCollapse() {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  }

  return (
    <Box
      w={isCollapsed ? "60px" : "250px"}
      bg={bgColor}
      borderRight="1px solid"
      borderColor={borderColor}
      h="100vh"
      position="sticky"
      top="0"
      transition="width 0.2s ease"
    >
      <VStack spacing={0} align="stretch" h="100%">
        {/* App Logo/Name */}
        <Box p={isCollapsed ? 3 : 6} borderBottom="1px solid" borderColor={borderColor} position="relative">
          <HStack justify="space-between" align="center">
            {!isCollapsed && (
              <HStack spacing={3}>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={activeColor}
                  letterSpacing="tight"
                >
                  Recallify
                </Text>
                {/* Kitsune tails (expanded view) */}
                {isKitsuneModeActive && (
                  <Box position="relative" top="-2px">
                    <KitsuneTails size={32} animated={true} />
                  </Box>
                )}
              </HStack>
            )}
            {/* Compact tail count badge (collapsed view) */}
            {isCollapsed && isKitsuneModeActive && (
              <Box position="relative">
                <Text fontSize="xl" color={activeColor}>🦊</Text>
                <KitsuneTailsCompact />
              </Box>
            )}
            <IconButton
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              icon={<Text fontSize="lg">{isCollapsed ? "→" : "←"}</Text>}
              size="sm"
              variant="ghost"
              onClick={toggleCollapse}
              color={textColor}
              _hover={{ bg: hoverBg }}
            />
          </HStack>
        </Box>

        {/* Navigation Menu */}
        <VStack spacing={1} p={4} flex="1">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));

            const menuItemContent = (
              <FoxFireGlow
                isActive={isActive}
                glowIntensity={isActive ? "high" : "medium"}
                borderRadius="md"
              >
                <HStack
                  px={isCollapsed ? 2 : 4}
                  py={3}
                  borderRadius="md"
                  bg={isActive ? activeBg : "transparent"}
                  color={isActive ? activeColor : textColor}
                  _hover={{
                    bg: isActive ? activeBg : hoverBg,
                  }}
                  cursor="pointer"
                  transition="all 0.2s"
                  justify={isCollapsed ? "center" : "flex-start"}
                >
                  <Text fontSize="lg">{item.icon}</Text>
                  {!isCollapsed && (
                    <Text fontWeight={isActive ? "semibold" : "normal"}>
                      {item.label}
                    </Text>
                  )}
                </HStack>
              </FoxFireGlow>
            );

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{ width: "100%", textDecoration: "none" }}
              >
                {isCollapsed ? (
                  <KitsuneHaikuTooltip
                    pageName={item.label}
                    fallbackLabel={item.label}
                    placement="right"
                    hasArrow
                  >
                    {menuItemContent}
                  </KitsuneHaikuTooltip>
                ) : (
                  menuItemContent
                )}
              </Link>
            );
          })}
        </VStack>

        {/* Stats Box */}
        {dueCount > 0 && (
          <Tooltip
            label={isCollapsed ? `${dueCount} revision${dueCount !== 1 ? 's' : ''} due today - Click to review` : ""}
            placement="right"
            hasArrow
            isDisabled={!isCollapsed}
          >
            <Box
              p={isCollapsed ? 2 : 4}
              m={isCollapsed ? 2 : 4}
              bg="status.due"
              borderRadius="md"
              color="white"
              cursor="pointer"
              _hover={{ opacity: 0.9 }}
              onClick={() => (window.location.href = "/")}
              textAlign={isCollapsed ? "center" : "left"}
            >
              {isCollapsed ? (
                <Text fontSize="xl" fontWeight="bold">
                  {dueCount}
                </Text>
              ) : (
                <>
                  <Text fontSize="sm" fontWeight="semibold">
                    {dueCount} revision{dueCount !== 1 ? "s" : ""} due today
                  </Text>
                  <Text fontSize="xs" mt={1} opacity={0.9}>
                    Click to review
                  </Text>
                </>
              )}
            </Box>
          </Tooltip>
        )}
      </VStack>
    </Box>
  );
}
