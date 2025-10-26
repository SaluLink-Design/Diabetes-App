# Testing Guide - SaluLink Chronic Treatment App

## Test Cases for Manual Testing

### Test Case 1: Diabetes Mellitus Type 2 - Complete Workflow

#### Step 1: Clinical Note

**Input:**

```
Patient: 58-year-old male
Chief Complaint: Poor glycemic control

History:
- Diagnosed with Type 2 Diabetes Mellitus 5 years ago
- Currently on Metformin 850mg twice daily
- Recent HbA1c: 8.2%
- Fasting glucose: 9.5 mmol/L
- BMI: 32

Clinical Findings:
- Blood pressure: 145/90 mmHg
- No signs of diabetic neuropathy
- Fundoscopy: No retinopathy noted
- Foot examination: Normal sensation, pulses present

Assessment:
- Type 2 Diabetes Mellitus with suboptimal control
- Requires medication adjustment and lifestyle modification

Plan:
- Increase Metformin to 1000mg BD
- Add Gliclazide MR 60mg daily
- Refer to dietitian
- Schedule HbA1c in 3 months
```

**Expected Result:**

- ClinicalBERT should detect "Diabetes Mellitus Type 2"
- Condition should appear in selection list

#### Step 2: ICD-10 Codes

**Expected Codes (select 2-3):**

- E11.9 - Non-insulin-dependent diabetes mellitus without complications
- E11.8 - Non-insulin-dependent diabetes mellitus with unspecified complications

#### Step 3: Treatment Protocol

**Diagnostic Basket (select):**

- ✅ HbA1c
- ✅ Fasting glucose
- ✅ Lipid profile (Total cholesterol, HDL, LDL, Triglycerides)
- ✅ U&E and Creatinine

**Documentation Example:**

```
HbA1c: 8.2% (target <7%)
Fasting glucose: 9.5 mmol/L
Total cholesterol: 5.2 mmol/L
LDL: 3.1 mmol/L
HDL: 1.1 mmol/L
Creatinine: 85 μmol/L (normal)
```

**Ongoing Management Basket (select):**

- ✅ HbA1c (4 per year)
- ✅ Fundus examination
- ✅ Dietitian consultation

#### Step 4: Medication

**Medical Plan:** Core

**Select:**

- ✅ Metformin - Diaphage 1000mg
- ✅ Gliclazide MR - Dynacaz MR 60mg
- ✅ Glucose test strips - Glucocheck key test strip
- ✅ Lancets - Lancet unilet sterile 28g

#### Step 5: Final Documentation

**Chronic Registration Note:**

```
Patient registered for chronic diabetes management.
Current medications: Metformin 1000mg BD, Gliclazide MR 60mg OD
Target HbA1c: <7%
Monitoring plan: HbA1c every 3 months, annual fundoscopy, dietitian review
Patient counseled on lifestyle modifications, medication compliance, and hypoglycemia awareness.
```

---

### Test Case 2: Diabetes Mellitus Type 1 - Insulin Dependent

#### Step 1: Clinical Note

**Input:**

```
Patient: 24-year-old female
Diagnosis: Type 1 Diabetes Mellitus

Presentation:
- Diagnosed at age 12
- On basal-bolus insulin regimen
- Recent episodes of hypoglycemia
- HbA1c: 7.5%

Current Treatment:
- Insulin Glargine (Optisulin) 20 units at bedtime
- Insulin Aspart (Novorapid) 6-8 units with meals
- Self-monitoring blood glucose 4 times daily

Recent Labs:
- HbA1c: 7.5%
- Random glucose: 6.8 mmol/L
- Urine microalbumin: negative
- Creatinine: 68 μmol/L

Complications Screening:
- No retinopathy on fundoscopy
- No peripheral neuropathy
- Normal foot examination

Plan:
- Continue current insulin regimen
- Diabetes educator review for hypoglycemia management
- Increase frequency of glucose monitoring
- Annual complications screening
```

**Expected Result:**

- Should detect "Diabetes Mellitus Type 1"

#### Step 2: ICD-10 Codes

**Select:**

- E10.9 - Insulin-dependent diabetes mellitus without complications
- E10.8 - Insulin-dependent diabetes mellitus with unspecified complications

#### Step 3: Treatment Protocol

**Diagnostic Basket:**

- ✅ ECG
- ✅ HbA1c
- ✅ Microalbuminuria
- ✅ Lipid profile

**Ongoing Management:**

- ✅ HbA1c (4 per year)
- ✅ Fundus examination
- ✅ Diabetes Educator (DEDUT)
- ✅ Dietitian

#### Step 4: Medication

**Medical Plan:** Executive

**Select:**

- ✅ Insulin Glargine - Optisulin cartridge 3ml
- ✅ Insulin Aspart - Novorapid penfill 3ml
- ✅ Glucose strips - Contour plus blood glucose test strips
- ✅ Lancets - BD micro fine plus pen needle 31g
- ✅ Needles - Needle insulin pen verifine 4mm 32g

---

### Test Case 3: Diabetes Insipidus

#### Step 1: Clinical Note

**Input:**

```
Patient: 35-year-old male
Chief Complaint: Excessive thirst and urination

History:
- Polyuria (8-10 liters/day) for 3 months
- Polydipsia with preference for cold water
- Nocturia 5-6 times per night
- No history of head trauma
- No visual disturbances

Investigations:
- Serum osmolality: 295 mOsm/kg
- Urine osmolality: 150 mOsm/kg
- Serum sodium: 148 mmol/L
- Water deprivation test: Positive for central DI
- MRI pituitary: Normal

Diagnosis: Central Diabetes Insipidus

Treatment Plan:
- Start Desmopressin (DDAVP) nasal spray
- Monitor fluid balance
- Regular sodium and osmolality checks
```

**Expected Result:**

- Should detect "Diabetes Insipidus"

#### Step 2: ICD-10 Codes

**Select:**

- E23.2 - Diabetes insipidus

#### Step 3: Treatment Protocol

**Diagnostic Basket:**

- ✅ Serum osmolality
- ✅ Urine osmolality
- ✅ U&E and Creatinine

**Ongoing Management:**

- ✅ Serum osmolality (3 per year)
- ✅ U&E (3 per year)

#### Step 4: Medication

**Medical Plan:** Comprehensive

**Select:**

- ✅ Desmopressin - Ddavp nasal spray 5ml 0.1mg/1ml

---

## Edge Cases to Test

### 1. Ambiguous Clinical Note

**Input:**

```
Patient with diabetes, needs medication review.
```

**Expected Behavior:**

- Should show error: "No diabetes conditions detected"
- Prompt user to add more detail

### 2. Multiple Conditions Mentioned

**Input:**

```
Patient has both Type 1 and Type 2 diabetes characteristics.
Started as Type 2 but now requires insulin.
```

**Expected Behavior:**

- Should detect both conditions
- User selects most appropriate one

### 3. No Medical Plan Selected

**Action:** Try to select medication without choosing a plan

**Expected Behavior:**

- Default plan (Core) should be pre-selected
- All medications should be visible

### 4. Empty Case Save

**Action:** Try to save a case without completing any steps

**Expected Behavior:**

- Should save partial case
- Can be loaded and continued later

### 5. PDF Export with Minimal Data

**Action:** Export PDF with only Step 1 completed

**Expected Behavior:**

- PDF should generate with available data
- Missing sections should be omitted

---

## Validation Tests

### ICD Code Selection

- ✅ Must select at least 1 code
- ✅ Can select multiple codes
- ✅ Selected codes persist when navigating back

### Treatment Selection

- ✅ Can select from diagnostic basket only
- ✅ Can select from ongoing basket only
- ✅ Can select from both baskets
- ✅ Documentation is optional
- ✅ Documentation persists after modal close

### Medication Selection

- ✅ Excluded medications cannot be selected
- ✅ Plan change updates availability
- ✅ Selected medications persist across plan changes
- ✅ Must select at least 1 medication

### Case Management

- ✅ Cases save to localStorage
- ✅ Cases persist after page refresh
- ✅ Can load saved case
- ✅ Can delete saved case
- ✅ Delete requires confirmation

---

## Performance Tests

### Data Loading

**Test:** Measure time to load all CSV files

**Expected:** < 2 seconds on standard connection

### ClinicalBERT Analysis

**Test:** Analyze a 500-word clinical note

**Expected:** < 2 seconds (including simulated delay)

### PDF Generation

**Test:** Generate PDF with full case data

**Expected:** < 3 seconds

### Case Save/Load

**Test:** Save and load a complete case

**Expected:** Instant (localStorage is synchronous)

---

## Browser Compatibility Tests

### Chrome/Edge

- ✅ All features work
- ✅ PDF downloads correctly
- ✅ localStorage persists

### Firefox

- ✅ All features work
- ✅ PDF downloads correctly
- ✅ localStorage persists

### Safari

- ✅ All features work
- ⚠️ Check PDF download behavior
- ✅ localStorage persists

---

## Accessibility Tests

### Keyboard Navigation

- ✅ Tab through all interactive elements
- ✅ Enter to activate buttons
- ✅ Escape to close modals

### Screen Reader

- ✅ Labels are readable
- ✅ Buttons have descriptive text
- ✅ Form fields have labels

### Color Contrast

- ✅ Text meets WCAG AA standards
- ✅ Disabled states are distinguishable
- ✅ Error messages are visible

---

## Error Handling Tests

### Network Errors

**Test:** Disconnect network, try to load CSV files

**Expected:** Error message with retry option

### Invalid CSV Data

**Test:** Corrupt a CSV file

**Expected:** Graceful error, partial data load if possible

### localStorage Full

**Test:** Fill localStorage to capacity

**Expected:** Error message when saving case

### Browser Not Supported

**Test:** Open in IE11

**Expected:** Compatibility warning message

---

## Regression Tests

After any code changes, verify:

1. ✅ All 5 workflow steps complete successfully
2. ✅ Case save and load works
3. ✅ PDF export generates correctly
4. ✅ Medical plan filtering works
5. ✅ ClinicalBERT detection is accurate
6. ✅ ICD codes display correctly
7. ✅ Treatment documentation saves
8. ✅ Medication selection respects plan exclusions
9. ✅ Navigation between steps works
10. ✅ Sidebar case management functions

---

## Automated Testing Setup (Future)

### Unit Tests (Jest)

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### E2E Tests (Playwright)

```bash
npm install --save-dev @playwright/test
```

### Example Test Structure

```typescript
// __tests__/clinicalBERT.test.ts
describe('ClinicalBERT', () => {
  it('should detect Type 2 Diabetes', () => {
    const note = 'Patient with Type 2 Diabetes Mellitus';
    const result = analyzeClinicalNote(note);
    expect(result).toContain('Diabetes Mellitus Type 2');
  });
});
```

---

## Test Data Files

All test CSV files are located in `/public`:

- `Endocrine CONDITIONS.csv` - 130 condition entries
- `Endocrine MEDICINE.csv` - 124 medication entries
- `Endocrine TREATMENT.csv` - 39 treatment protocol entries

---

## Reporting Issues

When reporting bugs, include:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser and version
5. Screenshot if applicable
6. Console errors (F12 → Console)

---

**Happy Testing! 🧪**
