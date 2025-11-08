/**
 * 🕷️ ANANSI YARN HOOK
 * Triggers yarn interruptions during Pomodoro sessions
 */

import { useState, useEffect, useCallback } from 'react';
import { useRandomAnansiYarn } from './useFolklore';
import { useIsMythicFeatureActive, useMythicStore } from '../stores/mythicStore';
import { AnansiYarn } from '../types/mythic';

interface UseAnansiYarnOptions {
  sessionType: 'work' | 'short_break' | 'long_break';
  sessionDuration: number; // in seconds
  isRunning: boolean;
}

export function useAnansiYarn({ sessionType, sessionDuration, isRunning }: UseAnansiYarnOptions) {
  const isActive = useIsMythicFeatureActive('anansiWeb');
  const { setCurrentYarn } = useMythicStore();
  const [showRiddle, setShowRiddle] = useState(false);
  const [currentYarnData, setCurrentYarnData] = useState<AnansiYarn | null>(null);

  // Determine difficulty based on session duration
  let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  if (sessionDuration < 15 * 60) {
    difficulty = 'easy';
  } else if (sessionDuration > 30 * 60) {
    difficulty = 'hard';
  }

  // Get yarn data (will regenerate on difficulty change)
  const randomYarn = useRandomAnansiYarn(difficulty);

  // Generate new yarn
  const generateYarn = useCallback(() => {
    if (!isActive || sessionType !== 'work') return;

    setCurrentYarnData(randomYarn);
    setCurrentYarn(randomYarn);
    setShowRiddle(true);
  }, [isActive, sessionType, randomYarn, setCurrentYarn]);

  // Trigger yarn at random time during work session
  useEffect(() => {
    if (!isActive || !isRunning || sessionType !== 'work') {
      return;
    }

    // Trigger yarn between 30%-70% of session duration
    const minTriggerTime = sessionDuration * 0.3 * 1000; // Convert to ms
    const maxTriggerTime = sessionDuration * 0.7 * 1000;
    const triggerTime = minTriggerTime + Math.random() * (maxTriggerTime - minTriggerTime);

    const timeout = setTimeout(() => {
      generateYarn();
    }, triggerTime);

    return () => clearTimeout(timeout);
  }, [isActive, isRunning, sessionType, sessionDuration, generateYarn]);

  const closeRiddle = useCallback(() => {
    setShowRiddle(false);
    setCurrentYarn(null);
  }, [setCurrentYarn]);

  return {
    showRiddle,
    currentYarn: currentYarnData,
    closeRiddle,
    triggerYarn: generateYarn, // Manual trigger for testing
  };
}
