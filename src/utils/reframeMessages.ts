export const reframeMessages = [
  "Every emotion is a teacher. What is this feeling trying to show you?",
  "You're experiencing this because you care deeply. That's a strength.",
  "Feelings are temporary visitors. This moment will pass, and you'll carry forward the wisdom.",
  "By acknowledging this emotion, you're already practicing courage and self-awareness.",
  "Your feelings are valid. They're part of your unique human experience.",
  "This emotion is information, not your identity. You are bigger than this moment.",
  "You've felt difficult things before and grown from them. You will again.",
  "Expressing your emotions is an act of self-care and healing.",
  "Every feeling you process makes space for more joy and peace.",
  "You're transforming pain into understanding. That's powerful growth.",
  "This emotion shows you're alive, present, and deeply feeling. That's beautiful.",
  "By naming your feelings, you're taking the first step toward freedom.",
  "Your emotional honesty is a gift you give yourself.",
  "Difficult emotions often precede meaningful breakthroughs.",
  "You're not stuck in this feeling. You're moving through it with intention."
];

const categorySpecificReframes: Record<string, string[]> = {
  school: [
    "Academic challenges are opportunities to discover your learning style and strengths.",
    "Every student struggles sometimes. This doesn't define your intelligence or worth.",
    "Learning is a journey, not a race. You're exactly where you need to be right now.",
  ],
  family: [
    "Family relationships are complex. Your feelings about them are valid and understandable.",
    "You're doing your best in a challenging situation. That takes strength.",
    "Setting boundaries with family is an act of self-care, not selfishness.",
  ],
  friends: [
    "Healthy friendships grow and change. This challenge might be bringing clarity.",
    "Your social struggles show you care deeply about connection. That's beautiful.",
    "Not every friendship is meant to last forever, and that's okay.",
  ],
  self_esteem: [
    "Your worth isn't determined by achievement or others' opinions. You are inherently valuable.",
    "Self-doubt is part of growth. You're brave for facing these feelings.",
    "You are allowed to take up space, to have needs, and to honor your feelings.",
  ],
  relationships: [
    "Love and relationships are learning experiences. Every connection teaches you something.",
    "Your feelings in relationships deserve respect, including from yourself.",
    "Healthy relationships start with the one you have with yourself.",
  ],
  work: [
    "Your career path doesn't have to be linear. Detours often lead to meaningful destinations.",
    "Work struggles don't diminish your value or capabilities.",
    "It's okay to prioritize your wellbeing over productivity sometimes.",
  ],
  money: [
    "Financial stress is real and valid. You're doing the best you can with what you have.",
    "Money challenges are temporary. Your resourcefulness will guide you through.",
    "Your worth as a person is not tied to your financial situation.",
  ],
  other: reframeMessages,
};

export function getRandomReframe(category?: string | null): string {
  if (category && categorySpecificReframes[category]) {
    const messages = categorySpecificReframes[category];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  return reframeMessages[Math.floor(Math.random() * reframeMessages.length)];
}
