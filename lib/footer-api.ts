import { api } from "./api/client";

export interface FooterLink {
  _id: string;
  section: "resources";
  label: string;
  href?: string;
  order?: number;
}

interface FooterLinksResponse {
  resources: FooterLink[];
}

export async function fetchFooterLinks(): Promise<FooterLinksResponse> {
  return api.get<FooterLinksResponse>("/api/footer-links");
}
