import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ error: "Kata kunci pencarian wajib diisi." }, { status: 400 });

  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      results: [],
      message: "Pencarian web belum aktif. Tambahkan TAVILY_API_KEY pada pengaturan lingkungan.",
      configured: false
    });
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: `${q} arcade machine service manual user manual PDF`,
        search_depth: "advanced",
        max_results: 10,
        include_answer: false
      }),
      cache: "no-store"
    });
    if (!response.ok) throw new Error("Penyedia pencarian mengembalikan kesalahan.");
    const data = await response.json();
    const results = (data.results || []).map((item: any) => ({
      title: item.title,
      detail: item.content,
      url: item.url,
      type: "Hasil web"
    }));
    return NextResponse.json({ results, message: `${results.length} hasil ditemukan. Periksa sumber dan izin unduh setiap dokumen.`, configured: true });
  } catch (error) {
    console.error("Manual search error:", error);
    return NextResponse.json({ error: "Pencarian dokumen gagal. Coba lagi nanti." }, { status: 502 });
  }
}
