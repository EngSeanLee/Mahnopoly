export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      commit:
        process.env.VERCEL_GIT_COMMIT_SHA ||
        process.env.NEXT_DEPLOYMENT_ID ||
        null,
      deployment: process.env.VERCEL_DEPLOYMENT_ID || null,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
