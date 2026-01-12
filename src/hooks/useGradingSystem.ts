export interface GradingInputs {
  leadCloseRate: number;
  followupRate: number;
  speedOfFollowup: string;
  missedCallsPerWeek: number;
  afterHoursImportance: string;
  messagingPreferenceRate: number;
  websiteScore: number;
  contactScore: number;
  roiMultiplier: number;
  monthlyLostRevenue: number;
}

export interface GradeResults {
  leadConversionGrade: string;
  contactAccessibilityGrade: string;
  automationReadinessGrade: string;
  customerExperienceGrade: string;
  aiImpactPotentialGrade: string;
  overallGrade: string;
}

export const useGradingSystem = () => {
  const gradeLeadConversion = (closeRate: number, followupRate: number, speedOfFollowup: string): string => {
    let points = 0;
    
    if (closeRate >= 40) points += 3;
    else if (closeRate >= 30) points += 2.5;
    else if (closeRate >= 20) points += 2;
    else if (closeRate >= 10) points += 1;
    
    if (followupRate >= 90) points += 2;
    else if (followupRate >= 75) points += 1.5;
    else if (followupRate >= 60) points += 1;
    else if (followupRate >= 40) points += 0.5;
    
    const speedPoints: Record<string, number> = {
      'within-5min': 2,
      'within-1hr': 1.5,
      'within-4hrs': 1,
      'within-24hrs': 0.5,
      'slower': 0,
    };
    points += speedPoints[speedOfFollowup] || 0;
    
    if (points >= 6.5) return 'A';
    if (points >= 5) return 'B';
    if (points >= 3.5) return 'C';
    if (points >= 2) return 'D';
    return 'F';
  };

  const gradeContactAccessibility = (contactScore: number): string => {
    if (contactScore >= 90) return 'A';
    if (contactScore >= 75) return 'B';
    if (contactScore >= 60) return 'C';
    if (contactScore >= 40) return 'D';
    return 'F';
  };

  const gradeAutomationReadiness = (
    missedCalls: number,
    afterHours: string,
    messagingPreference: number
  ): string => {
    let points = 0;
    
    if (missedCalls >= 15) points += 3;
    else if (missedCalls >= 10) points += 2.5;
    else if (missedCalls >= 5) points += 2;
    else if (missedCalls > 0) points += 1;
    
    const afterHoursPoints: Record<string, number> = {
      'critical': 2,
      'important': 1.5,
      'moderate': 1,
      'not-important': 0,
    };
    points += afterHoursPoints[afterHours] || 0;
    
    if (messagingPreference >= 50) points += 2;
    else if (messagingPreference >= 30) points += 1.5;
    else if (messagingPreference >= 15) points += 1;
    
    if (points >= 6) return 'A';
    if (points >= 4.5) return 'B';
    if (points >= 3) return 'C';
    if (points >= 1.5) return 'D';
    return 'F';
  };

  const gradeCustomerExperience = (
    websiteScore: number,
    speedOfFollowup: string,
    followupRate: number
  ): string => {
    let points = 0;
    
    points += (websiteScore / 100) * 3;
    
    const speedPoints: Record<string, number> = {
      'within-5min': 2,
      'within-1hr': 1.5,
      'within-4hrs': 1,
      'within-24hrs': 0.5,
      'slower': 0,
    };
    points += speedPoints[speedOfFollowup] || 0;
    
    points += (followupRate / 100) * 2;
    
    if (points >= 6) return 'A';
    if (points >= 4.5) return 'B';
    if (points >= 3) return 'C';
    if (points >= 1.5) return 'D';
    return 'F';
  };

  const gradeAIImpactPotential = (roiMultiplier: number, monthlyLostRevenue: number): string => {
    if (roiMultiplier >= 10 && monthlyLostRevenue >= 10000) return 'A';
    if (roiMultiplier >= 5 && monthlyLostRevenue >= 5000) return 'B';
    if (roiMultiplier >= 3 && monthlyLostRevenue >= 2000) return 'C';
    if (roiMultiplier >= 2 && monthlyLostRevenue >= 1000) return 'D';
    return 'F';
  };

  const calculateOverallGrade = (grades: Omit<GradeResults, 'overallGrade'>): string => {
    const gradeValues: Record<string, number> = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
    const values = [
      gradeValues[grades.leadConversionGrade],
      gradeValues[grades.contactAccessibilityGrade],
      gradeValues[grades.automationReadinessGrade],
      gradeValues[grades.customerExperienceGrade],
      gradeValues[grades.aiImpactPotentialGrade],
    ];
    
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    
    if (average >= 3.5) return 'A';
    if (average >= 2.5) return 'B';
    if (average >= 1.5) return 'C';
    if (average >= 0.5) return 'D';
    return 'F';
  };

  const calculateAllGrades = (inputs: GradingInputs): GradeResults => {
    const leadConversionGrade = gradeLeadConversion(
      inputs.leadCloseRate,
      inputs.followupRate,
      inputs.speedOfFollowup
    );
    const contactAccessibilityGrade = gradeContactAccessibility(inputs.contactScore);
    const automationReadinessGrade = gradeAutomationReadiness(
      inputs.missedCallsPerWeek,
      inputs.afterHoursImportance,
      inputs.messagingPreferenceRate
    );
    const customerExperienceGrade = gradeCustomerExperience(
      inputs.websiteScore,
      inputs.speedOfFollowup,
      inputs.followupRate
    );
    const aiImpactPotentialGrade = gradeAIImpactPotential(
      inputs.roiMultiplier,
      inputs.monthlyLostRevenue
    );

    const overallGrade = calculateOverallGrade({
      leadConversionGrade,
      contactAccessibilityGrade,
      automationReadinessGrade,
      customerExperienceGrade,
      aiImpactPotentialGrade,
    });

    return {
      leadConversionGrade,
      contactAccessibilityGrade,
      automationReadinessGrade,
      customerExperienceGrade,
      aiImpactPotentialGrade,
      overallGrade,
    };
  };

  return {
    calculateAllGrades,
    gradeLeadConversion,
    gradeContactAccessibility,
    gradeAutomationReadiness,
    gradeCustomerExperience,
    gradeAIImpactPotential,
  };
};
