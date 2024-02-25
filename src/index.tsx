import { createRoot } from "react-dom/client";
import { createContext } from "react";
// import store from "@src/store";
// import Freezer from "freezer-js";

// interface FreezerNode<T> {
//     set(update: Partial<T>): FreezerNode<T>;
//     get(): T;
//     update(updateFunction: (currentValue: T) => Partial<T>): FreezerNode<T>;
//     // Add other methods you use from FreezerNode as needed
// }

// interface FreezerStore<T> extends FreezerNode<T> {
//     // The store might have additional methods specific to it
//     // For instance, methods to listen to changes
//     on(eventName: 'update', callback: (state: FreezerNode<T>) => void): void;
//     off(eventName: 'update', callback: (state: FreezerNode<T>) => void): void;
//     // Add other store-specific methods here
// }

// interface AppState {
//     todos: { id: number; text: string; done: boolean; }[];
//     // Add other state properties as needed
// }

// const initialState: AppState = {
//   todos: [
//     { id: 1, text: "Learn React", done: false },
//     { id: 2, text: "Learn Freezer-js", done: false },
//   ],
// };

// const store = new Freezer(initialState);

// export const FreezerContext = createContext(initialState);

import { App } from "./App";

const container = document.getElementById("container")!;
const root = createRoot(container);

root.render(
  //   <FreezerContext.Provider value={store}>
  <App />
  //   </FreezerContext.Provider>
);
