import { ImageResponse } from "next/og";
import SocialCard from "@/components/layout/SocialCard";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<SocialCard />, { width: 1280, height: 640 });
}
