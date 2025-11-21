import type { ReactNode } from "react";

export type ResizePanelProps = {
  readonly width: string;
  readonly children: ReactNode;
};

export function ResizePanel({ width, children }: ResizePanelProps) {
  return (
    <div
      style={{
        width,
        minWidth: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

