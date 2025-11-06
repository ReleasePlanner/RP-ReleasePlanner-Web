import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect } from "vitest";
import CommonDataCard from "./CommonDataCardMaterial";

it("renders tabs with owner, start date, end date, and id", () => {
  render(
    <CommonDataCard
      owner="Alice"
      startDate="2025-01-01"
      endDate="2025-01-31"
      id="p1"
    />
  );

  // Check that tabs container exists
  expect(screen.getByRole("tablist")).toBeInTheDocument();

  // Check that all tab buttons are present
  expect(screen.getByRole("tab", { name: /owner/i })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /start/i })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /end/i })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /id/i })).toBeInTheDocument();

  // Check that the first tab content (Owner) is visible by default
  expect(screen.getByText("Alice")).toBeInTheDocument();

  // Click on Start tab and check its content
  fireEvent.click(screen.getByRole("tab", { name: /start/i }));
  expect(screen.getByText("2025-01-01")).toBeInTheDocument();

  // Click on End tab and check its content
  fireEvent.click(screen.getByRole("tab", { name: /end/i }));
  expect(screen.getByText("2025-01-31")).toBeInTheDocument();

  // Click on ID tab and check its content
  fireEvent.click(screen.getByRole("tab", { name: /id/i }));
  expect(screen.getByText("p1")).toBeInTheDocument();
});
