import { DomainPayload, MessageType, SendResponse, SetLocalStorageMessagePayload } from '@sync-your-cookie/shared';
import { messageListener } from './listener';


class Observer {
  observers: any[] = [];

  constructor() {
  }

  // 订阅获取本地存储
  subscribeGetLocalStorage(callback: (data: any, sendResponse: (data: SendResponse) => void) => void) {
    messageListener.on(MessageType.GetLocalStorage, callback);
  }

  subscribeSetLocalStorage(callback: (data: any, sendResponse: (data: SendResponse) => void) => void) {
    messageListener.on(MessageType.SetLocalStorage, callback);
  }
}

export const observer = new Observer();


class eventHandler {
  constructor() {
    // this.init();
  }

  init() {
    this.handleGetLocalStorage();
    this.handleSetLocalStorage();
  }

  handleGetLocalStorage() {
    observer.subscribeGetLocalStorage(async (result: DomainPayload, sendResponse: (data: SendResponse) => void) => {
      console.log("result", result);
      if (location.origin.includes(result.domain)) {
        try {
          console.log("localStorage", { ...localStorage });
          const items: {key: string, value: string}[] = [];
          const localObject = { ...localStorage };
          for(const key in localObject) {
            const value:string = localObject[key].toString();
            items.push({key, value});
          }
          console.log("items", items);

          sendResponse({
              isOk: true,
              msg: 'get localStorage success',
              result: items
          });
          // const json = JSON.parse(result.response);
        } catch (error) {
          console.log('XHR_RESPONSE->error', error);
          sendResponse({
            isOk: false,
            msg: 'get localStorage error',
            result: error
          })
        }
      } else {
        console.log("localStorage not match domain", result.domain);
      }

    });
  }

  handleSetLocalStorage() {
    observer.subscribeSetLocalStorage(async (result: SetLocalStorageMessagePayload, sendResponse: (data: SendResponse) => void) => {
      console.log("result", result);
      if (location.origin.includes(result.domain)) {
        try {
          const values = result.value;
          const setKey = result.onlyKey;
          if(setKey){
            const targetItem = values.find((item: any) => item.key === setKey);
            if(targetItem){
              localStorage.setItem(setKey, targetItem.value || "");
            } else {
              console.log("no target item", setKey);
            }
          } else {
            for(const item of values){
              localStorage.setItem(item.key || '', item.value || "");
            }
          }
          sendResponse({
              isOk: true,
              msg: 'set localStorage success',
          });
          // const json = JSON.parse(result.response);
        } catch (error) {
          console.log('XHR_RESPONSE->error', error);
          sendResponse({
            isOk: false,
            msg: 'set localStorage error',
            result: error
          })
        }
      } else {
        console.log("localStorage not match domain", result.domain);
      }

    });
  }

}
export const eventHandlerInstance = new eventHandler();
