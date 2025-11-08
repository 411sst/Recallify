/**
 * 📜 KITSUNE HAIKU TOOLTIP
 * Displays wisdom haikus based on tail count
 */

import { Tooltip, TooltipProps, Box, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useCurrentKitsuneHaiku } from '../../hooks/useFolklore';
import { useIsMythicFeatureActive } from '../../stores/mythicStore';

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
  const { haiku, tailCount } = useCurrentKitsuneHaiku();

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
