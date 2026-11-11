import { ImageResponse } from "next/og";
import BrandIcon from "@/components/layout/BrandIcon";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<BrandIcon />, { width: 180, height: 180 });
}
