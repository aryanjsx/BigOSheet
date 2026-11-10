export const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })
    : "";
