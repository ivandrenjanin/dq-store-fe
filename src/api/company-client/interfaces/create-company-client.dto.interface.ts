export interface CreateCompanyClientDto {
  name: string;
  postalCode?: string;
  street?: string;
  city?: string;
  taxIdNumber: string;
  companyNumber: string;
  bankName?: string;
  bankAccountNumber?: string;
  phoneFaxNumber?: string;
  phoneMobileNumber?: string;
  email?: string;
}
