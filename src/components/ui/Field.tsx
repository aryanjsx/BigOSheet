/** A labelled control in the `.pg-controls` toolbar style. */
export default function Field({
  label,
  htmlFor,
  hidden,
  children,
}: {
  label: string;
  htmlFor: string;
  hidden?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="pg-field" style={hidden ? { display: "none" } : undefined}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}
