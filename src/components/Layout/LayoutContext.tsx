import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  // Sider 收缩状态
  siderCollapsed: boolean;
  setSiderCollapsed: (collapsed: boolean) => void;
  // 是否为零宽度模式
  zeroWidthMode: boolean;
  setZeroWidthMode: (mode: boolean) => void;
  // 展开回调
  onExpand: () => void;
  setOnExpand: (fn: () => void) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [siderCollapsed, setSiderCollapsed] = useState(false);
  const [zeroWidthMode, setZeroWidthMode] = useState(false);
  const [onExpand, setOnExpand] = useState<() => void>(() => () => {});

  return (
    <LayoutContext.Provider
      value={{
        siderCollapsed,
        setSiderCollapsed,
        zeroWidthMode,
        setZeroWidthMode,
        onExpand,
        setOnExpand,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return context;
};

export { LayoutContext };
