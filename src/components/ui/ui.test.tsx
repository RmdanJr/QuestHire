import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import {
  CandleHp,
  GrimoirePanel,
  Hourglass,
  MoonMeter,
  RuneButton,
  ScrollModal,
} from "./index";

describe("CandleHp", () => {
  it("exposes a meter with lit candles as the value", () => {
    render(<CandleHp current={3} max={5} label="Your hit points" />);
    const meter = screen.getByRole("meter", { name: "Your hit points" });
    expect(meter).toHaveAttribute("value", "3");
    expect(meter).toHaveAttribute("max", "5");
    expect(meter).toHaveAttribute("aria-valuetext", "3 of 5 candles lit");
  });

  it("clamps out-of-range HP", () => {
    render(<CandleHp current={99} max={4} />);
    expect(screen.getByRole("meter")).toHaveAttribute("value", "4");
  });

  it("renders one candle per max HP and marks lit ones", () => {
    const { container } = render(<CandleHp current={2} max={5} />);
    const candles = container.querySelectorAll("svg[data-lit]");
    expect(candles).toHaveLength(5);
    expect(container.querySelectorAll('svg[data-lit="true"]')).toHaveLength(2);
  });
});

describe("Hourglass", () => {
  it("announces days left", () => {
    render(<Hourglass daysLeft={6} totalDays={14} />);
    const meter = screen.getByRole("meter", { name: "Time until your interview" });
    expect(meter).toHaveAttribute("value", "6");
    expect(meter).toHaveAttribute("aria-valuetext", "6 days left");
  });

  it("uses the singular for one day", () => {
    render(<Hourglass daysLeft={1} totalDays={14} />);
    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuetext", "1 day left");
  });
});

describe("MoonMeter", () => {
  it("reports readiness and phase", () => {
    render(<MoonMeter value={50} />);
    const meter = screen.getByRole("meter", { name: "Readiness" });
    expect(meter).toHaveAttribute("value", "50");
    expect(meter).toHaveAttribute("aria-valuetext", "50 percent, first quarter");
  });

  it("clamps above 100", () => {
    render(<MoonMeter value={250} />);
    expect(screen.getByRole("meter")).toHaveAttribute("value", "100");
  });
});

describe("GrimoirePanel and RuneButton", () => {
  it("renders a titled section and footer", () => {
    render(
      <GrimoirePanel title="Lore" footer="Source: test">
        body
      </GrimoirePanel>,
    );
    expect(screen.getByRole("heading", { name: "Lore", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Source: test")).toBeInTheDocument();
  });

  it("defaults to type=button so it never submits a form by accident", () => {
    render(<RuneButton>Go</RuneButton>);
    expect(screen.getByRole("button", { name: "Go" })).toHaveAttribute("type", "button");
  });
});

function ModalHarness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <RuneButton onClick={() => setOpen(true)}>Open</RuneButton>
      <ScrollModal open={open} onClose={() => setOpen(false)} title="Scroll">
        Contents
      </ScrollModal>
    </>
  );
}

describe("ScrollModal", () => {
  it("opens with a labelled dialog and closes with the close button", async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    await user.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog", { name: "Scroll" });
    expect(dialog).toHaveAttribute("open");

    await user.click(screen.getByRole("button", { name: "Close scroll" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
