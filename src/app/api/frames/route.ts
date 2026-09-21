import { NextResponse } from "next/server";

const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL;

const frames = [
  {
    id: "budi",
    name: "Budi",
    key: "frames/budi.png",
  },
  {
    id: "windut",
    name: "Windut",
    key: "frames/windut.png",
  },
  {
    id: "zootopia",
    name: "Zootopia",
    key: "frames/zootopia.png",
  },
];

export async function GET() {
  const result = frames.map((frame) => ({
    ...frame,
    imageUrl: `${R2_PUBLIC_URL}/${frame.key}`,
  }));

  return NextResponse.json({
    message: "Daftar frame berhasil diambil",
    frames: result,
  });
}