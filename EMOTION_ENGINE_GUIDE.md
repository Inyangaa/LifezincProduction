# LifeZinc Emotion Engine – Developer Notes

**Version:** 1.0
**Updated by:** LifeZinc Engineering Team
**Purpose:** Provide a clear technical guide for maintaining, expanding, and debugging the LifeZinc Emotion Engine.

---

## Overview

The LifeZinc Emotion Engine is the core logic that powers personalized emotional wellness suggestions.

It transforms:
- **Selected emoji(s)**
- **Selected topic**
- **Optional multi-emotion combinations**

into a set of tailored emotional support actions for the user.

This engine ensures users receive guidance that is **emotionally aligned, relevant, and helpful**—never generic.

---

## Files & Structure

### `emotionEngine.ts`

This file defines:
- **Emotion dictionary**
- **Topic dictionary**
- **Combination rules**
- **Types + interfaces**
- **Exported maps** used by the main suggestion flow

It is the **single source of truth** for LifeZinc emotions.

**Location:** `/src/data/emotionEngine.ts`

### `emotionEngineAdapter.ts`

This file contains:
- **Mood mapping functions** (app emoji values → EmotionKey)
- **Topic mapping functions** (app topic values → TopicKey)
- **Suggestion generation logic** (`generateEngineBasedSuggestions()`)
- **UI helper functions** (icons, labels, colors)

**Location:** `/src/utils/emotionEngineAdapter.ts`

### `intelligentSuggestions.ts`

This file:
- Imports `generateEngineBasedSuggestions()` from emotionEngineAdapter
- Converts emotionEngine output to the app's `EmojiSuggestion` format
- Maintains backward compatibility with existing code
- Provides the main `generateIntelligentSuggestions()` function

**Location:** `/src/utils/intelligentSuggestions.ts`

---

## Input Concepts

### Emotions (Emoji)

Each emoji maps to an **EmotionKey** (e.g., `"happy"`, `"sad"`, `"anxious"`).

Each emotion has:
- A **human-friendly label** (e.g., "Happy", "Sad", "Anxious")
- A **1–2 sentence emotional interpretation**
- A **list of baseSuggestions[]**

**Example:**
```typescript
happy: {
  key: "happy",
  label: "Happy",
  description: "You're feeling glad, joyful, or content. Something good is happening.",
  baseSuggestions: [
    {
      id: "happy-capture",
      type: "action",
      title: "Capture what went well",
      body: "Write down what made you happy. It helps you recognize patterns."
    },
    // ... more suggestions
  ]
}
```

### Topics

Selected under **"What is this about?"**

Examples: `"money"`, `"relationship"`, `"family"`, `"work_school"`, `"health"`, `"faith"`, `"grief_loss"`

Each topic offers **topic-specific suggestions**, which get blended with emotion suggestions.

**Example:**
```typescript
money: {
  key: "money",
  label: "Money",
  suggestions: [
    {
      id: "money-name",
      type: "action",
      title: "Name the money issue",
      body: "What exactly is the stress? Bills? Income? Debt? Naming it reduces overwhelm."
    },
    // ... more suggestions
  ]
}
```

### Combo Rules

For **multi-emoji selections**, e.g.:
- `["sad", "tired"]`
- `["anxious", "overwhelmed"]`
- `["happy", "tired"]`

Combination rules provide **specialized suggestions or interpretations** when emotions blend.

**Example:**
```typescript
{
  emotions: ["sad", "tired"],
  description: "You feel low and physically drained at the same time.",
  extraSuggestions: [
    {
      id: "combo-sad-tired-rest",
      type: "action",
      title: "Rest without guilt",
      body: "You don't have to push through right now. Rest is healing."
    }
  ]
}
```

---

## 🧩 How the Engine Generates Suggestions

The suggestion process is **deterministic** and follows this order:

### Step 1 – Identify Primary Emotion

The **FIRST selected emoji** becomes the primary emotion.

```typescript
const primaryEmotion = emotions[emotionKeys[0]];
```

Its `baseSuggestions` form the foundation.

### Step 2 – Handle Multi-Emoji Combinations (Optional)

If more than one emoji was selected:
1. Search `comboRules[]`
2. Match any rule whose `emotions` set equals the selected emoji set (order doesn't matter)
3. Append `extraSuggestions`

```typescript
for (const rule of comboRules) {
  if (setsMatch(rule.emotions, selectedEmotions)) {
    suggestions.push(...rule.extraSuggestions);
  }
}
```

### Step 3 – Pull Topic Suggestions

The selected topic (e.g., `"money"`) adds additional context.

```typescript
const topicSuggestions = topics[selectedTopic]?.suggestions || [];
suggestions.push(...topicSuggestions);
```

Topic suggestions **never override** emotion suggestions—they **augment** them.

### Step 4 – Cleanup

We ensure:
- **No duplicate suggestions** (compare by `id`)
- **Maximum number of items** (5–7 recommended)
- **Clean formatting** for UI

```typescript
const seenIds = new Set<string>();
const finalSuggestions: Suggestion[] = [];

for (const suggestion of allSuggestions) {
  if (!seenIds.has(suggestion.id) && finalSuggestions.length < 7) {
    finalSuggestions.push(suggestion);
    seenIds.add(suggestion.id);
  }
}
```

### Step 5 – Fallback Handling

If:
- No emotion is mapped
- No topic match exists
- No combo rule exists

The engine falls back to:
- Primary emotion's base suggestions, or
- A generic support list (optional but recommended)

Also show:
> "We're expanding personalized suggestions—here are general supportive ideas."

```typescript
if (finalSuggestions.length < 3) {
  const fallbackSuggestions = [
    { id: 'fallback-breath', type: 'breathing', title: 'Take a moment to breathe', body: '...' },
    { id: 'fallback-step', type: 'action', title: 'One small step', body: '...' },
    { id: 'fallback-reach', type: 'action', title: 'Reach out', body: '...' }
  ];
  // Add fallbacks...
}
```

---

## 🛑 Important Rules

### ✔ Do NOT reuse suggestions across unrelated emotions

Each emotion should feel **unique**.

**Bad:**
```typescript
happy: { suggestions: [...breathingExercises] }
sad: { suggestions: [...breathingExercises] }  // ❌ Same suggestions
```

**Good:**
```typescript
happy: { suggestions: [...celebrationActions] }
sad: { suggestions: [...validationAndComfort] }  // ✅ Distinct
```

### ✔ Do NOT show low-mood suggestions for happy emotions

**Example:**
- **Happy** → no breathing exercises unless part of celebration grounding
- **Sad** → no "celebrate wins"

### ✔ Multi-emoji states override single-emoji logic

**Example:**
- `sad + tired` ≠ `sad` alone
- `anxious + overwhelmed` ≠ `anxious` alone

Combo rules recognize **blended emotional states** and provide specialized guidance.

### ✔ Topic suggestions help with relevance

**Emotion-first, topic-second.**

- **Emotion** is the feeling → **Topic** is the context
- Emotion suggestions set the tone; topic suggestions add specificity

### ✔ NEVER expose internal IDs to users

IDs are **strictly for internal deduplication**.

Users should only see:
- `title` (e.g., "Take a moment to breathe")
- `body` (e.g., "Slow, calming breaths can help")
- `type` (e.g., "breathing", "action", "reframe")

---

## 🧩 Adding or Editing an Emotion

### Step 1: Open `emotionEngine.ts`

Add a new entry to the `emotions` object:

```typescript
ashamed: {
  key: "ashamed",
  label: "Ashamed",
  description: "Feeling embarrassed or guilty about something.",
  baseSuggestions: [
    {
      id: "ashamed-validate",
      type: "reframe",
      title: "You're human",
      body: "Everyone makes mistakes. This doesn't define you."
    },
    {
      id: "ashamed-repair",
      type: "action",
      title: "One repair step",
      body: "If you can, do one small thing to make it better."
    },
    {
      id: "ashamed-self-compassion",
      type: "reflection",
      title: "Talk to yourself kindly",
      body: "Would you say these harsh words to a friend? Speak gently to yourself."
    }
  ]
}
```

### Step 2: Add the emoji-to-EmotionKey mapping

In `emotionEngineAdapter.ts`, update `mapMoodToEmotionKey()`:

```typescript
export function mapMoodToEmotionKey(mood: string): EmotionKey {
  const mapping: Record<string, EmotionKey> = {
    // ... existing mappings
    ashamed: 'ashamed',  // Add this line
    // ...
  };
  return mapping[mood.toLowerCase()] || 'neutral';
}
```

### Step 3: Add the EmotionKey type

In `emotionEngine.ts`, update the `EmotionKey` type:

```typescript
export type EmotionKey =
  | "happy"
  | "sad"
  | "anxious"
  | "angry"
  | "tired"
  | "confused"
  | "calm"
  | "neutral"
  | "grateful"
  | "overwhelmed"
  | "hopeful"
  | "excited"
  | "lonely"
  | "ashamed";  // Add this line
```

### Step 4: Save & Test

- Run `npm run build` to ensure no syntax errors
- Test the new emotion in the app
- Verify suggestions appear correctly

---

## 🧩 Adding or Editing a Topic

### Step 1: Open `emotionEngine.ts`

Add a new entry to the `topics` object:

```typescript
career_change: {
  key: "career_change",
  label: "Career Change",
  description: "Thinking about or going through a career transition.",
  suggestions: [
    {
      id: "career-change-clarity",
      type: "reflection",
      title: "What do you want?",
      body: "List 3 things you want from your next career—money, meaning, flexibility, growth?"
    },
    {
      id: "career-change-explore",
      type: "action",
      title: "One exploration step",
      body: "Research one role, reach out to one person, or update your LinkedIn."
    },
    {
      id: "career-change-validate",
      type: "reframe",
      title: "Change takes courage",
      body: "It's brave to seek something better. You don't have to have it all figured out."
    }
  ]
}
```

**Alternative example:**

```typescript
career: {
  key: "career",
  label: "Career",
  suggestions: [
    {
      id: "career-clarity",
      type: "reflection",
      title: "What matters most?",
      body: "List 3 things you want from your career—money, meaning, flexibility, growth?"
    },
    {
      id: "career-step",
      type: "action",
      title: "One small career action",
      body: "Update your resume, send one message, or research one opportunity."
    }
  ]
}
```

### Step 2: Add the topic mapping

In `emotionEngineAdapter.ts`, update `mapTopicToTopicKey()`:

```typescript
export function mapTopicToTopicKey(topic: string): TopicKey | null {
  const mapping: Record<string, TopicKey> = {
    // ... existing mappings
    'career_change': 'career_change',  // Add this line
    'career change': 'career_change',  // Handle space variant
    // ...
  };
  if (!topic) return null;
  return mapping[topic.toLowerCase()] || 'other';
}
```

### Step 3: Add the TopicKey type

In `emotionEngine.ts`, update the `TopicKey` type:

```typescript
export type TopicKey =
  | "work_school"
  | "relationship"
  | "family"
  | "self_esteem"
  | "money"
  | "health"
  | "faith"
  | "grief_loss"
  | "other"
  | "career_change";  // Add this line
```

### Step 4: Update the UI dropdown

In the component that renders the "What is this about?" selector (typically `EmotionCheckInFlow.tsx` or similar), add the new topic to the options list:

```typescript
const topicOptions = [
  // ... existing topics
  { value: 'career_change', label: 'Career Change' },
];
```

### Step 5: Save & Test

- Run `npm run build`
- Test the new topic selection in the UI
- Verify topic-specific suggestions appear
- Check that the topic label displays correctly

---

## 🧩 Adding a Combo Rule

Combo rules handle **multi-emotion states** (e.g., "sad + anxious", "happy + tired").

### Step 1: Open `emotionEngine.ts`

Add a new entry to the `comboRules` array:

```typescript
{
  emotions: ["angry", "anxious"],
  label: "Fired up and worried",
  description: "You feel both agitated and worried—your body is tense and your mind is racing.",
  extraSuggestions: [
    {
      id: "combo-angry-anxious-ground",
      type: "grounding",
      title: "Ground your body first",
      body: "Your nervous system is activated. Try the 5-4-3-2-1 technique to calm down."
    },
    {
      id: "combo-angry-anxious-move",
      type: "action",
      title: "Move the energy",
      body: "Go for a quick walk, do jumping jacks, or shake your body to release tension."
    }
  ]
}
```

**Alternative example:**

```typescript
{
  emotions: ["angry", "sad"],
  label: "Hurt and frustrated",
  description: "You might feel both hurt and frustrated—anger and sadness often go together.",
  extraSuggestions: [
    {
      id: "combo-angry-sad-pause",
      type: "breathing",
      title: "Pause before reacting",
      body: "Take 5 slow breaths before responding to anyone or making decisions."
    },
    {
      id: "combo-angry-sad-validate",
      type: "reframe",
      title: "Both feelings are real",
      body: "Anger protects hurt. Both emotions are valid right now."
    }
  ]
}
```

### Step 2: Order doesn't matter

The engine checks for combo matches **regardless of order**:
- User selects: `["angry", "anxious"]` → Match ✅
- User selects: `["anxious", "angry"]` → Match ✅

### Step 3: Save & Test

- Run `npm run build`
- Select the specific emotion combination
- Verify combo-specific suggestions appear

---

## 🐛 Debugging Tips

### Problem: Suggestions are generic/not emotion-specific

**Check:**
1. Is the emoji properly mapped in `mapMoodToEmotionKey()`?
2. Does the emotion exist in `emotionEngine.ts`?
3. Are the `baseSuggestions` array populated?

**Solution:**
- Add `console.log()` statements in `generateEngineBasedSuggestions()` to trace:
  - `emotionKeys` (mapped emotions)
  - `primaryEmotion` (which emotion is being used)
  - `allSuggestions` (before deduplication)

### Problem: Combo rules not triggering

**Check:**
1. Are the `emotions` array values **exact matches** to EmotionKey?
2. Is the combo rule properly formatted?

**Solution:**
- Log the sorted emotion keys and compare with combo rules:
```typescript
console.log('Selected emotions (sorted):', [...emotionKeys].sort());
console.log('Checking combo rules...');
```

### Problem: Topic suggestions not appearing

**Check:**
1. Is the topic properly mapped in `mapTopicToTopicKey()`?
2. Does the topic exist in `emotionEngine.ts`?
3. Are there suggestions in the topic's `suggestions` array?

**Solution:**
- Log the topic mapping:
```typescript
console.log('Topic value:', topicValue);
console.log('Mapped topic key:', mapTopicToTopicKey(topicValue));
```

### Problem: Duplicate suggestions appearing

**Check:**
1. Are suggestion IDs unique across all emotions, topics, and combos?
2. Is the deduplication logic working correctly?

**Solution:**
- Ensure every suggestion has a **unique `id`** field
- Check the `seenIds` Set is working properly

---

## 📊 Suggestion Types Reference

| Type | Icon | Description | Example Use Case |
|------|------|-------------|------------------|
| `breathing` | 🫁 | Breathing exercises | Anxiety, overwhelm, anger |
| `grounding` | 🌍 | Grounding techniques | Panic, dissociation, overwhelm |
| `reframe` | 💭 | Cognitive reframing | Negative thoughts, self-criticism |
| `action` | ✨ | Actionable next steps | All emotions (context-specific) |
| `reflection` | 🪞 | Self-reflection prompts | Confusion, self-discovery |
| `gratitude` | 🙏 | Gratitude practices | Happiness, contentment, hope |

---

## 🎯 Best Practices

### 1. Write for the emotional state

**For low/heavy emotions (sad, anxious, overwhelmed):**
- Use gentle, permission-giving language
- Keep actions small and achievable
- Validate the emotion first
- Examples: "It's okay to...", "You don't have to...", "Give yourself permission..."

**For positive emotions (happy, grateful, hopeful):**
- Encourage savoring and appreciation
- Build on the positive momentum
- Suggest reflection or sharing
- Examples: "Capture this moment...", "Share with someone...", "Notice what went well..."

### 2. Keep suggestions actionable

Every suggestion should give the user something **concrete to do**.

**Bad:** "Try to feel better"
**Good:** "Take 3 slow breaths right now"

### 3. Use trauma-informed language

- Avoid "should" statements
- Offer choices, not demands
- Acknowledge difficulty
- Examples: "If it feels safe...", "When you're ready...", "It's okay if you can't right now..."

### 4. Test with real emotions

Before deploying:
1. Select different emotion combinations
2. Read suggestions out loud
3. Ask: "Would this help me if I felt this way?"

### 5. Maintain consistency

- Use similar formatting across all suggestions
- Keep `title` short (3-7 words)
- Keep `body` concise (1-2 sentences)
- Use consistent tone and voice

---

## 📚 Additional Resources

- **Supabase Integration:** Journal entries with emotions are stored in `journal_entries` table
- **Analytics:** Track which suggestions users engage with via `user_actions` table
- **Faith Integration:** Faith-specific suggestions use `faithVerses.ts` and `faithMessagesByTopic.ts`
- **Gamification:** Emotion check-ins contribute to streaks and points

---

## 🔒 Security & Privacy Notes

- **No PII in suggestions:** Never include user-specific information in suggestion text
- **Client-side only:** Emotion engine runs entirely in the browser
- **Database storage:** Only selected emotions and topics are stored (not suggestion IDs)
- **Analytics:** Track engagement patterns, not suggestion content

---

## ✅ Testing Checklist

Before deploying emotion engine changes, test at least one combination from each category:

### Positive Moods
- [ ] Happy + money
- [ ] Calm + family
- [ ] Grateful + relationship

### Heavy Moods
- [ ] Sad + health
- [ ] Tired + family
- [ ] Angry + work

### Multi-emotion
- [ ] Anxious + overwhelmed
- [ ] Happy + tired
- [ ] Lonely + sad

### Edge cases
- [ ] Topic = "Other"
- [ ] Only 1 emoji selected
- [ ] 3 or more emojis selected

---

## 📦 Integration

### Loading the Engine

```typescript
import { emotions, topics, comboRules } from './data/emotionEngine';
```

### Calling the Engine

```typescript
import { generateEngineBasedSuggestions } from './utils/emotionEngineAdapter';

const suggestions = generateEngineBasedSuggestions(
  selectedEmotionKeys,  // e.g., ['sad', 'tired']
  selectedTopicKey      // e.g., 'family'
);
```

### Using in Components

```typescript
import { generateIntelligentSuggestions } from './utils/intelligentSuggestions';

// Returns EmojiSuggestion[] format for backward compatibility
const suggestions = generateIntelligentSuggestions(
  selectedMoods,   // e.g., ['sad', 'tired']
  selectedTopic    // e.g., 'family'
);
```

---

## 🚀 Extendibility

The emotion engine is designed to be:

- **Fully modular** – Each emotion, topic, and combo rule is self-contained
- **Easy to expand** – Add new emotions/topics/combos without breaking existing code
- **Human-editable** – Non-engineers can understand and modify emotion data
- **Understandable** – Clear structure with descriptive labels

### Future Feature Foundation

This engine provides the foundation for:

- **AI-assisted suggestions** – Use emotion patterns to train recommendation models
- **Personalized patterns** – Track which emotions users experience most
- **Trends over time** – Analyze emotional patterns across days/weeks/months
- **Recommendation ranking** – Surface most helpful suggestions based on user engagement
- **Voice-based emotional understanding** – Map voice tone/speech patterns to emotions

---

## 📝 Changelog

### Version 1.0 (2025-11-26)
- Initial emotion engine implementation
- 13 emotions with base suggestions
- 9 topics with context-specific suggestions
- 4 combo rules for multi-emotion states
- Created `emotionEngineAdapter.ts` for mapping
- Integrated with `intelligentSuggestions.ts`

---

## 🤝 Contact for Future Developers

**LifeZinc Internal Developer Notes**

If you extend or update this engine:

1. **Document the change** inside `EMOTION_ENGINE_GUIDE.md`
2. **Bump the version** in the changelog
3. **Add tests** (if applicable) to the testing checklist
4. **Ensure brand alignment** – New emotions/topics must align with LifeZinc's trauma-informed, compassionate tone

---

## 🙋 Questions?

For questions about the emotion engine:
1. Review this guide
2. Check `emotionEngine.ts` for data structure
3. Check `emotionEngineAdapter.ts` for logic
4. Test in the app UI

---

**Last Updated:** 2025-11-26
**Maintained by:** LifeZinc Engineering Team
