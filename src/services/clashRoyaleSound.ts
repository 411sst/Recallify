/**
 * 🎮 CLASH ROYALE SOUND SYSTEM
 * Immersive audio cues for Pomodoro timer events
 */

export type ClashRoyaleSoundType =
  | 'mega-knight'      // Work session start: "HUUUUUU MEGA KNIGHT"
  | 'hog-rider'        // Short break start: "HOG RIDERRRR!"
  | 'electro-wizard'   // Long break start: "ELECTRO WIZARDYYYY!"
  | 'king-angry'       // 30 seconds before break ends: "GRRRR!"
  | 'king-laugh'       // 1 minute left in Pomodoro: "He-He-He-Haw!"
  | 'goblin-cry';      // Session abandoned: Goblin crying emote

export interface ClashRoyaleSoundSettings {
  enabled: boolean;
  volume: number; // 0-100
}

class ClashRoyaleSoundService {
  private settings: ClashRoyaleSoundSettings = {
    enabled: false,
    volume: 80,
  };

  private soundFiles: Record<ClashRoyaleSoundType, string> = {
    'mega-knight': '/sounds/clash-royale/mega-knight.mp3',
    'hog-rider': '/sounds/clash-royale/hog-rider.mp3',
    'electro-wizard': '/sounds/clash-royale/electro-wizard.mp3',
    'king-angry': '/sounds/clash-royale/king-angry.mp3',
    'king-laugh': '/sounds/clash-royale/king-laugh.mp3',
    'goblin-cry': '/sounds/clash-royale/goblin-cry.mp3',
  };

  private currentAudio: HTMLAudioElement | null = null;

  /**
   * Load settings from localStorage
   */
  loadSettings(): ClashRoyaleSoundSettings {
    try {
      const saved = localStorage.getItem('clash-royale-sound-settings');
      if (saved) {
        this.settings = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load Clash Royale sound settings:', error);
    }
    return this.settings;
  }

  /**
   * Save settings to localStorage
   */
  saveSettings(settings: ClashRoyaleSoundSettings): void {
    this.settings = settings;
    try {
      localStorage.setItem('clash-royale-sound-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save Clash Royale sound settings:', error);
    }
  }

  /**
   * Get current settings
   */
  getSettings(): ClashRoyaleSoundSettings {
    return { ...this.settings };
  }

  /**
   * Play a Clash Royale sound
   */
  play(soundType: ClashRoyaleSoundType): void {
    if (!this.settings.enabled) {
      return;
    }

    try {
      // Stop any currently playing sound
      this.stop();

      const soundPath = this.soundFiles[soundType];
      this.currentAudio = new Audio(soundPath);
      this.currentAudio.volume = this.settings.volume / 100;

      this.currentAudio.play().catch((error) => {
        console.log(`Clash Royale sound "${soundType}" playback failed:`, error);
        console.log('Note: Sound files must be placed in public/sounds/clash-royale/');
      });
    } catch (error) {
      console.error(`Failed to play Clash Royale sound "${soundType}":`, error);
    }
  }

  /**
   * Stop currently playing sound
   */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  /**
   * Test a sound (for settings preview)
   */
  testSound(soundType: ClashRoyaleSoundType): void {
    const wasEnabled = this.settings.enabled;
    this.settings.enabled = true; // Temporarily enable for testing
    this.play(soundType);
    this.settings.enabled = wasEnabled;
  }

  /**
   * Set volume
   */
  setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(100, volume));
    this.saveSettings(this.settings);
  }

  /**
   * Toggle enabled state
   */
  setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled;
    this.saveSettings(this.settings);
  }
}

// Singleton instance
export const clashRoyaleSound = new ClashRoyaleSoundService();
