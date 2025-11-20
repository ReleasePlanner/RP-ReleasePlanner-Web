import { useState, useEffect, useCallback, useRef, type RefObject } from "react";
import { PX_PER_DAY, TRACK_HEIGHT, LANE_GAP } from "../Gantt/constants";
import { laneTop } from "../Gantt/utils";

type DragState = {
  phaseId: string;
  phaseIdx: number;
  startIdx: number;
  currentIdx: number;
} | null;

type EditDragState = {
  phaseId: string;
  phaseIdx: number;
  mode: "move" | "resize-left" | "resize-right";
  anchorIdx: number;
  currentIdx: number;
  originalStartIdx: number;
  originalLen: number;
} | null;

type UseGanttDragAndDropProps = {
  days: Date[];
  pxPerDay: number;
  trackHeight: number;
  onPhaseRangeChange?: (
    phaseId: string,
    startDate: string,
    endDate: string
  ) => void;
  containerRef: RefObject<HTMLDivElement>;
  contentRef: RefObject<HTMLDivElement>;
};

export function useGanttDragAndDrop({
  days,
  pxPerDay,
  trackHeight,
  onPhaseRangeChange,
  containerRef,
  contentRef,
}: UseGanttDragAndDropProps) {
  const [drag, setDrag] = useState<DragState>(null);
  const [editDrag, setEditDrag] = useState<EditDragState>(null);
  
  // Use refs to store current drag state without causing re-renders
  const dragRef = useRef<DragState>(null);
  const editDragRef = useRef<EditDragState>(null);
  
  // Direct DOM manipulation for preview (no React re-renders)
  const previewElementRef = useRef<HTMLDivElement | null>(null);
  const previewInnerRef = useRef<HTMLDivElement | null>(null);
  const pxPerDayRef = useRef<number>(pxPerDay);
  const daysRef = useRef<Date[]>(days);
  
  // Update refs when props change
  useEffect(() => {
    pxPerDayRef.current = pxPerDay;
  }, [pxPerDay]);

  // Cache contentLeft to avoid repeated getBoundingClientRect calls
  const contentLeftRef = useRef<number>(0);
  const contentLeftCacheTimeRef = useRef<number>(0);
  const CACHE_DURATION = 50; // Cache for 50ms (reduced for better accuracy during drag)

  const clientXToDayIndex = useCallback(
    (clientX: number) => {
      const content = contentRef.current;
      if (!content) return 0;
      
      // Use cached value if recent
      const now = Date.now();
      if (now - contentLeftCacheTimeRef.current < CACHE_DURATION && contentLeftRef.current !== 0) {
        const x = clientX - contentLeftRef.current;
        const idx = Math.floor(x / pxPerDayRef.current);
        return Math.max(0, Math.min(days.length - 1, idx));
      }
      
      // Update cache
      contentLeftRef.current = content.getBoundingClientRect().left;
      contentLeftCacheTimeRef.current = now;
      const x = clientX - contentLeftRef.current;
      const idx = Math.floor(x / pxPerDayRef.current);
      return Math.max(0, Math.min(days.length - 1, idx));
    },
    [days.length, contentRef]
  );

  // Direct DOM update function - no React re-renders during drag
  // Optimized to batch style updates for better performance
  const updatePreviewDOM = useCallback((
    left: number,
    top: number,
    width: number,
    height: number
  ) => {
    const preview = previewElementRef.current;
    if (!preview) return;
    
    // Use direct style updates - browser optimizes these well
    // Batch updates by setting all properties
    preview.style.left = `${left}px`;
    preview.style.top = `${top}px`;
    preview.style.width = `${width}px`;
    preview.style.height = `${height}px`;
  }, []);

  // Update refs when props change
  useEffect(() => {
    daysRef.current = days;
  }, [days]);

  // Initialize preview element on mount - retry until container is found
  // This is critical for plans that are expanded (rendered inside Collapse)
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const initializePreview = (container: HTMLElement) => {
      // Don't initialize twice
      if (previewElementRef.current) return;
      
      // Ensure container has position relative
      if (getComputedStyle(container).position !== 'relative') {
        container.style.position = 'relative';
      }
      
      // Create preview element directly in DOM
      const preview = document.createElement('div');
      preview.setAttribute('data-preview', 'true');
      preview.style.cssText = `
        position: absolute;
        pointer-events: none;
        z-index: 6;
        will-change: left, top, width;
        transform: translateZ(0);
        backface-visibility: hidden;
        -webkit-font-smoothing: subpixel-antialiased;
        display: none;
      `;
      
      const previewInner = document.createElement('div');
      previewInner.style.cssText = `
        height: 100%;
        border-radius: 2px;
        border: 2px solid #217346;
        background-color: rgba(33, 115, 70, 0.1);
      `;
      
      preview.appendChild(previewInner);
      container.appendChild(preview);
      
      previewElementRef.current = preview;
      previewInnerRef.current = previewInner;
    };

    // Find the tracks container (where phase bars are rendered) - it has class "relative"
    let retryCount = 0;
    const MAX_RETRIES = 20; // Try for up to 1 second (20 * 50ms)
    
    const findAndInit = () => {
      const tracksContainer = content.querySelector('.relative') as HTMLElement;
      if (tracksContainer) {
        initializePreview(tracksContainer);
      } else if (retryCount < MAX_RETRIES) {
        retryCount++;
        // Retry after a short delay - important for Collapse animations
        setTimeout(findAndInit, 50);
      }
    };
    
    // Start immediately
    findAndInit();

    return () => {
      const preview = previewElementRef.current;
      if (preview && preview.parentNode) {
        preview.parentNode.removeChild(preview);
        previewElementRef.current = null;
        previewInnerRef.current = null;
      }
    };
  }, [contentRef]);

  useEffect(() => {
    // Sync refs with state
    dragRef.current = drag;
    editDragRef.current = editDrag;
    
    // Show/hide preview element based on state and update position immediately
    const preview = previewElementRef.current;
    if (preview) {
      if (drag || editDrag) {
        preview.style.display = 'block';
        
        // Update preview position immediately when drag starts
        if (editDrag) {
          const {
            mode,
            currentIdx,
            originalStartIdx,
            originalLen,
            phaseIdx,
            anchorIdx,
          } = editDrag;
          let newStartIdx = originalStartIdx;
          let newLen = originalLen;
          
          if (mode === "move") {
            const delta = currentIdx - anchorIdx;
            newStartIdx = Math.max(
              0,
              Math.min(daysRef.current.length - originalLen, originalStartIdx + delta)
            );
            newLen = originalLen;
          } else if (mode === "resize-left") {
            newStartIdx = Math.max(
              0,
              Math.min(originalStartIdx + originalLen - 1, currentIdx)
            );
            newLen = Math.max(1, originalStartIdx + originalLen - newStartIdx);
          } else if (mode === "resize-right") {
            // For resize-right: dragging right (currentIdx > anchorIdx) increases days, dragging left (currentIdx < anchorIdx) decreases days
            // anchorIdx is the right edge (originalStartIdx + originalLen - 1)
            // We want the end to be at currentIdx, so the length is currentIdx - originalStartIdx + 1
            const proposedEndIdx = Math.max(originalStartIdx, currentIdx);
            newLen = Math.max(
              1,
              Math.min(
                daysRef.current.length - originalStartIdx,
                proposedEndIdx - originalStartIdx + 1
              )
            );
          }
          
          const left = newStartIdx * pxPerDayRef.current;
          const width = newLen * pxPerDayRef.current;
          const top = laneTop(phaseIdx);
          
          updatePreviewDOM(left, top, width, trackHeight);
        } else if (drag) {
          const a = Math.min(drag.startIdx, drag.currentIdx);
          const b = Math.max(drag.startIdx, drag.currentIdx);
          const left = a * pxPerDayRef.current;
          const width = (b - a + 1) * pxPerDayRef.current;
          const top = laneTop(drag.phaseIdx);
          
          updatePreviewDOM(left, top, width, trackHeight);
        }
      } else {
        preview.style.display = 'none';
      }
    }
  }, [drag, editDrag, trackHeight, updatePreviewDOM]);

  useEffect(() => {
    // Only add listeners if there's an active drag
    if (!drag && !editDrag) {
      return;
    }
    
    let lastIdx = -1;
    let rafId: number | null = null;
    let lastClientX = -1;
    
    // Optimized day index calculation - avoid function call overhead
    const getDayIndexFast = (clientX: number): number => {
      const content = contentRef.current;
      if (!content) return 0;
      
      // Use cached value if recent
      const now = Date.now();
      if (now - contentLeftCacheTimeRef.current < CACHE_DURATION && contentLeftRef.current !== 0) {
        const x = clientX - contentLeftRef.current;
        const idx = Math.floor(x / pxPerDayRef.current);
        return Math.max(0, Math.min(daysRef.current.length - 1, idx));
      }
      
      // Update cache
      contentLeftRef.current = content.getBoundingClientRect().left;
      contentLeftCacheTimeRef.current = now;
      const x = clientX - contentLeftRef.current;
      const idx = Math.floor(x / pxPerDayRef.current);
      return Math.max(0, Math.min(daysRef.current.length - 1, idx));
    };
    
    function onMove(e: MouseEvent) {
      // Only process if there's an active drag
      if (!dragRef.current && !editDragRef.current) return;
      
      // Cancel previous frame if pending
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      
      // Use requestAnimationFrame for smooth updates
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const idx = getDayIndexFast(e.clientX);
        
        // Always update - don't skip even if index is the same (for smooth preview updates)
        lastIdx = idx;
        lastClientX = e.clientX;
        
        if (dragRef.current) {
          const drag = dragRef.current;
          if (idx !== drag.currentIdx) {
            drag.currentIdx = idx;
            
            // Update DOM directly - no React re-render
            const a = Math.min(drag.startIdx, drag.currentIdx);
            const b = Math.max(drag.startIdx, drag.currentIdx);
            const left = a * pxPerDayRef.current;
            const width = (b - a + 1) * pxPerDayRef.current;
            const top = laneTop(drag.phaseIdx);
            
            updatePreviewDOM(left, top, width, trackHeight);
          }
        }
        
        if (editDragRef.current) {
          const editDrag = editDragRef.current;
          // Always update currentIdx and preview to ensure smooth updates
          editDrag.currentIdx = idx;
          
          // Calculate preview position directly
          let newStartIdx = editDrag.originalStartIdx;
          let newLen = editDrag.originalLen;
          
          if (editDrag.mode === "move") {
            const delta = idx - editDrag.anchorIdx;
            newStartIdx = Math.max(
              0,
              Math.min(daysRef.current.length - editDrag.originalLen, editDrag.originalStartIdx + delta)
            );
            newLen = editDrag.originalLen;
          } else if (editDrag.mode === "resize-left") {
            // For resize-left: dragging left (idx < anchorIdx) increases days, dragging right (idx > anchorIdx) decreases days
            // anchorIdx is the left edge (originalStartIdx)
            // The new start is at idx, and the length adjusts accordingly
            newStartIdx = Math.max(
              0,
              Math.min(editDrag.originalStartIdx + editDrag.originalLen - 1, idx)
            );
            newLen = Math.max(1, editDrag.originalStartIdx + editDrag.originalLen - newStartIdx);
          } else if (editDrag.mode === "resize-right") {
            // For resize-right: dragging right (idx > anchorIdx) increases days, dragging left (idx < anchorIdx) decreases days
            // anchorIdx is the right edge (originalStartIdx + originalLen - 1)
            // The start stays the same, only the end (and length) changes
            // The end should be at idx (inclusive), so length = idx - originalStartIdx + 1
            const proposedEndIdx = Math.max(editDrag.originalStartIdx, idx);
            newLen = Math.max(
              1,
              Math.min(
                daysRef.current.length - editDrag.originalStartIdx,
                proposedEndIdx - editDrag.originalStartIdx + 1
              )
            );
            newStartIdx = editDrag.originalStartIdx; // Start doesn't change in resize-right
          }
          
          const left = newStartIdx * pxPerDayRef.current;
          const width = newLen * pxPerDayRef.current;
          const top = laneTop(editDrag.phaseIdx);
          
          updatePreviewDOM(left, top, width, trackHeight);
        }
      });
    }

    function onUp() {
      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      
      const currentDrag = dragRef.current;
      const currentEditDrag = editDragRef.current;
      
      // Hide preview immediately
      const preview = previewElementRef.current;
      if (preview) {
        preview.style.display = 'none';
      }
      
      if (currentDrag) {
        const a = Math.min(currentDrag.startIdx, currentDrag.currentIdx);
        const b = Math.max(currentDrag.startIdx, currentDrag.currentIdx);
        const s = days[a].toISOString().slice(0, 10);
        const e = days[b].toISOString().slice(0, 10);
        if (onPhaseRangeChange) {
          onPhaseRangeChange(currentDrag.phaseId, s, e);
        }
      }
      
      if (currentEditDrag) {
        const {
          mode,
          anchorIdx,
          currentIdx,
          originalStartIdx,
          originalLen,
          phaseId,
        } = currentEditDrag;
        let newStartIdx = originalStartIdx;
        let newLen = originalLen;
        if (mode === "move") {
          const delta = currentIdx - anchorIdx;
          newStartIdx = Math.max(
            0,
            Math.min(days.length - originalLen, originalStartIdx + delta)
          );
          newLen = originalLen;
        } else if (mode === "resize-left") {
          // For resize-left: dragging left (currentIdx < anchorIdx) increases days, dragging right (currentIdx > anchorIdx) decreases days
          // anchorIdx is the left edge (originalStartIdx)
          newStartIdx = Math.max(
            0,
            Math.min(originalStartIdx + originalLen - 1, currentIdx)
          );
          newLen = Math.max(1, originalStartIdx + originalLen - newStartIdx);
        } else if (mode === "resize-right") {
          // For resize-right: dragging right (currentIdx > anchorIdx) increases days, dragging left (currentIdx < anchorIdx) decreases days
          // anchorIdx is the right edge (originalStartIdx + originalLen - 1)
          // We want the end to be at currentIdx, so the length is currentIdx - originalStartIdx + 1
          // Ensure currentIdx is at least originalStartIdx to maintain minimum length of 1
          const proposedEndIdx = Math.max(originalStartIdx, currentIdx);
          newLen = Math.max(
            1,
            Math.min(
              days.length - originalStartIdx,
              proposedEndIdx - originalStartIdx + 1
            )
          );
        }
        const clampedStart = Math.max(
          0,
          Math.min(days.length - 1, newStartIdx)
        );
        const clampedEndIndex = Math.max(
          clampedStart,
          Math.min(days.length - 1, clampedStart + newLen)
        );
        const s = days[clampedStart]?.toISOString().slice(0, 10);
        const e = days[clampedEndIndex]?.toISOString().slice(0, 10);
        if (s && e && onPhaseRangeChange) onPhaseRangeChange(phaseId, s, e);
      }
      
      setDrag(null);
      setEditDrag(null);
      dragRef.current = null;
      editDragRef.current = null;
    }

    // Use passive listeners for better performance
    // Note: mousemove cannot be passive, but we handle it efficiently
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [drag, editDrag, days, onPhaseRangeChange, clientXToDayIndex, updatePreviewDOM, trackHeight]);

  return { drag, editDrag, setDrag, setEditDrag, clientXToDayIndex };
}
