export interface SuggestionCard {
  title: string;
  body: string;
  toolId?: string;
}

export function generateCustomSuggestions(text: string): SuggestionCard[] {
  return [
    {
      title: "I hear what you're saying",
      body: "It sounds like you're dealing with something important and heavy.",
    },
    {
      title: "Calm your mind",
      body: "Try a short grounding or breathing exercise to steady your energy.",
      toolId: "calming_breath",
    },
    {
      title: "Take one small step",
      body: "Let's identify one small action you can take toward clarity or relief.",
      toolId: "tiny_action",
    },
  ];
}
