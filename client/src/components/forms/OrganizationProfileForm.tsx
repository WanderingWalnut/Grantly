import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrganization } from '../../context/OrganizationContext';

export const OrganizationProfileForm = () => {
  const { organization, updateOrganization, loading: orgLoading } = useOrganization();
  const [formData, setFormData] = useState({
    legalBusinessName: '',
    operatingName: '',
    businessNumber: '',
    businessStructure: '',
    address: '',
    contactInformation: '',
    dateOfEstablishment: '',
    phoneNumber: '',
    emailAddress: '',
    numberOfEmployees: '0',
    businessSector: '',
    missionStatement: '',
    companyDescription: '',
    targetBeneficiaries: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  // Populate form when organization data is loaded
  useEffect(() => {
    if (organization) {
      setFormData({
        legalBusinessName: organization.legal_business_name || '',
        operatingName: organization.operating_name || '',
        businessNumber: organization.business_number || '',
        businessStructure: organization.business_structure || '',
        address: organization.address || '',
        contactInformation: organization.contact_information || '',
        dateOfEstablishment: organization.date_of_establishment || '',
        phoneNumber: organization.phone_number || '',
        emailAddress: organization.email_address || '',
        numberOfEmployees: organization.number_of_employees?.toString() || '0',
        businessSector: organization.business_sector || '',
        missionStatement: organization.mission_statement || '',
        companyDescription: organization.company_description || '',
        targetBeneficiaries: organization.target_beneficiaries || '',
      });
    }
  }, [organization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Prepare data for API
      const apiData = {
        legal_business_name: formData.legalBusinessName,
        operating_name: formData.operatingName,
        business_number: formData.businessNumber,
        business_structure: formData.businessStructure,
        address: formData.address,
        contact_information: formData.contactInformation,
        date_of_establishment: formData.dateOfEstablishment,
        phone_number: formData.phoneNumber,
        email_address: formData.emailAddress,
        number_of_employees: parseInt(formData.numberOfEmployees) || 0,
        business_sector: formData.businessSector,
        mission_statement: formData.missionStatement,
        company_description: formData.companyDescription,
        target_beneficiaries: formData.targetBeneficiaries,
      };

      const result = await updateOrganization(apiData);
      
      if (result) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Failed to update organization');
      }
    } catch (err) {
      console.error('Error updating organization:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
    if (success) setSuccess(false);
  };

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-surface-600 font-medium">Loading organization data...</span>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="space-y-6">
        {/* Warning Card */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-3xl p-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-md">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-surface-900 mb-2">No Organization Profile Found</h4>
              <p className="text-surface-700 mb-4">
                You haven't completed your organization profile yet. To unlock all features and start finding grants, 
                please complete the intake form with your organization's information.
              </p>
              <Link
                to="/intake-form"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-civic text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Complete Intake Form</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-primary-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h5 className="font-bold text-surface-900 mb-1">Find Perfect Grants</h5>
            <p className="text-sm text-surface-600">Get matched with grants tailored to your organization</p>
          </div>

          <div className="bg-white border border-secondary-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h5 className="font-bold text-surface-900 mb-1">Track Applications</h5>
            <p className="text-sm text-surface-600">Monitor your grant applications in one place</p>
          </div>

          <div className="bg-white border border-accent-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h5 className="font-bold text-surface-900 mb-1">Save Time</h5>
            <p className="text-sm text-surface-600">Automated matching and deadline reminders</p>
          </div>
        </div>
      </div>
    );
  }

  return (
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

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Organization profile updated successfully!
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Legal Business Name */}
          <div>
            <label htmlFor="legalBusinessName" className="block text-sm font-bold text-surface-700 mb-2">
              Legal Business Name *
            </label>
            <input
              type="text"
              name="legalBusinessName"
              id="legalBusinessName"
              required
              className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
              placeholder="Enter legal business name"
              value={formData.legalBusinessName}
              onChange={handleChange}
            />
          </div>

          {/* Operating Name */}
          <div>
            <label htmlFor="operatingName" className="block text-sm font-bold text-surface-700 mb-2">
              Operating Name *
            </label>
            <input
              type="text"
              name="operatingName"
              id="operatingName"
              required
              className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
              placeholder="Enter operating name"
              value={formData.operatingName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Number */}
          <div>
            <label htmlFor="businessNumber" className="block text-sm font-bold text-surface-700 mb-2">
              Business Number *
            </label>
            <input
              type="text"
              name="businessNumber"
              id="businessNumber"
              required
              className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
              placeholder="Enter business number"
              value={formData.businessNumber}
              onChange={handleChange}
            />
          </div>

          {/* Business Structure */}
          <div>
            <label htmlFor="businessStructure" className="block text-sm font-bold text-surface-700 mb-2">
              Business Structure *
            </label>
            <select
              name="businessStructure"
              id="businessStructure"
              required
              className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 appearance-none"
              value={formData.businessStructure}
              onChange={handleChange}
            >
              <option value="">Select structure</option>
              <option value="sole proprietorship">Sole Proprietorship</option>
              <option value="partnership">Partnership</option>
              <option value="llc">LLC</option>
              <option value="corporation">Corporation</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-bold text-surface-700 mb-2">
            Address *
          </label>
          <input
            type="text"
            name="address"
            id="address"
            required
            className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
            placeholder="Enter full address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-bold text-surface-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              required
              className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
              placeholder="(XXX) XXX-XXXX"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="emailAddress" className="block text-sm font-bold text-surface-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="emailAddress"
              id="emailAddress"
              required
              className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
              placeholder="contact@organization.org"
              value={formData.emailAddress}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <label htmlFor="contactInformation" className="block text-sm font-bold text-surface-700 mb-2">
            Additional Contact Information *
          </label>
          <textarea
            name="contactInformation"
            id="contactInformation"
            required
            rows={2}
            className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 resize-none"
            placeholder="Additional contact details (e.g., alternate phone, fax, contact person)"
            value={formData.contactInformation}
            onChange={handleChange}
          />
        </div>

        {/* Mission Statement */}
        <div>
          <label htmlFor="missionStatement" className="block text-sm font-bold text-surface-700 mb-2">
            Mission Statement *
          </label>
          <textarea
            name="missionStatement"
            id="missionStatement"
            required
            rows={4}
            className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 resize-none"
            placeholder="Describe your organization's mission and values"
            value={formData.missionStatement}
            onChange={handleChange}
          />
        </div>

        {/* Company Description */}
        <div>
          <label htmlFor="companyDescription" className="block text-sm font-bold text-surface-700 mb-2">
            Organization Description *
          </label>
          <textarea
            name="companyDescription"
            id="companyDescription"
            required
            rows={4}
            className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 resize-none"
            placeholder="Provide a detailed description of your organization's activities and programs"
            value={formData.companyDescription}
            onChange={handleChange}
          />
        </div>

        {/* Target Beneficiaries */}
        <div>
          <label htmlFor="targetBeneficiaries" className="block text-sm font-bold text-surface-700 mb-2">
            Target Beneficiaries *
          </label>
          <textarea
            name="targetBeneficiaries"
            id="targetBeneficiaries"
            required
            rows={3}
            className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 resize-none"
            placeholder="Describe the communities or individuals your organization serves"
            value={formData.targetBeneficiaries}
            onChange={handleChange}
          />
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
            <input
              type="date"
              name="dateOfEstablishment"
              id="dateOfEstablishment"
              required
              className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
              value={formData.dateOfEstablishment}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Number of Employees */}
        <div>
          <label htmlFor="numberOfEmployees" className="block text-sm font-bold text-surface-700 mb-2">
            Number of Employees *
          </label>
          <input
            type="number"
            name="numberOfEmployees"
            id="numberOfEmployees"
            required
            min="0"
            className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
            placeholder="Enter number of employees"
            value={formData.numberOfEmployees}
            onChange={handleChange}
          />
        </div>

        {/* Business Sector */}
        <div>
          <label htmlFor="businessSector" className="block text-sm font-bold text-surface-700 mb-2">
            Business Sector
          </label>
          <input
            type="text"
            name="businessSector"
            id="businessSector"
            className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300"
            placeholder="e.g., Education, Healthcare, Environmental"
            value={formData.businessSector}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-surface-200"></div>

      {/* Submit Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-surface-600">
          Last updated: <span className="font-semibold">
            {organization?.updated_at 
              ? new Date(organization.updated_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              : 'Never'}
          </span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="group px-8 py-4 bg-gradient-civic text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg className="-ml-1 h-5 w-5 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Changes</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
};
