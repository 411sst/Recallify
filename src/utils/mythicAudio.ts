/**
 * 🔊 MYTHIC AUDIO UTILITY
 * Centralized sound effect management for mythic features
 */

// Sound effect paths (to be added to public folder)
export const MYTHIC_SOUNDS = {
  // Kitsune sounds
  foxFireWhoosh: '/sounds/mythic/fox-fire-whoosh.mp3',
  tailGrow: '/sounds/mythic/tail-grow.mp3',

  // Phoenix sounds
  phoenixCry: '/sounds/mythic/phoenix-cry.mp3',
  flameIgnite: '/sounds/mythic/flame-ignite.mp3',
  rebirthComplete: '/sounds/mythic/rebirth-complete.mp3',

  // Anansi sounds
  webVibration: '/sounds/mythic/web-vibration.mp3',
  spiderCrawl: '/sounds/mythic/spider-crawl.mp3',
  riddleSolved: '/sounds/mythic/riddle-solved.mp3',

  // Banshee sounds
  bansheeWhisper: '/sounds/mythic/banshee-whisper.mp3',
  bansheeWail: '/sounds/mythic/banshee-wail.mp3',
  bansheeScream: '/sounds/mythic/banshee-scream.mp3',

  // Djinn sounds
  wishGranted: '/sounds/mythic/wish-granted.mp3',
  djinnAppear: '/sounds/mythic/djinn-appear.mp3',
  magicShimmer: '/sounds/mythic/magic-shimmer.mp3',

  // General
  mythicToggle: '/sounds/mythic/mythic-toggle.mp3',
  badgeUnlock: '/sounds/mythic/badge-unlock.mp3',
  themeChange: '/sounds/mythic/theme-change.mp3',
};

export type MythicSoundEffect = keyof typeof MYTHIC_SOUNDS;

class MythicAudioManager {
  private audioEnabled: boolean = true;
  private volume: number = 0.5;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private preloadedSounds: Set<string> = new Set();

  /**
   * Set global audio enabled state
   */
  setEnabled(enabled: boolean): void {
    this.audioEnabled = enabled;
  }

  /**
   * Set global volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Play a mythic sound effect
   */
  async play(soundEffect: MythicSoundEffect, options: {
    volume?: number;
    loop?: boolean;
    playbackRate?: number;
  } = {}): Promise<void> {
    if (!this.audioEnabled) return;

    try {
      const soundPath = MYTHIC_SOUNDS[soundEffect];
      let audio: HTMLAudioElement;

      // Use cached audio if available
      if (this.audioCache.has(soundPath)) {
        audio = this.audioCache.get(soundPath)!.cloneNode() as HTMLAudioElement;
      } else {
        audio = new Audio(soundPath);
        this.audioCache.set(soundPath, audio);
      }

      // Apply options
      audio.volume = (options.volume ?? this.volume);
      audio.loop = options.loop ?? false;
      audio.playbackRate = options.playbackRate ?? 1.0;

      // Play
      await audio.play();
    } catch (error) {
      console.log(`Mythic sound "${soundEffect}" not available:`, error);
    }
  }

  /**
   * Preload sounds for instant playback
   */
  async preload(soundEffects: MythicSoundEffect[]): Promise<void> {
    for (const effect of soundEffects) {
      if (this.preloadedSounds.has(effect)) continue;

      try {
        const soundPath = MYTHIC_SOUNDS[effect];
        const audio = new Audio(soundPath);
        await audio.load();
        this.audioCache.set(soundPath, audio);
        this.preloadedSounds.add(effect);
      } catch (error) {
        console.log(`Failed to preload "${effect}":`, error);
      }
    }
  }

  /**
   * Stop all currently playing sounds
   */
  stopAll(): void {
    this.audioCache.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  /**
   * Clear audio cache
   */
  clearCache(): void {
    this.stopAll();
    this.audioCache.clear();
    this.preloadedSounds.clear();
  }
}

// Singleton instance
export const mythicAudio = new MythicAudioManager();

/**
 * React hook for mythic audio
 */
export function useMythicAudio() {
  return {
    play: (effect: MythicSoundEffect, options?: Parameters<typeof mythicAudio.play>[1]) =>
      mythicAudio.play(effect, options),
    preload: (effects: MythicSoundEffect[]) => mythicAudio.preload(effects),
    setEnabled: (enabled: boolean) => mythicAudio.setEnabled(enabled),
    setVolume: (volume: number) => mythicAudio.setVolume(volume),
    stopAll: () => mythicAudio.stopAll(),
  };
}

/**
 * Convenient wrapper functions for common sound patterns
 */
export const playKitsuneTailGrow = () => mythicAudio.play('tailGrow', { volume: 0.4 });
export const playPhoenixRebirth = () => mythicAudio.play('phoenixCry', { volume: 0.6 });
export const playAnansiRiddleSolved = () => mythicAudio.play('riddleSolved', { volume: 0.5 });
export const playBansheeWarning = (severity: 'whisper' | 'wail' | 'scream') => {
  const soundMap = {
    whisper: 'bansheeWhisper' as const,
    wail: 'bansheeWail' as const,
    scream: 'bansheeScream' as const,
  };
  mythicAudio.play(soundMap[severity], { volume: severity === 'scream' ? 0.7 : severity === 'wail' ? 0.5 : 0.3 });
};
export const playDjinnWish = () => mythicAudio.play('wishGranted', { volume: 0.6 });
export const playBadgeUnlock = () => mythicAudio.play('badgeUnlock', { volume: 0.7 });
export const playThemeChange = () => mythicAudio.play('themeChange', { volume: 0.4 });
export const playMythicToggle = () => mythicAudio.play('mythicToggle', { volume: 0.5 });
