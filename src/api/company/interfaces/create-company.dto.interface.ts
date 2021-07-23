export interface CreateCompanyDto {
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
}
