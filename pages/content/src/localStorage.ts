import { eventHandlerInstance } from "./observer";

export const init = () => {
  eventHandlerInstance.init();
  console.log("LocalStorage initialized");
}
