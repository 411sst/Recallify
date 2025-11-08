/**
 * 📜 KITSUNE HAIKU TOOLTIP
 * Displays wisdom haikus based on tail count
 */

import { Tooltip, TooltipProps, Box, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useKitsuneHaikus } from '../../hooks/useFolklore';
import { useIsMythicFeatureActive, useMythicStore } from '../../stores/mythicStore';

interface KitsuneHaikuTooltipProps extends Omit<TooltipProps, 'label'> {
  children: ReactNode;
  pageName?: string; // Optional: customize haiku based on page
  fallbackLabel?: string; // Fallback label if mythic mode is off
}

export function KitsuneHaikuTooltip({
  children,
  pageName,
  fallbackLabel,
  ...tooltipProps
}: KitsuneHaikuTooltipProps) {
  const isMythicActive = useIsMythicFeatureActive('kitsuneSidebar');
  const allHaikus = useKitsuneHaikus();
  const { kitsune } = useMythicStore();
  const tailCount = kitsune.currentTailCount;

  // Create unique haiku selection based on page name
  // This ensures each sidebar section shows a different haiku
  const getPageOffset = (name?: string): number => {
    if (!name) return 0;
    // Simple hash function to create consistent offset per page
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 9;
  };

  const pageOffset = getPageOffset(pageName);
  const haikuIndex = (tailCount - 1 + pageOffset) % 9;
  const haiku = allHaikus[haikuIndex] || allHaikus[0];

  // If mythic mode is off, use fallback label
  if (!isMythicActive) {
    if (!fallbackLabel) return <>{children}</>;

    return (
      <Tooltip label={fallbackLabel} {...tooltipProps}>
        {children}
      </Tooltip>
    );
  }

  // Custom haiku label with styling
  const haikuLabel = (
    <Box textAlign="center" py={2} px={3}>
      <Text
        fontSize="xs"
        fontStyle="italic"
        color="orange.100"
        whiteSpace="pre-line"
        lineHeight="1.6"
      >
        {haiku}
      </Text>
      <Text fontSize="2xs" color="orange.200" mt={2} opacity={0.7}>
        — {tailCount} {tailCount === 1 ? 'tail' : 'tails'} of wisdom
      </Text>
      {pageName && (
        <Text fontSize="2xs" color="orange.300" mt={1}>
          {pageName}
        </Text>
      )}
    </Box>
  );

  return (
    <Tooltip
      label={haikuLabel}
      bg="gray.800"
      color="white"
      borderRadius="md"
      boxShadow="0 0 20px rgba(255, 107, 53, 0.3)"
      hasArrow
      placement="right"
      closeOnMouseDown
      closeOnScroll
      closeDelay={0}
      {...tooltipProps}
    >
      {children}
    </Tooltip>
  );
}

// Simpler version: Just shows tail count with minimal styling
export function KitsuneTailBadge({ showText = false }: { showText?: boolean }) {
  const isMythicActive = useIsMythicFeatureActive('kitsuneSidebar');
  const { tailCount } = useCurrentKitsuneHaiku();

  if (!isMythicActive) return null;

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap={1}
      px={2}
      py={0.5}
      borderRadius="full"
      bg="orange.500"
      color="white"
      fontSize="xs"
      fontWeight="bold"
      boxShadow="0 0 8px rgba(255, 107, 53, 0.4)"
    >
      <Text>🦊</Text>
      {showText && <Text>{tailCount}</Text>}
    </Box>
  );
}
