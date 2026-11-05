export type WelfareProfile = {
  age: number;
  householdType: string;
  householdSize: number;
  housingType: string;
  employmentStatus: string;
  hasDisability: boolean;
  income: number;
  region: string;
};

export type WelfareAnalysisRequest = {
  appliedPolicy: string;
  appliedPolicyId: string;
  consent: boolean;
  rejectionReason: string;
  profile: WelfareProfile;
};

export type EligibilityStatus = "MATCH" | "MISMATCH" | "CHECK_REQUIRED";

export type EligibilityItem = {
  label: string;
  status: EligibilityStatus;
  value: string;
};

export type PolicyRecommendation = {
  policyId: string;
  name: string;
  reason: string;
  supportDescription?: string;
  eligibility: EligibilityItem[];
};

export type NextAction = {
  type: string;
  title: string;
  description: string;
};

export type WelfareAnalysis = {
  reasonExplanation: {
    summary: string;
    details: string[];
    keyCondition: string;
  };
  recommendations: PolicyRecommendation[];
  nextActions: NextAction[];
};

export type AnalysisFormValues = {
  appliedPolicy: string;
  appliedPolicyId: string;
  rejectionReason: string;
  age: string;
  householdType: string;
  householdSize: string;
  housingType: string;
  employmentStatus: string;
  income: string;
  region: string;
};
