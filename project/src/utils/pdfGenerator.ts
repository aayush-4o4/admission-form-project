import { jsPDF } from 'jspdf';

interface FormData {
  photo: File | null;
  postAppliedFor: string;
  organization: string;
  fullName: string;
  dateOfBirth: string;
  contactNo: string;
  motherTongue: string;
  socialMediaId: string;
  familyStatus: string;
  marriagePlan: string;
  sex: string;
  hasGraduation: boolean;
  graduationDegree: string;
  graduationUniversity: string;
  graduationSubject: string;
  graduationYear: string;
  graduationPercentage: string;
  hasPostGraduation: boolean;
  postGraduationDegree: string;
  postGraduationUniversity: string;
  postGraduationSubject: string;
  postGraduationYear: string;
  postGraduationPercentage: string;
  hasProfessionalPostGraduation: boolean;
  professionalPostGraduationDegree: string;
  professionalPostGraduationUniversity: string;
  professionalPostGraduationSubject: string;
  professionalPostGraduationYear: string;
  professionalPostGraduationPercentage: string;
  otherCourses: string;
  computerKnowledge: string;
  otherSkills: string;
  schoolingMedium: string;
  subjectProficiency: string;
  teachingStandard: string;
  otherSubjects: string;
  currentJobStatus: string;
  currentOrganization: string;
  currentJobProfile: string;
  currentSalary: string;
  pfDeducted: string;
  expectedSalary: string;
  joiningTime: string;
  customJoiningDate: string;
  preferableTimings: string;
  customTimingFrom: string;
  customTimingFromPeriod: string;
  customTimingTo: string;
  customTimingToPeriod: string;
  referenceName: string;
  referenceProfession: string;
  referenceContact: string;
}

export async function generatePDF(
  formData: FormData,
  photoDataUrl: string
): Promise<void> {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = 20;

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 35, 'F');

  try {
    const logoImg = await loadImage(
      '/White and Brown Grand Opening Coffee Shop Presentation.png'
    );
    doc.addImage(logoImg, 'PNG', margin, 8, 20, 20);
  } catch (error) {
    console.log('Logo not loaded');
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Employee Information Form', margin + 25, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Rapid Academy of Career Exam', margin + 25, 25);

  doc.setTextColor(0, 0, 0);
  yPos = 45;

  if (photoDataUrl) {
    try {
      doc.addImage(photoDataUrl, 'JPEG', pageWidth - margin - 35, yPos, 35, 45);
    } catch (error) {
      console.log('Photo not added to PDF');
    }
  }

  doc.setFillColor(239, 246, 255);
  doc.rect(margin, yPos, pageWidth - 2 * margin - 40, 10, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Personal Information', margin + 3, yPos + 7);

  doc.setTextColor(0, 0, 0);
  yPos += 15;

  const addField = (
    label: string,
    value: string,
    isFullWidth: boolean = false
  ) => {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(label + ':', margin, yPos);

    doc.setFont('helvetica', 'normal');
    const textWidth = isFullWidth ? pageWidth - 2 * margin - 40 : 80;
    const splitText = doc.splitTextToSize(value || 'N/A', textWidth);
    doc.text(splitText, margin + 55, yPos);

    yPos += splitText.length * 5 + 3;
  };

  const addSection = (title: string) => {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = 20;
    }

    yPos += 5;
    doc.setFillColor(239, 246, 255);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text(title, margin + 3, yPos + 7);
    doc.setTextColor(0, 0, 0);
    yPos += 15;
  };

  addField('Application for Post', formData.postAppliedFor, true);
  addField('Organization', formData.organization, true);
  addField('Full Name', formData.fullName, true);
  addField('Date of Birth', formData.dateOfBirth);
  addField('Contact No', formData.contactNo);
  addField('Mother Tongue', formData.motherTongue);
  addField('Social Media ID', formData.socialMediaId, true);
  addField('Sex', formData.sex);
  addField('Family Status', formData.familyStatus);

  if (formData.familyStatus === 'Unmarried' && formData.marriagePlan) {
    addField('Marriage Plan', formData.marriagePlan);
  }

  if (formData.hasGraduation) {
    addSection('Graduation Qualification');
    addField('Degree', formData.graduationDegree || 'N/A');
    addField('University', formData.graduationUniversity || 'N/A', true);
    addField('Subject', formData.graduationSubject || 'N/A');
    addField('Year of Passing', formData.graduationYear || 'N/A');
    addField('Percentage', formData.graduationPercentage || 'N/A');
  }

  if (formData.hasPostGraduation) {
    addSection('Academic Post-Graduation Qualification');
    addField('Degree', formData.postGraduationDegree || 'N/A');
    addField('University', formData.postGraduationUniversity || 'N/A', true);
    addField('Subject', formData.postGraduationSubject || 'N/A');
    addField('Year of Passing', formData.postGraduationYear || 'N/A');
    addField('Percentage', formData.postGraduationPercentage || 'N/A');
  }

  if (formData.hasProfessionalPostGraduation) {
    addSection('Professional Post-Graduation Qualification');
    addField('Degree', formData.professionalPostGraduationDegree || 'N/A');
    addField(
      'University',
      formData.professionalPostGraduationUniversity || 'N/A',
      true
    );
    addField('Subject', formData.professionalPostGraduationSubject || 'N/A');
    addField(
      'Year of Passing',
      formData.professionalPostGraduationYear || 'N/A'
    );
    addField(
      'Percentage',
      formData.professionalPostGraduationPercentage || 'N/A'
    );
  }

  addSection('Other Skills/Knowledge');

  if (formData.otherCourses) {
    addField('Other Courses', formData.otherCourses, true);
  }
  if (formData.computerKnowledge) {
    addField('Computer Knowledge', formData.computerKnowledge, true);
  }
  if (formData.otherSkills) {
    addField('Other Skills', formData.otherSkills, true);
  }

  addSection('Educational Information');

  addField('Schooling Medium', formData.schoolingMedium);

  if (formData.subjectProficiency) {
    addField('Subject Proficiency', formData.subjectProficiency, true);
  }
  if (formData.teachingStandard) {
    addField('Teaching Standard', formData.teachingStandard);
  }
  if (formData.otherSubjects) {
    addField('Other Subjects', formData.otherSubjects, true);
  }

  addSection('Employment Information');

  addField('Current Job Status', formData.currentJobStatus);

  if (formData.currentJobStatus === 'Working') {
    addField('Current Organization', formData.currentOrganization, true);
    addField('Current Job Profile', formData.currentJobProfile, true);
    if (formData.currentSalary) {
      addField('Current Salary', `₹${formData.currentSalary}`);
    }
    addField('P.F Deducted', formData.pfDeducted);
  }

  if (formData.expectedSalary) {
    addField(
      'Expected Salary Per Month',
      `${parseInt(formData.expectedSalary)}`
    );
  }

  if (formData.joiningTime === 'Other' && formData.customJoiningDate) {
    addField('Can Join From', formData.customJoiningDate);
  } else {
    addField('Can Join From', formData.joiningTime);
  }

  if (
    formData.preferableTimings === 'Other' &&
    formData.customTimingFrom &&
    formData.customTimingTo
  ) {
    const customTiming = `${formData.customTimingFrom} ${formData.customTimingFromPeriod} to ${formData.customTimingTo} ${formData.customTimingToPeriod}`;
    addField('Preferable Timings', customTiming, true);
  } else {
    addField('Preferable Timings', formData.preferableTimings);
  }

  if (
    formData.referenceName ||
    formData.referenceProfession ||
    formData.referenceContact
  ) {
    addSection('References');

    if (formData.referenceName) {
      addField('Reference Name', formData.referenceName, true);
    }
    if (formData.referenceProfession) {
      addField('Professional Status', formData.referenceProfession, true);
    }
    if (formData.referenceContact) {
      addField('Contact', formData.referenceContact);
    }
  }

  addSection('Declaration');

  yPos += 10;
  if (yPos > pageHeight - 30) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const submissionDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  // Set font and size
doc.setFontSize(10);

// Declaration line (bold)
doc.setFont("helvetica", "bold");
doc.text(
  "I hereby declare that all the information given above is true to the best of my knowledge and belief.",
  margin,
  yPos
);

// Move down for next line (add spacing)
yPos += 15;

// Candidate signature (bold)
doc.text("Candidate Signature : __________________", margin, yPos);

// Move down again for submission date
yPos += 10;

// Submitted date (normal)
doc.setFont("helvetica", "normal");
doc.text(`Submitted on: ${submissionDate}`, margin, yPos);


  doc.setFontSize(8);
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      pageHeight - 10
    );
  }

  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
  }

  const fileName = `Employee_Form_${formData.fullName.replace(
    /\s+/g,
    '_'
  )}_${Date.now()}.pdf`;
  doc.save(fileName);

  saveFormDataToLocalStorage(formData, fileName);
}

function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Canvas context not available'));
      }
    };
    img.onerror = reject;
    img.src = url;
  });
}

function saveFormDataToLocalStorage(
  formData: FormData,
  fileName: string
): void {
  const submissions = JSON.parse(
    localStorage.getItem('employeeSubmissions') || '[]'
  );

  const submission = {
    id: Date.now(),
    fileName,
    submittedAt: new Date().toISOString(),
    data: {
      postAppliedFor: formData.postAppliedFor,
      organization: formData.organization,
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      contactNo: formData.contactNo,
      motherTongue: formData.motherTongue,
      socialMediaId: formData.socialMediaId,
      familyStatus: formData.familyStatus,
      marriagePlan: formData.marriagePlan,
      sex: formData.sex,
      hasGraduation: formData.hasGraduation,
      graduationDegree: formData.graduationDegree,
      graduationUniversity: formData.graduationUniversity,
      graduationSubject: formData.graduationSubject,
      graduationYear: formData.graduationYear,
      graduationPercentage: formData.graduationPercentage,
      hasPostGraduation: formData.hasPostGraduation,
      postGraduationDegree: formData.postGraduationDegree,
      postGraduationUniversity: formData.postGraduationUniversity,
      postGraduationSubject: formData.postGraduationSubject,
      postGraduationYear: formData.postGraduationYear,
      postGraduationPercentage: formData.postGraduationPercentage,
      hasProfessionalPostGraduation: formData.hasProfessionalPostGraduation,
      professionalPostGraduationDegree:
        formData.professionalPostGraduationDegree,
      professionalPostGraduationUniversity:
        formData.professionalPostGraduationUniversity,
      professionalPostGraduationSubject:
        formData.professionalPostGraduationSubject,
      professionalPostGraduationYear: formData.professionalPostGraduationYear,
      professionalPostGraduationPercentage:
        formData.professionalPostGraduationPercentage,
      otherCourses: formData.otherCourses,
      computerKnowledge: formData.computerKnowledge,
      otherSkills: formData.otherSkills,
      schoolingMedium: formData.schoolingMedium,
      subjectProficiency: formData.subjectProficiency,
      teachingStandard: formData.teachingStandard,
      otherSubjects: formData.otherSubjects,
      currentJobStatus: formData.currentJobStatus,
      currentOrganization: formData.currentOrganization,
      currentJobProfile: formData.currentJobProfile,
      currentSalary: formData.currentSalary,
      pfDeducted: formData.pfDeducted,
      expectedSalary: formData.expectedSalary,
      joiningTime: formData.joiningTime,
      customJoiningDate: formData.customJoiningDate,
      preferableTimings: formData.preferableTimings,
      customTimingFrom: formData.customTimingFrom,
      customTimingFromPeriod: formData.customTimingFromPeriod,
      customTimingTo: formData.customTimingTo,
      customTimingToPeriod: formData.customTimingToPeriod,
      referenceName: formData.referenceName,
      referenceProfession: formData.referenceProfession,
      referenceContact: formData.referenceContact,
    },
  };

  submissions.push(submission);
  localStorage.setItem('employeeSubmissions', JSON.stringify(submissions));
}
