import { TFunction } from "react-i18next";

export enum SuccessMessage {
  // Category Related Messages
  CATEGORY_CREATED = "CATEGORY_CREATED",

  // Inventory Related Messages
  INVENTORY_CREATED = "INVENTORY_CREATED",

  // Product Related Messages
  PRODUCT_CREATED = "PRODUCT_CREATED",
  PRODUCT_DETAILS_CREATED = "PRODUCT_DETAILS_CREATED",
  PRODUCT_ORDER_CREATED = "PRODUCT_ORDER_CREATED",

  // DEFAULT
  DEFAULT = "DEFAULT",
}

export const handleSuccessMessage = (
  message: SuccessMessage,
  translate: TFunction<"common">
): string => {
  switch (message) {
    case SuccessMessage.CATEGORY_CREATED:
      return translate(`successMessage.${SuccessMessage.CATEGORY_CREATED}`);
    case SuccessMessage.INVENTORY_CREATED:
      return translate(`successMessage.${SuccessMessage.INVENTORY_CREATED}`);
    case SuccessMessage.PRODUCT_CREATED:
      return translate(`successMessage.${SuccessMessage.PRODUCT_CREATED}`);
    case SuccessMessage.PRODUCT_DETAILS_CREATED:
      return translate(
        `successMessage.${SuccessMessage.PRODUCT_DETAILS_CREATED}`
      );
    case SuccessMessage.PRODUCT_ORDER_CREATED:
      return translate(
        `successMessage.${SuccessMessage.PRODUCT_ORDER_CREATED}`
      );
    default:
      return translate(`successMessage.${SuccessMessage.DEFAULT}`);
  }
};
