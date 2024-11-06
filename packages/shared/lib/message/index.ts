export enum MessageType {
  PushCookie = 'PushCookie',
  PullCookie = 'PullCookie',
  RemoveCookie = 'RemoveCookie',
}

export enum MessageErrorCode {
  AccountCheck = 'AccountCheck',
  CloudflareNotFoundRoute = 'CloudflareNotFoundRoute',
}

export type PushCookieMessagePayload = {
  domain: string;
};

export type RemoveCookieMessagePayload = {
  domain: string;
};

export type PullCookieMessagePayload = {
  domain: string;
  activeTabUrl: string;
  reload: boolean;
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

export function sendMessage<T extends MessageType>(message: Message<T>) {
  return new Promise<SendResponse>((resolve, reject) => {
    chrome.runtime.sendMessage(message, function (result: SendResponse) {
      console.log('result->', result);
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
