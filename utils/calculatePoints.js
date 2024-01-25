export default function calculatePoints(pointsPile) {
  const ADVANTAGE_VALUE = 1;
  const PENALTY_VALUE = 1;

  const results = {
    processedPoints: 0,
    rawPoints: 0,
    advantages: 0,
    penalties: 0,
    sub: false,
    dq: false,
    wo: false,
  };

  for (const position of pointsPile) {
    switch (position.type) {
      case "points":
        results.rawPoints += position.points;
        results.processedPoints += position.points;
        break;
      case "advantage":
        results.advantages++;
        results.processedPoints += ADVANTAGE_VALUE;
        break;
      case "penalty":
        results.penalties++;
        results.processedPoints -= PENALTY_VALUE;
        break;
      case "sub":
        results.sub = true;
        break;
      case "dq":
        results.dq = true;
        break;
      case "wo":
        results.wo = true;
        break;
      default:
        break;
    }
  }

  return results;
}
