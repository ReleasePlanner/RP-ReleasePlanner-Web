import { render, screen } from "@testing-library/react";
import { it, expect, describe } from "vitest";
import { DataItem } from "./DataItem";

describe("DataItem", () => {
  it("renders label and value correctly", () => {
    render(<DataItem label="Owner" value="Alice" />);

    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("applies correct typography styles", () => {
    render(<DataItem label="Test Label" value="Test Value" />);

    const label = screen.getByText("Test Label");
    const value = screen.getByText("Test Value");

    expect(label).toHaveClass("MuiTypography-body2");
    expect(value).toHaveClass("MuiTypography-h6");
  });
});
