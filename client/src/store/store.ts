import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { sensorsReducer } from "./sensors";
import { sensorsConnector } from "./sensors/sensorsConnector";

// Available reducers
const reducer = combineReducers({
  sensors: sensorsReducer,
});

// Create the store
export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sensorsConnector),
  devTools: import.meta.env.NODE_ENV !== "production",
});

// Export the store and types
export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;
