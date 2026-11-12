import type { Metadata } from "next";
import { GalleryClient } from "./GalleryClient";

export const metadata: Metadata = {
  title: "Component gallery | QuestHire",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
