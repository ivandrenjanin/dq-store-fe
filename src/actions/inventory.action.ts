import { Inventory } from "../entities";
import { InventoryActionType } from "../reducers/inventory.reducer";

export const setInventory = (payload: Inventory) => ({
  type: InventoryActionType.SET_INVENTORY,
  payload,
});

export const setInventories = (payload: Inventory[]) => ({
  type: InventoryActionType.SET_INVENTORIES,
  payload,
});

export const updateInventory = (payload: Inventory) => ({
  type: InventoryActionType.UPDATE_INVENTORY,
  payload,
});
