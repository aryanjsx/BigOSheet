import { ImageResponse } from "next/og";
import BrandIcon from "@/components/layout/BrandIcon";

export const dynamic = "force-static";

export async function GET() {
  const png = new Uint8Array(await new ImageResponse(<BrandIcon />, { width: 32, height: 32 }).arrayBuffer());
  const icon = new Uint8Array(22 + png.length);
  const header = new DataView(icon.buffer);
  header.setUint16(2, 1, true);
  header.setUint16(4, 1, true);
  header.setUint8(6, 32);
  header.setUint8(7, 32);
  header.setUint16(10, 1, true);
  header.setUint16(12, 32, true);
  header.setUint32(14, png.length, true);
  header.setUint32(18, 22, true);
  icon.set(png, 22);

  return new Response(icon.buffer, { headers: { "Content-Type": "image/x-icon" } });
}
