export default async function UserPage({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const { user } = await params;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Send Anonymous Message</h1>

      <h2>Douglas</h2>

      <p>This page belongs to Douglas</p>
    </div>
  );
}