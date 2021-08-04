import { TFunction } from "react-i18next";

export enum ErrorMessages {
  // Category Related Messages
  CATEGORY_CODE_OR_NAME_EXIST = "CATEGORY_CODE_OR_NAME_EXIST",
  CATEGORY_NOT_FOUND = "CATEGORY_NOT_FOUND",

  // Default
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export const handleErrorMessage = (
  message: string,
  translate: TFunction<"common">
): string => {
  switch (message) {
    case ErrorMessages.CATEGORY_CODE_OR_NAME_EXIST:
      return translate(`error.${ErrorMessages.CATEGORY_CODE_OR_NAME_EXIST}`);
    case ErrorMessages.CATEGORY_NOT_FOUND:
      return translate(`error.${ErrorMessages.CATEGORY_NOT_FOUND}`);
    default:
      return translate(`error.${ErrorMessages.UNKNOWN_ERROR}`);
  }
};
