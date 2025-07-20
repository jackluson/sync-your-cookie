import { MessageType } from '@sync-your-cookie/shared';
import { messageListener } from './listener';


class Observer {
  observers: any[] = [];

  constructor() {
  }

  subscribeGetLocalStorage(callback: (data: any) => void) {
    messageListener.on(MessageType.GetLocalStorage, callback);
  }
}

export const observer = new Observer();


class eventHandler {
  constructor() {
    // this.init();
  }

  init() {
    this.handleGetLocalStorage();
  }

  handleGetLocalStorage() {
    observer.subscribeGetLocalStorage(async result => {
      try {
        console.log("result", result);
        console.log("localStorage", localStorage);
        const json = JSON.parse(result.response);
      } catch (error) {
        console.log('XHR_RESPONSE->error', error);
      }
    });
  }

}
export const eventHandlerInstance = new eventHandler();
