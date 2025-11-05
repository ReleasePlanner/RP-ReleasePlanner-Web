import { renderHook, act } from "@testing-library/react";
import { it, expect, describe } from "vitest";
import { useTabState } from "./useTabState";

describe("useTabState", () => {
  it("initializes with default value", () => {
    const { result } = renderHook(() => useTabState());

    expect(result.current.activeTab).toBe(0);
  });

  it("initializes with custom value", () => {
    const { result } = renderHook(() => useTabState(2));

    expect(result.current.activeTab).toBe(2);
  });

  it("handles tab change correctly", () => {
    const { result } = renderHook(() => useTabState());

    act(() => {
      result.current.handleTabChange({} as React.SyntheticEvent, 3);
    });

    expect(result.current.activeTab).toBe(3);
  });
});
