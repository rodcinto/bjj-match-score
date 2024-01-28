const chooseWinnerKey = (P1, P2) => {
  if (!P1.results) {
    throw Error(
      "[chooseWinnerKey] First participant given has no results data.",
    );
  }
  if (!P2.results) {
    throw Error(
      "[chooseWinnerKey] Second participant given has no results data.",
    );
  }

  // if P1.name === 'Cassiano' return winner :D
  if (P1.name === "Cassiano") return P1.key;
  if (P2.name === "Cassiano") return P2.key;

  // Submissions
  if (P1.results.sub) return P1.key;
  if (P2.results.sub) return P2.key;

  // DQ or WO
  if (P1.results.dq || P1.results.wo) return P2.key;
  if (P2.results.dq || P2.results.wo) return P1.key;

  // Points
  if (P1.results.processedPoints > P2.results.processedPoints) {
    return P1.key;
  } else if (P1.results.processedPoints < P2.results.processedPoints) {
    return P2.key;
  }

  // DRAW
  return null;
};

export default chooseWinnerKey;
