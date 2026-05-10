# Risk Escalation Rules - Hard-Locked Protocol

## ⚠️ CRITICAL: DO NOT MODIFY WITHOUT CLINICAL REVIEW

Last Updated: 2026-01-27
Status: **HARD-LOCKED**

---

## Core Implementation

**Primary File:** `src/utils/riskEscalation.ts`

This file contains all risk assessment logic and must not be modified without explicit clinical review and authorization.

---

## Risk Score Calculation Formula

### Formula

```
RiskScore = baseRiskNumeric + intensityModifier + dangerSignalModifier
```

### Components

1. **baseRiskNumeric** (1-3 points)
   - `low` = 1
   - `medium` = 2
   - `high` = 3

2. **intensityModifier** (0-1 points)
   - `+1` if intensity >= 7
   - `0` if intensity < 7

3. **dangerSignalModifier** (0-2 points)
   - `+2` if any danger signal present
   - `0` if no danger signals

### Score Range

- **Minimum:** 1 (low base + low intensity + no danger)
- **Maximum:** 6 (high base + high intensity + danger signal)

### Score to Risk Level Mapping

```
5-6 points → high risk
3-4 points → medium risk
1-2 points → low risk
```

---

## Danger Signal Definitions

**Location:** `src/utils/riskEscalation.ts` - `DANGER_SIGNALS` constant

### Categories

#### 1. `self_harm`
Intent or urges to harm oneself

**Signal IDs:**
- `self-harm-urges`
- `cutting-urges`
- `self-injury-thoughts`
- `hurting-myself`
- `want-to-hurt-self`

#### 2. `imminent_danger`
Immediate physical danger to self

**Signal IDs:**
- `going-to-die`
- `cant-breathe`
- `losing-control`
- `immediate-threat`
- `in-danger-now`

#### 3. `life_exit_thoughts`
Suicidal ideation or planning

**Signal IDs:**
- `suicidal-thoughts`
- `end-it-all`
- `no-reason-live`
- `better-off-dead`
- `suicide-plan`
- `giving-up`
- `no-hope`
- `never-better`

#### 4. `harm_to_others`
Intent or urges to harm others

**Signal IDs:**
- `hurt-someone`
- `violent-thoughts`
- `harm-others`
- `revenge-thoughts`
- `violent-urges`

---

## Crisis Intervention Trigger Rules

### HARD-LOCKED RULE

Crisis UI triggers **ONLY** if **ALL** of these conditions are met:

```
baseRisk === 'high'
AND
(intensity >= 7 OR dangerSignal === true)
```

### Implementation

**Function:** `shouldShowCrisisIntervention()`
**File:** `src/utils/riskEscalation.ts:186-208`

```typescript
export function shouldShowCrisisIntervention(
  baseRisk: RiskLevel,
  intensity: IntensityLevel,
  selectedSignals: string[]
): boolean {
  const hasDangerSignal = checkForDangerSignals(selectedSignals);

  if (baseRisk === 'high') {
    if (intensity >= 7 || hasDangerSignal) {
      return true;
    }
  }

  return false;
}
```

### UI Display

**File:** `src/components/AdvancedEmotionFlow.tsx:423-444`

When triggered, shows:
- Red alert box with crisis resources
- 24/7 hotline numbers (988, 741741)
- Emergency instructions (911, ER)
- Legal disclaimer

---

## Extra Support Trigger Rules

### Definition

"Extra Support" provides supportive resources **without** triggering crisis protocols.

### Conditions

Shows extra support **ONLY** if **ALL** of these are true:

```
baseRisk === 'high'
AND
intensity <= 3
AND
NO danger signals present
```

### Implementation

**Function:** `shouldShowExtraSupport()`
**File:** `src/utils/riskEscalation.ts:210-234`

```typescript
export function shouldShowExtraSupport(
  baseRisk: RiskLevel,
  intensity: IntensityLevel,
  selectedSignals: string[]
): boolean {
  const hasDangerSignal = checkForDangerSignals(selectedSignals);

  if (baseRisk === 'high' && intensity <= 3 && !hasDangerSignal) {
    return true;
  }

  return false;
}
```

### UI Display

**File:** `src/components/AdvancedEmotionFlow.tsx:446-465`

When triggered, shows:
- Amber alert box (less urgent than crisis)
- Supportive messaging
- Recommendations for therapy/counseling
- Support resources (not labeled as crisis)

---

## Example Scenarios

### Scenario 1: Crisis Intervention Triggered

**Input:**
- baseRisk: `high`
- intensity: `8`
- selectedSignals: `[]`

**Calculation:**
```
RiskScore = 3 + 1 + 0 = 4 (medium)
But: baseRisk=high AND intensity>=7
Result: CRISIS INTERVENTION SHOWN ✓
```

### Scenario 2: Crisis Intervention Triggered (Danger Signal)

**Input:**
- baseRisk: `high`
- intensity: `4`
- selectedSignals: `['suicidal-thoughts']`

**Calculation:**
```
RiskScore = 3 + 0 + 2 = 5 (high)
But: baseRisk=high AND dangerSignal=true
Result: CRISIS INTERVENTION SHOWN ✓
```

### Scenario 3: Extra Support Shown

**Input:**
- baseRisk: `high`
- intensity: `2`
- selectedSignals: `[]`

**Calculation:**
```
RiskScore = 3 + 0 + 0 = 3 (medium)
But: baseRisk=high AND intensity<=3 AND no dangerSignal
Result: EXTRA SUPPORT SHOWN ✓
```

### Scenario 4: No Special Intervention

**Input:**
- baseRisk: `high`
- intensity: `5`
- selectedSignals: `[]`

**Calculation:**
```
RiskScore = 3 + 0 + 0 = 3 (medium)
baseRisk=high BUT intensity<7 AND no dangerSignal
Result: Standard support actions only
```

### Scenario 5: Medium Risk, No Crisis

**Input:**
- baseRisk: `medium`
- intensity: `8`
- selectedSignals: `[]`

**Calculation:**
```
RiskScore = 2 + 1 + 0 = 3 (medium)
baseRisk≠high (not high)
Result: NO crisis intervention (standard support only)
```

---

## State-Specific Signal Mappings

### High-Risk States with Danger Signals

**File:** `src/data/advancedTaxonomy.ts`

#### `despair-hopeless` (Existential)
- `no-hope` → life_exit_thoughts
- `never-better` → life_exit_thoughts
- `giving-up` → life_exit_thoughts
- `no-reason-live` → life_exit_thoughts
- `suicidal-thoughts` → life_exit_thoughts

#### `rage-destructive` (Dysregulated)
- `want-to-break` → harm_to_others
- `violent-thoughts` → harm_to_others
- `harm-others` → harm_to_others
- `losing-control` → imminent_danger

#### `numb-disconnected` (Dysregulated)
- `dissociated` → imminent_danger
- `self-harm-urges` → self_harm

---

## Verification & Testing

### Test Cases Required

1. **High + Intensity 7+ → Crisis**
2. **High + Danger Signal → Crisis**
3. **High + Low Intensity + No Signal → Extra Support**
4. **Medium + High Intensity → NO Crisis**
5. **Low + Any Intensity → NO Crisis**

### Console Logging

**Location:** `src/components/AdvancedEmotionFlow.tsx:90-101`

Every risk calculation logs:
```javascript
{
  baseRisk: string,
  intensity: number,
  selectedSignals: string[],
  riskScore: number,
  riskLevel: string,
  hasDangerSignal: boolean,
  dangerSignalCategories: string[],
  interventionType: string
}
```

---

## Integration Points

### Files Using Risk Escalation

1. **`src/data/advancedTaxonomy.ts`**
   - Function: `calculateRiskLevel()` (lines 1453-1483)
   - Updated with hard-locked formula
   - Legacy compatibility maintained

2. **`src/components/AdvancedEmotionFlow.tsx`**
   - Imports: Lines 9-14
   - Risk calculation: Lines 72-95
   - Crisis UI: Lines 423-444
   - Extra support UI: Lines 446-465

3. **`src/utils/advancedEmotionEngine.ts`**
   - Uses risk levels for saving entries
   - Auto-escalation preferences

---

## Legal & Clinical Disclaimers

### User-Facing Disclaimer

**Text:**
> "LifeZinc is not a substitute for professional care. If you are in immediate danger, call emergency services."

**Location:** Displayed in all crisis intervention screens

### Development Team Notice

**⚠️ WARNING:**
- These rules have clinical implications
- Modifications require licensed mental health professional review
- Changes must be documented and audited
- False negatives (missing a crisis) pose serious risk
- False positives (over-warning) can reduce user trust

---

## Audit Log

| Date | Change | Reviewer | Reason |
|------|--------|----------|--------|
| 2026-01-27 | Initial hard-lock implementation | System | Establish definitive protocol |

---

## Contact for Modifications

For any proposed changes to risk escalation logic:

1. Document proposed change with clinical justification
2. Include test cases showing impact
3. Obtain approval from licensed clinical supervisor
4. Update this document with change log entry
5. Re-test all scenarios before deployment

**DO NOT MODIFY** without following this process.
