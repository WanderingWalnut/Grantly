export type OrganizationContact = {
  title: string;
  name: string;
  phone: string;
  email: string;
};

export type ProjectExpense = {
  item: string;
  amount: number;
  description: string;
};

export type DonatedLabour = {
  role: string;
  hours: number;
  value: number;
  description: string;
};

export type FundingSource = {
  source: string;
  amount: number;
  status: "pending" | "confirmed";
  notes?: string;
};

export type OrganizationProfile = {
  legalName: string;
  operatingName?: string;
  mission: string;
  description: string;
  targetBeneficiaries: string[];
  sectorFocus: string[];
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  signaturePrograms: string[];
  facilityHighlights: string[];
  keyMetrics: { label: string; value: string }[];
  legalSigningAuthority: OrganizationContact;
  primaryContact: OrganizationContact;
  projectPlan: {
    projectName: string;
    overview: string;
    scope: string;
    canopyType: string;
    seatingMaterials: string;
    accessibilityFeatures: string[];
    additionalAccessibilityNotes: string;
    timelineHighlights: string[];
    equipmentOwnership: string;
  };
  fundingPlan: {
    cfepRequest: number;
    totalProjectExpenses: number;
    totalProjectCost: number;
    totalProjectRevenues: number;
    donatedLabourPresent: boolean;
    donatedLabourValue: number;
    donatedLabour: DonatedLabour[];
    donatedEquipmentMaterialsPresent: boolean;
    projectExpenses: ProjectExpense[];
    fundingSources: FundingSource[];
    municipalSupport: {
      amount: number;
      status: "pending" | "confirmed";
      description: string;
    };
    ownSource: {
      amount: number;
      status: "pending" | "confirmed";
      documentation: string;
    };
    otherProvincialSupportDetails: string;
    contingencyPlan: string;
  };
};

export const ORGANIZATION_PROFILE: OrganizationProfile = {
  legalName: "Prairie Heritage Community Society",
  operatingName: "Prairie Heritage Community Hub",
  mission:
    "To preserve beloved rural gathering spaces and deliver inclusive arts, culture, and wellness programs that keep Prairie Crossing vibrant.",
  description:
    "Volunteer-led nonprofit stewarding a 12,000 square foot multi-use community hall, heritage exhibit, and outdoor green space that host year-round events for families, newcomers, and Elders across Wheatland County.",
  targetBeneficiaries: [
    "Rural families living within 75 km of Prairie Crossing",
    "Indigenous youth and knowledge keepers partnering on cultural programming",
    "Older adults seeking accessible recreation and social connection",
    "Newcomer families settling in central Alberta",
  ],
  sectorFocus: [
    "Community services",
    "Arts and culture",
    "Heritage preservation",
    "Health and wellness",
  ],
  address: {
    street: "123 Prairie Crescent",
    city: "Prairie Crossing",
    province: "AB",
    postalCode: "T0J 1X0",
    country: "Canada",
  },
  signaturePrograms: [
    "Heritage Makers Lab: after-school STEAM and storytelling series linking Elders with youth (320 participants annually)",
    "Community Fit and Nourish: low-cost fitness, nutrition, and mental health workshops serving adults and seniors (1,150 visits per year)",
    "Festival of the Prairie: summer arts market and Indigenous showcase drawing 2,400 attendees and 38 local vendors",
    "Shared Kitchen Co-op: commercial kitchen rentals and training for newcomer entrepreneurs launching food ventures",
  ],
  facilityHighlights: [
    "Fully accessible community hall with updated lift and barrier-free washrooms (renovated in 2023)",
    "Outdoor performance pavilion and community garden delivering 28 free events each summer",
    "Energy-efficient HVAC, LED lighting, and solar-ready electrical upgrades completed in 2024",
  ],
  keyMetrics: [
    { label: "Year Established", value: "1984" },
    { label: "Paid Staff", value: "6 full-time equivalent" },
    { label: "Active Volunteers", value: "82 (6,300 volunteer hours in 2024)" },
    { label: "Annual Participants", value: "3,700 unique visitors; 9,200 program visits" },
    { label: "Operating Budget", value: "$620,000 (FY2024)" },
  ],
  legalSigningAuthority: {
    title: "Executive Director",
    name: "Avery Sinclair",
    phone: "403-555-0126",
    email: "avery.sinclair@prairieheritage.ca",
  },
  primaryContact: {
    title: "Community Engagement Manager",
    name: "Jordan Ellis",
    phone: "403-555-0184",
    email: "jordan.ellis@prairieheritage.ca",
  },
  projectPlan: {
    projectName: "Prairie Crossing Outdoor Canopy & Gathering Plaza",
    overview:
      "Construction of a 2,400 sq ft all-weather canopy with integrated seating and lighting to activate the outdoor plaza for year-round markets, cultural programming, and seniors wellness classes.",
    scope:
      "Upgrade existing plaza with engineered steel canopy, expanded concrete pad, radiant heaters, wind panels, flexible seating pods, AV infrastructure, and accessible pathways linking to parking and garden space.",
    canopyType:
      "Powder-coated structural steel canopy with high-impact polycarbonate roof panels, snow-load rated for central Alberta winters.",
    seatingMaterials:
      "Composite timber benches with recycled rubber seat pads and modular aluminum café tables with anti-slip surfacing.",
    accessibilityFeatures: [
      "Barrier-free routes with tactile warning strips and rest areas every 20 metres",
      "Heated seating zone for mobility-challenged visitors",
      "Integrated hearing-assist audio loop and high-contrast signage",
    ],
    additionalAccessibilityNotes:
      "Design meets CSA B651 standards, includes 1:15 sloped ramp with handrails, LED perimeter lighting, and accessible power hookups for adaptive programming equipment.",
    timelineHighlights: [
      "April 2025: Finalize engineering drawings and secure development permits",
      "May 2025: Site preparation, electrical rough-ins, and concrete expansion",
      "June-July 2025: Fabricate canopy structure, install radiant heating and lighting",
      "August 2025: Install seating, signage, landscaping refresh, and commissioning",
    ],
    equipmentOwnership:
      "The Society will own and maintain all canopy infrastructure, seating, and installed equipment upon project completion.",
  },
  fundingPlan: {
    cfepRequest: 125000,
    totalProjectExpenses: 230000,
    totalProjectCost: 250000,
    totalProjectRevenues: 250000,
    donatedLabourPresent: true,
    donatedLabourValue: 20000,
    donatedLabour: [
      {
        role: "Certified carpenters (volunteer guild)",
        hours: 280,
        value: 11200,
        description: "Fabrication of seating modules and installation of wind screens.",
      },
      {
        role: "Landscape and site prep volunteers",
        hours: 220,
        value: 8800,
        description: "Demolition of existing fixtures, landscaping refresh, and accessibility ramp finishing.",
      },
    ],
    donatedEquipmentMaterialsPresent: false,
    projectExpenses: [
      {
        item: "Structural steel canopy fabrication and install",
        amount: 85000,
        description: "Engineered steel frame, powder coating, and installation labour.",
      },
      {
        item: "Polycarbonate roofing and radiant heating system",
        amount: 42000,
        description: "Roof panels, heat tracing, radiant heaters, and electrical integration.",
      },
      {
        item: "Accessible seating pods and modular tables",
        amount: 32000,
        description: "Composite benches, rubberized seating pads, modular aluminum tables.",
      },
      {
        item: "Electrical, lighting, and AV infrastructure",
        amount: 31000,
        description: "LED lighting, AV system, hearing loop, control panels, conduit, and labour.",
      },
      {
        item: "Concrete expansion, landscaping, and signage",
        amount: 40000,
        description: "Concrete pad expansion, ramp upgrades, tactile paving, signage, planters.",
      },
    ],
    fundingSources: [
      {
        source: "CFEP Small Request",
        amount: 125000,
        status: "pending",
        notes: "Submitted through this application cycle.",
      },
      {
        source: "Municipal Support - Prairie Crossing Council",
        amount: 45000,
        status: "confirmed",
        notes: "Council motion #2025-06 passed March 18, 2025; letter of support attached.",
      },
      {
        source: "Own Source - Facility Reserve & 2024 Gala",
        amount: 40000,
        status: "confirmed",
        notes: "Bank statements and board resolution approving allocation attached.",
      },
      {
        source: "Community Foundation of Wheatland County",
        amount: 40000,
        status: "pending",
        notes: "Funding decision expected May 2025; acknowledgement letter included.",
      },
      {
        source: "Donated Labour",
        amount: 20000,
        status: "confirmed",
        notes: "Volunteer commitment letters attached.",
      },
    ],
    municipalSupport: {
      amount: 45000,
      status: "confirmed",
      description: "Prairie Crossing Council recreation capital grant (Resolution #2025-06).",
    },
    ownSource: {
      amount: 40000,
      status: "confirmed",
      documentation:
        "Board-approved transfer from Facility Sustainability Reserve and 2024 Harvest Gala net proceeds; bank statements provided.",
    },
    otherProvincialSupportDetails: "N/A",
    contingencyPlan:
      "If pending grants are reduced, the Society will deploy an additional $20,000 from the Capital Replacement Reserve and phase landscaping enhancements into 2026. Sponsorship requests to local cooperatives will bridge any remaining gap.",
  },
};

export const buildOrganizationSummary = (
  profile: OrganizationProfile
): string => {
  const lines: string[] = [
    `Organization Name: ${profile.legalName}`,
  ];

  if (profile.operatingName && profile.operatingName !== profile.legalName) {
    lines.push(`Operating Name: ${profile.operatingName}`);
  }

  lines.push(`Mission: ${profile.mission}`);
  lines.push(`About: ${profile.description}`);
  lines.push(
    `Legal Signing Authority: ${profile.legalSigningAuthority.name} (${profile.legalSigningAuthority.title}) | Phone: ${profile.legalSigningAuthority.phone} | Email: ${profile.legalSigningAuthority.email}`
  );
  lines.push(
    `Primary Contact: ${profile.primaryContact.name} (${profile.primaryContact.title}) | Phone: ${profile.primaryContact.phone} | Email: ${profile.primaryContact.email}`
  );

  if (profile.signaturePrograms.length > 0) {
    lines.push(
      `Signature Programs: ${profile.signaturePrograms
        .map((program) => program.trim())
        .join(" | ")}`
    );
  }

  if (profile.targetBeneficiaries.length > 0) {
    lines.push(
      `Target Beneficiaries: ${profile.targetBeneficiaries
        .map((group) => group.trim())
        .join("; ")}`
    );
  }

  if (profile.sectorFocus.length > 0) {
    lines.push(
      `Sector Focus: ${profile.sectorFocus.map((sector) => sector.trim()).join(", ")}`
    );
  }

  lines.push(
    `Facility Highlights: ${profile.facilityHighlights
      .map((highlight) => highlight.trim())
      .join(" | ")}`
  );

  lines.push(
    `Key Metrics: ${profile.keyMetrics
      .map((metric) => `${metric.label} - ${metric.value}`)
      .join(" | ")}`
  );

  lines.push(
    `Project Overview: ${profile.projectPlan.projectName} — ${profile.projectPlan.overview}`
  );
  lines.push(`Project Scope: ${profile.projectPlan.scope}`);
  lines.push(
    `Canopy & Seating: ${profile.projectPlan.canopyType}; Seating Materials: ${profile.projectPlan.seatingMaterials}`
  );
  lines.push(
    `Accessibility Features: ${profile.projectPlan.accessibilityFeatures.join("; ")}`
  );
  lines.push(
    `Additional Accessibility Notes: ${profile.projectPlan.additionalAccessibilityNotes}`
  );
  lines.push(
    `Timeline Highlights: ${profile.projectPlan.timelineHighlights.join(" | ")}`
  );
  lines.push(`Equipment Ownership: ${profile.projectPlan.equipmentOwnership}`);

  lines.push(
    `Funding Request: CFEP Small Request $${profile.fundingPlan.cfepRequest.toLocaleString("en-CA")} | Total Project Expenses $${profile.fundingPlan.totalProjectExpenses.toLocaleString("en-CA")} | Total Project Cost $${profile.fundingPlan.totalProjectCost.toLocaleString("en-CA")}`
  );

  lines.push(
    `Funding Sources: ${profile.fundingPlan.fundingSources
      .map(
        (source) =>
          `${source.source} - $${source.amount.toLocaleString("en-CA")} (${source.status})${source.notes ? ` [${source.notes}]` : ""}`
      )
      .join(" | ")}`
  );

  lines.push(
    `Donated Labour: Present=${profile.fundingPlan.donatedLabourPresent ? "Yes" : "No"}; Value $${profile.fundingPlan.donatedLabourValue.toLocaleString("en-CA")}; Details ${profile.fundingPlan.donatedLabour
      .map(
        (labour) =>
          `${labour.role}: ${labour.hours} hours ($${labour.value.toLocaleString("en-CA")}) - ${labour.description}`
      )
      .join(" | ")}`
  );

  lines.push(
    `Municipal Support: $${profile.fundingPlan.municipalSupport.amount.toLocaleString("en-CA")} (${profile.fundingPlan.municipalSupport.status}) - ${profile.fundingPlan.municipalSupport.description}`
  );

  lines.push(
    `Own Source Funding: $${profile.fundingPlan.ownSource.amount.toLocaleString("en-CA")} (${profile.fundingPlan.ownSource.status}) - ${profile.fundingPlan.ownSource.documentation}`
  );

  lines.push(
    `Other Provincial Support Details: ${profile.fundingPlan.otherProvincialSupportDetails}`
  );

  lines.push(`Contingency Plan: ${profile.fundingPlan.contingencyPlan}`);

  lines.push(
    `Project Expenses: ${profile.fundingPlan.projectExpenses
      .map(
        (expense) =>
          `${expense.item} $${expense.amount.toLocaleString("en-CA")} - ${expense.description}`
      )
      .join(" | ")}`
  );

  lines.push(
    `Address: ${profile.address.street}, ${profile.address.city}, ${profile.address.province} ${profile.address.postalCode}, ${profile.address.country}`
  );

  return lines.join("\n");
};

export const ORGANIZATION_PROFILE_SUMMARY =
  buildOrganizationSummary(ORGANIZATION_PROFILE);

