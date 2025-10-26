# SaluLink Chronic Treatment App

A comprehensive clinical documentation and treatment management tool designed for doctors and specialist teams managing chronic disease patients within South African medical scheme frameworks.

## Overview

The SaluLink Chronic Treatment App automates the clinical, coding, and compliance process by:

- Mapping clinical notes to specific chronic conditions using ClinicalBERT
- Aligning diagnoses with ICD-10 codes and PMB (Prescribed Minimum Benefit) requirements
- Listing approved diagnostic tests, ongoing management protocols, and formulary-based medications
- Generating complete treatment documentation for export and submission to medical schemes

## Features

### 🔬 **Authi 1.0 Integration**

Automated Treatment and Healthcare Information system that maps conditions to:

- ICD-10 codes with descriptions
- Treatment protocols (diagnostic and ongoing management baskets)
- Formulary-based medications with CDA details

### 📋 **5-Step Workflow**

1. **Clinical Note Input and Analysis**
   - Enter or paste patient clinical notes
   - ClinicalBERT analyzes and identifies chronic conditions
   - Confirm the most accurate condition

2. **ICD-10 Code Mapping**
   - Authi 1.0 displays all relevant ICD-10 codes
   - Select appropriate codes for the case
   - Multiple code selection supported

3. **Treatment Protocol Generation**
   - Diagnostic Basket: Tests required for diagnosis confirmation
   - Ongoing Management Basket: Recurring tests and monitoring
   - Add documentation (notes/images) for each treatment

4. **Medication Mapping and Selection**
   - Filter by medical plan (KeyCare, Core, Priority, Saver, Executive, Comprehensive)
   - View CDA details for different plan tiers
   - Select appropriate medications from formulary

5. **Final Claim Documentation**
   - Review complete case summary
   - Add chronic registration note
   - Export as PDF for submission
   - Save case for future reference

### 💾 **Case Management**

- Save and manage multiple cases
- Load previous cases for review or editing
- Delete cases as needed
- All data stored locally in browser

### 📄 **PDF Export**

- Professional, formatted PDF documents
- Complete treatment documentation
- Ready for medical scheme submission

## Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Processing**: PapaParse for CSV parsing
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Data Files

The application uses three CSV datasets located in the `public` directory:

- `Endocrine CONDITIONS.csv` - Condition definitions and ICD-10 mappings
- `Endocrine TREATMENT.csv` - Diagnostic and management protocols
- `Endocrine MEDICINE.csv` - Chronic medication formulary and plan coverage

## Supported Conditions

Currently supports three endocrine conditions:

- Diabetes Insipidus
- Diabetes Mellitus Type 1
- Diabetes Mellitus Type 2

## ClinicalBERT Integration

The app uses semantic pattern matching to identify conditions in clinical notes. In a production environment, this would connect to a ClinicalBERT API endpoint for more sophisticated natural language processing.

## Medical Plan Support

- KeyCare
- Core
- Priority
- Saver
- Executive
- Comprehensive

Medications are automatically filtered based on plan availability and exclusions.

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari

## Data Privacy

All patient data is stored locally in the browser's localStorage. No data is transmitted to external servers. For production use, implement appropriate security measures and comply with healthcare data regulations (POPIA, HIPAA, etc.).

## License

Proprietary - SaluLink

## Support

For questions or support, please contact the SaluLink team.

---

**Powered by Authi 1.0** - Automated Treatment and Healthcare Information System

