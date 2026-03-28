import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Lists all .png files in public/3dviewer/ so the client can build the tattoo picker
 * without hardcoding filenames (add/remove files on disk → refetch to update).
 */
export async function GET() {
  const dir = path.join(process.cwd(), "public", "3dviewer");
  let files: string[] = [];
  try {
    if (fs.existsSync(dir)) {
      files = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isFile() && /\.png$/i.test(d.name))
        .map((d) => d.name)
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    }
  } catch {
    files = [];
  }

  const urls = files.map((f) => `/3dviewer/${encodeURIComponent(f)}`);
  return NextResponse.json({ urls });
}
