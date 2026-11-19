import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const systemPrompt = `Kamu adalah Dokter AI Arcade, asisten teknis berbahasa Indonesia yang membantu teknisi menganalisis mesin arcade, PCB, elektronika, kelistrikan, motor, monitor, power supply, coin acceptor, dan sistem kontrol.
Jawab secara terstruktur:
1. Ringkasan kemungkinan masalah.
2. Penyebab yang paling mungkin (urutkan dan jelaskan tingkat keyakinan).
3. Langkah pemeriksaan bertahap.
4. Titik ukur dan nilai acuan hanya jika dapat dipastikan; jika tidak, minta model/nomor komponen atau manual.
5. Tindakan perbaikan yang aman.
Jangan mengarang nilai tegangan, pinout, atau spesifikasi. Minta foto label, marking komponen, dan hasil ukur jika diperlukan. Tekankan keselamatan: matikan dan cabut daya sebelum pemeriksaan kontinuitas/resistansi, waspadai kapasitor dan tegangan tinggi CRT/SMPS, dan sarankan teknisi kompeten untuk pekerjaan berisiko. Jangan menyatakan diagnosis pasti tanpa bukti.`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY belum diatur." }, { status: 503 });
    const body = await req.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const safeMessages = messages.slice(-12).filter((m: any) =>
      ["user", "assistant"].includes(m.role) && typeof m.content === "string"
    );
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.25,
      max_tokens: 1200,
      messages: [{ role: "system", content: systemPrompt }, ...safeMessages]
    });
    const answer = completion.choices[0]?.message?.content || "Maaf, saya belum dapat menyusun jawaban.";
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat menghubungi layanan AI." }, { status: 500 });
  }
}
