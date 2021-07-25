export interface CompanyResponse {
  id: number;
  publicId: string;
  isActive: boolean;
  name: string;
  postalCode: string;
  taxIdNumber: string;
  companyNumber: string;
  activityCode?: string;
  bankName?: string;
  bankAccountNumber?: string;
  phoneFaxNumber?: string;
  phoneMobileNumber?: string;
  email?: string;
  websiteURL?: string;
  createdAt: Date;
  updatedAt: Date;
}
