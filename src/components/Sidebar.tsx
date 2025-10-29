import { useEffect, useState } from "react";
import { Box, VStack, Text, HStack } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { getRevisionsDueToday } from "../services/database";

const menuItems = [
  { path: "/", label: "Subjects", icon: "📚" },
  { path: "/pomodoro", label: "Pomodoro", icon: "🍅" },
  { path: "/calendar", label: "Calendar", icon: "📅" },
  { path: "/history", label: "History", icon: "📜" },
  { path: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const location = useLocation();
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    loadDueCount();
    const interval = setInterval(loadDueCount, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  async function loadDueCount() {
    const revisions = await getRevisionsDueToday();
    setDueCount(revisions.length);
  }

  return (
    <Box
      w="250px"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      h="100vh"
      position="sticky"
      top="0"
    >
      <VStack spacing={0} align="stretch" h="100%">
        {/* App Logo/Name */}
        <Box p={6} borderBottom="1px solid" borderColor="gray.200">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="primary.500"
            letterSpacing="tight"
          >
            Recallify
          </Text>
        </Box>

        {/* Navigation Menu */}
        <VStack spacing={1} p={4} flex="1">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{ width: "100%", textDecoration: "none" }}
              >
                <HStack
                  px={4}
                  py={3}
                  borderRadius="md"
                  bg={isActive ? "primary.50" : "transparent"}
                  color={isActive ? "primary.500" : "text.secondary"}
                  _hover={{
                    bg: isActive ? "primary.50" : "gray.50",
                  }}
                  cursor="pointer"
                  transition="all 0.2s"
                >
                  <Text fontSize="lg">{item.icon}</Text>
                  <Text fontWeight={isActive ? "semibold" : "normal"}>
                    {item.label}
                  </Text>
                </HStack>
              </Link>
            );
          })}
        </VStack>

        {/* Stats Box */}
        {dueCount > 0 && (
          <Box
            p={4}
            m={4}
            bg="status.due"
            borderRadius="md"
            color="white"
            cursor="pointer"
            _hover={{ opacity: 0.9 }}
            onClick={() => (window.location.href = "/")}
          >
            <Text fontSize="sm" fontWeight="semibold">
              {dueCount} revision{dueCount !== 1 ? "s" : ""} due today
            </Text>
            <Text fontSize="xs" mt={1} opacity={0.9}>
              Click to review
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
