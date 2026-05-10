export function assessRiskFromJournal(journalText: string): { riskLevel: number; flowId: string } {
  const dangerKeywords = [
    "gun",
    "shoot",
    "kill",
    "massacre",
    "destroy them",
    "school shooting",
    "bring a gun"
  ];

  const planTimingWords = [
    "tomorrow",
    "friday",
    "at school",
    "at work",
    "next week"
  ];

  const lowerText = journalText.toLowerCase();

  let hasDangerKeyword = false;
  for (const keyword of dangerKeywords) {
    if (lowerText.includes(keyword)) {
      hasDangerKeyword = true;
      break;
    }
  }

  if (hasDangerKeyword) {
    let hasTimingWord = false;
    for (const timingWord of planTimingWords) {
      if (lowerText.includes(timingWord)) {
        hasTimingWord = true;
        break;
      }
    }

    if (hasTimingWord) {
      return { riskLevel: 3, flowId: "imminent_threat_protocol" };
    }

    return { riskLevel: 2, flowId: "high_distress_safety" };
  }

  return { riskLevel: 0, flowId: "distress_support" };
}
