# Risk Escalation Rules - Implementation Summary

## Overview

Hard-locked risk escalation rules with comprehensive documentation and fail-safe logic.

---

## Files Created

### 1. `src/utils/riskEscalation.ts` (NEW)

**Purpose:** Central authority for all risk assessment logic

**Key Functions:**

#### `calculateRiskScore(baseRisk, intensity, selectedSignals)`
- Implements formula: RiskScore = baseRisk + (intensity>=7 ? 1 : 0) + (dangerSignal ? 2 : 0)
- Converts baseRisk: low=1, medium=2, high=3
- Returns numeric score (1-6)

#### `shouldShowCrisisIntervention(baseRisk, intensity, selectedSignals)`
- **HARD-LOCKED RULE:** Returns true ONLY if:
  - `baseRisk === 'high'`
  - AND (`intensity >= 7` OR `dangerSignal === true`)

#### `shouldShowExtraSupport(baseRisk, intensity, selectedSignals)`
- Returns true ONLY if:
  - `baseRisk === 'high'`
  - AND `intensity <= 3`
  - AND NO danger signals

#### `checkForDangerSignals(selectedSignals)`
- Checks if any selected signal matches danger signal definitions
- Returns boolean

#### `categorizeDangerSignals(selectedSignals)`
- Identifies which danger categories are present
- Returns: `['self_harm', 'imminent_danger', 'life_exit_thoughts', 'harm_to_others']`

#### `assessRisk(baseRisk, intensity, selectedSignals)`
- Comprehensive risk assessment
- Returns complete assessment object with all metrics

**Danger Signal Definitions (Lines 22-47):**
```typescript
DANGER_SIGNALS = {
  self_harm: ['self-harm-urges', 'cutting-urges', 'self-injury-thoughts', ...],
  imminent_danger: ['going-to-die', 'cant-breathe', 'losing-control', ...],
  life_exit_thoughts: ['suicidal-thoughts', 'end-it-all', 'no-reason-live', ...],
  harm_to_others: ['hurt-someone', 'violent-thoughts', 'harm-others', ...]
}
```

---

## Files Modified

### 2. `src/data/advancedTaxonomy.ts`

**Changes:**

#### Updated `calculateRiskLevel()` function (Lines 1453-1483)
- Added comprehensive documentation
- Implements hard-locked formula with explicit comments
- Converts baseRisk to numeric (low=1, medium=2, high=3)
- Adds intensity modifier (+1 if intensity >= 7)
- Adds danger signal modifier (+2 if present)
- Maps risk score to risk level (5-6=high, 3-4=medium, 1-2=low)

#### Updated Danger Signals in States

**`despair-hopeless` state (Lines 1114-1126):**
- Added: `no-reason-live` (life_exit_thoughts)
- Added: `suicidal-thoughts` (life_exit_thoughts)
- Kept: `no-hope`, `never-better`, `giving-up` as risk indicators

**`rage-destructive` state (Lines 220-232):**
- Added: `violent-thoughts` (harm_to_others)
- Added: `harm-others` (harm_to_others)
- Kept: `want-to-break`, `losing-control` as risk indicators

**`numb-disconnected` state (Lines 100-112):**
- Added: `self-harm-urges` (self_harm)
- Kept: `dissociated` as risk indicator

### 3. `src/components/AdvancedEmotionFlow.tsx`

**Changes:**

#### Added Imports (Lines 9-14)
```typescript
import {
  assessRisk,
  shouldShowCrisisIntervention,
  shouldShowExtraSupport,
  checkForDangerSignals,
} from '../utils/riskEscalation';
```

#### Added State Variables (Lines 47-48)
```typescript
const [showCrisis, setShowCrisis] = useState(false);
const [showExtraSupport, setShowExtraSupport] = useState(false);
```

#### Updated `handleContinueToActions()` (Lines 72-95)
- Uses new `assessRisk()` function
- Sets crisis/extra support flags
- Logs comprehensive risk assessment to console
- Provides debugging information

#### Updated Crisis UI (Lines 423-444)
- Changed condition to: `showCrisis && autoEscalateHighRisk`
- Added comment: "HARD-LOCKED RULE: Only shown if baseRisk=high AND (intensity>=7 OR dangerSignal)"
- Enhanced title: "Crisis Resources - Immediate Help Available"

#### Added Extra Support UI (Lines 446-465)
- New amber alert box for extra support
- Shown when: baseRisk=high, intensity<=3, no danger signal
- Provides supportive resources without crisis language
- Recommends therapy/counseling

---

## Documentation Created

### 4. `RISK_ESCALATION_RULES.md` (NEW)

**Comprehensive documentation including:**

- Formula details with exact calculations
- Danger signal definitions by category
- Crisis intervention trigger rules
- Extra support trigger rules
- 5+ example scenarios with calculations
- State-specific signal mappings
- Verification & testing requirements
- Integration points across codebase
- Legal & clinical disclaimers
- Audit log structure
- Modification approval process

---

## Function Locations & File Paths

### Primary Implementation

**File:** `src/utils/riskEscalation.ts`

| Function | Lines | Purpose |
|----------|-------|---------|
| `DANGER_SIGNALS` | 22-47 | Danger signal definitions |
| `calculateRiskScore()` | 63-85 | Core risk score calculation |
| `checkForDangerSignals()` | 93-109 | Check for danger signals |
| `categorizeDangerSignals()` | 117-135 | Categorize danger types |
| `riskScoreToLevel()` | 145-151 | Convert score to level |
| `shouldShowCrisisIntervention()` | 186-208 | Crisis trigger logic |
| `shouldShowExtraSupport()` | 226-244 | Extra support logic |
| `assessRisk()` | 277-306 | Comprehensive assessment |

### Integration Points

**File:** `src/data/advancedTaxonomy.ts`
- Function: `calculateRiskLevel()` - Lines 1453-1483

**File:** `src/components/AdvancedEmotionFlow.tsx`
- Risk calculation: Lines 72-95
- Crisis UI: Lines 423-444
- Extra support UI: Lines 446-465

---

## Key Rules Summary

### Crisis Intervention Triggers

**ONLY IF:**
```
baseRisk = 'high'
AND
(intensity >= 7 OR dangerSignal = true)
```

### Extra Support Triggers

**ONLY IF:**
```
baseRisk = 'high'
AND
intensity <= 3
AND
dangerSignal = false
```

### Danger Signal Categories

1. **self_harm** - Intent/urges to harm oneself
2. **imminent_danger** - Immediate physical danger to self
3. **life_exit_thoughts** - Suicidal ideation/planning
4. **harm_to_others** - Intent/urges to harm others

---

## Testing Validation

### Build Status
✅ **PASSED** - No compilation errors

### Console Logging
All risk assessments log complete data:
- baseRisk, intensity, selectedSignals
- riskScore, riskLevel
- hasDangerSignal, dangerSignalCategories
- interventionType

### Test Scenarios Verified

1. ✅ High + intensity 7+ → Crisis shown
2. ✅ High + danger signal → Crisis shown
3. ✅ High + low intensity + no signal → Extra support shown
4. ✅ Medium + high intensity → NO crisis
5. ✅ Low + any intensity → NO crisis

---

## Security & Safety

### Fail-Safe Defaults
- Auto-escalation enabled by default
- Risk warnings shown by default
- Conservative signal matching

### Documentation
- All rules documented in code comments
- Hard-lock warnings in critical functions
- Clinical review requirements specified

### Audit Trail
- Console logging for all assessments
- Clear calculation visibility
- Traceable decision logic

---

## Next Steps for Production

1. ✅ Code implementation complete
2. ✅ Documentation complete
3. ⏳ Clinical review of rules required
4. ⏳ User testing with safety protocols
5. ⏳ Legal review of disclaimers
6. ⏳ Monitor false positive/negative rates

---

## Maintenance Notes

**DO NOT MODIFY** without:
1. Clinical justification
2. Test cases showing impact
3. Licensed clinical supervisor approval
4. Updated documentation
5. Re-testing all scenarios

All modifications must be logged in `RISK_ESCALATION_RULES.md` audit log.
