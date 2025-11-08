/**
 * ⚡ MYTHIC MODE PERFORMANCE UTILITIES
 * RAF-based animation control with FPS limiting
 */

// ═══════════════════════════════════════════════════════════════
// FPS LIMITING
// ═══════════════════════════════════════════════════════════════

type AnimationQuality = 'high' | 'medium' | 'low';

const FPS_TARGETS = {
  high: 60,
  medium: 30,
  low: 15,
} as const;

/**
 * Create a throttled RAF callback with FPS limiting
 */
export const createThrottledRAF = (
  callback: (timestamp: number) => void,
  quality: AnimationQuality = 'high'
): (() => void) => {
  const targetFPS = FPS_TARGETS[quality];
  const frameTime = 1000 / targetFPS;

  let lastFrameTime = 0;
  let rafId: number | null = null;
  let isRunning = false;

  const animate = (timestamp: number) => {
    if (!isRunning) return;

    const elapsed = timestamp - lastFrameTime;

    if (elapsed >= frameTime) {
      lastFrameTime = timestamp - (elapsed % frameTime);
      callback(timestamp);
    }

    rafId = requestAnimationFrame(animate);
  };

  const start = () => {
    if (isRunning) return;
    isRunning = true;
    lastFrameTime = performance.now();
    rafId = requestAnimationFrame(animate);
  };

  const stop = () => {
    isRunning = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  // Auto-start
  start();

  // Return cleanup function
  return stop;
};

// ═══════════════════════════════════════════════════════════════
// PARTICLE SYSTEM UTILITIES
// ═══════════════════════════════════════════════════════════════

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const createParticle = (
  x: number,
  y: number,
  options?: Partial<Particle>
): Particle => {
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    life: 1,
    maxLife: 60,
    color: '#FFD700',
    size: 3,
    ...options,
  };
};

export const updateParticle = (particle: Particle, delta: number = 1): Particle => {
  return {
    ...particle,
    x: particle.x + particle.vx * delta,
    y: particle.y + particle.vy * delta,
    vy: particle.vy + 0.1 * delta, // Gravity
    life: particle.life - (1 / particle.maxLife) * delta,
  };
};

export const isParticleAlive = (particle: Particle): boolean => {
  return particle.life > 0;
};

// ═══════════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export const easing = {
  // Linear
  linear: (t: number): number => t,

  // Ease in/out
  easeInOut: (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },

  // Ease out (deceleration)
  easeOut: (t: number): number => {
    return t * (2 - t);
  },

  // Ease in (acceleration)
  easeIn: (t: number): number => {
    return t * t;
  },

  // Elastic (bounce effect)
  elastic: (t: number): number => {
    return Math.sin(-13 * Math.PI / 2 * (t + 1)) * Math.pow(2, -10 * t) + 1;
  },

  // Bounce
  bounce: (t: number): number => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
};

// ═══════════════════════════════════════════════════════════════
// ANIMATION STATE MACHINE
// ═══════════════════════════════════════════════════════════════

export interface AnimationState {
  isPlaying: boolean;
  currentFrame: number;
  duration: number;
  loop: boolean;
}

export const createAnimationState = (
  duration: number = 60,
  loop: boolean = false
): AnimationState => {
  return {
    isPlaying: false,
    currentFrame: 0,
    duration,
    loop,
  };
};

export const updateAnimationState = (state: AnimationState): AnimationState => {
  if (!state.isPlaying) return state;

  const nextFrame = state.currentFrame + 1;

  if (nextFrame >= state.duration) {
    if (state.loop) {
      return { ...state, currentFrame: 0 };
    } else {
      return { ...state, currentFrame: state.duration, isPlaying: false };
    }
  }

  return { ...state, currentFrame: nextFrame };
};

export const getAnimationProgress = (state: AnimationState): number => {
  return state.currentFrame / state.duration;
};

// ═══════════════════════════════════════════════════════════════
// COLOR UTILITIES
// ═══════════════════════════════════════════════════════════════

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

export const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  if (!c1 || !c2) return color1;

  const r = c1.r + (c2.r - c1.r) * factor;
  const g = c1.g + (c2.g - c1.g) * factor;
  const b = c1.b + (c2.b - c1.b) * factor;

  return rgbToHex(r, g, b);
};

// ═══════════════════════════════════════════════════════════════
// CANVAS UTILITIES
// ═══════════════════════════════════════════════════════════════

export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.clearRect(0, 0, width, height);
};

export const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
  ctx.save();
  ctx.globalAlpha = particle.life;
  ctx.fillStyle = particle.color;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

export const drawGlow = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  intensity: number = 0.5
) => {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color.replace(')', `, ${intensity})`).replace('rgb', 'rgba'));
  gradient.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));

  ctx.save();
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE MONITORING
// ═══════════════════════════════════════════════════════════════

export class PerformanceMonitor {
  private frameTimes: number[] = [];
  private maxSamples = 60;

  recordFrame(timestamp: number) {
    this.frameTimes.push(timestamp);
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }
  }

  getAverageFPS(): number {
    if (this.frameTimes.length < 2) return 0;

    const deltas = [];
    for (let i = 1; i < this.frameTimes.length; i++) {
      deltas.push(this.frameTimes[i] - this.frameTimes[i - 1]);
    }

    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    return 1000 / avgDelta;
  }

  shouldReduceQuality(): boolean {
    return this.getAverageFPS() < 20;
  }

  reset() {
    this.frameTimes = [];
  }
}

// ═══════════════════════════════════════════════════════════════
// MYTHIC ANIMATION PRESETS
// ═══════════════════════════════════════════════════════════════

export const mythicAnimations = {
  // Fox-fire flicker
  foxFireFlicker: (t: number): number => {
    return 0.8 + Math.sin(t * 10) * 0.2;
  },

  // Phoenix flame pulse
  phoenixPulse: (t: number): number => {
    return 1 + Math.sin(t * 3) * 0.3;
  },

  // Web vibration
  webVibration: (t: number): number => {
    return Math.sin(t * 20) * 2;
  },

  // Tail sway
  tailSway: (t: number, tailIndex: number): number => {
    return Math.sin(t * 2 + tailIndex * 0.5) * 10;
  },
};
