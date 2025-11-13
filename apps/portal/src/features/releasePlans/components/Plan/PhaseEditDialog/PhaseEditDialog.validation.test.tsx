import { render, screen } from "@testing-library/react";
import PhaseEditDialog from "./PhaseEditDialog";

it("disables Save when end < start and shows helper text", () => {
  const onSave = vi.fn();
  const onCancel = vi.fn();
  const onStartChange = vi.fn();
  const onEndChange = vi.fn();
  const onColorChange = vi.fn();

  render(
    <PhaseEditDialog
      open
      start="2025-02-10"
      end="2025-02-01"
      color="#217346"
      onStartChange={onStartChange}
      onEndChange={onEndChange}
      onColorChange={onColorChange}
      onCancel={onCancel}
      onSave={onSave}
    />
  );

  expect(
    screen.getByText(/End must be after or equal to Start/i)
  ).toBeInTheDocument();
  const saveBtn = screen.getByRole("button", { name: /save/i });
  expect(saveBtn).toBeDisabled();
});
