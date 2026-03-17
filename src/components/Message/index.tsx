'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import MessageComponent from './Message';
import { MessageType, MessageInstance } from './types';

// ========== 全局免 Provider 的 Message ==========

let messageCounter = 0;
const messages: Map<number, { container: HTMLElement; root: ReturnType<typeof createRoot> }> = new Map();

// 创建消息容器
const createMessageContainer = (): HTMLElement => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '20px';
  container.style.left = '50%';
  container.style.transform = 'translateX(-50%)';
  container.style.zIndex = '1050';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);
  return container;
};

// 移除消息
const removeMessage = (id: number) => {
  const messageData = messages.get(id);
  if (messageData) {
    const { container, root } = messageData;
    root.unmount();
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    messages.delete(id);
  }
};

// 添加消息
const addMessage = (type: MessageType, content: ReactNode, duration = 3000) => {
  const id = ++messageCounter;
  const container = createMessageContainer();
  const root = createRoot(container);

  const handleClose = () => {
    removeMessage(id);
  };

  root.render(
    <MessageComponent
      type={type}
      content={content}
      duration={duration}
      onClose={handleClose}
    />
  );

  messages.set(id, { container, root });

  // 自动关闭
  const timer = setTimeout(() => {
    removeMessage(id);
  }, duration);

  return {
    close: () => {
      clearTimeout(timer);
      removeMessage(id);
    }
  };
};

/**
 * 全局 message 实例 - 无需 MessageProvider 即可使用
 * @example
 * import { message } from '@zjpcy/simple-design';
 * message.success('操作成功');
 */
export const message: MessageInstance = {
  success: (content, duration) => { addMessage('success', content, duration); },
  warning: (content, duration) => { addMessage('warning', content, duration); },
  error: (content, duration) => { addMessage('error', content, duration); },
  info: (content, duration) => { addMessage('info', content, duration); },
  close: () => {
    messages.forEach((_, id) => removeMessage(id));
  }
};
// ========== 全局免 Provider 的 Message 结束 ==========

// ========== 兼容旧的 Provider 模式（可选） ==========
interface MessageContextType {
  message: MessageInstance | null;
}

const MessageContext = createContext<MessageContextType>({ message: null });

export interface MessageProviderProps {
  children: ReactNode;
}

/**
 * @deprecated 现在可以直接使用全局 message，无需 Provider
 */
export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [messageList, setMessageList] = useState<Array<{ id: number; type: MessageType; content: ReactNode; duration?: number }>>([]);
  const [counter, setCounter] = useState(0);

  const addProviderMessage = useCallback((type: MessageType, content: ReactNode, duration = 3000) => {
    const id = counter;
    setCounter((prev) => prev + 1);

    setMessageList((prev) => [...prev, { id, type, content, duration }]);

    const timer = setTimeout(() => {
      removeProviderMessage(id);
    }, duration);

    const removeProviderMessage = (messageId: number) => {
      setMessageList((prev) => prev.filter((msg) => msg.id !== messageId));
    };

    return {
      close: () => {
        clearTimeout(timer);
        removeProviderMessage(id);
      }
    };
  }, [counter]);

  const providerMessage: MessageInstance = {
    success: (content, duration) => addProviderMessage('success', content, duration),
    warning: (content, duration) => addProviderMessage('warning', content, duration),
    error: (content, duration) => addProviderMessage('error', content, duration),
    info: (content, duration) => addProviderMessage('info', content, duration),
    close: () => setMessageList([])
  };

  return (
    <MessageContext.Provider value={{ message: providerMessage }}>
      {children}
      {messageList.map((msg) => (
        <MessageComponent
          key={msg.id}
          type={msg.type}
          content={msg.content}
          duration={msg.duration}
          onClose={() => setMessageList((prev) => prev.filter((m) => m.id !== msg.id))}
        />
      ))}
    </MessageContext.Provider>
  );
};

/**
 * @deprecated 现在可以直接使用全局 message，无需 useMessage
 * @example
 * import { message } from '@zjpcy/simple-design';
 * message.success('操作成功');
 */
export const useMessage = (): MessageInstance => {
  const context = useContext(MessageContext);
  if (!context?.message) {
    // 返回全局 message，不再报错
    return message;
  }
  return context.message;
};
// ========== 兼容旧的 Provider 模式结束 ==========

export default MessageComponent;
