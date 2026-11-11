import { ImageResponse } from "next/og";
import { OG_IMAGE } from "@/lib/meta";
import SocialCard from "@/components/layout/SocialCard";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<SocialCard />, { width: OG_IMAGE.width, height: OG_IMAGE.height });
}
