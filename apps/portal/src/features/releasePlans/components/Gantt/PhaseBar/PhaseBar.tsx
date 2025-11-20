import Tooltip from "@mui/material/Tooltip";
import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";

type PhaseBarProps = {
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  label?: string;
  title?: string;
  ariaLabel?: string;
  tooltipContent?: ReactNode;
  onStartMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onStartResizeLeft?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onStartResizeRight?: (e: React.MouseEvent<HTMLDivElement>) => void;
  testIdSuffix?: string;
  onDoubleClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function PhaseBar({
  left,
  top,
  width,
  height,
  color,
  label,
  title,
  ariaLabel,
  tooltipContent,
  onStartMove,
  onStartResizeLeft,
  onStartResizeRight,
  testIdSuffix,
  onDoubleClick,
}: PhaseBarProps) {
  const hasTooltip = tooltipContent || title;
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);
  const DOUBLE_CLICK_THRESHOLD = 300; // Maximum time between clicks for double click (ms)
  const DRAG_START_DELAY = 100; // Delay before starting drag (ms)
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, handler?: (e: React.MouseEvent<HTMLDivElement>) => void) => {
    e.stopPropagation();
    
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    
    // Clear any pending drag start
    if (dragStartTimeoutRef.current) {
      clearTimeout(dragStartTimeoutRef.current);
      dragStartTimeoutRef.current = null;
    }
    
    // Check if this is a double click (manual detection for faster response)
    if (timeSinceLastClick < DOUBLE_CLICK_THRESHOLD && clickCountRef.current === 1) {
      // This is a double click - execute immediately
      clickCountRef.current = 0;
      lastClickTimeRef.current = 0;
      
      // Cancel any active drag immediately
      isDraggingRef.current = false;
      setIsDragging(false);
      
      e.preventDefault();
      e.stopPropagation();
      
      // Execute double click handler immediately - no delay
      if (onDoubleClick) {
        onDoubleClick(e);
      }
      return;
    }
    
    // Single click - increment counter
    clickCountRef.current = 1;
    lastClickTimeRef.current = now;
    
    // Reset click count after threshold
    setTimeout(() => {
      if (clickCountRef.current === 1) {
        clickCountRef.current = 0;
      }
    }, DOUBLE_CLICK_THRESHOLD);
    
    // Start drag after a short delay (reduced for better responsiveness)
    if (handler) {
      dragStartTimeoutRef.current = setTimeout(() => {
        // Only start drag if still a single click (not cancelled by double click)
        if (clickCountRef.current === 1 && !isDraggingRef.current) {
          e.preventDefault(); // Prevent text selection
          isDraggingRef.current = true;
          setIsDragging(true);
          handler(e);
        }
      }, DRAG_START_DELAY);
    }
  };
  
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Cancel any pending drag start immediately
    if (dragStartTimeoutRef.current) {
      clearTimeout(dragStartTimeoutRef.current);
      dragStartTimeoutRef.current = null;
    }
    
    // Reset click tracking
    clickCountRef.current = 0;
    lastClickTimeRef.current = 0;
    
    // Cancel any active drag
    isDraggingRef.current = false;
    setIsDragging(false);
    
    e.stopPropagation();
    e.preventDefault();
    
    // Execute double click handler immediately - no delay
    if (onDoubleClick) {
      onDoubleClick(e);
    }
  };

  const handleMouseUp = () => {
    // Reset dragging state on mouse up
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dragStartTimeoutRef.current) {
        clearTimeout(dragStartTimeoutRef.current);
      }
    };
  }, []);
  

  // Add global mouseup listener to reset dragging state
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };
    
    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp, { passive: true });
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);
  
  return (
    <div
      className="absolute"
      style={{ 
        left, 
        top, 
        width, 
        height,
        zIndex: 10,
        pointerEvents: "auto",
        willChange: isDragging ? "transform" : "auto",
        transform: isDragging ? "translateZ(0)" : "none",
        backfaceVisibility: "hidden",
      }}
      aria-label={ariaLabel}
      onDoubleClick={handleDoubleClick}
      onMouseUp={handleMouseUp}
    >
      <Tooltip 
        title={hasTooltip && !isDragging ? (tooltipContent ?? title ?? "") : ""} 
        placement="top" 
        arrow
        enterDelay={500}
        leaveDelay={200}
        disableInteractive={false}
        disableHoverListener={isDragging}
        disableFocusListener={isDragging}
        disableTouchListener={isDragging}
        PopperProps={{
          style: { zIndex: 1500 },
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
          ],
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
        <div
          className="h-full rounded-md opacity-75 shadow-sm"
          style={{ backgroundColor: color }}
        />
        {label && (
          <div className="absolute left-1 top-1 text-[11px] text-white/95 font-medium mix-blend-luminosity truncate pr-1 pointer-events-none">
            {label}
          </div>
        )}
        <div
          data-testid={
            testIdSuffix ? `phasebar-resize-left-${testIdSuffix}` : undefined
          }
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: 8,
            height: "100%",
            cursor: "ew-resize",
            zIndex: 11,
            pointerEvents: "auto",
            backgroundColor: "transparent",
            transition: "background-color 0.15s ease",
          }}
          onMouseDown={(e) => handleMouseDown(e, onStartResizeLeft)}
          onMouseEnter={(e) => {
            if (e.currentTarget) {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            }
          }}
          onMouseLeave={(e) => {
            if (e.currentTarget) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
          title="Drag to resize start date"
        />
        <div
          data-testid={
            testIdSuffix ? `phasebar-move-${testIdSuffix}` : undefined
          }
          className="absolute"
          style={{ 
            left: 8, 
            right: 8, 
            top: 0, 
            height: "100%", 
            cursor: isDragging ? "grabbing" : "grab",
            zIndex: 11,
            userSelect: "none",
            pointerEvents: "auto",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleMouseDown(e, onStartMove);
          }}
          onDoubleClick={handleDoubleClick}
        />
        <div
          data-testid={
            testIdSuffix ? `phasebar-resize-right-${testIdSuffix}` : undefined
          }
          className="absolute"
          style={{
            right: 0,
            top: 0,
            width: 8,
            height: "100%",
            cursor: "ew-resize",
            zIndex: 11,
            pointerEvents: "auto",
            backgroundColor: "transparent",
            transition: "background-color 0.15s ease",
          }}
          onMouseDown={(e) => handleMouseDown(e, onStartResizeRight)}
          onMouseEnter={(e) => {
            if (e.currentTarget) {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            }
          }}
          onMouseLeave={(e) => {
            if (e.currentTarget) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
          title="Drag to resize end date"
        />
        </div>
      </Tooltip>
    </div>
  );
}
