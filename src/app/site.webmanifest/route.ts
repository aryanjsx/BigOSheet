import { asset } from "@/lib/utils";

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    name: "BigOSheet",
    short_name: "BigOSheet",
    description: "A Big O cheat sheet for time and space complexity of data structures and algorithms.",
    start_url: asset("/"),
    display: "standalone",
    background_color: "#12151a",
    theme_color: "#12151a",
    icons: [
      { src: asset("/icon.png"), sizes: "32x32", type: "image/png", purpose: "any" },
      { src: asset("/icon.svg"), sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  });
}
