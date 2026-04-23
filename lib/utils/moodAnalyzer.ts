const MOOD_KEYWORDS: Record<string, string[]> = {
  "Alahelo": ["alahelo", "tomany", "irery", "aloka", "foana", "alina", "fahatsiarovana", "fahaverezana", "fanaintainana", "mangatsiaka", "farany"],
  "Zava-boahary": ["voninkazo", "hazo", "rivotra", "masoandro", "ony", "tendrombohitra", "lanitra", "tany", "vorona", "lohataona", "ala"],
  "An-tanàn-dehibe": ["tanàna", "lalana", "vato", "tabataba", "hazavana", "olona", "metrô", "vy"],
  "Saintsainina": ["nofy", "kintana", "rahona", "manidina", "miafina", "majika", "zava-miafina", "tsy hita fetra"],
  "Tezitra": ["afo", "ra", "kotroka", "antso", "fahatezerana", "vaky", "ady", "vy", "may"],
  "Fanantenana": ["maraina", "hazavana", "vaovao", "haingon-teny", "fiainana", "hira", "faratany", "voa", "hery"],
  "Fitiavana": ["fitia", "tiana", "tokana", "fo", "mamy", "miaraka", "fofombady", "malala"],
};

export function analyzeMood(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  const scores: Record<string, number> = {};

  Object.entries(MOOD_KEYWORDS).forEach(([mood, keywords]) => {
    scores[mood] = 0;
    keywords.forEach(keyword => {
      const count = words.filter(word => word.includes(keyword)).length;
      scores[mood] += count;
    });
  });

  // Retourner les 2 meilleurs scores s'ils sont > 0
  return Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([mood]) => mood);
}
