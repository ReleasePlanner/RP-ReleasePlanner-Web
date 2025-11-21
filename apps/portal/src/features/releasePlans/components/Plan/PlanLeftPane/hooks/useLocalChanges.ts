import { useMemo } from "react";
import type { RefObject } from "react";

export function useLocalChanges(
  localName: string,
  localDescription: string,
  localStatus: string,
  localStartDate: string,
  localEndDate: string,
  localProductId: string | undefined,
  localItOwner: string | undefined,
  originalNameRef: RefObject<string>,
  originalDescriptionRef: RefObject<string>,
  originalStatusRef: RefObject<string>,
  originalStartDateRef: RefObject<string>,
  originalEndDateRef: RefObject<string>,
  originalProductIdRef: RefObject<string | undefined>,
  originalItOwnerRef: RefObject<string | undefined>
) {
  return useMemo(() => {
    return (
      localName !== originalNameRef.current ||
      localDescription !== originalDescriptionRef.current ||
      localStatus !== originalStatusRef.current ||
      localStartDate !== originalStartDateRef.current ||
      localEndDate !== originalEndDateRef.current ||
      localProductId !== originalProductIdRef.current ||
      localItOwner !== originalItOwnerRef.current
    );
  }, [
    localName,
    localDescription,
    localStatus,
    localStartDate,
    localEndDate,
    localProductId,
    localItOwner,
    originalNameRef,
    originalDescriptionRef,
    originalStatusRef,
    originalStartDateRef,
    originalEndDateRef,
    originalProductIdRef,
    originalItOwnerRef,
  ]);
}

