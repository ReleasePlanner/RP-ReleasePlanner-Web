import { useState, useEffect, useRef } from "react";
import type { PlanStatus } from "../../../../types";

export function useLocalState(
  name: string,
  description: string | undefined,
  status: PlanStatus,
  startDate: string,
  endDate: string,
  productId: string | undefined,
  itOwner: string | undefined
) {
  const [localName, setLocalName] = useState(name);
  const [localDescription, setLocalDescription] = useState(description || "");
  const [localStatus, setLocalStatus] = useState(status);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localProductId, setLocalProductId] = useState<string | undefined>(
    productId
  );
  const [localItOwner, setLocalItOwner] = useState<string | undefined>(itOwner);

  // Refs for original values
  const originalNameRef = useRef(name);
  const originalDescriptionRef = useRef(description || "");
  const originalStatusRef = useRef(status);
  const originalStartDateRef = useRef(startDate);
  const originalEndDateRef = useRef(endDate);
  const originalProductIdRef = useRef(productId);
  const originalItOwnerRef = useRef(itOwner);

  // Timeouts for debouncing text inputs
  const nameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const descriptionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startDateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const endDateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state when props change externally (e.g., after save)
  useEffect(() => {
    const newName = name;
    const newDescription = description || "";
    const newStatus = status;
    const newStartDate = startDate;
    const newEndDate = endDate;
    const newProductId = productId;
    const newItOwner = itOwner;

    setLocalName(newName);
    setLocalDescription(newDescription);
    setLocalStatus(newStatus);
    setLocalStartDate(newStartDate);
    setLocalEndDate(newEndDate);
    setLocalProductId(newProductId);
    setLocalItOwner(newItOwner);

    originalNameRef.current = newName;
    originalDescriptionRef.current = newDescription;
    originalStatusRef.current = newStatus;
    originalStartDateRef.current = newStartDate;
    originalEndDateRef.current = newEndDate;
    originalProductIdRef.current = newProductId;
    originalItOwnerRef.current = newItOwner;
  }, [name, description, status, startDate, endDate, productId, itOwner]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      [
        nameTimeoutRef,
        descriptionTimeoutRef,
        startDateTimeoutRef,
        endDateTimeoutRef,
      ].forEach((ref) => {
        if (ref.current) {
          clearTimeout(ref.current);
        }
      });
    };
  }, []);

  return {
    localName,
    setLocalName,
    localDescription,
    setLocalDescription,
    localStatus,
    setLocalStatus,
    localStartDate,
    setLocalStartDate,
    localEndDate,
    setLocalEndDate,
    localProductId,
    setLocalProductId,
    localItOwner,
    setLocalItOwner,
    nameTimeoutRef,
    descriptionTimeoutRef,
    startDateTimeoutRef,
    endDateTimeoutRef,
    originalNameRef,
    originalDescriptionRef,
    originalStatusRef,
    originalStartDateRef,
    originalEndDateRef,
    originalProductIdRef,
    originalItOwnerRef,
  };
}

