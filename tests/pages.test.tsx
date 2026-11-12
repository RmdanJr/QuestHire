import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import GalleryPage, { metadata } from "@/app/gallery/page";

describe("landing page", () => {
  it("shows the product name and a way into the library", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: "The Crypt of the Hiring Manager" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Enter the library" })).toHaveAttribute(
      "href",
      "/gallery",
    );
  });

  it("marks the main landmark as the skip-link target", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
  });

  it("explains what each meter means", () => {
    render(<Home />);
    for (const name of ["Candles", "Hourglass", "Moon"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
  });
});

describe("gallery page", () => {
  it("has a descriptive title", () => {
    expect(metadata.title).toBe("Component gallery | QuestHire");
  });

  it("snuffs a candle on a wrong answer and relights them", async () => {
    const user = userEvent.setup();
    render(<GalleryPage />);
    const hp = () => screen.getByRole("meter", { name: "Your hit points" });
    expect(hp()).toHaveAttribute("value", "5");

    await user.click(screen.getByRole("button", { name: "Wrong answer" }));
    expect(hp()).toHaveAttribute("value", "4");

    await user.click(screen.getByRole("button", { name: "Relight" }));
    expect(hp()).toHaveAttribute("value", "5");
  });

  it("never lets HP go below zero", async () => {
    const user = userEvent.setup();
    render(<GalleryPage />);
    for (let i = 0; i < 8; i++) {
      await user.click(screen.getByRole("button", { name: "Wrong answer" }));
    }
    expect(screen.getByRole("meter", { name: "Your hit points" })).toHaveAttribute("value", "0");
  });

  it("fills the moon as rooms are cleared and caps at 100", async () => {
    const user = userEvent.setup();
    render(<GalleryPage />);
    const moon = () => screen.getByRole("meter", { name: "Readiness" });
    expect(moon()).toHaveAttribute("value", "35");

    await user.click(screen.getByRole("button", { name: "Clear a room" }));
    expect(moon()).toHaveAttribute("value", "50");

    for (let i = 0; i < 6; i++) {
      await user.click(screen.getByRole("button", { name: "Clear a room" }));
    }
    expect(moon()).toHaveAttribute("value", "100");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(moon()).toHaveAttribute("value", "0");
  });

  it("opens and closes the lore scroll", async () => {
    const user = userEvent.setup();
    render(<GalleryPage />);
    await user.click(screen.getByRole("button", { name: "Unroll scroll" }));
    expect(await screen.findByRole("dialog", { name: "Caching, in one scroll" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close scroll" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
