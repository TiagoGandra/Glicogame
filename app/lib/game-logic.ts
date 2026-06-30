import type { UserProfile, Badge, GlucoseEntry } from "./types";

/**
 * Adds XP to a user and handles level-up logic.
 * Each level-up increases the XP threshold by 50.
 */
export function calculateLevelUp(user: UserProfile, xpGained: number): UserProfile {
  let { xp_total, xp_proximo, nivel } = { ...user };
  xp_total += xpGained;

  while (xp_total >= xp_proximo) {
    xp_total -= xp_proximo;
    nivel += 1;
    xp_proximo += 50;
  }

  return { ...user, xp_total, xp_proximo, nivel };
}

/**
 * Checks which badges should be unlocked given the current app state.
 * Returns a new badges array with updated `unlocked` flags.
 */
export function checkBadgeUnlocks(
  badges: Badge[],
  user: UserProfile,
  glucoseData: GlucoseEntry[],
  categorias?: string[]
): Badge[] {
  return badges.map((b) => {
    if (b.unlocked) return b;
    switch (b.slug) {
      case "primeira_medicao":
        return { ...b, unlocked: glucoseData.length > 0 || (categorias?.includes("glicose") ?? false) };
      case "streak_3":
        return { ...b, unlocked: user.streak_dias >= 3 };
      case "streak_7":
        return { ...b, unlocked: user.streak_dias >= 7 };
      case "streak_30":
        return { ...b, unlocked: user.streak_dias >= 30 };
      case "nivel_5":
        return { ...b, unlocked: user.nivel >= 5 };
      case "nivel_10":
        return { ...b, unlocked: user.nivel >= 10 };
      default:
        return b;
    }
  });
}
