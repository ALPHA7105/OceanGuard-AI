
export interface DetectionResult {
  detectedItems: string[];
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
}

export enum AppTab {
  LEARN = 'learn',
  DETECT = 'detect',
  IMPACT = 'impact'
}
