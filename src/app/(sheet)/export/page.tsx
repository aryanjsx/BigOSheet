import Export from "@/components/interactive/Export";
import PageHeader from "@/components/layout/PageHeader";
import PrintCards from "@/components/layout/PrintCards";
import { pageMeta } from "@/lib/meta";
import { asset } from "@/lib/utils";

export const metadata = pageMeta(
  "Export and share",
  "Copy the Big O tables as Markdown, download them as CSV, print compact topic cards, or download the full and one-page PDFs.",
  "export/",
);

export default function ExportPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="Export and share"
        lede="Take the sheet with you. Copy a Markdown table, download a CSV, or print compact cards for the topics you choose."
      />
      <div className="page-body">
        <Export />
        <h2>PDFs</h2>
        <p>
          The full sheet and the one-page revision sheet, ready to print. They are regenerated when the tables change.
        </p>
        <div className="viz-buttons">
          <a className="btn" href={asset("/Big-O-Sheet.pdf")} download>
            Download full PDF
          </a>
          <a className="btn" href={asset("/Big-O-Sheet-one-page.pdf")} download>
            Download one-page PDF
          </a>
        </div>
      </div>
      <PrintCards />
    </>
  );
}
