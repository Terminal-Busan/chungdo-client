export type WelfareProfile = {
  age: number;
  householdType: string;
  income: number;
  region: string;
};

export type WelfareAnalysisRequest = {
  appliedPolicy: string;
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
  rejectionReason: string;
  age: string;
  householdType: string;
  income: string;
  region: string;
};
