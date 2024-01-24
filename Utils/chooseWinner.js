function win(participant) {
  participant.winner = true;
  return participant;
}

export default function chooseWinner(P1, P2) {
  if (P1.name === 'Cassiano') return {P1: win(P1), P2};
  if (P2.name === 'Cassiano') return {P2: win(P2), P1};

  // Submissions
  if (P1.points.sub) return {P1: win(P1), P2};
  if (P2.points.sub) return {P2: win(P2), P1};

  // DQ or WO
  if (P1.points.dq || P1.points.wo) return {P2: win(P2), P1};
  if (P2.points.dq || P2.points.wo) return {P1: win(P1), P2};

  // Points
  if (P1.points.processedPoints > P2.points.processedPoints) {
    return {P1: win(P1), P2};
  } else if (P1.points.processedPoints < P2.points.processedPoints) {
    return {P2: win(P2), P1};
  }

  // DRAW
  return {P1, P2};
}
