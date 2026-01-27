import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calculator } from "../../../src/features/calculator";

describe("Calculator", () => {
  it("renders calculator with display and keypad", () => {
    render(<Calculator />);

    expect(
      screen.getByRole("application", { name: "Calculator" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("0");
  });

  it("displays digits when clicked", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText("5"));

    expect(screen.getByRole("status")).toHaveTextContent("5");
  });

  it("calculates 5 + 3 = 8", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText("5"));
    await user.click(screen.getByLabelText("Add"));
    await user.click(screen.getByLabelText("3"));
    await user.click(screen.getByLabelText("Equals"));

    expect(screen.getByRole("status")).toHaveTextContent("8");
  });

  it("calculates 10 - 4 = 6", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText("1"));
    await user.click(screen.getByLabelText("0"));
    await user.click(screen.getByLabelText("Subtract"));
    await user.click(screen.getByLabelText("4"));
    await user.click(screen.getByLabelText("Equals"));

    expect(screen.getByRole("status")).toHaveTextContent("6");
  });

  it("calculates 6 × 7 = 42", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText("6"));
    await user.click(screen.getByLabelText("Multiply"));
    await user.click(screen.getByLabelText("7"));
    await user.click(screen.getByLabelText("Equals"));

    expect(screen.getByRole("status")).toHaveTextContent("42");
  });

  it("calculates 20 ÷ 4 = 5", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText("2"));
    await user.click(screen.getByLabelText("0"));
    await user.click(screen.getByLabelText("Divide"));
    await user.click(screen.getByLabelText("4"));
    await user.click(screen.getByLabelText("Equals"));

    expect(screen.getByRole("status")).toHaveTextContent("5");
  });

  it("shows error for division by zero", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText("5"));
    await user.click(screen.getByLabelText("Divide"));
    await user.click(screen.getByLabelText("0"));
    await user.click(screen.getByLabelText("Equals"));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Cannot divide by zero",
    );
  });

  it("clears display with AC button", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText("5"));
    await user.click(screen.getByLabelText("Add"));
    await user.click(screen.getByLabelText("3"));
    await user.click(screen.getByLabelText("Clear all"));

    expect(screen.getByRole("status")).toHaveTextContent("0");
  });

  it("toggles sign with ± button", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText("5"));
    await user.click(screen.getByLabelText("Toggle sign"));

    expect(screen.getByRole("status")).toHaveTextContent("-5");
  });

  it("calculates percentage with % button", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText("5"));
    await user.click(screen.getByLabelText("0"));
    await user.click(screen.getByLabelText("Percent"));

    expect(screen.getByRole("status")).toHaveTextContent("0.5");
  });

  it("handles decimal point input", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText("3"));
    await user.click(screen.getByLabelText("Decimal point"));
    await user.click(screen.getByLabelText("1"));
    await user.click(screen.getByLabelText("4"));

    expect(screen.getByRole("status")).toHaveTextContent("3.14");
  });

  it("handles keyboard input for digits", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.keyboard("123");

    expect(screen.getByRole("status")).toHaveTextContent("123");
  });

  it("handles keyboard input for calculation", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.keyboard("5+3{Enter}");

    expect(screen.getByRole("status")).toHaveTextContent("8");
  });

  it("handles keyboard Escape to clear", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.keyboard("123{Escape}");

    expect(screen.getByRole("status")).toHaveTextContent("0");
  });

  it("handles keyboard Backspace", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.keyboard("123{Backspace}");

    expect(screen.getByRole("status")).toHaveTextContent("12");
  });

  it("handles floating-point precision (0.1 + 0.2 = 0.3)", async () => {
    render(<Calculator />);
    const user = userEvent.setup();

    await user.keyboard("0.1+0.2{Enter}");

    expect(screen.getByRole("status")).toHaveTextContent("0.3");
  });

  it("has accessible buttons with aria-labels", () => {
    render(<Calculator />);

    // Check all digit buttons
    for (let i = 0; i <= 9; i++) {
      expect(screen.getByLabelText(String(i))).toBeInTheDocument();
    }

    // Check operator buttons
    expect(screen.getByLabelText("Add")).toBeInTheDocument();
    expect(screen.getByLabelText("Subtract")).toBeInTheDocument();
    expect(screen.getByLabelText("Multiply")).toBeInTheDocument();
    expect(screen.getByLabelText("Divide")).toBeInTheDocument();

    // Check function buttons
    expect(screen.getByLabelText("Clear all")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle sign")).toBeInTheDocument();
    expect(screen.getByLabelText("Percent")).toBeInTheDocument();
    expect(screen.getByLabelText("Equals")).toBeInTheDocument();
    expect(screen.getByLabelText("Decimal point")).toBeInTheDocument();
  });

  it("has accessible display regions", () => {
    render(<Calculator />);

    expect(
      screen.getByRole("region", { name: "Calculator display" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Calculator keypad" }),
    ).toBeInTheDocument();
  });
});
