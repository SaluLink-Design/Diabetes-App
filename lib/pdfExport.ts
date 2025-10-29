import jsPDF from 'jspdf';
import { Case, Condition, Medicine, TreatmentItem, ChronicRegistrationNote } from '@/types';

export const exportCaseToPDF = (caseData: Case) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  // Helper function to add text with page break handling
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
    if (yPosition > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, 170);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  };

  // Title
  doc.setFillColor(159, 98, 237);
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('SaluLink Chronic Treatment', margin, 25);
  doc.setFontSize(12);
  doc.text('Clinical Documentation Report', margin, 33);
  
  yPosition = 50;
  doc.setTextColor(0, 0, 0);

  // Case Information
  addText(`Case ID: ${caseData.id}`, 10, true);
  addText(`Date: ${new Date(caseData.createdAt).toLocaleDateString()}`, 10);
  yPosition += 5;

  // Original Clinical Note
  addText('ORIGINAL CLINICAL NOTE', 14, true);
  yPosition += 2;
  addText(caseData.patientNote, 10);
  yPosition += 5;

  // Confirmed Condition
  addText('CONFIRMED CONDITION', 14, true);
  yPosition += 2;
  addText(caseData.confirmedCondition, 12, true);
  yPosition += 5;

  // ICD-10 Codes
  addText('SELECTED ICD-10 CODES', 14, true);
  yPosition += 2;
  caseData.selectedIcdCodes.forEach((code: Condition) => {
    addText(`• ${code.icdCode}: ${code.icdDescription}`, 10);
  });
  yPosition += 5;

  // Diagnostic Basket
  const diagnosticItems = caseData.selectedTreatments.filter(
    (t: any) => t.basketType === 'diagnostic'
  );
  if (diagnosticItems.length > 0) {
    addText('DIAGNOSTIC BASKET', 14, true);
    yPosition += 2;
    diagnosticItems.forEach((item: any) => {
      addText(`• ${item.description}`, 10, true);
      addText(`  Code: ${item.code}`, 9);
      addText(`  Number Covered: ${item.numberCovered}`, 9);
      if (item.documentation?.note) {
        addText(`  Documentation: ${item.documentation.note}`, 9);
      }
      yPosition += 2;
    });
    yPosition += 3;
  }

  // Ongoing Management Basket
  const ongoingItems = caseData.selectedTreatments.filter(
    (t: any) => t.basketType === 'ongoing'
  );
  if (ongoingItems.length > 0) {
    addText('ONGOING MANAGEMENT BASKET', 14, true);
    yPosition += 2;
    ongoingItems.forEach((item: any) => {
      addText(`• ${item.description}`, 10, true);
      addText(`  Code: ${item.code}`, 9);
      addText(`  Number Covered: ${item.numberCovered}`, 9);
      if (item.specialistsCovered) {
        addText(`  Specialists Covered: ${item.specialistsCovered}`, 9);
      }
      if (item.documentation?.note) {
        addText(`  Documentation: ${item.documentation.note}`, 9);
      }
      yPosition += 2;
    });
    yPosition += 3;
  }

  // Selected Medications
  if (caseData.selectedMedications.length > 0) {
    addText('SELECTED MEDICATIONS', 14, true);
    yPosition += 2;
    caseData.selectedMedications.forEach((med: Medicine) => {
      addText(`• ${med.medicineNameStrength}`, 10, true);
      addText(`  Class: ${med.medicineClass}`, 9);
      addText(`  Active Ingredient: ${med.activeIngredient}`, 9);
      addText(`  CDA (Core/Priority/Saver): ${med.cdaCorePrioritySaver}`, 9);
      addText(`  CDA (Executive/Comprehensive): ${med.cdaExecutiveComprehensive}`, 9);
      yPosition += 2;
    });
    yPosition += 3;
  }

  // Chronic Registration Notes
  if (caseData.chronicRegistrationNotes && caseData.chronicRegistrationNotes.length > 0) {
    addText(`CHRONIC REGISTRATION NOTES (${caseData.chronicRegistrationNotes.length} MEDICATION${caseData.chronicRegistrationNotes.length > 1 ? 'S' : ''})`, 14, true);
    yPosition += 2;

    caseData.chronicRegistrationNotes.forEach((note: ChronicRegistrationNote, index: number) => {
      addText(`Medication ${index + 1}: ${note.medication.medicineNameStrength}`, 12, true);
      addText(`${note.medication.activeIngredient} • ${note.medication.medicineClass}`, 9);
      yPosition += 2;
      addText(note.fullNote, 10);
      yPosition += 4;
    });
  } else if (caseData.chronicRegistrationNote) {
    // Legacy support for old format
    addText('CHRONIC REGISTRATION NOTE', 14, true);
    yPosition += 2;
    addText(caseData.chronicRegistrationNote, 10);
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${totalPages} | Generated by SaluLink Authi 1.0`,
      margin,
      pageHeight - 10
    );
  }

  // Save the PDF
  const fileName = `SaluLink_Case_${caseData.id}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

