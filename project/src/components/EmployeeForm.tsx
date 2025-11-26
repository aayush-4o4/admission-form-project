import React, { useState } from 'react';
import { Upload, Send } from 'lucide-react';
import { generatePDF } from '../utils/pdfGenerator';

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

export default function EmployeeForm() {
  const [formData, setFormData] = useState<FormData>({
    photo: null,
    postAppliedFor: '',
    organization: '',
    fullName: '',
    dateOfBirth: '',
    contactNo: '',
    motherTongue: '',
    socialMediaId: '',
    familyStatus: '',
    marriagePlan: '',
    sex: '',
    hasGraduation: false,
    graduationDegree: '',
    graduationUniversity: '',
    graduationSubject: '',
    graduationYear: '',
    graduationPercentage: '',
    hasPostGraduation: false,
    postGraduationDegree: '',
    postGraduationUniversity: '',
    postGraduationSubject: '',
    postGraduationYear: '',
    postGraduationPercentage: '',
    hasProfessionalPostGraduation: false,
    professionalPostGraduationDegree: '',
    professionalPostGraduationUniversity: '',
    professionalPostGraduationSubject: '',
    professionalPostGraduationYear: '',
    professionalPostGraduationPercentage: '',
    otherCourses: '',
    computerKnowledge: '',
    otherSkills:'',
    schoolingMedium: '',
    subjectProficiency: '',
    teachingStandard: '',
    otherSubjects: '',
    currentJobStatus: '',
    currentOrganization: '',
    currentJobProfile: '',
    currentSalary: '',
    pfDeducted: '',
    expectedSalary: '',
    joiningTime: '',
    customJoiningDate: '',
    preferableTimings: '',
    customTimingFrom: '',
    customTimingFromPeriod: 'AM',
    customTimingTo: '',
    customTimingToPeriod: 'PM',
    referenceName: '',
    referenceProfession: '',
    referenceContact: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          photo: 'File size must be less than 10MB',
        }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          photo: 'Please upload an image file',
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, photo: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.photo) newErrors.photo = 'Passport photo is required';
    if (!formData.postAppliedFor)
      newErrors.postAppliedFor = 'This field is required';
    if (!formData.organization)
      newErrors.organization = 'This field is required';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.contactNo) newErrors.contactNo = 'Contact number is required';
    if (!formData.motherTongue)
      newErrors.motherTongue = 'Mother tongue is required';
    if (!formData.familyStatus)
      newErrors.familyStatus = 'Family status is required';
    if (!formData.sex) newErrors.sex = 'Sex is required';
    if (!formData.schoolingMedium)
      newErrors.schoolingMedium = 'Schooling medium is required';
    if (!formData.currentJobStatus)
      newErrors.currentJobStatus = 'Current job status is required';
    if (!formData.joiningTime)
      newErrors.joiningTime = 'Joining time is required';
    if (!formData.preferableTimings)
      newErrors.preferableTimings = 'Preferable timings are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await generatePDF(formData, photoPreview);
      alert(
        'Form submitted successfully! PDF has been generated and downloaded.'
      );

      setFormData({
        photo: null,
        postAppliedFor: '',
        organization: '',
        fullName: '',
        dateOfBirth: '',
        contactNo: '',
        motherTongue: '',
        socialMediaId: '',
        familyStatus: '',
        marriagePlan: '',
        sex: '',
        hasGraduation: false,
        graduationDegree: '',
        graduationUniversity: '',
        graduationSubject: '',
        graduationYear: '',
        graduationPercentage: '',
        hasPostGraduation: false,
        postGraduationDegree: '',
        postGraduationUniversity: '',
        postGraduationSubject: '',
        postGraduationYear: '',
        postGraduationPercentage: '',
        hasProfessionalPostGraduation: false,
        professionalPostGraduationDegree: '',
        professionalPostGraduationUniversity: '',
        professionalPostGraduationSubject: '',
        professionalPostGraduationYear: '',
        professionalPostGraduationPercentage: '',
        otherCourses: '',
        computerKnowledge: '',
        schoolingMedium: '',
        subjectProficiency: '',
        teachingStandard: '',
        otherSubjects: '',
        currentJobStatus: '',
        currentOrganization: '',
        currentJobProfile: '',
        currentSalary: '',
        pfDeducted: '',
        expectedSalary: '',
        joiningTime: '',
        customJoiningDate: '',
        preferableTimings: '',
        customTimingFrom: '',
        customTimingFromPeriod: 'AM',
        customTimingTo: '',
        customTimingToPeriod: 'PM',
        referenceName: '',
        referenceProfession: '',
        referenceContact: '',
      });
      setPhotoPreview('');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/White and Brown Grand Opening Coffee Shop Presentation.png"
                alt="RACE Logo"
                className="h-20 w-auto"
              />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Employee Information Form
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Rapid Academy of Career Exam
                </p>
              </div>
            </div>
            <img
              src="/files_7554345-1759721404517-da97663d-fd2f-4f72-8df4-701f03f4a6d8.png"
              alt="Mascots"
              className="h-20 w-auto hidden md:block"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <h2 className="text-lg font-semibold text-blue-900">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Passport Size Photo <span className="text-red-500">*</span>
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Click to upload photo (Max 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                    {errors.photo && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.photo}
                      </p>
                    )}
                  </div>
                  {photoPreview && (
                    <div className="w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Application for the post of{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="postAppliedFor"
                  value={formData.postAppliedFor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.postAppliedFor && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.postAppliedFor}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.organization && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.organization}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact No <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.contactNo && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactNo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mother Tongue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="motherTongue"
                  value={formData.motherTongue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.motherTongue && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.motherTongue}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Facebook/Social Media ID
                </label>
                <input
                  type="text"
                  name="socialMediaId"
                  value={formData.socialMediaId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sex <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sex"
                      value="Male"
                      checked={formData.sex === 'Male'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sex"
                      value="Female"
                      checked={formData.sex === 'Female'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Female</span>
                  </label>
                </div>
                {errors.sex && (
                  <p className="mt-1 text-sm text-red-600">{errors.sex}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Family Status <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="familyStatus"
                      value="Married"
                      checked={formData.familyStatus === 'Married'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Married</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="familyStatus"
                      value="Unmarried"
                      checked={formData.familyStatus === 'Unmarried'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Unmarried</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="familyStatus"
                      value="Divorced/Separated"
                      checked={formData.familyStatus === 'Divorced/Separated'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Divorced/Separated</span>
                  </label>
                </div>
                {errors.familyStatus && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.familyStatus}
                  </p>
                )}
              </div>

              {formData.familyStatus === 'Unmarried' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Planned to get married in (Months/Years)
                  </label>
                  <input
                    type="text"
                    name="marriagePlan"
                    value={formData.marriagePlan}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 years, 6 months"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    name="hasGraduation"
                    checked={formData.hasGraduation}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Graduation Qualification
                  </span>
                </label>

                {formData.hasGraduation && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        name="graduationDegree"
                        value={formData.graduationDegree}
                        onChange={handleInputChange}
                        placeholder="e.g., B.Tech, B.Sc"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        University
                      </label>
                      <input
                        type="text"
                        name="graduationUniversity"
                        value={formData.graduationUniversity}
                        onChange={handleInputChange}
                        placeholder="University name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="graduationSubject"
                        value={formData.graduationSubject}
                        onChange={handleInputChange}
                        placeholder="Graduation Subject"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year of Passing
                      </label>
                      <input
                        type="text"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleInputChange}
                        placeholder="e.g., 2020"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Percentage
                      </label>
                      <input
                        type="text"
                        name="graduationPercentage"
                        value={formData.graduationPercentage}
                        onChange={handleInputChange}
                        placeholder="e.g., 75%"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    name="hasPostGraduation"
                    checked={formData.hasPostGraduation}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Academic Post-Graduation Qualification
                  </span>
                </label>

                {formData.hasPostGraduation && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        name="postGraduationDegree"
                        value={formData.postGraduationDegree}
                        onChange={handleInputChange}
                        placeholder="e.g., M.Tech, M.Sc"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        University
                      </label>
                      <input
                        type="text"
                        name="postGraduationUniversity"
                        value={formData.postGraduationUniversity}
                        onChange={handleInputChange}
                        placeholder="University name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="postGraduationSubject"
                        value={formData.postGraduationSubject}
                        onChange={handleInputChange}
                        placeholder="Academic Post-Graduation Subject"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year of Passing
                      </label>
                      <input
                        type="text"
                        name="postGraduationYear"
                        value={formData.postGraduationYear}
                        onChange={handleInputChange}
                        placeholder="e.g., 2022"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Percentage
                      </label>
                      <input
                        type="text"
                        name="postGraduationPercentage"
                        value={formData.postGraduationPercentage}
                        onChange={handleInputChange}
                        placeholder="e.g., 80%"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    name="hasProfessionalPostGraduation"
                    checked={formData.hasProfessionalPostGraduation}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Professional Graduation Qualification
                  </span>
                </label>

                {formData.hasProfessionalPostGraduation && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        name="professionalPostGraduationDegree"
                        value={formData.professionalPostGraduationDegree}
                        onChange={handleInputChange}
                        placeholder="e.g., B.Ed,D.EL.Ed,P.T.C"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        University
                      </label>
                      <input
                        type="text"
                        name="professionalPostGraduationUniversity"
                        value={formData.professionalPostGraduationUniversity}
                        onChange={handleInputChange}
                        placeholder="University name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="professionalPostGraduationSubject"
                        value={formData.professionalPostGraduationSubject}
                        onChange={handleInputChange}
                        placeholder="Professional Graduation Subject"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year of Passing
                      </label>
                      <input
                        type="text"
                        name="professionalPostGraduationYear"
                        value={formData.professionalPostGraduationYear}
                        onChange={handleInputChange}
                        placeholder="e.g., 2023"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Percentage
                      </label>
                      <input
                        type="text"
                        name="professionalPostGraduationPercentage"
                        value={formData.professionalPostGraduationPercentage}
                        onChange={handleInputChange}
                        placeholder="e.g., 85%"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
 {/* _____________________________________________________________________________________________              */}
<div className ="md:col-span-2 flex flex-col space-y-6">
              <div>
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Other Courses (if done)
                </label>
                <input
                  type="text"
                  name="otherCourses"
                  value={formData.otherCourses}
                  onChange={handleInputChange}
                  placeholder="e.g., Certifications, Diplomas"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              </div>


              {/* computer kng section */}
              <div>
              <div className="w-full">
              
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Computer Knowledge
  </label>

  <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {[
        "MS Office (Word, Excel, PPT)",
        "Google Workspace (Drive, Sheets, Docs, Forms, Meet)",
        "Email drafting & communication",
        "PDF handling (edit, merge, compress)",
        "Data entry & report prep",
        "Typing & formatting (English/Gujarati)",
        "File management & cloud storage",
        "Attendance & timetable software",
        "Zoom / Google Meet / online tools",
        "Social media & digital tools",
        "Basic system/internet troubleshooting",
        "Printing, scanning & document sharing",
      ].map((option) => (
        <label
          key={option}
          className="flex items-center space-x-2 border border-gray-100 rounded-md p-2 hover:bg-gray-50 cursor-pointer"
        >
          <input
            type="checkbox"
            value={option}
            checked={formData.computerKnowledge.includes(option)}
            onChange={() => {
              const selected = formData.computerKnowledge.includes(option)
                ? formData.computerKnowledge.filter((item) => item !== option)
                : [...formData.computerKnowledge, option];
              handleInputChange({
                target: { name: "computerKnowledge", value: selected },
              });
            }}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  

  <p className="text-xs text-gray-500 mt-2">
    Tick all that apply to your computer knowledge.
  </p>
  </div>
</div>
</div>

              {/* cmp kng sec ends */}

              {/* skill src starts here */}
              <div>
              <div className="w-full">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Your Skills Other Than Academics
  </label>

  <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {[
        'Drawing',
        'Art / Craft',
        'Dance',
        'Music',
        'Sports',
        'Photography',
        'Writing / Poetry',
        'Public Speaking',
      ].map((skill) => (
        <label
          key={skill}
          className="flex items-center space-x-2 border border-gray-100 rounded-md p-2 hover:bg-gray-50 cursor-pointer"
        >
          <input
            type="checkbox"
            value={skill}
            checked={formData.otherSkills?.includes(skill)}
            onChange={() => {
              const selected = formData.otherSkills?.includes(skill)
                ? formData.otherSkills.filter((item) => item !== skill)
                : [...(formData.otherSkills || []), skill];
              handleInputChange({
                target: { name: 'otherSkills', value: selected },
              });
            }}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{skill}</span>
        </label>
      ))}
    </div>
  </div>

  <p className="text-xs text-gray-500 mt-2">
    Tick all the skills that match your interests or hobbies.
  </p>
</div>
</div>
</div>
              {/* skill sec ends here */}
{/* ------------------------------------------------------------------------------------------ */}

             
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <h2 className="text-lg font-semibold text-blue-900">
                Educational Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  10th & 12th Schooling (Medium){' '}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="schoolingMedium"
                  value={formData.schoolingMedium}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Medium</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Other">Other</option>
                </select>
                {errors.schoolingMedium && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.schoolingMedium}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject Proficiency (For Teachers)
                </label>
                <input
                  type="text"
                  name="subjectProficiency"
                  value={formData.subjectProficiency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upto Which Std - You can take lectures (For Teachers)
                </label>
                <input
                  type="text"
                  name="teachingStandard"
                  value={formData.teachingStandard}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Other Subjects you can teach (For Teachers)
                </label>
                <input
                  type="text"
                  name="otherSubjects"
                  value={formData.otherSubjects}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <h2 className="text-lg font-semibold text-blue-900">
                Employment Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Job Description{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="currentJobStatus"
                      value="Working"
                      checked={formData.currentJobStatus === 'Working'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Working</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="currentJobStatus"
                      value="Fresher"
                      checked={formData.currentJobStatus === 'Fresher'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Fresher</span>
                  </label>
                </div>
                {errors.currentJobStatus && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.currentJobStatus}
                  </p>
                )}
              </div>

              {formData.currentJobStatus === 'Working' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name of Current Organization
                    </label>
                    <input
                      type="text"
                      name="currentOrganization"
                      value={formData.currentOrganization}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Job Profile
                    </label>
                    <input
                      type="text"
                      name="currentJobProfile"
                      value={formData.currentJobProfile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Job Salary
                    </label>
                    <input
                      type="number"
                      name="currentSalary"
                      value={formData.currentSalary}
                      onChange={handleInputChange}
                      placeholder="Current Job Salary"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{
                        appearance: 'textfield',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      P.F Deducted
                    </label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="pfDeducted"
                          value="Yes"
                          checked={formData.pfDeducted === 'Yes'}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="pfDeducted"
                          value="No"
                          checked={formData.pfDeducted === 'No'}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Salary Per Month
                </label>
                <input
                  type="number"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  placeholder="Expected Salary Per Month"
                  //step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{
                    appearance: 'textfield',
                  }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  If Selected, Can Join From{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="joiningTime"
                      value="Immediately"
                      checked={formData.joiningTime === 'Immediately'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Immediately</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="joiningTime"
                      value="1 Month"
                      checked={formData.joiningTime === '1 Month'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">1 Month</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="joiningTime"
                      value="2 Months"
                      checked={formData.joiningTime === '2 Months'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">2 Months</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="joiningTime"
                      value="Next Term"
                      checked={formData.joiningTime === 'Next Term'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Next Term</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="joiningTime"
                      value="Other"
                      checked={formData.joiningTime === 'Other'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Other</span>
                  </label>
                </div>
                {errors.joiningTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.joiningTime}
                  </p>
                )}
              </div>

              {formData.joiningTime === 'Other' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Custom Joining Date
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700">Date:</span>
                    <input
                      type="date"
                      name="customJoiningDate"
                      value={formData.customJoiningDate}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferable Job Timings <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferableTimings"
                      value="Morning"
                      checked={formData.preferableTimings === 'Morning'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Morning</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferableTimings"
                      value="Afternoon"
                      checked={formData.preferableTimings === 'Afternoon'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Afternoon</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferableTimings"
                      value="Full Day"
                      checked={formData.preferableTimings === 'Full Day'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Full Day</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferableTimings"
                      value="Other"
                      checked={formData.preferableTimings === 'Other'}
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Other</span>
                  </label>
                </div>
                {errors.preferableTimings && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.preferableTimings}
                  </p>
                )}
              </div>

              {formData.preferableTimings === 'Other' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Custom Timings
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-gray-700">From</span>
                    <input
                      type="time"
                      name="customTimingFrom"
                      value={formData.customTimingFrom}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      name="customTimingFromPeriod"
                      value={formData.customTimingFromPeriod}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    <span className="text-gray-700">To</span>
                    <input
                      type="time"
                      name="customTimingTo"
                      value={formData.customTimingTo}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      name="customTimingToPeriod"
                      value={formData.customTimingToPeriod}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <h2 className="text-lg font-semibold text-blue-900">
                References
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reference Name
                </label>
                <input
                  type="text"
                  name="referenceName"
                  value={formData.referenceName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Professional Status of References
                </label>
                <input
                  type="text"
                  name="referenceProfession"
                  value={formData.referenceProfession}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact of References
                </label>
                <input
                  type="text"
                  name="referenceContact"
                  value={formData.referenceContact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Send className="h-5 w-5" />
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>
            All fields marked with <span className="text-red-500">*</span> are
            required
          </p>
        </div>
      </div>
    </div>
  );
}
