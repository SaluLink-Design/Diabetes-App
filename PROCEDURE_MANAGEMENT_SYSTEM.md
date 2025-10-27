# Medical Procedure Management System Documentation

## System Overview

The Medical Procedure Management System is an advanced interface designed for medical professionals to manage chronic disease treatment protocols with precision and compliance. The system integrates procedure code tracking, quantity management, and comprehensive documentation capabilities.

---

## Core Functionality

### 1. Procedure Code Display and Management

**Data Source:** `Endocrine TREATMENT.csv`

The system displays all procedure codes organized into two baskets:

- **Diagnostic Basket**: Initial tests required to confirm diagnosis
- **Ongoing Management Basket**: Recurring tests and monitoring procedures

**For each procedure, the system shows:**
- Procedure/Test Description
- Procedure/Test Code (with support for multi-code options)
- Coverage Limit (maximum number of tests covered)
- Specialist Coverage (for ongoing management)

### 2. Quantity Tracking with Coverage Limits

**Features:**
- Real-time quantity adjustment using increment/decrement buttons
- Direct numeric input with validation
- Hard limit enforcement - prevents exceeding coverage limits
- Visual progress indicators showing usage vs. limit

**Validation Rules:**
- Quantity must be greater than 0 for selected procedures
- Quantity cannot exceed the `coverageLimit` specified in CSV
- Real-time error messages when limits are approached or exceeded
- Visual warnings when at 80% capacity (yellow) or 100% (red)

**User Interface Elements:**
- Plus/Minus buttons for incremental adjustments
- Numeric input field for direct entry
- Progress bar with color coding:
  - Blue: Normal usage (0-79%)
  - Orange: Near limit (80-99%)
  - Red: At limit (100%)
- Coverage counter showing "Current / Maximum"

### 3. Documentation System

**Text-Based Documentation:**
- Rich text area for clinical notes
- Space for observations, findings, and test results
- Timestamp automatically captured on save

**File Upload Capabilities:**

**Accepted Formats:**
- Images: JPG, JPEG, PNG
- Documents: PDF

**File Specifications:**
- Maximum file size: 5 MB per file
- Multiple file uploads supported
- Automatic file type detection and validation
- File metadata captured (name, size, upload timestamp)

**Documentation Features:**
- Drag-and-drop file upload interface
- File preview with type-specific icons
- Individual file removal capability
- Complete file list with size and timestamp
- Documentation status indicators

---

## Technical Architecture

### Data Models

```typescript
interface TreatmentItem {
  description: string;
  code: string;
  numberCovered: string;
  coverageLimit: number;
  specialistsCovered?: string;
  selectedQuantity?: number;
  basketType?: 'diagnostic' | 'ongoing';
  documentation?: {
    note?: string;
    files?: DocumentFile[];
    timestamp?: Date;
  };
}

interface DocumentFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf' | 'other';
  size: number;
  uploadedAt: Date;
}
```

### Data Validation Rules

**File Validation:**
```typescript
- File type check: Only JPG, PNG, PDF accepted
- Size validation: Maximum 5MB
- Format verification: MIME type validation
- Error handling: Clear user feedback on rejection
```

**Quantity Validation:**
```typescript
- Range check: 0 < quantity <= coverageLimit
- Real-time validation on input change
- Prevention of invalid submissions
- Visual feedback on validation state
```

### Components

**1. ProcedureQuantityControl**
- Handles quantity input and validation
- Displays coverage progress
- Manages increment/decrement logic
- Shows error messages

**2. DocumentationUpload**
- File upload interface
- Document management
- Note entry and editing
- Timestamp tracking

**3. Step3TreatmentProtocol**
- Main procedure selection interface
- Integrates quantity and documentation
- Validation before proceeding
- Summary display

---

## User Interface Design

### Visual Indicators

**Coverage Status:**
- Green checkmark: Documentation added
- Progress bar: Visual quantity tracking
- Color-coded alerts: Orange (near limit), Red (at limit)
- Disabled controls: Greyed out when at capacity

**Error Handling:**
- Inline error messages below controls
- Alert banners for critical validation
- Auto-dismissing success messages
- Clear action instructions

### Information Hierarchy

**Step 3: Treatment Protocol Screen Layout:**

```
┌─────────────────────────────────────────────────┐
│ Step 3: Treatment Protocol Generation          │
├─────────────────────────────────────────────────┤
│ [Guidelines Box]                                │
│ • Set quantities (must be > 0)                  │
│ • Cannot exceed coverage limits                 │
│ • Add documentation                             │
│ • Upload files (JPG, PNG, PDF)                  │
├─────────────────────────────────────────────────┤
│ Total Procedures: X          Condition: [Name]  │
├─────────────────────────────────────────────────┤
│ DIAGNOSTIC BASKET                    [X selected]│
│                                                  │
│ ┌──────────────────────────────────────────┐   │
│ │ ☑ Procedure Name                         │   │
│ │   Code: 4171  Max Coverage: 3            │   │
│ │   ┌────────────────────────────────────┐ │   │
│ │   │ [-] [1] [+]  Progress: 1/3 ▓░░░░░  │ │   │
│ │   └────────────────────────────────────┘ │   │
│ │   [Add Documentation] ✓ Documented       │   │
│ └──────────────────────────────────────────┘   │
│                                                  │
├─────────────────────────────────────────────────┤
│ ONGOING MANAGEMENT BASKET            [Y selected]│
│ [Similar structure]                             │
├─────────────────────────────────────────────────┤
│ [Previous]  [Confirm Treatment Selection]       │
└─────────────────────────────────────────────────┘
```

### Documentation Modal

```
┌─────────────────────────────────────────────┐
│ Add Documentation                      [X]  │
├─────────────────────────────────────────────┤
│ Procedure: U & E only                       │
│ Code: 4171                                  │
├─────────────────────────────────────────────┤
│ Clinical Notes                              │
│ ┌─────────────────────────────────────────┐ │
│ │ [Text area for notes]                   │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Upload Documents                            │
│ ┌─────────────────────────────────────────┐ │
│ │     [Upload Icon]                       │ │
│ │  Drag files here or click to browse    │ │
│ │  JPG, PNG, PDF (Max 5MB)                │ │
│ │     [Select Files]                      │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Uploaded Files (2):                         │
│ [📄 lab-report.pdf] 2.3 MB          [X]    │
│ [🖼 scan-result.jpg] 1.1 MB         [X]    │
├─────────────────────────────────────────────┤
│ [Cancel]          [Save Documentation]      │
└─────────────────────────────────────────────┘
```

---

## Workflow Integration

### Step-by-Step Process

**Step 1: Procedure Selection**
1. User views available procedures in both baskets
2. User checks boxes to select required procedures
3. System enables quantity controls for selected items

**Step 2: Quantity Configuration**
1. User sets quantity for each selected procedure
2. System validates against coverage limits in real-time
3. Visual indicators show remaining capacity
4. System prevents exceeding limits

**Step 3: Documentation**
1. User clicks "Add Documentation" for each procedure
2. Modal opens for note entry and file upload
3. User enters clinical findings
4. User uploads supporting documents
5. System validates file types and sizes
6. Timestamp is automatically recorded

**Step 4: Confirmation**
1. System validates all selections have valid quantities
2. System checks all required documentation is present
3. User confirms to proceed to next step

**Step 5: Final Review**
1. All procedures displayed with quantities
2. Documentation notes shown
3. Attached files listed with names
4. Timestamps displayed for audit trail

---

## Data Persistence

### Local Storage
- All case data stored in browser localStorage
- Files converted to Base64 for storage
- Automatic case saving on updates
- Case history maintained

### Export Functionality
- PDF export includes all quantities
- Documentation notes embedded in output
- File attachments listed with metadata
- Timestamps for regulatory compliance

---

## Security and Compliance

**Data Validation:**
- File type whitelist enforcement
- Size limit checks
- Input sanitization
- MIME type verification

**Data Integrity:**
- Mandatory quantity validation
- Coverage limit enforcement
- Timestamp auditing
- Complete documentation trails

**Privacy:**
- Client-side processing
- No external data transmission
- Local storage only
- User-controlled data export

---

## Error Handling

### User-Facing Errors

**File Upload Errors:**
- "Invalid file type. Only JPG, PNG, and PDF files are accepted."
- "File size exceeds 5MB limit."
- "Failed to upload file. Please try again."

**Quantity Errors:**
- "Quantity cannot be negative"
- "Cannot exceed coverage limit of [X]"
- "Coverage limit of [X] reached"

**Validation Errors:**
- "Please set valid quantities for all selected procedures"
- "Quantity must be greater than 0"
- "Please add documentation for selected procedures"

### Technical Error Handling
- Graceful degradation on file processing failures
- Retry mechanisms for upload issues
- Clear error messages with recovery instructions
- Logging for debugging purposes

---

## Performance Optimization

**File Handling:**
- Asynchronous upload processing
- Progress indicators during operations
- Efficient Base64 encoding
- Chunked processing for large files

**UI Responsiveness:**
- Debounced input validation
- Optimistic UI updates
- Lazy loading of documentation modals
- Efficient re-rendering strategies

---

## Testing Recommendations

### Functional Testing
- Verify coverage limit enforcement
- Test quantity validation edge cases
- Validate file type restrictions
- Check file size limits
- Confirm timestamp accuracy

### User Acceptance Testing
- Medical professional workflow validation
- Documentation completeness checks
- Error message clarity verification
- Overall usability assessment

### Integration Testing
- CSV data parsing accuracy
- State management consistency
- Export functionality completeness
- Data persistence reliability

---

## Future Enhancements

**Potential Features:**
- Batch procedure selection
- Template documentation notes
- Document preview capabilities
- Advanced search and filtering
- Audit log export
- Multi-user collaboration
- Cloud storage integration
- OCR for uploaded documents

---

## Support and Maintenance

**Regular Updates:**
- CSV data updates for new procedures
- Coverage limit adjustments
- Code mappings maintenance
- File format support expansion

**User Training:**
- Workflow documentation
- Video tutorials
- Best practices guide
- Common issues FAQ

---

## Conclusion

The Medical Procedure Management System provides a comprehensive, user-friendly interface for managing chronic disease treatment protocols. With robust validation, complete documentation capabilities, and intuitive quantity tracking, the system ensures medical professionals can maintain accurate, compliant treatment records while optimizing coverage utilization.

**Key Benefits:**
✓ Real-time coverage limit enforcement
✓ Comprehensive documentation with file uploads
✓ Intuitive quantity management
✓ Complete audit trails
✓ Data integrity assurance
✓ Regulatory compliance support
