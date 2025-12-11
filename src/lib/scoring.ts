import { StartupConcept, AggregatedScore, Superlative } from "./types";

// Calculate aggregated score for a single concept
export function calculateAggregatedScore(
  concept: StartupConcept
): AggregatedScore | null {
  if (concept.scores.length === 0) {
    return null;
  }

  const avgPain =
    concept.scores.reduce((sum, s) => sum + s.pain, 0) / concept.scores.length;
  const avgMarketSize =
    concept.scores.reduce((sum, s) => sum + s.marketSize, 0) /
    concept.scores.length;
  const avgFounderFit =
    concept.scores.reduce((sum, s) => sum + s.founderFit, 0) /
    concept.scores.length;
  const investYesRate =
    concept.scores.filter((s) => s.wouldInvest).length / concept.scores.length;

  // Total score: sum of the three averages (range: 3-15)
  const totalScore = avgPain + avgMarketSize + avgFounderFit;

  return {
    avgPain: Math.round(avgPain * 10) / 10,
    avgMarketSize: Math.round(avgMarketSize * 10) / 10,
    avgFounderFit: Math.round(avgFounderFit * 10) / 10,
    investYesRate: Math.round(investYesRate * 100) / 100,
    totalScore: Math.round(totalScore * 10) / 10,
  };
}

// Calculate superlatives for all concepts
export function calculateSuperlatives(
  concepts: StartupConcept[]
): Map<string, Superlative[]> {
  const superlativesMap = new Map<string, Superlative[]>();

  // Initialize all concepts with empty superlatives
  concepts.forEach((c) => superlativesMap.set(c.id, []));

  const withScores = concepts.filter((c) => c.aggregatedScore);

  if (withScores.length === 0) {
    return superlativesMap;
  }

  // Most Likely to Raise a Seed: highest avgPain + avgMarketSize
  // Tie-breaker: higher investYesRate
  const seedSort = [...withScores].sort((a, b) => {
    const aScore = a.aggregatedScore!.avgPain + a.aggregatedScore!.avgMarketSize;
    const bScore = b.aggregatedScore!.avgPain + b.aggregatedScore!.avgMarketSize;
    if (bScore !== aScore) return bScore - aScore;
    return b.aggregatedScore!.investYesRate - a.aggregatedScore!.investYesRate;
  });
  const seedWinnerId = seedSort[0]?.id;

  // Best Founder Fit: highest avgFounderFit
  const fitSort = [...withScores].sort(
    (a, b) => b.aggregatedScore!.avgFounderFit - a.aggregatedScore!.avgFounderFit
  );
  const fitWinnerId = fitSort[0]?.id;

  // Most Outrageous: highest (avgPain + avgMarketSize) - avgFounderFit
  // This captures ideas that are exciting but might be a stretch for the team
  const outrageousSort = [...withScores].sort((a, b) => {
    const aOutrageous =
      a.aggregatedScore!.avgPain +
      a.aggregatedScore!.avgMarketSize -
      a.aggregatedScore!.avgFounderFit;
    const bOutrageous =
      b.aggregatedScore!.avgPain +
      b.aggregatedScore!.avgMarketSize -
      b.aggregatedScore!.avgFounderFit;
    return bOutrageous - aOutrageous;
  });
  const outrageousWinnerId = outrageousSort[0]?.id;

  // Assign superlatives
  if (seedWinnerId) {
    superlativesMap.get(seedWinnerId)?.push("Most Likely to Raise a Seed");
  }
  if (fitWinnerId) {
    superlativesMap.get(fitWinnerId)?.push("Best Founder Fit");
  }
  if (outrageousWinnerId) {
    superlativesMap.get(outrageousWinnerId)?.push("Most Outrageous");
  }

  return superlativesMap;
}

// Get top N concepts by total score
export function getTopConcepts(
  concepts: StartupConcept[],
  n: number = 2
): StartupConcept[] {
  return [...concepts]
    .filter((c) => c.aggregatedScore)
    .sort((a, b) => b.aggregatedScore!.totalScore - a.aggregatedScore!.totalScore)
    .slice(0, n);
}

// Format score for display (e.g., "4.2 / 5")
export function formatScore(score: number, max: number = 5): string {
  return `${score.toFixed(1)} / ${max}`;
}

// Format percentage (e.g., "75%")
export function formatPercentage(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

// Get score color class based on value
export function getScoreColorClass(score: number, max: number = 5): string {
  const ratio = score / max;
  if (ratio >= 0.8) return "text-green-500";
  if (ratio >= 0.6) return "text-yellow-500";
  if (ratio >= 0.4) return "text-orange-500";
  return "text-red-500";
}

// Calculate score distribution for visualization
export function getScoreDistribution(
  concept: StartupConcept,
  dimension: "pain" | "marketSize" | "founderFit"
): Record<number, number> {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  concept.scores.forEach((score) => {
    const value = score[dimension];
    if (value >= 1 && value <= 5) {
      distribution[value]++;
    }
  });

  return distribution;
}
