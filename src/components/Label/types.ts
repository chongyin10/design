import { CSSProperties, ReactNode } from "react";

export interface LabelProps {
  title?: ReactNode;
  indicatorColor?: string;
  indicatorWidth?: string | number;
  indicatorHeight?: string | number;
  paddingRight?: string | number;
  style?: CSSProperties;
  className?: string;
}
