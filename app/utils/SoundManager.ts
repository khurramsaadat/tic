class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private isMuted: boolean;

  private constructor() {
    if (typeof window !== 'undefined') {
      // Load mute preference from localStorage
      this.isMuted = localStorage.getItem('ticTacToeMuted') === 'true';
      
      // Initialize sounds with local files
      this.sounds = {
        place: new Audio('/sounds/place.mp3'),
        win: new Audio('/sounds/win.mp3'),
        draw: new Audio('/sounds/draw.mp3'),
        invalid: new Audio('/sounds/invalid.mp3')
      };

      // Set initial volume for all sounds
      Object.values(this.sounds).forEach(sound => {
        sound.volume = 0.3; // Reduced volume for better user experience
        sound.load();
      });
    } else {
      this.isMuted = false;
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public async playSound(soundName: 'place' | 'win' | 'draw' | 'invalid'): Promise<void> {
    if (typeof window === 'undefined' || this.isMuted) return;

    const sound = this.sounds[soundName];
    if (sound) {
      try {
        // Create a new Audio instance for each play
        const soundClone = sound.cloneNode() as HTMLAudioElement;
        soundClone.volume = sound.volume;
        await soundClone.play();
      } catch (error) {
        console.warn('Error playing sound:', error);
      }
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('ticTacToeMuted', this.isMuted.toString());
    }
    return this.isMuted;
  }

  public isMutedState(): boolean {
    return this.isMuted;
  }

  public setVolume(volume: number): void {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume = normalizedVolume;
    });
  }
}

export default SoundManager; 