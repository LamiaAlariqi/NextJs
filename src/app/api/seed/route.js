// Seed route disabled after successful database population
export async function GET() {
  return Response.json(
    { message: "Seed endpoint is disabled." },
    { status: 404 }
  );
}
