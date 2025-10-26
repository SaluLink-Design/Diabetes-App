# SaluLink Chronic Treatment App - Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SaluLink Chronic Treatment App                │
│                         (Next.js 14 + TypeScript)                │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
            ┌───────▼────────┐         ┌────────▼────────┐
            │   Frontend UI   │         │  Data Layer     │
            │   (React/TSX)   │         │  (CSV + State)  │
            └───────┬────────┘         └────────┬────────┘
                    │                           │
        ┌───────────┼───────────┐              │
        │           │           │              │
    ┌───▼───┐  ┌───▼───┐  ┌───▼───┐     ┌────▼────┐
    │Sidebar│  │Steps  │  │Modals │     │ Zustand │
    └───────┘  └───┬───┘  └───────┘     │  Store  │
                   │                     └────┬────┘
        ┌──────────┼──────────┐              │
        │          │          │              │
    ┌───▼───┐ ┌───▼───┐ ┌───▼───┐     ┌────▼────┐
    │Step 1 │ │Step 2 │ │Step 3 │     │localStorage│
    │Step 4 │ │Step 5 │ │       │     └─────────┘
    └───────┘ └───────┘ └───────┘
```

---

## Component Hierarchy

```
app/page.tsx (Root)
│
├── Sidebar
│   ├── Logo Section
│   ├── Navigation
│   │   ├── New Case Button
│   │   └── View Cases Dropdown
│   │       └── Case List Items
│   └── Bottom Menu
│       ├── Light Mode Toggle
│       ├── My Account
│       ├── Updates & FAQ
│       └── Log Out
│
├── WorkflowProgress
│   └── Step Indicators (1-5)
│
└── Step Components (Conditional)
    │
    ├── Step1ClinicalNote
    │   ├── Text Input Area
    │   ├── Analyze Button
    │   ├── Detected Conditions List
    │   └── Confirm Button
    │
    ├── Step2IcdMapping
    │   ├── Condition Display
    │   ├── ICD Code List (Checkboxes)
    │   └── Navigation Buttons
    │
    ├── Step3TreatmentProtocol
    │   ├── Diagnostic Basket
    │   │   ├── Treatment Items (Checkboxes)
    │   │   └── Documentation Buttons
    │   ├── Ongoing Management Basket
    │   │   ├── Treatment Items (Checkboxes)
    │   │   └── Documentation Buttons
    │   ├── DocumentationModal (Conditional)
    │   │   ├── Note Input
    │   │   ├── Image URL Input
    │   │   └── Save/Cancel Buttons
    │   └── Navigation Buttons
    │
    ├── Step4Medication
    │   ├── Plan Filter Buttons
    │   ├── Medication Groups (by Class)
    │   │   └── Medication Items (Checkboxes)
    │   └── Navigation Buttons
    │
    └── Step5FinalClaim
        ├── Case Summary Display
        │   ├── Original Note
        │   ├── Confirmed Condition
        │   ├── ICD Codes
        │   ├── Diagnostic Basket
        │   ├── Ongoing Management
        │   └── Medications
        ├── Registration Note Input
        └── Action Buttons
            ├── Save Case
            ├── Export PDF
            └── New Case
```

---

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         User Actions                          │
└───────────────────────────┬──────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼────────┐     ┌────────▼────────┐
        │  UI Components  │     │  Event Handlers │
        └───────┬────────┘     └────────┬────────┘
                │                       │
                └───────────┬───────────┘
                            │
                    ┌───────▼────────┐
                    │  Zustand Store  │
                    │  (Global State) │
                    └───────┬────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
    ┌───────▼────────┐ ┌───▼────┐ ┌───────▼────────┐
    │  Case State     │ │ Data   │ │  Workflow      │
    │  - currentCase  │ │ State  │ │  State         │
    │  - savedCases   │ │        │ │  - currentStep │
    └───────┬────────┘ └───┬────┘ └────────────────┘
            │              │
            │      ┌───────▼────────┐
            │      │  Data Loaders  │
            │      │  - CSV Parser  │
            │      └───────┬────────┘
            │              │
            │      ┌───────▼────────┐
            │      │  CSV Files     │
            │      │  (Public Dir)  │
            │      └────────────────┘
            │
    ┌───────▼────────┐
    │  localStorage   │
    │  (Persistence)  │
    └────────────────┘
```

---

## Workflow State Machine

```
                    ┌──────────────┐
                    │  New Case    │
                    │  Created     │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Step 1     │
                    │ Clinical Note│
                    └──────┬───────┘
                           │
                    [Analyze Note]
                           │
                    [Confirm Condition]
                           │
                    ┌──────▼───────┐
                    │   Step 2     │
                    │ ICD Mapping  │
                    └──────┬───────┘
                           │
                    [Select ICD Codes]
                           │
                    ┌──────▼───────┐
                    │   Step 3     │
                    │  Treatment   │
                    └──────┬───────┘
                           │
                    [Select Treatments]
                    [Add Documentation]
                           │
                    ┌──────▼───────┐
                    │   Step 4     │
                    │  Medication  │
                    └──────┬───────┘
                           │
                    [Filter by Plan]
                    [Select Medications]
                           │
                    ┌──────▼───────┐
                    │   Step 5     │
                    │ Final Claim  │
                    └──────┬───────┘
                           │
                    [Add Registration Note]
                           │
            ┌──────────────┼──────────────┐
            │              │              │
    ┌───────▼────┐  ┌──────▼─────┐  ┌───▼──────┐
    │ Save Case  │  │ Export PDF │  │ New Case │
    └────────────┘  └────────────┘  └──────────┘
```

---

## Module Dependencies

```
app/page.tsx
├── components/Sidebar
├── components/WorkflowProgress
├── components/Step1ClinicalNote
│   └── lib/clinicalBERT
├── components/Step2IcdMapping
│   └── lib/authi
├── components/Step3TreatmentProtocol
│   └── lib/authi
├── components/Step4Medication
│   └── lib/authi
├── components/Step5FinalClaim
│   ├── lib/authi
│   └── lib/pdfExport
└── store/useAppStore
    └── lib/dataLoader
```

---

## ClinicalBERT Analysis Flow

```
┌─────────────────────┐
│  Clinical Note      │
│  (User Input)       │
└──────────┬──────────┘
           │
    ┌──────▼──────┐
    │  Normalize  │
    │  Text       │
    └──────┬──────┘
           │
    ┌──────▼──────────────┐
    │  Pattern Matching   │
    │  - Keywords         │
    │  - Phrases          │
    │  - Medical Terms    │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  Confidence Scoring │
    │  - Weight patterns  │
    │  - Count matches    │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  Sort by Confidence │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  Return Detected    │
    │  Conditions         │
    └─────────────────────┘
```

---

## Authi 1.0 Mapping Flow

```
┌─────────────────────┐
│  Confirmed          │
│  Condition          │
└──────────┬──────────┘
           │
    ┌──────▼──────────────┐
    │  Authi 1.0          │
    │  mapConditionToData │
    └──────┬──────────────┘
           │
    ┌──────┴──────────────┐
    │                     │
┌───▼────────┐    ┌───────▼───────┐
│ Filter     │    │ Filter        │
│ CONDITIONS │    │ TREATMENT     │
│ CSV        │    │ CSV           │
└───┬────────┘    └───────┬───────┘
    │                     │
┌───▼────────┐    ┌───────▼───────┐
│ ICD-10     │    │ Diagnostic    │
│ Codes      │    │ Basket        │
└────────────┘    │ +             │
                  │ Ongoing       │
                  │ Management    │
                  └───────┬───────┘
                          │
                  ┌───────▼───────┐
                  │ Filter        │
                  │ MEDICINE CSV  │
                  └───────┬───────┘
                          │
                  ┌───────▼───────┐
                  │ Medications   │
                  │ (by Plan)     │
                  └───────────────┘
```

---

## PDF Export Architecture

```
┌─────────────────────┐
│  Complete Case      │
│  Data               │
└──────────┬──────────┘
           │
    ┌──────▼──────────┐
    │  jsPDF          │
    │  Initialize     │
    └──────┬──────────┘
           │
    ┌──────▼──────────────┐
    │  Add Header         │
    │  (Branded)          │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  Add Case Info      │
    │  - ID, Date         │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  Add Clinical Note  │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  Add Condition      │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  Add ICD Codes      │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  Add Treatments     │
    │  (Both Baskets)     │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  Add Medications    │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  Add Registration   │
    │  Note               │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  Add Footer         │
    │  (Page Numbers)     │
    └──────┬──────────────┘
           │
    ┌──────▼──────────────┐
    │  Generate & Save    │
    │  PDF File           │
    └─────────────────────┘
```

---

## State Management Structure

```typescript
AppStore (Zustand)
│
├── Data State
│   ├── allConditions: Condition[]
│   │   └── [{ name, icdCode, icdDescription }]
│   │
│   ├── allTreatments: Treatment[]
│   │   └── [{ condition, diagnosticBasket[], ongoingManagementBasket[] }]
│   │
│   └── allMedicines: Medicine[]
│       └── [{ condition, cdaAmounts, medicineClass, activeIngredient, ... }]
│
├── Case State
│   ├── currentCase: Partial<Case>
│   │   ├── id
│   │   ├── patientNote
│   │   ├── detectedConditions[]
│   │   ├── confirmedCondition
│   │   ├── selectedIcdCodes[]
│   │   ├── selectedTreatments[]
│   │   ├── selectedMedications[]
│   │   └── chronicRegistrationNote
│   │
│   └── savedCases: Case[]
│       └── Persisted to localStorage
│
├── Workflow State
│   ├── currentStep: 1-5
│   └── selectedPlan: MedicalPlan
│
└── Actions
    ├── Data Loading
    │   ├── setAllConditions()
    │   ├── setAllTreatments()
    │   └── setAllMedicines()
    │
    ├── Case Management
    │   ├── createNewCase()
    │   ├── updateCurrentCase()
    │   ├── saveCase()
    │   ├── loadCase()
    │   └── deleteCase()
    │
    └── Workflow
        ├── setCurrentStep()
        ├── nextStep()
        ├── previousStep()
        └── setSelectedPlan()
```

---

## Security Architecture

```
┌─────────────────────────────────────────┐
│           Browser Environment            │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │     SaluLink Application           │ │
│  │     (Client-Side Only)             │ │
│  │                                    │ │
│  │  ┌──────────────────────────────┐ │ │
│  │  │  React Components            │ │ │
│  │  └──────────┬───────────────────┘ │ │
│  │             │                      │ │
│  │  ┌──────────▼───────────────────┐ │ │
│  │  │  Zustand State Management    │ │ │
│  │  └──────────┬───────────────────┘ │ │
│  │             │                      │ │
│  │  ┌──────────▼───────────────────┐ │ │
│  │  │  localStorage API            │ │ │
│  │  │  - Case Data                 │ │ │
│  │  │  - No Encryption (Default)   │ │ │
│  │  └──────────────────────────────┘ │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Public Directory                  │ │
│  │  - CSV Files (Read-Only)           │ │
│  └────────────────────────────────────┘ │
│                                          │
└─────────────────────────────────────────┘

         No External Communication
         No Backend Server
         No API Calls
         No Data Transmission
```

---

## Performance Optimization

```
┌─────────────────────────────────────────┐
│         Performance Strategies           │
└─────────────────────────────────────────┘

1. Data Loading
   ├── Parallel CSV loading (Promise.all)
   ├── Parse on demand
   └── Cache in Zustand store

2. Component Rendering
   ├── Conditional rendering (only current step)
   ├── Zustand selective subscriptions
   └── React.memo where appropriate

3. State Updates
   ├── Batched updates
   ├── Minimal re-renders
   └── Efficient selectors

4. Asset Loading
   ├── Next.js automatic code splitting
   ├── Dynamic imports for heavy components
   └── Optimized images (if any)

5. localStorage
   ├── Synchronous operations (fast)
   ├── JSON serialization
   └── Periodic cleanup (optional)
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Development Environment          │
│                                          │
│  npm run dev                             │
│  ├── Next.js Dev Server                 │
│  ├── Hot Module Replacement             │
│  ├── Fast Refresh                       │
│  └── Source Maps                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Production Build                 │
│                                          │
│  npm run build                           │
│  ├── TypeScript Compilation             │
│  ├── Tailwind CSS Purge                 │
│  ├── Code Minification                  │
│  ├── Bundle Optimization                │
│  └── Static Generation                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Deployment Options               │
│                                          │
│  Option 1: Vercel                        │
│  ├── Automatic deployments              │
│  ├── Edge network                       │
│  └── Zero config                        │
│                                          │
│  Option 2: Netlify                       │
│  ├── Continuous deployment              │
│  ├── CDN distribution                   │
│  └── Form handling                      │
│                                          │
│  Option 3: Docker                        │
│  ├── Containerized app                  │
│  ├── Portable deployment                │
│  └── Custom infrastructure              │
└─────────────────────────────────────────┘
```

---

## Technology Stack Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer               │
│  - React 18                              │
│  - Tailwind CSS                          │
│  - Lucide Icons                          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Application Layer                │
│  - Next.js 14 (App Router)               │
│  - TypeScript 5.3                        │
│  - ES6+ JavaScript                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Business Logic Layer             │
│  - ClinicalBERT (Pattern Matching)       │
│  - Authi 1.0 (Mapping System)            │
│  - Validation Logic                      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         State Management Layer           │
│  - Zustand Store                         │
│  - React Context (implicit)              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Data Layer                       │
│  - PapaParse (CSV)                       │
│  - localStorage API                      │
│  - jsPDF (Export)                        │
└─────────────────────────────────────────┘
```

---

This architecture provides:

- ✅ **Scalability**: Easy to add new conditions/features
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Performance**: Optimized rendering and data loading
- ✅ **Security**: Client-side only, no data leakage
- ✅ **Reliability**: Type-safe with TypeScript
- ✅ **Usability**: Intuitive workflow and UI
