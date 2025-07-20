import { LocalStorageMessageType } from '@sync-your-cookie/shared';
import EventEmitter from 'eventemitter3';

/**
 * 消息监听器类
 * 基于发布订阅模式，集中管理消息处理
 */
export class MessageListener {
  private emitter: EventEmitter;
  private static instance: MessageListener;
  public debuggerOpen = true;

  constructor() {
    this.emitter = new EventEmitter();
    this.init();
  }

  /**
   * 获取单例实例
   * @returns {MessageListener} 单例实例
   */
  public static getInstance(): MessageListener {
    if (!MessageListener.instance) {
      MessageListener.instance = new MessageListener();
    }
    return MessageListener.instance;
  }

  private init(): void {
    // 此处不能使用 async 函数
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === LocalStorageMessageType.GetLocalStorage) {
          // console.log('拦截到 XHR 响应:', message.data);
          this.emit(LocalStorageMessageType.GetLocalStorage, message.data, sendResponse);
          sendResponse({});
        }
      return true; // keep the channel open
    });
  }

  /**
   * 监听消息
   * @param {string} event 消息类型
   * @param {(...args: any[]) => void} callback 回调函数
   */

  public on(event: string, callback: (...args: any[]) => void): void {
    this.emitter.on(event, callback);
  }

  /**
   * 取消监听消息
   * @param {string} event 消息类型
   * @param {(...args: any[]) => void} callback 回调函数
   */
  async emit(event: string, data: any, callback?: (...args: any[]) => void): Promise<void> {
    console.log("event", event);
    console.log("data", data);
    return new Promise((resolve, reject) => {
      try {
        if (callback) {
          this.emitter.emit(event, data, (message: any) => {
            if (callback) {
              callback(message);
            }
            resolve();
          });
        } else {
          this.emitter.emit(event, data);
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const messageListener = MessageListener.getInstance();
