/** Business details returned from GST lookup (e.g. GST portal / third-party API). */
export interface GstBusinessDetails {
  /** Legal name of the business (as registered). */
  legalName: string;
  /** Trade name / business name (if different). */
  tradeName?: string;
  /** Status e.g. "Active", "Cancelled". */
  status?: string;
  /** Principal place of business address. */
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  /** Constitution type e.g. "Private Limited Company", "Proprietorship". */
  constitutionType?: string;
}

export interface GstLookupResponse {
  gstin: string;
  details: GstBusinessDetails;
}

export interface GstLookupError {
  code: string;
  message: string;
}
