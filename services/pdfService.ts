

import { jsPDF } from 'jspdf';
import type { ExamSection, ExamOptions } from '../types';
import { QuestionType } from '../types';


const renderMatchAnswer = (answer: string): string => {
    try {
        const parsed = JSON.parse(answer);
        return Object.entries(parsed)
            .map(([key, value]) => `${key} -> ${value}`)
            .join(', ');
    } catch {
        return answer; // Fallback for non-JSON answers
    }
};

export const exportToPDF = (sections: ExamSection[], options: ExamOptions, t: (key: string) => string): void => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });
  
  let y = 15;
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const lineSpacing = 6;

  const checkPageBreak = (spaceNeeded: number) => {
    if (y + spaceNeeded > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // 1. Exam Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(options.examName, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
  y += 8;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(options.className, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
  y += 15;
  
  // 2. Student Info
  doc.setFontSize(12);
  const studentInfoFields: {label: string}[] = [];
  if (options.studentFields.includeName) studentInfoFields.push({ label: `${t('name')}:` });
  if (options.studentFields.includeId) studentInfoFields.push({ label: `${t('idNo')}:` });
  if (options.studentFields.includeClass) studentInfoFields.push({ label: `${t('class')}:` });
  
  if (studentInfoFields.length > 0) {
      const fieldWidth = (maxWidth - (studentInfoFields.length - 1) * 5) / studentInfoFields.length;
      let x = margin;
      
      for (const field of studentInfoFields) {
        const labelWidth = doc.getTextWidth(field.label);
        doc.text(field.label, x, y);
        doc.line(x + labelWidth + 2, y, x + fieldWidth, y);
        x += fieldWidth + 5;
      }
      y += 15;
  }
  
  // 3. Description
  if (options.description) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      const descLines = doc.splitTextToSize(`${t('instructions')}: ${options.description}`, maxWidth);
      checkPageBreak(descLines.length * (lineSpacing - 1));
      doc.text(descLines, margin, y);
      y += descLines.length * (lineSpacing - 2) + 8;
      doc.line(margin, y - 5, maxWidth + margin, y - 5);
      y += 2;
  }

  // 4. Questions
  for (const section of sections) {
    checkPageBreak(15);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin, y);
    y += lineSpacing * 1.5;

    for (const question of section.questions) {
        checkPageBreak(20); // Initial check for some space
        
        doc.setFontSize(12);
        const questionNumberText = `${question.questionNumberInPart}.`;
        const numberWidth = doc.getTextWidth(questionNumberText);

        const questionTextLines = doc.splitTextToSize(question.questionText, maxWidth - (numberWidth + 2));

        // Check if the whole block fits before rendering
        checkPageBreak(questionTextLines.length * lineSpacing);
        const currentY = y;

        doc.setFont('helvetica', 'bold');
        doc.text(questionNumberText, margin, currentY);

        doc.setFont('helvetica', 'normal');
        doc.text(questionTextLines, margin + numberWidth + 2, currentY);

        y += questionTextLines.length * (lineSpacing - 0.5);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        
        if (question.type === QuestionType.MULTIPLE_CHOICE && question.options) {
        y += 2;
        for (let i = 0; i < question.options.length; i++) {
            const optionText = `(${String.fromCharCode(65 + i)}) ${question.options[i]}`;
            const optionLines = doc.splitTextToSize(optionText, maxWidth - 10);
            checkPageBreak(optionLines.length * (lineSpacing - 1));
            doc.text(optionLines, margin + 5, y);
            y += optionLines.length * (lineSpacing - 1);
        }
        } else if (question.type === QuestionType.MATCH_COLUMNS && question.columnA && question.columnB) {
            y += 5;
            const colAStartY = y;
            doc.setFont('helvetica', 'bold');
            doc.text(t('columnA'), margin, y);
            doc.setFont('helvetica', 'normal');
            y += lineSpacing;
            for (const item of question.columnA) {
                const itemText = `${item.id}. ${item.text}`;
                const itemLines = doc.splitTextToSize(itemText, (maxWidth/2) - 5);
                checkPageBreak(itemLines.length * (lineSpacing - 1));
                doc.text(itemLines, margin, y);
                y += itemLines.length * (lineSpacing - 1);
            }

            let colB_y = colAStartY;
            const colBx = margin + maxWidth / 2;
            doc.setFont('helvetica', 'bold');
            doc.text(t('columnB'), colBx, colB_y);
            doc.setFont('helvetica', 'normal');
            colB_y += lineSpacing;
            for (const item of question.columnB) {
                const itemText = `${item.id}. ${item.text}`;
                const itemLines = doc.splitTextToSize(itemText, (maxWidth/2) - 5);
                checkPageBreak(itemLines.length * (lineSpacing - 1));
                doc.text(itemLines, colBx, colB_y);
                colB_y += itemLines.length * (lineSpacing - 1);
            }
            y = Math.max(y, colB_y);
            y += lineSpacing;
            checkPageBreak(question.columnA.length * lineSpacing);
            doc.text(`${t('answers')}:`, margin, y);
            y += lineSpacing;
            for (const item of question.columnA) {
                doc.text(`${item.id}. ____`, margin + 5, y);
                y += lineSpacing;
            }

        } else if (question.type === QuestionType.TRUE_FALSE) {
            y += 5;
            doc.text('(  ) True   (  ) False', margin + 5, y);
            y += 8;
        } else if (question.type === QuestionType.SHORT_ANSWER || question.type === QuestionType.DIRECT_QUESTION) {
            y += 3;
            checkPageBreak(14);
            doc.line(margin, y, maxWidth + margin, y);
            y += 7;
            doc.line(margin, y, maxWidth + margin, y);
            y += 7;
        } else if (question.type === QuestionType.ESSAY) {
            y += 3;
            checkPageBreak(35);
            for (let i = 0; i < 5; i++) {
                doc.line(margin, y, maxWidth + margin, y);
                y += 7;
            }
        } else if (question.type === QuestionType.FILL_IN_THE_BLANKS) {
            y += 8; // The question text itself usually contains the blank space.
        }
        
        y += 8; // Space between questions
    }
     y += 4; // Extra space between sections
  }

  // 5. Answer Key
  doc.addPage();
  y = margin;
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(t('answerKey'), doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
  y += 15;

  for (const section of sections) {
    checkPageBreak(10);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin, y);
    y += lineSpacing + 2;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    for (const question of section.questions) {
        const answerText = question.type === QuestionType.MATCH_COLUMNS 
            ? renderMatchAnswer(question.answer) 
            : question.answer;

        const answerLine = `${question.questionNumberInPart}. ${answerText}`;
        const answerLines = doc.splitTextToSize(answerLine, maxWidth - 5);
        checkPageBreak(answerLines.length * (lineSpacing - 1.5));
        doc.text(answerLines, margin + 5, y);
        y += answerLines.length * (lineSpacing - 1.5);
    }
    y += 8; // Space between answer sections
  }
  
  const filename = `${options.examName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
  doc.save(filename);
};