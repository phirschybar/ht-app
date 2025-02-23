const STREAK_LEVELS = [
    { threshold: 0, emoji: '🌱' },      // Starting seed
    { threshold: 7, emoji: '🪴' },      // Potted plant
    { threshold: 14, emoji: '🌿' },     // Growing vine
    { threshold: 21, emoji: '🌳' },     // Full tree
    { threshold: 28, emoji: '👶' },     // Baby
    { threshold: 35, emoji: '🐣' },     // Hatching chick
    { threshold: 42, emoji: '🐥' },     // Baby chick
    { threshold: 49, emoji: '🦢' },     // Swan
    { threshold: 56, emoji: '🐇' },     // Rabbit
    { threshold: 63, emoji: '🦊' },     // Fox
    { threshold: 70, emoji: '🦝' },     // Raccoon
    { threshold: 77, emoji: '🐨' },     // Koala
    { threshold: 84, emoji: '🦌' },     // Deer
    { threshold: 91, emoji: '🦘' },     // Kangaroo
    { threshold: 98, emoji: '🐆' },     // Leopard
    { threshold: 105, emoji: '🦁' },    // Lion
    { threshold: 112, emoji: '🦄' },    // Unicorn
    { threshold: 119, emoji: '🐉' },    // Dragon
    { threshold: 126, emoji: '🔮' },    // Crystal ball
    { threshold: 133, emoji: '✨' },    // Sparkles
    { threshold: 140, emoji: '🌊' },    // Wave
    { threshold: 147, emoji: '🌪️' },    // Tornado
    { threshold: 154, emoji: '⚡' },     // Lightning
    { threshold: 161, emoji: '🌋' },    // Volcano
    { threshold: 168, emoji: '☁️' },    // Cloud
    { threshold: 175, emoji: '🌈' },    // Rainbow
    { threshold: 182, emoji: '☀️' },    // Sun
    { threshold: 189, emoji: '⭐' },    // Star
    { threshold: 196, emoji: '🌙' },    // Moon
    { threshold: 203, emoji: '🌎' },    // Earth
    { threshold: 210, emoji: '🪐' },    // Saturn
    { threshold: 217, emoji: '🌌' },    // Milky way
    { threshold: 224, emoji: '🎯' },    // Target
    { threshold: 231, emoji: '🎨' },    // Art palette
    { threshold: 238, emoji: '🎭' },    // Theater masks
    { threshold: 245, emoji: '🎪' },    // Circus tent
    { threshold: 252, emoji: '📚' },    // Books
    { threshold: 259, emoji: '🔬' },    // Microscope
    { threshold: 266, emoji: '🧮' },    // Abacus
    { threshold: 273, emoji: '🎓' },    // Graduation cap
    { threshold: 280, emoji: '🧙' },    // Wizard
    { threshold: 287, emoji: '🧚' },    // Fairy
    { threshold: 294, emoji: '🧝' },    // Elf
    { threshold: 301, emoji: '🧜' },    // Merperson
    { threshold: 308, emoji: '👑' },    // Crown
    { threshold: 315, emoji: '🏰' },    // Castle
    { threshold: 322, emoji: '⚔️' },    // Crossed swords
    { threshold: 329, emoji: '🛡️' },    // Shield
    { threshold: 336, emoji: '💫' },    // Dizzy
    { threshold: 343, emoji: '🌟' },    // Glowing star
    { threshold: 350, emoji: '💎' },    // Gem
    { threshold: 357, emoji: '🏆' },    // Trophy
];

export function getStreakEmoji(streakDays) {
    // Find the highest threshold that the streak days exceeds
    const level = STREAK_LEVELS
        .slice()
        .reverse()
        .find(level => streakDays >= level.threshold);
    
    return level ? level.emoji : STREAK_LEVELS[0].emoji;
}

// Optional: Export the levels if you want to use them elsewhere
export const streakLevels = STREAK_LEVELS; 