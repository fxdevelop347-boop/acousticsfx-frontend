import { api } from "./api/client";

export interface CaseStudy {
  slug: string;
  title: string;
  description?: string;
  image: string;
  order?: number;
}

interface ResourcesResponse {
  caseStudies: CaseStudy[];
}

export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  const data = await api.get<ResourcesResponse>("/api/resources");
  return data.caseStudies ?? [];
}
