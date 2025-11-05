import { render, screen } from "@testing-library/react";
import { it, expect, describe } from "vitest";
import { TabLabel } from "./TabLabel";

describe("TabLabel", () => {
  it("renders icon and label correctly", () => {
    render(<TabLabel icon="👤" label="Owner" />);

    expect(screen.getByText("👤")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
  });

  it("applies correct font sizes", () => {
    render(<TabLabel icon="📅" label="Start" />);

    const icon = screen.getByText("📅");
    const label = screen.getByText("Start");

    expect(icon).toHaveStyle("font-size: 16px");
    expect(label).toHaveStyle("font-size: 10px");
  });
});
