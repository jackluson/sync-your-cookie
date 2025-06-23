import { ICookie } from '@sync-your-cookie/protobuf';

export type { ICookie };
export enum MessageType {
  PushCookie = 'PushCookie',
  PullCookie = 'PullCookie',
  RemoveCookie = 'RemoveCookie',
  RemoveCookieItem = 'RemoveCookieItem',
  EditCookieItem = 'EditCookieItem',
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

export function sendMessage<T extends MessageType>(message: Message<T>, isTab = false) {
  if (isTab) {
    return new Promise<SendResponse>((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length === 0) {
          reject({ isOk: false, msg: 'No active tab found' } as SendResponse);
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
    chrome.runtime.sendMessage(message, function (result: SendResponse) {
      if (result?.isOk) {
        resolve(result);
      } else {
        reject(result as SendResponse);
      }
    });
  });
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
