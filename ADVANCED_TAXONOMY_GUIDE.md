# Advanced Emotion Taxonomy System - Implementation Guide

## Overview

The Advanced Emotion Taxonomy System is a comprehensive, layered emotional tracking framework that runs **alongside** the existing basic emotion system. This phased implementation ensures zero disruption to current LifeZinc users while providing opt-in access to a more detailed emotional state tracking system.

---

## Phase 1: SAFE ADD ✅ COMPLETED

### What Was Added

#### 1. Database Schema Extensions
- **New fields in `journal_entries` table** (all nullable for backward compatibility):
  - `advanced_category_id` (text) - One of 6 emotional categories
  - `advanced_state_id` (text) - One of 35+ specific emotional states
  - `intensity` (smallint 1-5) - Intensity level
  - `risk_level` (text) - low/medium/high
  - `selected_signals` (text[]) - User-selected symptoms/signals
  - `recommended_actions` (text[]) - Recommended coping actions
  - `completed_actions` (text[]) - Actions user completed
  - `is_advanced_mode` (boolean) - Flag indicating advanced mode usage

- **New `advanced_emotion_sessions` table**:
  - Tracks complete advanced emotion flow sessions
  - Records initial/final intensity, actions taken, outcomes
  - Used for analytics and insights

- **New fields in `user_preferences` table**:
  - `enable_advanced_states` (boolean) - Opt-in toggle
  - `preferred_mode` (text) - basic/advanced/hybrid
  - `show_risk_warnings` (boolean) - Display risk alerts
  - `auto_escalate_high_risk` (boolean) - Auto-show crisis resources

#### 2. TypeScript Types
- **File**: `src/types/advancedTaxonomy.ts`
- Comprehensive type definitions for all advanced taxonomy components
- Full type safety for categories, states, signals, actions, risk levels

#### 3. Advanced Taxonomy Data Structure
- **File**: `src/data/advancedTaxonomy.ts`
- **6 Emotional Categories**:
  1. 🌀 **Dysregulated** - Emotional systems overwhelmed (High Risk)
  2. ⚡ **Stress Response** - Fight-flight-freeze activation (Medium Risk)
  3. 💔 **Relational** - Connection and belonging challenges (Medium Risk)
  4. 🪞 **Identity** - Self-concept struggles (Medium Risk)
  5. 🌑 **Existential** - Meaning, mortality, deep loss (High Risk)
  6. 🌱 **Growth-Oriented** - Positive and expanding states (Low Risk)

- **35+ Specific States** including:
  - Numb/Disconnected, Overwhelmed/Spiraling, Rage/Destructive
  - Anxious/Vigilant, Panicked, Shutdown/Avoidant
  - Abandoned/Rejected, Betrayed/Distrustful
  - Shame/Inadequate, Confused/Lost, Fraudulent/Impostor
  - Grief/Mourning, Despair/Hopeless, Meaningless
  - Hopeful/Motivated, Curious/Exploring, Confident/Empowered

- **Each State Includes**:
  - Description and base risk level
  - 3-5 specific signals (some marked as risk indicators)
  - Reflection prompts
  - 2-5 recommended actions with steps
  - Mapping to basic emotions for compatibility

#### 4. UI Components

##### Settings Toggle (`src/components/SettingsPage.tsx`)
- Advanced States section added to settings
- Main toggle to enable/disable advanced mode
- Mode selector: Basic, Hybrid (recommended), or Advanced
- Risk warning preferences
- Auto-escalate high-risk toggle

##### Advanced Emotion Flow (`src/components/AdvancedEmotionFlow.tsx`)
- **Step 1: Category Selection** - Choose emotional category
- **Step 2: State Selection** - Pick specific state within category
- **Step 3: Intensity Selection** - Rate 1-5 with visual scale
- **Step 4: Signals Selection** - Multi-select symptoms/signals
- **Step 5: Actions & Recommendations** - View and track actions

- **Risk-Aware Features**:
  - Risk level badges (Low/Medium/High)
  - Crisis resource auto-display for high-risk states
  - Priority action highlighting
  - Reflection prompts
  - Action completion tracking

#### 5. Engine & Utilities (`src/utils/advancedEmotionEngine.ts`)
- `saveAdvancedEmotionEntry()` - Save with backward compatibility
- `createAdvancedEmotionSession()` - Track complete sessions
- `getUserPreferredMode()` - Check user's mode preference
- `suggestAdvancedStatesFromBasicEmotion()` - Map basic → advanced
- `getActionsForRiskLevel()` - Filter actions by risk
- `detectHighRiskPatterns()` - Analyze patterns over time
- `getAdvancedInsights()` - Analytics for user insights
- `shouldShowCrisisIntervention()` - Risk-based crisis detection

---

## Phase 2: INTEGRATE (Next Steps)

### Integration Points

#### 1. Journal Page Integration
```typescript
// In JournalPage.tsx - Add mode selector
const [trackingMode, setTrackingMode] = useState<'basic' | 'advanced'>('basic');

// Load user preference on mount
useEffect(() => {
  getUserPreferredMode(user.id).then(mode => {
    if (mode === 'hybrid') {
      // Show choice to user
    } else {
      setTrackingMode(mode);
    }
  });
}, [user]);

// Conditional rendering
{trackingMode === 'basic' ? (
  <MoodSelector /> // Existing component
) : (
  <AdvancedEmotionFlow
    onComplete={handleAdvancedComplete}
    onCancel={() => setTrackingMode('basic')}
  />
)}
```

#### 2. History Page Enhancement
- Show advanced states when available
- Display risk level badges
- Show completed actions
- Filter by category or state

#### 3. Insights Page Extension
- Add Advanced Insights section when enabled
- Show most common category/state
- Display intensity trends
- Show improvement trajectory
- Risk pattern detection alerts

#### 4. Recommendation Engine Integration
- Use advanced state + intensity to filter suggestions
- Prioritize by risk level
- Map advanced actions to existing tools
- Show crisis resources automatically for high-risk

---

## Phase 3: ENGINE UPGRADE (Advanced Features)

### Risk-Based Routing

#### Crisis Detection Flow
```typescript
// Automatic crisis detection
const { isHighRisk, reasons, recommendedActions } =
  await detectHighRiskPatterns(userId);

if (isHighRisk && autoEscalateHighRisk) {
  // Show crisis modal
  // Display 988 hotline
  // Offer immediate resources
}
```

#### Smart Recommendation System
```typescript
// Risk-aware action filtering
const actions = getActionsForRiskLevel(stateId, riskLevel);

// Priority actions for high-risk:
// - Professional support (therapist, crisis line)
// - Immediate grounding techniques
// - Safety planning

// Medium-risk actions:
// - Processing tools
// - Support network activation
// - Self-regulation techniques

// Low-risk actions:
// - Growth activities
// - Reflection exercises
// - Maintenance practices
```

### Pattern Analysis

#### Trend Detection
- Track intensity over time
- Identify recurring states
- Detect escalation patterns
- Suggest preventive interventions

#### Insights Generation
```typescript
const insights = await getAdvancedInsights(userId);
// Returns:
// - Most common category/state
// - Average intensity & risk
// - Improvement trend (improving/stable/declining)
// - Total entries tracked
```

---

## Phase 4: OPTIONAL REPLACE (Future)

### Gradual Migration Strategy

#### Step 1: User Testing (3-6 months)
- Monitor advanced mode adoption
- Collect user feedback
- Analyze accuracy and usefulness
- Refine states and recommendations

#### Step 2: Hybrid as Default
- Make hybrid mode the default for new users
- Encourage existing users to try advanced mode
- Show comparative insights (basic vs. advanced)

#### Step 3: Full Migration (If Validated)
- Deprecate pure basic mode
- Migrate all entries to advanced taxonomy
- Use basic emotions as simplified view
- Keep backward compatibility in database

---

## Data Model - Backward Compatibility

### Existing Fields (UNCHANGED)
```typescript
{
  id: string;
  user_id: string;
  created_at: string;
  text_entry: string;
  mood: string;           // Still saved for compatibility
  emotions: string[];     // Still saved for compatibility
  category: string;       // Mapped from advanced category
  tags: string[];
  // ... all other existing fields remain
}
```

### New Fields (ALL NULLABLE)
```typescript
{
  // Advanced taxonomy fields
  advanced_category_id?: string;
  advanced_state_id?: string;
  intensity?: number;
  risk_level?: 'low' | 'medium' | 'high';
  selected_signals?: string[];
  recommended_actions?: string[];
  completed_actions?: string[];
  is_advanced_mode: boolean;  // Default: false
}
```

### Query Compatibility

#### Basic Mode Queries (Still Work)
```typescript
// Old query - still works perfectly
const { data } = await supabase
  .from('journal_entries')
  .select('id, mood, emotions, text_entry')
  .eq('user_id', userId);
```

#### Advanced Mode Queries (Opt-In)
```typescript
// New query - only gets advanced data
const { data } = await supabase
  .from('journal_entries')
  .select('*, advanced_category_id, advanced_state_id, intensity, risk_level')
  .eq('user_id', userId)
  .eq('is_advanced_mode', true);
```

#### Hybrid Queries (Best of Both)
```typescript
// Get all entries with optional advanced data
const { data } = await supabase
  .from('journal_entries')
  .select('*')
  .eq('user_id', userId);

// Entries will have:
// - Basic fields always populated
// - Advanced fields populated only if is_advanced_mode = true
```

---

## Risk Level System

### Risk Calculation
```typescript
function calculateRiskLevel(
  baseRisk: 'low' | 'medium' | 'high',
  intensity: 1-5,
  hasRiskSignals: boolean
): 'low' | 'medium' | 'high' {
  // High if: risk signals + intensity ≥ 4
  // High if: base high + intensity ≥ 3
  // High if: base medium + intensity ≥ 4
  // Medium if: base medium OR intensity ≥ 3
  // Low otherwise
}
```

### Risk-Based Actions

#### High Risk (Crisis Level)
- **988 Suicide & Crisis Lifeline** (immediate)
- **Crisis Text Line** (text HOME to 741741)
- **Emergency Room** option
- **Safety Plan** activation
- **Therapist Contact** if available

#### Medium Risk (Support Level)
- Grounding techniques
- Support network activation
- Processing tools
- Professional scheduling
- Self-regulation practices

#### Low Risk (Maintenance Level)
- Growth activities
- Reflection exercises
- Skill building
- Preventive self-care
- Meaning-making activities

---

## User Experience Flow

### Hybrid Mode (Recommended)

#### Entry Point
```
User clicks "How are you feeling?"
  ↓
System shows choice:
  [Quick Check (Basic)]  [Detailed Tracking (Advanced)]
  ↓                      ↓
Basic emotion flow      Advanced taxonomy flow
```

### Advanced Flow Steps

1. **Category Selection**
   - 6 categories with emojis and descriptions
   - Risk level badges visible
   - "What best describes how you feel?"

2. **State Selection**
   - 3-7 states per category
   - Detailed descriptions
   - Related basic emotions shown

3. **Intensity Rating**
   - Visual 1-5 scale
   - Clear labels (Mild → Severe)
   - Guideline descriptions

4. **Signal Selection**
   - Multi-select checkboxes
   - Risk indicators highlighted
   - Optional reflection prompts

5. **Actions & Recommendations**
   - Risk level summary
   - Crisis resources if high-risk
   - Prioritized action list
   - Track completion
   - Save & complete

---

## Integration Checklist

### Phase 2 Tasks
- [ ] Add advanced mode toggle to JournalPage
- [ ] Integrate AdvancedEmotionFlow into main flow
- [ ] Update HistoryPage to show advanced data
- [ ] Add "View Details" for advanced entries
- [ ] Create advanced entry card component
- [ ] Map advanced actions to existing tools

### Phase 3 Tasks
- [ ] Build risk pattern detection dashboard
- [ ] Create advanced insights page
- [ ] Integrate crisis intervention modals
- [ ] Add trend visualization charts
- [ ] Build state transition tracking
- [ ] Create therapist recommendation logic

### Phase 4 Tasks
- [ ] A/B test basic vs. advanced modes
- [ ] Collect user feedback surveys
- [ ] Analyze adoption and retention rates
- [ ] Refine taxonomy based on data
- [ ] Plan migration timeline
- [ ] Update onboarding to showcase advanced mode

---

## Testing Strategy

### Backward Compatibility Tests
1. Create basic emotion entry → Verify saved correctly
2. Query old entries → Verify no breaking changes
3. Load history with mixed entries → Verify both types display
4. Toggle advanced mode off → Verify basic mode still works

### Advanced Mode Tests
1. Complete full advanced flow → Verify all data saved
2. Test each risk level calculation → Verify accurate
3. Test crisis detection → Verify appropriate resources shown
4. Test action tracking → Verify completion saves
5. Test insights generation → Verify accurate calculations

### Edge Cases
1. User with only basic entries → Should work normally
2. User with only advanced entries → Should display correctly
3. User with mixed entries → Should show both types
4. Advanced mode disabled → Should not show advanced UI
5. Database fields null → Should not crash, handle gracefully

---

## Maintenance & Evolution

### Data Collection
- Track which states are most commonly selected
- Monitor risk level distribution
- Analyze action completion rates
- Identify unused states or actions

### Iterative Improvements
- Add new states based on user feedback
- Refine risk calculations based on outcomes
- Update action recommendations based on effectiveness
- Enhance prompts based on helpfulness ratings

### Future Enhancements
- AI-powered state suggestion
- Contextual prompts based on history
- Personalized action recommendations
- Predictive crisis detection
- Therapist dashboard integration

---

## Files Reference

### TypeScript Types
- `src/types/advancedTaxonomy.ts` - All type definitions

### Data Structures
- `src/data/advancedTaxonomy.ts` - Categories, states, signals, actions

### Components
- `src/components/AdvancedEmotionFlow.tsx` - Main flow UI
- `src/components/SettingsPage.tsx` - Settings integration

### Utilities
- `src/utils/advancedEmotionEngine.ts` - Engine logic, risk detection, insights

### Database
- `supabase/migrations/*_add_advanced_emotion_system.sql` - Schema extensions

---

## Support & Resources

### For Users
- Advanced mode is **opt-in** - basic mode always available
- Hybrid mode recommended for flexibility
- All data is private and secure
- Can switch modes anytime in Settings

### For Developers
- All new fields are nullable - no migration needed
- Existing queries unaffected
- Advanced features gracefully degrade if disabled
- Full type safety with TypeScript
- Comprehensive helper functions available

---

## Success Metrics

### Phase 1 (Launch)
- ✅ Zero breaking changes to existing system
- ✅ Advanced mode available in Settings
- ✅ Database schema extended safely
- ✅ UI components built and tested

### Phase 2 (Integration)
- [ ] 20% of users enable advanced mode
- [ ] Advanced entries showing correctly in history
- [ ] Risk detection functioning accurately
- [ ] No user-reported bugs in basic mode

### Phase 3 (Adoption)
- [ ] 40% of users try advanced mode at least once
- [ ] Positive feedback on detailed tracking
- [ ] Crisis resources reaching high-risk users
- [ ] Insights providing valuable information

### Phase 4 (Migration - If Validated)
- [ ] 60%+ user preference for advanced/hybrid mode
- [ ] Demonstrated improved outcomes
- [ ] Therapist/professional endorsement
- [ ] System stability and performance maintained

---

## Conclusion

The Advanced Emotion Taxonomy System provides a comprehensive, evidence-based emotional tracking framework that enhances LifeZinc's capabilities without disrupting existing functionality. The phased rollout ensures safety, allows for iterative improvement, and respects user choice.

**Current Status: Phase 1 Complete ✅**

Next steps: Begin Phase 2 integration into main user flows.
