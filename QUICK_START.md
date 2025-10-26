# Quick Start Guide - SaluLink Chronic Treatment App

## Installation & Setup

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand (state management)
- PapaParse (CSV parsing)
- jsPDF (PDF generation)
- Lucide React (icons)

### Step 2: Start the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Step 3: Using the Application

#### Creating a New Case

1. Click **"New Case"** in the sidebar or on the welcome screen
2. The workflow will start at Step 1

#### Step 1: Clinical Note Analysis

1. Enter or paste a patient's clinical note in the text area
2. Click **"Analyze Note"** 
3. ClinicalBERT will identify potential conditions
4. Select the most accurate condition
5. Click **"Confirm Condition"**

**Example Clinical Note:**
```
Patient presents with polyuria and polydipsia. 
Blood glucose: 8.5 mmol/L
HbA1c: 7.8%
History of Type 2 Diabetes Mellitus
Currently on Metformin 850mg BD
```

#### Step 2: ICD-10 Code Mapping

1. Review the ICD-10 codes displayed by Authi 1.0
2. Select one or more appropriate codes by checking the boxes
3. Click **"Confirm ICD Codes"**

#### Step 3: Treatment Protocol

1. Review the **Diagnostic Basket** (initial tests)
2. Review the **Ongoing Management Basket** (recurring tests)
3. Select applicable procedures by checking the boxes
4. For each selected procedure, click **"Add Documentation"** to:
   - Add clinical notes
   - Add image URLs (lab reports, scans)
5. Click **"Confirm Treatment Selection"**

#### Step 4: Medication Selection

1. Select the patient's **Medical Plan** from the filter buttons
2. Medications will be filtered based on plan availability
3. Browse medications grouped by class
4. Select appropriate medications by checking the boxes
5. Greyed-out medications are not available on the selected plan
6. Click **"Confirm Medication Selection"**

#### Step 5: Final Documentation

1. Review the complete case summary
2. Add a **Chronic Registration Note** in the text area
3. Click **"Save Case"** to save for later
4. Click **"Export as PDF"** to generate a submission-ready document
5. Click **"Start New Case"** to begin another case

### Managing Saved Cases

#### Viewing Cases

1. Click **"View Cases"** in the sidebar
2. A list of saved cases will appear
3. Click on any case to load it

#### Deleting Cases

1. Hover over a case in the list
2. Click the trash icon that appears
3. Confirm deletion

## Supported Conditions

The app currently supports three endocrine conditions:

1. **Diabetes Insipidus**
   - Keywords: polyuria, polydipsia, vasopressin, desmopressin
   
2. **Diabetes Mellitus Type 1**
   - Keywords: insulin dependent, ketoacidosis, autoimmune diabetes
   
3. **Diabetes Mellitus Type 2**
   - Keywords: non-insulin dependent, insulin resistance, metformin

## Medical Plans

The app supports the following South African medical aid plans:

- KeyCare
- Core
- Priority
- Saver
- Executive
- Comprehensive

## Tips for Best Results

### Clinical Note Analysis

- Include specific symptoms and clinical findings
- Mention relevant lab values (HbA1c, glucose levels)
- Include current medications
- Use standard medical terminology

### Treatment Documentation

- Document all performed tests with results
- Include dates where applicable
- Upload or link to supporting images/reports
- Be specific and detailed

### Medication Selection

- Always select the correct medical plan first
- Review CDA amounts for the patient's plan
- Consider formulary restrictions
- Select generic options when available

## Troubleshooting

### "No conditions detected"

- Ensure your note contains diabetes-related terminology
- Include specific symptoms or diagnoses
- Try adding more clinical detail

### "Failed to load application data"

- Check that CSV files are in the `public` folder
- Refresh the page
- Clear browser cache

### PDF Export Issues

- Ensure all required fields are completed
- Check browser pop-up settings
- Try a different browser (Chrome recommended)

## Data Privacy

⚠️ **Important**: All data is stored locally in your browser. No information is sent to external servers.

- Cases are saved in browser localStorage
- Clearing browser data will delete all cases
- Export important cases as PDFs for backup

## Building for Production

To create a production build:

```bash
npm run build
npm start
```

The optimized application will run on [http://localhost:3000](http://localhost:3000)

## System Requirements

- **Node.js**: 18.0 or higher
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **RAM**: 4GB minimum
- **Storage**: 500MB free space

## Support

For technical support or questions:

- Review the main README.md
- Check the code documentation
- Contact the SaluLink development team

---

**Powered by Authi 1.0** 🚀

