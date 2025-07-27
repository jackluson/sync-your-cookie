import { ICookie, ILocalStorageItem } from '@sync-your-cookie/protobuf';
import pTimeout from 'p-timeout';
export type { ICookie };
export enum MessageType {
  PushCookie = 'PushCookie',
  PullCookie = 'PullCookie',
  RemoveCookie = 'RemoveCookie',
  RemoveCookieItem = 'RemoveCookieItem',
  EditCookieItem = 'EditCookieItem',
  // LocalStorage
  GetLocalStorage = 'GetLocalStorage',
  SetLocalStorage = 'SetLocalStorage',
}

export enum MessageErrorCode {
  AccountCheck = 'AccountCheck',
  CloudflareNotFoundRoute = 'CloudflareNotFoundRoute',
}

export type PushCookieMessagePayload = {
  host: string;
  sourceUrl?: string;
  favIconUrl?: string;
};

export type DomainPayload = {
  domain: string;
}

export type RemoveCookieMessagePayload = {
  domain: string;
};

export type RemoveCookieItemMessagePayload = {
  domain: string;
  id: string;
};

export type PullCookieMessagePayload = {
  domain: string;
  activeTabUrl: string;
  reload: boolean;
};

export type EditCookieItemMessagePayload = {
  domain: string;
  oldItem: ICookie;
  newItem: ICookie;
};

export type SetLocalStorageMessagePayload = {
  domain: string;
  value: ILocalStorageItem[];
  onlyKey?: string;
}

export type MessageMap = {
  [MessageType.PushCookie]: {
    type: MessageType.PushCookie;
    payload: PushCookieMessagePayload;
  };
  [MessageType.RemoveCookie]: {
    type: MessageType.RemoveCookie;
    payload: RemoveCookieMessagePayload;
  };
  [MessageType.PullCookie]: {
    type: MessageType.PullCookie;
    payload: PullCookieMessagePayload;
  };
  [MessageType.RemoveCookieItem]: {
    type: MessageType.RemoveCookieItem;
    payload: RemoveCookieItemMessagePayload;
  };
  [MessageType.EditCookieItem]: {
    type: MessageType.EditCookieItem;
    payload: EditCookieItemMessagePayload;
  };
  // LocalStorage
  [MessageType.GetLocalStorage]: {
    type: MessageType.GetLocalStorage;
    payload: DomainPayload;
  };
  [MessageType.SetLocalStorage]: {
    type: MessageType.SetLocalStorage;
    payload: SetLocalStorageMessagePayload;
  }
};

// export type Message<T extends MessageType = MessageType> = {
//   type: T;
//   payload: MessagePayloadMap[T];
// };

export type Message<T extends MessageType = MessageType> = MessageMap[T];

export type SendResponse = {
  isOk: boolean;
  msg: string;
  result?: unknown;
  code?: MessageErrorCode;
};

export function sendMessage<T extends MessageType>(message: Message<T>, isTab = false, useTimeout: boolean = false) {
  console.log("message", message);
  const send = (resolve: (value: SendResponse | PromiseLike<SendResponse>) => void, reject:  (reason?: any) => void) => {
    chrome.runtime.sendMessage(message, function (result: SendResponse) {
      console.log("sendMessage->message", message);
      if (result?.isOk) {
        resolve(result);
      } else {
        reject(result as SendResponse);
      }
    });
  }
  const fn = () => {
    if (isTab) {
      return new Promise<SendResponse>((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
          if (tabs.length === 0) {
            const allOpendTabs = await chrome.tabs.query({});
            console.log("allOpendTabs", allOpendTabs);

            console.log('No active tab found, try alternative way');
            // reject({ isOk: false, msg: 'No active tab found' } as SendResponse);
            send(resolve, reject)
            return;
          }
          chrome.tabs.sendMessage(tabs[0].id!, message, function (result) {
            console.log('isTab', isTab, 'result->', result);
            if (result?.isOk) {
              resolve(result);
            } else {
              reject(result as SendResponse);
            }
          });
        });
      });
    }
    return new Promise<SendResponse>((resolve, reject) => {
      send(resolve, reject);
    });
  }
  if(useTimeout) {
    return pTimeout(fn(), {
      'milliseconds': 5000,
      fallback: () => {
        return { isOk: false, msg: 'Timeout' } as SendResponse;
      }
    })
  }
  return fn()
}

export function pushCookieUsingMessage(payload: PushCookieMessagePayload) {
  return sendMessage<MessageType.PushCookie>({
    payload,
    type: MessageType.PushCookie,
  });
}

export function removeCookieUsingMessage(payload: RemoveCookieMessagePayload) {
  return sendMessage<MessageType.RemoveCookie>({
    payload,
    type: MessageType.RemoveCookie,
  });
}

export function pullCookieUsingMessage(payload: PullCookieMessagePayload) {
  return sendMessage<MessageType.PullCookie>({
    payload,
    type: MessageType.PullCookie,
  });
}

export function removeCookieItemUsingMessage(payload: RemoveCookieItemMessagePayload) {
  const sendType = MessageType.RemoveCookieItem;
  return sendMessage<typeof sendType>({
    payload,
    type: sendType,
  });
}

export function editCookieItemUsingMessage(payload: EditCookieItemMessagePayload) {
  const sendType = MessageType.EditCookieItem;
  return sendMessage<typeof sendType>({
    payload,
    type: sendType,
  });
}
