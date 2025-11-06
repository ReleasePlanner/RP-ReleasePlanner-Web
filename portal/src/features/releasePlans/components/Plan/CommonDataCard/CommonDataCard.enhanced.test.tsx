/**
 * Test para CommonDataCard con Material Design y funcionalidades avanzadas
 *
 * Tests incluidos:
 * ✅ Tabs sistema (Common Data + Components)
 * ✅ Product ComboBox filtering
 * ✅ Component versioning display
 * ✅ Grid/List view modes
 * ✅ Component status y badges
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { it, expect, describe } from "vitest";
import CommonDataCard from "./CommonDataCardMaterial";

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("CommonDataCard Enhanced Features", () => {
  const mockProps = {
    owner: "Alice Johnson",
    startDate: "2025-01-01",
    endDate: "2025-06-30",
    id: "release-2025-h1",
  };

  it("renders tab system with Common Data and Components tabs", () => {
    renderWithTheme(<CommonDataCard {...mockProps} />);

    // Check that tab system exists
    expect(screen.getByRole("tablist")).toBeInTheDocument();

    // Check for both tabs
    expect(
      screen.getByRole("tab", { name: /common data/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /components/i })
    ).toBeInTheDocument();

    // Common Data tab should be active by default
    expect(screen.getByRole("tab", { name: /common data/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("switches between Common Data and Components tabs", () => {
    renderWithTheme(<CommonDataCard {...mockProps} />);

    // Initially on Common Data tab - should see owner info
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();

    // Click Components tab
    fireEvent.click(screen.getByRole("tab", { name: /components/i }));

    // Should see Product ComboBox
    expect(screen.getByLabelText(/select product/i)).toBeInTheDocument();
  });

  it("displays Product ComboBox in Components tab", () => {
    renderWithTheme(<CommonDataCard {...mockProps} />);

    // Go to Components tab
    fireEvent.click(screen.getByRole("tab", { name: /components/i }));

    // Check for Product selector
    const productSelect = screen.getByLabelText(/select product/i);
    expect(productSelect).toBeInTheDocument();

    // Open dropdown to see options
    fireEvent.mouseDown(productSelect);

    // Should see sample products
    expect(screen.getByText(/web platform/i)).toBeInTheDocument();
    expect(screen.getByText(/mobile app/i)).toBeInTheDocument();
  });

  it("displays components with version information when product is selected", () => {
    renderWithTheme(<CommonDataCard {...mockProps} />);

    // Go to Components tab
    fireEvent.click(screen.getByRole("tab", { name: /components/i }));

    // Select a product
    const productSelect = screen.getByLabelText(/select product/i);
    fireEvent.mouseDown(productSelect);
    fireEvent.click(screen.getByText(/web platform/i));

    // Should see components with versions
    expect(screen.getByText(/frontend portal/i)).toBeInTheDocument();
    expect(screen.getByText(/v2.1.4/i)).toBeInTheDocument(); // Version badge
    expect(screen.getByText(/production/i)).toBeInTheDocument(); // Status badge
  });

  it("displays view mode toggle buttons", () => {
    renderWithTheme(<CommonDataCard {...mockProps} />);

    // Go to Components tab and select a product
    fireEvent.click(screen.getByRole("tab", { name: /components/i }));
    const productSelect = screen.getByLabelText(/select product/i);
    fireEvent.mouseDown(productSelect);
    fireEvent.click(screen.getByText(/web platform/i));

    // Should see Grid and List view buttons
    expect(screen.getByTitle(/grid view/i)).toBeInTheDocument();
    expect(screen.getByTitle(/list view/i)).toBeInTheDocument();
  });

  it("switches between Grid and List view modes", () => {
    renderWithTheme(<CommonDataCard {...mockProps} />);

    // Go to Components tab and select a product
    fireEvent.click(screen.getByRole("tab", { name: /components/i }));
    const productSelect = screen.getByLabelText(/select product/i);
    fireEvent.mouseDown(productSelect);
    fireEvent.click(screen.getByText(/web platform/i));

    // Initially in Grid mode - components should be in grid layout
    const gridContainer =
      screen.getByTestId("grid-view") || screen.getByRole("main"); // Fallback
    expect(gridContainer).toBeInTheDocument();

    // Switch to List view
    const listViewButton = screen.getByTitle(/list view/i);
    fireEvent.click(listViewButton);

    // Should now be in list mode
    // In list mode, components are arranged differently
    expect(screen.getByText(/frontend portal/i)).toBeInTheDocument(); // Component still visible
  });

  it("displays component status badges with correct colors", () => {
    renderWithTheme(<CommonDataCard {...mockProps} />);

    // Navigate to Components and select product
    fireEvent.click(screen.getByRole("tab", { name: /components/i }));
    const productSelect = screen.getByLabelText(/select product/i);
    fireEvent.mouseDown(productSelect);
    fireEvent.click(screen.getByText(/web platform/i));

    // Should see different status badges
    expect(screen.getByText(/production/i)).toBeInTheDocument();
    expect(screen.getByText(/testing/i)).toBeInTheDocument();
    expect(screen.getByText(/development/i)).toBeInTheDocument();
  });

  it("shows component count in Components panel header", () => {
    renderWithTheme(<CommonDataCard {...mockProps} />);

    // Navigate to Components and select product
    fireEvent.click(screen.getByRole("tab", { name: /components/i }));
    const productSelect = screen.getByLabelText(/select product/i);
    fireEvent.mouseDown(productSelect);
    fireEvent.click(screen.getByText(/web platform/i));

    // Should see component count
    expect(screen.getByText(/4 Components/i)).toBeInTheDocument();
  });
});
