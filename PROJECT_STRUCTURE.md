# SaluLink Chronic Treatment App - Project Structure

## Directory Structure

```
Diabetes App/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Main application page
│
├── components/                   # React components
│   ├── Sidebar.tsx              # Navigation and case management sidebar
│   ├── WorkflowProgress.tsx     # Step progress indicator
│   ├── Step1ClinicalNote.tsx    # Clinical note input and analysis
│   ├── Step2IcdMapping.tsx      # ICD-10 code selection
│   ├── Step3TreatmentProtocol.tsx # Treatment basket selection
│   ├── Step4Medication.tsx      # Medication selection
│   └── Step5FinalClaim.tsx      # Final documentation and export
│
├── lib/                          # Utility libraries
│   ├── dataLoader.ts            # CSV data loading and parsing
│   ├── clinicalBERT.ts          # Condition detection logic
│   ├── authi.ts                 # Authi 1.0 mapping system
│   └── pdfExport.ts             # PDF generation
│
├── store/                        # State management
│   └── useAppStore.ts           # Zustand store for app state
│
├── types/                        # TypeScript type definitions
│   └── index.ts                 # Core type definitions
│
├── public/                       # Static assets
│   ├── Endocrine CONDITIONS.csv # Condition and ICD-10 data
│   ├── Endocrine MEDICINE.csv   # Medication formulary
│   └── Endocrine TREATMENT.csv  # Treatment protocols
│
├── package.json                  # Project dependencies
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── next.config.js               # Next.js configuration
├── .gitignore                   # Git ignore rules
├── README.md                    # Main documentation
├── QUICK_START.md               # Quick start guide
└── PROJECT_STRUCTURE.md         # This file
```

## Component Architecture

### Main Application Flow

```
app/page.tsx (Main Container)
├── Sidebar (Navigation & Case Management)
├── WorkflowProgress (Step Indicator)
└── Step Components (Conditional Rendering)
    ├── Step1ClinicalNote
    ├── Step2IcdMapping
    ├── Step3TreatmentProtocol
    ├── Step4Medication
    └── Step5FinalClaim
```

### State Management Flow

```
useAppStore (Zustand)
├── Data State
│   ├── allConditions: Condition[]
│   ├── allTreatments: Treatment[]
│   └── allMedicines: Medicine[]
│
├── Current Case State
│   ├── currentCase: Partial<Case>
│   ├── savedCases: Case[]
│   └── currentStep: number
│
└── Actions
    ├── Case Management (create, update, save, load, delete)
    ├── Workflow Navigation (next, previous, setStep)
    └── Data Loading (setConditions, setTreatments, setMedicines)
```

## Core Modules

### 1. Data Loader (`lib/dataLoader.ts`)

**Purpose**: Load and parse CSV data files

**Functions**:

- `loadConditionsData()`: Loads ICD-10 codes and condition mappings
- `loadMedicineData()`: Loads medication formulary with plan coverage
- `loadTreatmentData()`: Loads diagnostic and management protocols
- `groupConditionsByName()`: Groups conditions for easy lookup
- `getMedicinesByCondition()`: Filters medicines by condition
- `getTreatmentByCondition()`: Gets treatment protocol for condition

### 2. ClinicalBERT Integration (`lib/clinicalBERT.ts`)

**Purpose**: Analyze clinical notes to identify conditions

**Functions**:

- `analyzeClinicalNote()`: Main analysis function using pattern matching
- `isDiabetesRelated()`: Validates if note is diabetes-related
- `extractClinicalData()`: Extracts symptoms, medications, and lab values

**Detection Strategy**:

- Pattern-based semantic matching
- Confidence scoring system
- Multi-keyword recognition
- Context-aware identification

### 3. Authi 1.0 System (`lib/authi.ts`)

**Purpose**: Map conditions to clinical data

**Functions**:

- `mapConditionToData()`: Complete mapping of condition to ICD/treatments/meds
- `validateIcdSelection()`: Ensures valid ICD code selection
- `validateTreatmentSelection()`: Ensures valid treatment selection
- `validateMedicationSelection()`: Ensures valid medication selection
- `filterMedicationsByPlan()`: Filters meds by medical plan
- `generateCaseSummary()`: Creates formatted case summary

### 4. PDF Export (`lib/pdfExport.ts`)

**Purpose**: Generate professional PDF documents

**Features**:

- Branded header with SaluLink styling
- Complete case documentation
- Automatic page breaks
- Page numbering
- Professional formatting

## Data Models

### Core Types

```typescript
// Condition with ICD-10 mapping
interface Condition {
  name: string;
  icdCode: string;
  icdDescription: string;
}

// Treatment protocol
interface Treatment {
  condition: string;
  diagnosticBasket: TreatmentItem[];
  ongoingManagementBasket: TreatmentItem[];
}

// Treatment item
interface TreatmentItem {
  description: string;
  code: string;
  numberCovered: string;
  specialistsCovered?: string;
  selected?: boolean;
  documentation?: {
    note?: string;
    imageUrl?: string;
  };
}

// Medicine
interface Medicine {
  condition: string;
  cdaCorePrioritySaver: string;
  cdaExecutiveComprehensive: string;
  medicineClass: string;
  activeIngredient: string;
  medicineNameStrength: string;
  plansExcluded?: string[];
  selected?: boolean;
}

// Complete case
interface Case {
  id: string;
  patientNote: string;
  detectedConditions: string[];
  confirmedCondition: string;
  selectedIcdCodes: Condition[];
  selectedTreatments: TreatmentItem[];
  selectedMedications: Medicine[];
  chronicRegistrationNote: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Workflow Steps Detail

### Step 1: Clinical Note Analysis

- **Input**: Free-text clinical note
- **Process**: ClinicalBERT semantic analysis
- **Output**: Detected conditions list
- **User Action**: Confirm most accurate condition

### Step 2: ICD-10 Mapping

- **Input**: Confirmed condition
- **Process**: Authi 1.0 retrieves ICD codes from CONDITIONS.csv
- **Output**: List of applicable ICD-10 codes
- **User Action**: Select relevant codes (multiple allowed)

### Step 3: Treatment Protocol

- **Input**: Confirmed condition
- **Process**: Authi 1.0 retrieves protocols from TREATMENT.csv
- **Output**: Diagnostic and Ongoing Management baskets
- **User Action**: Select procedures, add documentation

### Step 4: Medication Selection

- **Input**: Confirmed condition, selected medical plan
- **Process**: Authi 1.0 retrieves medications from MEDICINE.csv
- **Output**: Filtered medication list by plan
- **User Action**: Select appropriate medications

### Step 5: Final Documentation

- **Input**: All previous selections
- **Process**: Compile complete case summary
- **Output**: Formatted documentation
- **User Action**: Add registration note, save, or export

## Key Features Implementation

### 1. Case Management

- **Storage**: Browser localStorage
- **Persistence**: Automatic on save
- **Retrieval**: Load by case ID
- **Deletion**: Soft delete with confirmation

### 2. Medical Plan Filtering

- **Logic**: Check `plansExcluded` array
- **UI**: Grey out unavailable medications
- **Validation**: Prevent selection of excluded items

### 3. Treatment Documentation

- **Modal**: Overlay for note/image entry
- **Storage**: Embedded in treatment item
- **Display**: Visual indicator when added

### 4. PDF Generation

- **Library**: jsPDF
- **Format**: Professional multi-page document
- **Content**: Complete case with all selections
- **Branding**: SaluLink header and footer

## Styling System

### Tailwind Configuration

- **Primary Color**: Purple gradient (#9f62ed)
- **Font**: Inter (system font)
- **Responsive**: Mobile-first approach
- **Components**: Utility-first classes

### Custom Styles

- Scrollbar styling (purple theme)
- Gradient backgrounds
- Shadow effects
- Hover states

## Performance Considerations

### Data Loading

- Async CSV parsing
- Promise.all for parallel loading
- Loading states with spinners

### State Management

- Zustand for minimal re-renders
- Selective updates
- localStorage sync

### Component Optimization

- Conditional rendering
- Memoization where needed
- Efficient list rendering

## Security & Privacy

### Data Storage

- **Local Only**: No external transmission
- **Browser Storage**: localStorage API
- **No Backend**: Client-side only

### Considerations for Production

- Implement proper authentication
- Add encryption for sensitive data
- Comply with POPIA/HIPAA
- Add audit logging
- Implement backup mechanisms

## Extension Points

### Adding New Conditions

1. Add entries to `Endocrine CONDITIONS.csv`
2. Add patterns to `clinicalBERT.ts`
3. Add treatments to `Endocrine TREATMENT.csv`
4. Add medicines to `Endocrine MEDICINE.csv`

### Adding New Medical Plans

1. Update `MedicalPlan` type in `types/index.ts`
2. Add to `MEDICAL_PLANS` array in `Step4Medication.tsx`
3. Update CSV data with plan exclusions

### Integrating Real ClinicalBERT

1. Create API endpoint for ClinicalBERT service
2. Replace pattern matching in `clinicalBERT.ts`
3. Add API key management
4. Implement error handling

## Testing Recommendations

### Unit Tests

- Data parsing functions
- Condition detection logic
- Validation functions
- State management actions

### Integration Tests

- Workflow progression
- Data loading and mapping
- PDF generation
- Case save/load

### E2E Tests

- Complete workflow from note to export
- Case management operations
- Plan filtering
- Error scenarios

## Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Static Export (Optional)

```bash
npm run build
# Configure next.config.js for static export
```

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE11 (not supported)

## Dependencies

### Core

- `next`: 14.0.0
- `react`: 18.2.0
- `typescript`: 5.3.0

### UI

- `tailwindcss`: 3.3.0
- `lucide-react`: 0.294.0

### Utilities

- `zustand`: 4.4.7 (state management)
- `papaparse`: 5.4.1 (CSV parsing)
- `jspdf`: 2.5.1 (PDF generation)

## Future Enhancements

1. **Backend Integration**
   - User authentication
   - Cloud storage
   - Multi-device sync

2. **Advanced Features**
   - Real ClinicalBERT API
   - OCR for document upload
   - Digital signatures
   - Batch processing

3. **Reporting**
   - Analytics dashboard
   - Usage statistics
   - Compliance reports

4. **Collaboration**
   - Multi-user support
   - Case sharing
   - Comments and notes

---

**Built with ❤️ for healthcare professionals**
