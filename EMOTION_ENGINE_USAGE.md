# Emotion Engine Guide

## Overview

The Emotion Engine is a config-driven therapeutic flow system that guides users through:
1. **Emotion Selection** - User picks their current emotion
2. **Context Selection** - User specifies what's happening in their life
3. **Tool Suggestions** - System offers targeted interventions
4. **Tool Execution** - User engages with the chosen tool
5. **Feedback Loop** - System adapts based on whether the tool helped

## Architecture

### Core Files

**Data Layer:**
- `src/data/emotionConfigs.ts` - Contains all 13 emotion configurations with contexts and suggestions

**Component Layer:**
- `src/components/EmotionSelectionPage.tsx` - Entry point showing all emotions
- `src/components/EmotionEngine.tsx` - Orchestrates the 5-step flow
- `src/components/EmotionToolRenderer.tsx` - Renders the appropriate tool based on toolId

### How to Access

Navigate to the emotion flow page by setting the currentPage state to `'emotion-flow'` in App.tsx, or add a button/link that calls:

```typescript
onNavigate('emotion-flow')
```

## Configuration Structure

Each emotion follows this structure:

```typescript
{
  id: "tired",
  emoji: "😩",
  label: "Tired",
  introMessage: "You've been carrying a lot...",
  contexts: [
    {
      id: "job_search",
      label: "Job search / career",
      description: "Sending applications, not hearing back...",
      suggestionGroups: [
        {
          id: "tired_job_rest",
          type: "rest",
          title: "Reset your energy",
          subtitle: "A short nervous-system reset",
          toolId: "breathing_2min"
        }
      ]
    }
  ]
}
```

## Available Emotions

### Challenging (8)
- 😩 Tired
- 😢 Sad
- 😤 Angry
- 😰 Anxious
- 😵 Overwhelmed
- 😔 Lonely
- 😣 Guilty
- 😶 Numb

### Neutral (1)
- 😐 Okay

### Positive (4)
- 🙏 Grateful
- 🤩 Excited
- 😌 Calm
- 💪 Proud

## Tool Types

Each suggestion has one of these types:

- **rest** - Breathing, meditation, body-based calm
- **process** - Journaling, emotional exploration
- **mindset** - Reframes, perspective shifts
- **practical** - Action plans, problem-solving
- **connection** - Reach-out planning, community finding
- **safety** - Grounding, present-moment anchoring

## Implemented Tools

The EmotionToolRenderer currently renders:

1. **Breathing Tools** - Any toolId starting with `breathing_` or containing `_breath`
2. **Journal Tools** - Any toolId starting with `journal_`
3. **Grounding Tools** - Specifically `grounding_54321`
4. **Reframe Tools** - Any toolId starting with `reframe_`
5. **Connection Tools** - Any toolId containing `connection` or `reachout`
6. **Default Fallback** - Shows "coming soon" for unimplemented tools

## Adding New Tools

To add a new tool:

1. **Add the toolId to a suggestion** in `emotionConfigs.ts`
2. **Add rendering logic** in `EmotionToolRenderer.tsx`:

```typescript
if (toolId === 'your_new_tool_id') {
  return renderYourNewTool();
}
```

3. **Implement the render function** with your tool UI
4. **Call `onComplete()`** when the tool finishes

## Feedback Loop

After a tool completes:

**User clicks "Yes, it helped":**
- Shows affirmation message
- Logs positive feedback
- Ends flow after 2 seconds

**User clicks "Try something else":**
- Returns to suggestion list
- Logs negative feedback
- Allows selecting a different tool from the same context

## Data Persistence

The engine logs events to Supabase `journal_entries` table:
- `flow_started` - User began the flow
- `context_selected` - User picked a context
- `suggestion_selected` - User picked a suggestion
- `feedback_positive` - Tool helped
- `feedback_negative` - Tool didn't help

## Extending the System

### Add a New Emotion

1. Add the emotion ID to the `EmotionId` type in `emotionConfigs.ts`
2. Create the full configuration with contexts and suggestions
3. Add it to the `emotionConfigs` object
4. It will automatically appear in the EmotionSelectionPage

### Add a New Context

Add a new context object to any emotion's `contexts` array:

```typescript
{
  id: "new_context_id",
  label: "New Context",
  description: "What this context is about",
  suggestionGroups: [ /* suggestions */ ]
}
```

### Add a New Suggestion

Add a new suggestion to any context's `suggestionGroups` array:

```typescript
{
  id: "unique_suggestion_id",
  type: "rest",
  title: "Tool Title",
  subtitle: "What this tool does",
  toolId: "tool_identifier"
}
```

## Styling

The emotion engine uses:
- Dark slate background (`from-slate-900 via-slate-800 to-slate-900`)
- Emerald accent color for primary actions
- Smooth fade-in animations
- Color-coded suggestion types
- Responsive grid layouts

## Future Enhancements

Potential additions:
- Save favorite tools
- Tool history and analytics
- Personalized tool recommendations
- Time-of-day aware suggestions
- Integration with calendar/goals
- Progress tracking through multi-session flows
