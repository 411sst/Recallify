import { useEffect, useState } from "react";
import { Box, VStack, Text, HStack, useColorModeValue, IconButton, Tooltip } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { getRevisionsDueToday } from "../services/database";

const menuItems = [
  { path: "/", label: "Subjects", icon: "📚" },
  { path: "/pomodoro", label: "Pomodoro", icon: "🍅" },
  { path: "/analytics", label: "Analytics", icon: "📊" },
  { path: "/pomodoro-history", label: "Sessions", icon: "🕐" },
  { path: "/calendar", label: "Calendar", icon: "📅" },
  { path: "/history", label: "History", icon: "📜" },
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

  // Dark mode colors
  const bgColor = useColorModeValue("white", "#1a1a1a");
  const borderColor = useColorModeValue("gray.200", "#333333");
  const textColor = useColorModeValue("text.secondary", "#e0e0e0");
  const hoverBg = useColorModeValue("gray.50", "#252525");
  const activeBg = useColorModeValue("primary.50", "#2F2F2F");
  const activeColor = useColorModeValue("primary.500", "#1EA896");

  useEffect(() => {
    loadDueCount();
    const interval = setInterval(loadDueCount, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

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

  async function loadDueCount() {
    const revisions = await getRevisionsDueToday();
    setDueCount(revisions.length);
  }

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
        <Box p={isCollapsed ? 3 : 6} borderBottom="1px solid" borderColor={borderColor}>
          <HStack justify="space-between" align="center">
            {!isCollapsed && (
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={activeColor}
                letterSpacing="tight"
              >
                Recallify
              </Text>
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

            const menuItem = (
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
            );

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{ width: "100%", textDecoration: "none" }}
              >
                {isCollapsed ? (
                  <Tooltip label={item.label} placement="right" hasArrow>
                    {menuItem}
                  </Tooltip>
                ) : (
                  menuItem
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
