import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const IntakeForm = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [formData, setFormData] = useState({
    organizationName: '',
    legalBusinessName: '',
    operatingName: '',
    businessNumber: '',
    businessStructure: '',
    address: '',
    contactInformation: '',
    dateOfEstablishment: '',
    phoneNumber: '',
    emailAddress: '',
    numberOfEmployees: '',
    missionStatement: '',
    companyDescription: '',
    targetBeneficiaries: '',
    organizationType: '',
    yearEstablished: '',
    annualBudget: '',
    focusAreas: '',
    previousGrants: '',
    websiteUrl: '',
    taxId: '',
    createdAt: '',
    updatedAt: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!session?.access_token) {
      setError('You must be logged in to submit this form');
      setLoading(false);
      return;
    }

    try {
      // Prepare data for API
      const apiData = {
        organization_name: formData.organizationName,
        legal_business_name: formData.legalBusinessName,
        operating_name: formData.operatingName,
        business_number: formData.businessNumber,
        business_structure: formData.businessStructure,
        address: formData.address,
        contact_information: formData.contactInformation,
        date_of_establishment: formData.dateOfEstablishment,
        phone_number: formData.phoneNumber,
        email_address: formData.emailAddress,
        number_of_employees: formData.numberOfEmployees,
        mission_statement: formData.missionStatement,
        company_description: formData.companyDescription,
        target_beneficiaries: formData.targetBeneficiaries,
        organization_type: formData.organizationType,
        year_established: parseInt(formData.yearEstablished),
        annual_budget: formData.annualBudget,
      };

      // Call backend API to save organization
      const response = await fetch(`${API_BASE_URL}/api/organizations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.error || 'Failed to save organization');
      }

      const result = await response.json();
      console.log('Organization saved:', result);

      // Redirect to dashboard after successful submission
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving organization:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-civic rounded-3xl flex items-center justify-center shadow-xl">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-surface-900 civic-heading mb-4">
              Organization Profile
            </h1>
            <p className="text-xl text-surface-600 civic-text max-w-2xl mx-auto">
              Tell us about your organization so we can find the perfect grant opportunities for you
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-primary-100/50 p-8 sm:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              
              {/* Section: Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-100 rounded-xl">
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-surface-900">Basic Information</h2>
                </div>

                {/* Organization Name */}
                <div>
                  <label htmlFor="organizationName" className="block text-sm font-bold text-surface-700 mb-2">
                    Organization Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="organizationName"
                      id="organizationName"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
                      placeholder="Enter your organization name"
                      value={formData.organizationName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Legal Business Name */}
                  <div>
                    <label htmlFor="legalBusinessName" className="block text-sm font-bold text-surface-700 mb-2">
                      Legal Business Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="legalBusinessName"
                        id="legalBusinessName"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
                        placeholder="Enter legal business name"
                        value={formData.legalBusinessName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Operating Name */}
                  <div>
                    <label htmlFor="operatingName" className="block text-sm font-bold text-surface-700 mb-2">
                      Operating Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="operatingName"
                        id="operatingName"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
                        placeholder="Enter operating name"
                        value={formData.operatingName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business Number */}
                  <div>
                    <label htmlFor="businessNumber" className="block text-sm font-bold text-surface-700 mb-2">
                      Business Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="businessNumber"
                        id="businessNumber"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
                        placeholder="Enter business number"
                        value={formData.businessNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Business Structure */}
                  <div>
                    <label htmlFor="businessStructure" className="block text-sm font-bold text-surface-700 mb-2">
                      Business Structure *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <select
                        name="businessStructure"
                        id="businessStructure"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 appearance-none"
                        value={formData.businessStructure}
                        onChange={handleChange}
                      >
                        <option value="">Select structure</option>
                        <option value="sole proprietorship">Sole Proprietorship</option>
                        <option value="partnership">Partnership</option>
                        <option value="llc">LLC</option>
                        <option value="corporation">Corporation</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-bold text-surface-700 mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
                      placeholder="Enter full address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-bold text-surface-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
                        placeholder="(XXX) XXX-XXXX"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="emailAddress" className="block text-sm font-bold text-surface-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="emailAddress"
                        id="emailAddress"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
                        placeholder="contact@organization.org"
                        value={formData.emailAddress}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <label htmlFor="contactInformation" className="block text-sm font-bold text-surface-700 mb-2">
                    Additional Contact Information *
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                      <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <textarea
                      name="contactInformation"
                      id="contactInformation"
                      required
                      rows={2}
                      className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
                      placeholder="Additional contact details (e.g., alternate phone, fax, contact person)"
                      value={formData.contactInformation}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Organization Type */}
                <div>
                  <label htmlFor="organizationType" className="block text-sm font-bold text-surface-700 mb-2">
                    Organization Type *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <select
                      name="organizationType"
                      id="organizationType"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 appearance-none"
                      value={formData.organizationType}
                      onChange={handleChange}
                    >
                      <option value="">Select type</option>
                      <option value="nonprofit">Nonprofit</option>
                      <option value="charity">Charity</option>
                      <option value="foundation">Foundation</option>
                      <option value="educational">Educational Institution</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Mission Statement */}
                <div>
                  <label htmlFor="missionStatement" className="block text-sm font-bold text-surface-700 mb-2">
                    Mission Statement *
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                      <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <textarea
                      name="missionStatement"
                      id="missionStatement"
                      required
                      rows={4}
                      className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
                      placeholder="Describe your organization's mission and values"
                      value={formData.missionStatement}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Company Description */}
                <div>
                  <label htmlFor="companyDescription" className="block text-sm font-bold text-surface-700 mb-2">
                    Organization Description *
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                      <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </div>
                    <textarea
                      name="companyDescription"
                      id="companyDescription"
                      required
                      rows={4}
                      className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
                      placeholder="Provide a detailed description of your organization's activities and programs"
                      value={formData.companyDescription}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Target Beneficiaries */}
                <div>
                  <label htmlFor="targetBeneficiaries" className="block text-sm font-bold text-surface-700 mb-2">
                    Target Beneficiaries *
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                      <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <textarea
                      name="targetBeneficiaries"
                      id="targetBeneficiaries"
                      required
                      rows={3}
                      className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
                      placeholder="Describe the communities or individuals your organization serves"
                      value={formData.targetBeneficiaries}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-surface-200"></div>

              {/* Section: Organization Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-secondary-100 rounded-xl">
                    <svg className="w-5 h-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-surface-900">Organization Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date of Establishment */}
                  <div>
                    <label htmlFor="dateOfEstablishment" className="block text-sm font-bold text-surface-700 mb-2">
                      Date of Establishment *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        name="dateOfEstablishment"
                        id="dateOfEstablishment"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
                        value={formData.dateOfEstablishment}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Year Established */}
                  <div>
                    <label htmlFor="yearEstablished" className="block text-sm font-bold text-surface-700 mb-2">
                      Year Established *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="number"
                        name="yearEstablished"
                        id="yearEstablished"
                        required
                        min="1800"
                        max={new Date().getFullYear()}
                        className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
                        placeholder="YYYY"
                        value={formData.yearEstablished}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Number of Employees */}
                <div>
                  <label htmlFor="numberOfEmployees" className="block text-sm font-bold text-surface-700 mb-2">
                    Number of Employees *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <select
                      name="numberOfEmployees"
                      id="numberOfEmployees"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 appearance-none"
                      value={formData.numberOfEmployees}
                      onChange={handleChange}
                    >
                      <option value="">Select range</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="500+">500+</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Annual Budget */}
                <div>
                  <label htmlFor="annualBudget" className="block text-sm font-bold text-surface-700 mb-2">
                    Annual Budget *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <select
                      name="annualBudget"
                      id="annualBudget"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 appearance-none"
                      value={formData.annualBudget}
                      onChange={handleChange}
                    >
                      <option value="">Select range</option>
                      <option value="under-100k">Under $100,000</option>
                      <option value="100k-500k">$100,000 - $500,000</option>
                      <option value="500k-1m">$500,000 - $1,000,000</option>
                      <option value="1m-5m">$1,000,000 - $5,000,000</option>
                      <option value="5m+">$5,000,000+</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>


              

              {/* Divider */}
              <div className="border-t border-surface-200"></div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <p className="text-sm text-surface-600">
                  All information will be kept confidential and used only for grant matching purposes.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto group bg-gradient-civic text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit & Continue</span>
                        <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

