import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface Organization {
  id: string;
  user_id: string;
  organization_name: string;
  legal_business_name: string;
  operating_name: string;
  business_number: string;
  business_structure: string;
  address: string;
  contact_information: string;
  date_of_establishment: string;
  phone_number: string;
  email_address: string;
  number_of_employees: string;
  mission_statement: string;
  company_description: string;
  target_beneficiaries: string;
  organization_type: string;
  year_established: number;
  annual_budget: string;
  created_at?: string;
  updated_at?: string;
}

interface OrganizationContextType {
  organization: Organization | null;
  loading: boolean;
  error: string | null;
  fetchOrganization: () => Promise<void>;
  updateOrganization: (data: Partial<Organization>) => Promise<boolean>;
  refreshOrganization: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const { session, user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = async () => {
    if (!session?.access_token || !user) {
      setOrganization(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/organizations/me`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrganization(data);
      } else if (response.status === 404) {
        // No organization found for this user yet
        setOrganization(null);
      } else {
        throw new Error('Failed to fetch organization');
      }
    } catch (err) {
      console.error('Error fetching organization:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async (data: Partial<Organization>): Promise<boolean> => {
    if (!session?.access_token || !organization?.id) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/organizations/${organization.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedOrg = await response.json();
        setOrganization(updatedOrg);
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update organization');
      }
    } catch (err) {
      console.error('Error updating organization:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  };

  const refreshOrganization = async () => {
    await fetchOrganization();
  };

  // Fetch organization when user logs in
  useEffect(() => {
    if (user && session) {
      fetchOrganization();
    } else {
      setOrganization(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, session]);

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        loading,
        error,
        fetchOrganization,
        updateOrganization,
        refreshOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
