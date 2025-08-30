import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  const response = await fetch(url);
  const blob = await response.blob();
  const headers = new Headers();
  headers.set("Content-Type", blob.type);
  headers.set(
    "Content-Disposition",
    `attachment; filename="${url.split("/").pop()}"`
  );

  return new NextResponse(blob, { headers });
}
