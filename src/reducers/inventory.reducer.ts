import { PayloadAction } from "@reduxjs/toolkit";
import { Inventory } from "../entities";

const initialState: Inventory[] = [];

export enum InventoryActionType {
  SET_INVENTORY = "SET_INVENTORY",
  SET_INVENTORIES = "SET_INVENTORIES",
  UPDATE_INVENTORY = "UPDATE_INVENTORY",
}

export const inventoryReducer = (
  state = initialState,
  action: PayloadAction<Inventory>
) => {
  switch (action.type) {
    case InventoryActionType.SET_INVENTORY:
      return state.concat(action.payload);
    case InventoryActionType.SET_INVENTORIES:
      return action.payload;
    case InventoryActionType.UPDATE_INVENTORY:
      const newState = state.filter((i) => i.id !== action.payload.id);
      return [...newState, action.payload];
    default:
      return state;
  }
};
