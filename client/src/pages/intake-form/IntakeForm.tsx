import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const IntakeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    missionStatement: '',
    yearEstablished: '',
    numberOfEmployees: '',
    annualBudget: '',
    previousGrants: '',
    focusAreas: '',
    websiteUrl: '',
    taxId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic (save to backend)
    console.log('Intake form submitted:', formData);
    
    // Redirect to dashboard after submission
    navigate('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Organization Intake Form
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please provide information about your organization to help us better serve you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Name */}
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  id="organizationName"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your organization name"
                  value={formData.organizationName}
                  onChange={handleChange}
                />
              </div>

              {/* Organization Type */}
              <div>
                <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">
                  Organization Type *
                </label>
                <select
                  name="organizationType"
                  id="organizationType"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.organizationType}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  <option value="nonprofit">Nonprofit</option>
                  <option value="charity">Charity</option>
                  <option value="foundation">Foundation</option>
                  <option value="educational">Educational Institution</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Mission Statement */}
              <div>
                <label htmlFor="missionStatement" className="block text-sm font-medium text-gray-700">
                  Mission Statement *
                </label>
                <textarea
                  name="missionStatement"
                  id="missionStatement"
                  required
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe your organization's mission"
                  value={formData.missionStatement}
                  onChange={handleChange}
                />
              </div>

              {/* Year Established */}
              <div>
                <label htmlFor="yearEstablished" className="block text-sm font-medium text-gray-700">
                  Year Established *
                </label>
                <input
                  type="number"
                  name="yearEstablished"
                  id="yearEstablished"
                  required
                  min="1800"
                  max={new Date().getFullYear()}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="YYYY"
                  value={formData.yearEstablished}
                  onChange={handleChange}
                />
              </div>

              {/* Number of Employees */}
              <div>
                <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-gray-700">
                  Number of Employees *
                </label>
                <select
                  name="numberOfEmployees"
                  id="numberOfEmployees"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              </div>

              {/* Annual Budget */}
              <div>
                <label htmlFor="annualBudget" className="block text-sm font-medium text-gray-700">
                  Annual Budget *
                </label>
                <select
                  name="annualBudget"
                  id="annualBudget"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              </div>

              {/* Previous Grants */}
              <div>
                <label htmlFor="previousGrants" className="block text-sm font-medium text-gray-700">
                  Previous Grant Experience
                </label>
                <textarea
                  name="previousGrants"
                  id="previousGrants"
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="List any previous grants received (optional)"
                  value={formData.previousGrants}
                  onChange={handleChange}
                />
              </div>

              {/* Focus Areas */}
              <div>
                <label htmlFor="focusAreas" className="block text-sm font-medium text-gray-700">
                  Primary Focus Areas *
                </label>
                <input
                  type="text"
                  name="focusAreas"
                  id="focusAreas"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Education, Healthcare, Environment"
                  value={formData.focusAreas}
                  onChange={handleChange}
                />
              </div>

              {/* Website URL */}
              <div>
                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
                  Website URL
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  id="websiteUrl"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://www.example.org"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                />
              </div>

              {/* Tax ID */}
              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
                  Tax ID / EIN *
                </label>
                <input
                  type="text"
                  name="taxId"
                  id="taxId"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="XX-XXXXXXX"
                  value={formData.taxId}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit & Continue to Dashboard
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

