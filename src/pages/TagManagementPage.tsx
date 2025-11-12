import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Input,
  Select,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Tag as ChakraTag,
} from "@chakra-ui/react";
import { getAllTags } from "../services/database";

interface Tag {
  id: number;
  name: string;
  color: string;
  usage_count: number;
  created_at: string;
}

export default function TagManagementPage() {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("usage"); // usage, name, date
  const [filterByUsage, setFilterByUsage] = useState("all"); // all, unused, 1-5, 5+

  // Dark mode colors
  const bgColor = useColorModeValue("background.main", "#0f0f0f");
  const cardBg = useColorModeValue("white", "#1a1a1a");
  const textColor = useColorModeValue("text.primary", "#ffffff");
  const secondaryTextColor = useColorModeValue("text.secondary", "#b0b0b0");
  const accentColor = useColorModeValue("primary.500", "#1EA896");
  const inputBg = useColorModeValue("white", "#252525");
  const borderColor = useColorModeValue("gray.200", "#2d2d2d");

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allTags, searchQuery, sortBy, filterByUsage]);

  async function loadTags() {
    try {
      const tags = await getAllTags();
      setAllTags(tags);
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  }

  function applyFilters() {
    let filtered = [...allTags];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply usage filter
    if (filterByUsage === "unused") {
      filtered = filtered.filter((tag) => tag.usage_count === 0);
    } else if (filterByUsage === "1-5") {
      filtered = filtered.filter((tag) => tag.usage_count >= 1 && tag.usage_count <= 5);
    } else if (filterByUsage === "5+") {
      filtered = filtered.filter((tag) => tag.usage_count > 5);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "usage") {
        return b.usage_count - a.usage_count;
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "date") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

    setFilteredTags(filtered);
  }

  function getStats() {
    const totalTags = allTags.length;
    const usedTags = allTags.filter((tag) => tag.usage_count > 0).length;
    const unusedTags = totalTags - usedTags;
    const mostUsedTag = allTags.reduce((prev, current) =>
      current.usage_count > prev.usage_count ? current : prev
    , allTags[0] || { name: "N/A", usage_count: 0 });

    return {
      totalTags,
      usedTags,
      unusedTags,
      mostUsedTag,
    };
  }

  const stats = allTags.length > 0 ? getStats() : null;

  return (
    <Box bg={bgColor} minH="100vh" p={8}>
      <VStack align="stretch" spacing={8}>
        <Heading size="xl" color={textColor}>
          Tag Management
        </Heading>

        {/* Statistics */}
        {stats && (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel color={secondaryTextColor}>Total Tags</StatLabel>
                  <StatNumber fontSize="3xl" color={accentColor}>
                    {stats.totalTags}
                  </StatNumber>
                  <StatHelpText color={secondaryTextColor}>
                    {stats.usedTags} used, {stats.unusedTags} unused
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel color={secondaryTextColor}>Most Used</StatLabel>
                  <StatNumber fontSize="lg" color={textColor} isTruncated>
                    {stats.mostUsedTag.name}
                  </StatNumber>
                  <StatHelpText color={secondaryTextColor}>
                    {stats.mostUsedTag.usage_count} uses
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel color={secondaryTextColor}>Active Tags</StatLabel>
                  <StatNumber fontSize="3xl" color={textColor}>
                    {stats.usedTags}
                  </StatNumber>
                  <StatHelpText color={secondaryTextColor}>
                    with 1+ uses
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel color={secondaryTextColor}>Avg Uses/Tag</StatLabel>
                  <StatNumber fontSize="3xl" color={textColor}>
                    {stats.totalTags > 0 ? Math.round(allTags.reduce((sum, tag) => sum + tag.usage_count, 0) / stats.totalTags) : 0}
                  </StatNumber>
                  <StatHelpText color={secondaryTextColor}>
                    per tag
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        )}

        {/* Filters */}
        <Card bg={cardBg}>
          <CardBody>
            <HStack spacing={4} flexWrap="wrap">
              <Box flex="1" minW="200px">
                <Text fontSize="sm" mb={2} fontWeight="semibold" color={textColor}>
                  Search
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Text>🔍</Text>
                  </InputLeftElement>
                  <Input
                    placeholder="Search tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    bg={inputBg}
                    borderColor={borderColor}
                  />
                </InputGroup>
              </Box>

              <Box minW="150px">
                <Text fontSize="sm" mb={2} fontWeight="semibold" color={textColor}>
                  Sort By
                </Text>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  bg={inputBg}
                  borderColor={borderColor}
                >
                  <option value="usage">Most Used</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="date">Newest First</option>
                </Select>
              </Box>

              <Box minW="150px">
                <Text fontSize="sm" mb={2} fontWeight="semibold" color={textColor}>
                  Filter by Usage
                </Text>
                <Select
                  value={filterByUsage}
                  onChange={(e) => setFilterByUsage(e.target.value)}
                  bg={inputBg}
                  borderColor={borderColor}
                >
                  <option value="all">All Tags</option>
                  <option value="unused">Unused (0)</option>
                  <option value="1-5">1-5 uses</option>
                  <option value="5+">5+ uses</option>
                </Select>
              </Box>
            </HStack>
          </CardBody>
        </Card>

        {/* Tags List */}
        <Card bg={cardBg}>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  Tags ({filteredTags.length})
                </Text>
              </HStack>

              {filteredTags.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text color={secondaryTextColor}>
                    {allTags.length === 0
                      ? "No tags created yet. Tags will appear here once you add them to study logs."
                      : "No tags match your filters."}
                  </Text>
                </Box>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {filteredTags.map((tag) => (
                    <Card key={tag.id} bg={inputBg} borderColor={borderColor} borderWidth="1px">
                      <CardBody>
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={2} flex="1">
                            <HStack>
                              <ChakraTag size="lg" colorScheme="blue" borderRadius="full">
                                {tag.name}
                              </ChakraTag>
                            </HStack>
                            <HStack spacing={4} fontSize="sm" color={secondaryTextColor}>
                              <Text>
                                📊 {tag.usage_count} {tag.usage_count === 1 ? "use" : "uses"}
                              </Text>
                            </HStack>
                          </VStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Info Card */}
        <Card bg={cardBg}>
          <CardBody>
            <VStack align="stretch" spacing={3}>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                About Tags
              </Text>
              <Text color={secondaryTextColor} fontSize="sm">
                Tags help you organize and categorize your study logs. Add tags when creating or editing study entries to make them easier to find later.
              </Text>
              <Text color={secondaryTextColor} fontSize="sm">
                💡 Tip: Use consistent tag names to keep your organization clean. For example: "difficult", "review-needed", "practice-more"
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
