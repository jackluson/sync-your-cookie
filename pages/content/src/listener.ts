import { Message, MessageType, SendResponse } from '@sync-your-cookie/shared';
import EventEmitter from 'eventemitter3';

declare global {
  interface Window {
    $messageListener: MessageListener;
  }
}


/**
 * 消息监听器类
 * 基于发布订阅模式，集中管理消息处理
 */
export class MessageListener {
  // 声明一个事件发射器
  private emitter: EventEmitter;
  // 声明一个单例实例
  private static instance: MessageListener;
  // 声明一个调试器开关
  public debuggerOpen = true;

  private timer: number | null = null;

  constructor() {
    // 初始化事件发射器
    this.emitter = new EventEmitter();
    // 初始化
    this.init();
  }

  /**
   * 获取单例实例
   * @returns {MessageListener} 单例实例
   */
  public static getInstance(): MessageListener {
    // 如果单例实例不存在，则创建一个新的实例
    if (!MessageListener.instance) {
      MessageListener.instance = new MessageListener();
    }
    // 返回单例实例
    return MessageListener.instance;
  }

  // 处理消息
  handleMessage = (message: Message, sender: chrome.runtime.MessageSender, sendResponse: (response?: SendResponse) => void) => {
    // 打印消息类型
    console.log("message-->", message);
    if(message.toString() === 'ping') {
      this.listen();
    }
    // 如果消息类型为获取本地存储
    if (message.type === MessageType.GetLocalStorage) {
      // 发射消息
      this.emit(MessageType.GetLocalStorage, message.payload, sendResponse);
      // console.log('拦截到 XHR 响应:', message.data);
      // sendResponse({});
      // 如果消息类型为设置本地存储
    } else if (message.type === MessageType.SetLocalStorage) {
      this.emit(MessageType.SetLocalStorage, message.payload, sendResponse);
    }
    return true; // keep the channel open
  }

  private init(): void {
    // 此处不能使用 async 函数
    this.listen();
    // this.ping();
    // chrome.runtime.onConnect.addListener(port => {
    //   console.log('connected ', port);
    //   if (port.name === 'hi') {
    //     port.onMessage.addListener((evt) => {
    //       console.log("evt", evt)
    //     });
    //   }
    // });
    // window.removeEventListener("load", this.listen);
    // window.addEventListener("load", this.listen);
    console.log('chrome', chrome, chrome.tabs)

    // var port = chrome.runtime.connect(null as any, { name: 'hi' });
    // console.log("port", port);
    // port.onDisconnect.addListener(obj => {
    //   console.log('disconnected port');
    // })
  }

  public ping = () => {
    chrome.runtime.sendMessage('ping', response => {
      setTimeout(this.ping, 1000);
      console.log('pong', response);
      // if (chrome.runtime.lastError) {
      // } else {
      //   // Do whatever you want, background script is ready now
      // }
    });
  }

  public listen = () => {
    if(this.timer) {
      clearTimeout(this.timer);
    }
    const fn = this.handleMessage;
    chrome.runtime.onMessage.removeListener(fn);
    chrome.runtime.onMessage.addListener(fn);
    console.log('listener init')
    this.timer = setTimeout(() => {
      this.listen();
    }, 6000)
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
   * @param {(...args: any[]) => void} sendResponse 回调函数
   */
  async emit(event: string, data: any, sendResponse?: (...args: any[]) => void): Promise<void> {
    console.log("data", data);
    return new Promise((resolve, reject) => {
      try {
        if (sendResponse) {
          this.emitter.emit(event, data, (message: any) => {
            if (sendResponse) {
              sendResponse(message);
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
window.$messageListener = messageListener
