 "use client";

import { useMemo, useState } from "react";
import {
  Activity, BookOpen, Bot, Calculator, ChevronRight, CircuitBoard, Cpu, Download,
  FileSearch, FileText, Gauge, History, Home, Menu, Search, Send, Settings,
  ShieldCheck, Zap, Wrench, X, Database, ExternalLink, AlertTriangle, Cable,
  Component, CircleHelp, Sparkles, ArrowRight, RotateCcw
} from "lucide-react";

type Tab = "dashboard" | "manual" | "doctor" | "tools" | "components" | "library" | "history";
const nav: { id: Tab; label: string; icon: any }[] = [
  { id: "dashboard", label: "Beranda", icon: Home },
  { id: "manual", label: "Pencari Manual", icon: FileSearch },
  { id: "doctor", label: "Dokter AI", icon: Bot },
  { id: "tools", label: "Kalkulator Elektronika", icon: Calculator },
  { id: "components", label: "Ensiklopedia Komponen", icon: Cpu },
  { id: "library", label: "Pustaka Teknik", icon: BookOpen },
  { id: "history", label: "Riwayat Perbaikan", icon: History }
];

const componentsData = [
  { name: "Resistor", category: "Komponen pasif", desc: "Membatasi arus dan membagi tegangan dalam rangkaian.", test: "Ukur resistansi saat komponen dilepas dari rangkaian. Bandingkan dengan kode warna atau marking.", symbol: "R" },
  { name: "Kapasitor", category: "Komponen pasif", desc: "Menyimpan energi listrik sementara dan membantu penyaringan tegangan.", test: "Buang muatan dengan prosedur aman, lalu ukur kapasitansi/ESR menggunakan alat yang sesuai.", symbol: "C" },
  { name: "Dioda", category: "Semikonduktor", desc: "Mengalirkan arus terutama ke satu arah dan digunakan untuk penyearah/proteksi.", test: "Gunakan mode diode multimeter. Periksa tegangan maju dan kondisi open/short.", symbol: "D" },
  { name: "Transistor BJT", category: "Semikonduktor", desc: "Komponen penguat atau sakelar elektronik dengan terminal basis, kolektor, dan emitor.", test: "Periksa sambungan basis-emitor dan basis-kolektor memakai mode diode.", symbol: "Q" },
  { name: "MOSFET", category: "Semikonduktor", desc: "Sakelar elektronik yang dikendalikan tegangan pada terminal gate.", test: "Identifikasi pin dari datasheet. Periksa short drain-source dan kondisi gate.", symbol: "Q" },
  { name: "Relay", category: "Elektromekanis", desc: "Sakelar yang kontaknya digerakkan oleh kumparan elektromagnetik.", test: "Ukur resistansi coil dan uji kontinuitas kontak dalam kondisi tidak bertegangan.", symbol: "K" },
  { name: "Regulator tegangan", category: "IC", desc: "Menjaga tegangan keluaran pada nilai tertentu untuk menyuplai rangkaian.", test: "Ukur input, output, dan ground saat rangkaian bekerja sesuai prosedur servis.", symbol: "U" },
  { name: "Optocoupler", category: "Isolasi", desc: "Meneruskan sinyal menggunakan cahaya sambil memberikan isolasi listrik.", test: "Periksa LED internal pada sisi input dan respons transistor/fotodetektor.", symbol: "U" }
];

const manualSources = [
  { title: "Internet Archive — koleksi manual", detail: "Repositori arsip digital; ketersediaan dan hak unduh bergantung pada item.", url: "https://archive.org/search?query=arcade+machine+service+manual", type: "Repositori" },
  { title: "ManualsLib — arcade", detail: "Kumpulan manual perangkat dan mesin; periksa izin dan ketentuan setiap dokumen.", url: "https://www.manualslib.com/", type: "Katalog manual" },
  { title: "Sega — situs resmi", detail: "Sumber resmi untuk informasi dan dukungan produk Sega.", url: "https://www.sega.com/", type: "Produsen" },
  { title: "Namco / Bandai Namco", detail: "Informasi perusahaan dan produk Bandai Namco.", url: "https://www.bandainamcoent.com/", type: "Produsen" },
  { title: "DigiKey — pencarian datasheet", detail: "Referensi komponen elektronik dan tautan datasheet dari produsen.", url: "https://www.digikey.com/en/resources/datasheets", type: "Datasheet" },
  { title: "AllDatasheet", detail: "Mesin pencari datasheet komponen elektronik.", url: "https://www.alldatasheet.com/", type: "Datasheet" }
];

function formatOhms(n: number) {
  if (!Number.isFinite(n)) return "—";
  if (n >= 1_000_000) return `${Number((n / 1_000_000).toPrecision(4))} MΩ`;
  if (n >= 1_000) return `${Number((n / 1_000).toPrecision(4))} kΩ`;
  return `${Number(n.toPrecision(4))} Ω`;
}

export default function Page() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [manualQuery, setManualQuery] = useState("");
  const [manualResults, setManualResults] = useState<any[]>(manualSources);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualNotice, setManualNotice] = useState("");
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<{role:"user"|"assistant";content:string}[]>([
    { role: "assistant", content: "Halo! Saya Dokter AI Arcade. Ceritakan gejala kerusakan mesin arcade, merek/model, dan hasil pengukuran yang sudah dilakukan. Saya akan membantu menyusun pemeriksaan secara bertahap." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [searchComponent, setSearchComponent] = useState("");
  const [band1, setBand1] = useState("cokelat");
  const [band2, setBand2] = useState("hitam");
  const [multiplier, setMultiplier] = useState("merah");
  const [tolerance, setTolerance] = useState("emas");
  const [voltage, setVoltage] = useState("12");
  const [resistance, setResistance] = useState("1000");
  const [toolMode, setToolMode] = useState<"resistor"|"ohm">("resistor");
  const [history, setHistory] = useState<string[]>([]);

  const colorBands: Record<string, number> = { hitam:0, cokelat:1, merah:2, jingga:3, kuning:4, hijau:5, biru:6, ungu:7, abuabu:8, putih:9 };
  const multipliers: Record<string, number> = { perak:.01, emas:.1, hitam:1, cokelat:10, merah:100, jingga:1000, kuning:10000, hijau:100000, biru:1000000, ungu:10000000 };
  const resistorValue = (colorBands[band1] * 10 + colorBands[band2]) * multipliers[multiplier];
  const ohmCurrent = Number(voltage) / Number(resistance);
  const filteredComponents = useMemo(() => componentsData.filter(c => (c.name + c.category + c.desc).toLowerCase().includes(searchComponent.toLowerCase())), [searchComponent]);

  async function searchManual() {
    const q = manualQuery.trim();
    if (!q) { setManualNotice("Masukkan nama atau model mesin terlebih dahulu."); return; }
    setManualLoading(true); setManualNotice("");
    try {
      const response = await fetch(`/api/manuals?q=${encodeURIComponent(q)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Pencarian gagal.");
      setManualResults(data.results || []);
      setManualNotice(data.message || (data.results?.length ? "Hasil pencarian ditemukan." : "Belum ada hasil. Coba kata kunci lain."));
    } catch {
      setManualResults(manualSources);
      setManualNotice("Pencarian web belum terhubung. Ditampilkan sumber referensi awal. Atur TAVILY_API_KEY untuk mengaktifkan pencarian web.");
    } finally { setManualLoading(false); }
  }

  async function sendQuestion() {
    const q = question.trim();
    if (!q || chatLoading) return;
    const next = [...chat, { role: "user" as const, content: q }];
    setChat(next); setQuestion(""); setChatLoading(true);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(-12) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI belum tersedia.");
      setChat([...next, { role: "assistant", content: data.answer }]);
      setHistory(h => [q, ...h].slice(0, 20));
    } catch {
      setChat([...next, { role: "assistant", content: "Koneksi AI belum aktif. Tambahkan OPENAI_API_KEY pada Environment Variables Vercel atau file .env.local. Sementara itu, periksa hal dasar berikut: pastikan mesin dimatikan sebelum pemeriksaan kontinuitas, cek konektor dan sekring, ukur tegangan keluaran catu daya sesuai label/manual, lalu catat hasilnya. Jangan menyentuh bagian tegangan tinggi saat mesin menyala." }]);
    } finally { setChatLoading(false); }
  }

  const title = nav.find(n => n.id === tab)?.label || "Beranda";

  return (
    <div className="app-shell">
      <div className="flex min-h-screen">
        <aside className={`${mobileMenu ? "fixed inset-y-0 left-0 z-50 flex" : "hidden"} sidebar w-[268px] shrink-0 flex-col p-5 lg:flex`}>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal/15 text-teal"><Wrench size={24}/></div>
              <div><div className="font-display text-lg font-bold tracking-wide">ARCADE <span className="text-teal">DOCTORS</span></div><div className="text-[10px] tracking-[.2em] text-slate-500">PUSAT DIAGNOSTIK ARCADE</div></div>
            </div>
            <button className="text-slate-400 lg:hidden" onClick={() => setMobileMenu(false)}><X/></button>
          </div>
          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-slate-600">Menu Utama</div>
          <nav className="space-y-1">
            {nav.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => {setTab(item.id);setMobileMenu(false);}} className={`nav-item ${tab===item.id?"active":""}`}><Icon size={18}/><span className="text-sm font-medium">{item.label}</span>{tab===item.id && <ChevronRight size={15} className="ml-auto"/>}</button>; })}
          </nav>
          <div className="mt-auto">
            <div className="rounded-2xl border border-teal/20 bg-teal/[.06] p-4">
              <div className="mb-2 flex items-center gap-2 text-teal"><ShieldCheck size={17}/><span className="text-xs font-bold">Ruang Kerja Teknisi</span></div>
              <p className="text-xs leading-5 text-slate-400">Satu tempat untuk mencari manual, memahami komponen, dan menganalisis kerusakan.</p>
            </div>
            <div className="mt-5 flex items-center gap-2 px-2 text-[11px] text-slate-600"><span className="h-2 w-2 rounded-full bg-emerald-400"/><span>Arcade Doctors v1.0</span><span className="ml-auto">ID</span></div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-800/80 bg-[#08111f]/90 px-5 backdrop-blur-xl md:px-8">
            <div className="flex items-center gap-3">
              <button className="text-slate-300 lg:hidden" onClick={() => setMobileMenu(true)}><Menu/></button>
              <div><div className="text-xs text-slate-500">Arcade Doctors / <span className="text-teal">{title}</span></div><h1 className="font-display text-lg font-semibold">{title}</h1></div>
            </div>
            <div className="hidden items-center gap-3 sm:flex"><span className="tag">Sistem teknisi</span><div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-bold text-teal">AD</div></div>
          </header>

          <div className="mx-auto max-w-[1450px] p-5 md:p-8">
            {tab === "dashboard" && <Dashboard setTab={setTab}/>}
            {tab === "manual" && <section>
              <SectionTitle eyebrow="PUSAT DOKUMENTASI" title="Pencari Manual Mesin Arcade" desc="Temukan manual servis, panduan pengguna, diagram kabel, dan referensi teknis mesin arcade."/>
              <div className="panel mt-6 p-5 md:p-7">
                <div className="mb-3 flex items-center gap-2 text-teal"><Search size={18}/><span className="text-sm font-semibold">Cari dokumen teknis</span></div>
                <div className="flex flex-col gap-3 sm:flex-row"><input className="input flex-1" value={manualQuery} onChange={e=>setManualQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&searchManual()} placeholder="Contoh: Sega UFO Catcher service manual..."/><button className="btn-primary flex items-center justify-center gap-2" onClick={searchManual} disabled={manualLoading}>{manualLoading?"Mencari...":<><Search size={17}/> Cari Manual</>}</button></div>
                <div className="mt-3 flex flex-wrap gap-2">{["Sega arcade","Namco","Andamiro","ICE Games","Raw Thrills","Coin acceptor"].map(x=><button key={x} className="btn-secondary !px-3 !py-1.5 text-xs" onClick={()=>setManualQuery(x)}>{x}</button>)}</div>
                {manualNotice && <p className="mt-4 text-xs text-amber-300">{manualNotice}</p>}
              </div>
              <div className="mt-7 flex items-center justify-between"><div><h3 className="font-display text-lg font-semibold">Sumber dan hasil pencarian</h3><p className="muted mt-1 text-xs">Pastikan izin penggunaan dokumen sebelum mengunduh atau membagikannya.</p></div><span className="tag">{manualResults.length} sumber</span></div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">{manualResults.map((r:any,i:number)=><div className="panel flex gap-4 p-4" key={i}><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-300"><FileText/></div><div className="min-w-0 flex-1"><div className="mb-1 flex flex-wrap items-center gap-2"><span className="text-sm font-semibold">{r.title}</span><span className="tag">{r.type || "Web"}</span></div><p className="mb-3 text-xs leading-5 text-slate-400">{r.detail || r.content || "Buka sumber untuk melihat dokumen dan ketersediaan unduhan."}</p><a className="inline-flex items-center gap-2 text-xs font-semibold text-teal hover:underline" href={r.url} target="_blank" rel="noreferrer">Buka sumber <ExternalLink size={13}/></a></div></div>)}</div>
              <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/[.06] p-4 text-xs leading-5 text-amber-100/80"><AlertTriangle className="mb-2 inline mr-2" size={15}/>Unduhan langsung hanya tersedia jika pemilik dokumen atau repositori mengizinkannya. Versi awal ini menampilkan tautan sumber; bukan menyalin file dari situs pihak ketiga.</div>
            </section>}

            {tab === "doctor" && <section>
              <SectionTitle eyebrow="ASISTEN DIAGNOSTIK" title="Konsultasi Dokter AI" desc="Jelaskan gejala kerusakan. Sertakan merek mesin, model, kondisi awal, dan hasil pengukuran agar diagnosis lebih terarah."/>
              <div className="panel mt-6 flex min-h-[590px] flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-700/70 p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal"><Bot/></div><div><div className="text-sm font-semibold">Dokter AI Arcade</div><div className="flex items-center gap-1 text-[11px] text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/> Siap menerima konsultasi</div></div></div><span className="tag">Asisten teknis</span></div>
                <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">{chat.map((m,i)=><div key={i} className={`flex gap-3 ${m.role==="user"?"justify-end":""}`}>{m.role==="assistant"&&<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal"><Bot size={17}/></div>}<div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl p-4 text-sm leading-6 ${m.role==="user"?"rounded-tr-sm bg-teal text-[#06201f]":"rounded-tl-sm bg-[#1a2a40] text-slate-200"}`}>{m.content}</div>{m.role==="user"&&<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-xs font-bold">AD</div>}</div>)}{chatLoading&&<div className="text-xs text-teal">Dokter AI sedang menganalisis...</div>}</div>
                <div className="border-t border-slate-700/70 p-4"><div className="mb-3 flex flex-wrap gap-2">{["Mesin hidup tetapi layar gelap","Koin tidak terbaca","Motor tidak bergerak","Power supply bermasalah"].map(x=><button key={x} className="btn-secondary !px-3 !py-1.5 text-[11px]" onClick={()=>setQuestion(x)}>{x}</button>)}</div><div className="flex gap-2"><textarea className="input min-h-[48px] resize-y" rows={2} value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendQuestion();}}} placeholder="Ceritakan masalah mesin arcade..."/><button className="btn-primary self-end !p-3" onClick={sendQuestion} disabled={chatLoading}><Send size={18}/></button></div><p className="mt-2 text-[10px] text-slate-500">AI dapat keliru. Verifikasi dengan service manual dan prosedur keselamatan. Jangan mengukur rangkaian bertegangan tinggi tanpa kompetensi dan alat pelindung yang sesuai.</p></div>
              </div>
            </section>}

            {tab === "tools" && <section>
              <SectionTitle eyebrow="ALAT BANTU TEKNISI" title="Kalkulator Elektronika" desc="Hitung nilai komponen dan parameter dasar rangkaian listrik secara cepat."/>
              <div className="mt-6 flex flex-wrap gap-2"><button className={toolMode==="resistor"?"btn-primary":"btn-secondary"} onClick={()=>setToolMode("resistor")}>Kode Warna Resistor</button><button className={toolMode==="ohm"?"btn-primary":"btn-secondary"} onClick={()=>setToolMode("ohm")}>Hukum Ohm</button></div>
              {toolMode==="resistor"?<div className="panel mt-4 p-5 md:p-7"><h3 className="font-display text-lg font-semibold">Kalkulator Resistor 4 Gelang</h3><p className="muted mt-1 text-xs">Pilih warna gelang untuk mengetahui nilai resistansi.</p><div className="my-7 flex items-center justify-center"><div className="relative flex h-16 w-64 items-center justify-center rounded-[30px] border border-amber-100/20 bg-gradient-to-b from-[#e8d1a0] via-[#b99562] to-[#80613d] shadow-xl"><div className="absolute left-[-25px] h-[2px] w-8 bg-slate-300"/><div className="absolute right-[-25px] h-[2px] w-8 bg-slate-300"/><div className="absolute left-[58px] h-16 w-3" style={{background:band1==="cokelat"?"#8b4513":band1}}/><div className="absolute left-[91px] h-16 w-3" style={{background:band2==="cokelat"?"#8b4513":band2}}/><div className="absolute left-[139px] h-16 w-3" style={{background:multiplier==="cokelat"?"#8b4513":multiplier}}/><div className="absolute right-[27px] h-16 w-3" style={{background:tolerance==="emas"?"#d4af37":tolerance==="perak"?"#c0c0c0":tolerance==="cokelat"?"#8b4513":"#b22222"}}/></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Gelang 1",band1,setBand1],["Gelang 2",band2,setBand2],["Pengali",multiplier,setMultiplier]].map(([label,val,set]:any)=><label key={label} className="text-xs text-slate-400">{label}<select className="input mt-2" value={val} onChange={e=>set(e.target.value)}>{(label==="Pengali"?["perak","emas","hitam","cokelat","merah","jingga","kuning","hijau","biru","ungu"]:Object.keys(colorBands)).map((c:string)=><option key={c} value={c}>{c[0].toUpperCase()+c.slice(1)}</option>)}</select></label>)}<label className="text-xs text-slate-400">Toleransi<select className="input mt-2" value={tolerance} onChange={e=>setTolerance(e.target.value)}><option value="emas">Emas ±5%</option><option value="perak">Perak ±10%</option><option value="cokelat">Cokelat ±1%</option><option value="merah">Merah ±2%</option></select></label></div><div className="mt-6 rounded-2xl border border-teal/20 bg-teal/[.07] p-5"><div className="text-xs text-teal">NILAI RESISTANSI</div><div className="font-display mt-1 text-3xl font-bold text-white">{formatOhms(resistorValue)}</div><p className="mt-1 text-xs text-slate-400">Toleransi {tolerance==="emas"?"±5%":tolerance==="perak"?"±10%":tolerance==="cokelat"?"±1%":"±2%"}</p></div></div>
              :<div className="panel mt-4 p-5 md:p-7"><h3 className="font-display text-lg font-semibold">Kalkulator Hukum Ohm</h3><p className="muted mt-1 text-xs">Masukkan tegangan dan resistansi untuk menghitung arus serta daya.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-xs text-slate-400">Tegangan (Volt)<input className="input mt-2" type="number" min="0" value={voltage} onChange={e=>setVoltage(e.target.value)}/></label><label className="text-xs text-slate-400">Resistansi (Ohm)<input className="input mt-2" type="number" min="0.0001" value={resistance} onChange={e=>setResistance(e.target.value)}/></label></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><Result label="Arus" value={Number.isFinite(ohmCurrent)?`${(ohmCurrent*1000).toFixed(3)} mA`:"—"}/><Result label="Daya" value={Number.isFinite(ohmCurrent)?`${(Number(voltage)*ohmCurrent).toFixed(4)} W`:"—"}/><Result label="Resistansi" value={`${Number(resistance)||0} Ω`}/></div><p className="mt-4 text-xs text-slate-500">Rumus: I = V / R dan P = V × I. Pastikan satuan input benar.</p></div>}
            </section>}

            {tab === "components" && <section><SectionTitle eyebrow="REFERENSI ELEKTRONIKA" title="Ensiklopedia Komponen" desc="Kenali fungsi, karakteristik, dan cara pemeriksaan komponen yang sering ditemukan pada PCB mesin arcade."/><div className="panel mt-6 p-4"><div className="relative"><Search className="absolute left-3 top-3 text-slate-500" size={17}/><input className="input pl-10" value={searchComponent} onChange={e=>setSearchComponent(e.target.value)} placeholder="Cari resistor, MOSFET, relay, kapasitor..."/></div></div><div className="mt-4 grid gap-3 md:grid-cols-2">{filteredComponents.map(c=><div key={c.name} className="panel p-5"><div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 font-display text-lg font-bold text-blue-300">{c.symbol}</div><span className="tag">{c.category}</span></div><h3 className="mt-4 font-display text-lg font-semibold">{c.name}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{c.desc}</p><div className="mt-4 rounded-xl bg-[#0a1626] p-3"><div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-teal">Cara pemeriksaan awal</div><p className="text-xs leading-5 text-slate-300">{c.test}</p></div></div>)}</div>{filteredComponents.length===0&&<p className="muted p-8 text-center">Komponen tidak ditemukan.</p>}<p className="mt-5 text-[11px] text-slate-500">Informasi ini merupakan ringkasan edukasi. Selalu cocokkan pinout, rating, dan prosedur pengujian dengan datasheet nomor part yang tepat.</p></section>}

            {tab === "library" && <section><SectionTitle eyebrow="PUSAT PEMBELAJARAN" title="Pustaka Teknik" desc="Kumpulan topik dasar untuk membantu proses diagnosis dan perawatan mesin arcade."/><div className="mt-6 grid gap-3 md:grid-cols-2">{[{icon:Zap,title:"Dasar kelistrikan",desc:"Tegangan, arus, resistansi, daya, AC dan DC."},{icon:CircuitBoard,title:"Membaca PCB",desc:"Mengenali jalur, konektor, komponen, dan titik ukur."},{icon:Gauge,title:"Penggunaan multimeter",desc:"Pengukuran tegangan, resistansi, kontinuitas, dan diode."},{icon:Cable,title:"Wiring dan konektor",desc:"Membaca diagram pengawatan dan pemeriksaan koneksi."},{icon:Activity,title:"Catu daya",desc:"Pemeriksaan output power supply dan gejala proteksi."},{icon:Wrench,title:"Perawatan arcade",desc:"Pemeriksaan berkala, kebersihan, dan dokumentasi servis."}].map((x:any)=><div className="panel flex gap-4 p-5" key={x.title}><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal"><x.icon/></div><div><h3 className="font-semibold">{x.title}</h3><p className="muted mt-2 text-xs leading-5">{x.desc}</p></div></div>)}</div></section>}

            {tab === "history" && <section><SectionTitle eyebrow="CATATAN TEKNISI" title="Riwayat Perbaikan" desc="Daftar pertanyaan yang dikirim ke Dokter AI pada sesi browser ini."/><div className="panel mt-6 p-5">{history.length===0?<div className="py-12 text-center"><History className="mx-auto mb-3 text-slate-600" size={35}/><p className="font-semibold">Belum ada riwayat</p><p className="muted mt-1 text-xs">Mulai konsultasi melalui menu Dokter AI.</p><button className="btn-primary mt-4" onClick={()=>setTab("doctor")}>Mulai konsultasi</button></div>:<div className="space-y-3">{history.map((h,i)=><div className="flex items-center justify-between gap-3 rounded-xl bg-[#0a1626] p-4" key={i}><div className="flex items-center gap-3"><div className="rounded-lg bg-teal/10 p-2 text-teal"><Wrench size={17}/></div><p className="text-sm">{h}</p></div><span className="text-[10px] text-slate-500">Sesi ini</span></div>)}</div>}</div></section>}
            <footer className="mt-12 border-t border-slate-800 pt-5 text-center text-[11px] text-slate-600">© {new Date().getFullYear()} Arcade Doctors · Dibuat untuk komunitas teknisi arcade dan elektronika.</footer>
          </div>
        </main>
      </div>
    </div>
  );
}

function SectionTitle({eyebrow,title,desc}:{eyebrow:string;title:string;desc:string}) {
  return <div><div className="mb-2 text-[10px] font-bold tracking-[.22em] text-teal">{eyebrow}</div><h2 className="font-display text-2xl font-bold md:text-3xl">{title}</h2><p className="muted mt-2 max-w-2xl text-sm leading-6">{desc}</p></div>;
}
function Result({label,value}:{label:string;value:string}) { return <div className="stat-card p-4"><div className="text-xs text-slate-500">{label}</div><div className="mt-2 font-display text-xl font-bold text-teal">{value}</div></div>; }

function Dashboard({setTab}:{setTab:(t:Tab)=>void}) {
  const cards = [
    {title:"Pencari Manual",desc:"Temukan dokumentasi mesin arcade.",icon:FileSearch,tab:"manual" as Tab,number:"01"},
    {title:"Dokter AI",desc:"Konsultasi dan analisis kerusakan.",icon:Bot,tab:"doctor" as Tab,number:"02"},
    {title:"Kalkulator Elektronika",desc:"Hitung nilai komponen dan rangkaian.",icon:Calculator,tab:"tools" as Tab,number:"03"},
    {title:"Ensiklopedia Komponen",desc:"Pelajari fungsi dan cara pengujian.",icon:Cpu,tab:"components" as Tab,number:"04"}
  ];
  return <section>
    <div className="relative overflow-hidden rounded-3xl border border-teal/20 bg-gradient-to-br from-[#123344] via-[#10283a] to-[#111d31] p-6 md:p-9">
      <div className="absolute -right-12 -top-20 h-72 w-72 rounded-full border-[35px] border-teal/[.06]"/><div className="absolute right-16 top-12 h-32 w-32 rounded-full border border-teal/10"/>
      <div className="relative max-w-2xl"><span className="tag">PLATFORM TEKNIS BERBASIS AI</span><h2 className="font-display mt-5 text-3xl font-bold leading-tight md:text-5xl">Solusi Cerdas untuk <span className="text-teal">Mesin Arcade</span></h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">Cari manual servis, pelajari komponen elektronika, hitung parameter rangkaian, dan konsultasikan masalah mesin arcade dalam satu tempat.</p><button onClick={()=>setTab("doctor")} className="btn-primary mt-6 inline-flex items-center gap-2">Konsultasi dengan Dokter AI <ArrowRight size={16}/></button></div>
      <div className="pointer-events-none absolute bottom-0 right-4 hidden opacity-20 md:block"><CircuitBoard size={230} strokeWidth={.7}/></div>
    </div>
    <div className="mt-7 flex items-end justify-between"><div><div className="text-[10px] font-bold tracking-[.2em] text-teal">PUSAT KENDALI TEKNISI</div><h3 className="font-display mt-1 text-xl font-bold">Apa yang ingin kamu lakukan?</h3></div><span className="hidden text-xs text-slate-500 sm:block">Pilih modul untuk memulai</span></div>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(c=><button key={c.tab} onClick={()=>setTab(c.tab)} className="panel group p-5 text-left transition hover:-translate-y-1 hover:border-teal/50"><div className="flex items-start justify-between"><div className="rounded-xl bg-teal/10 p-3 text-teal"><c.icon size={22}/></div><span className="font-display text-xs text-slate-600">{c.number}</span></div><h4 className="mt-5 font-display font-semibold group-hover:text-teal">{c.title}</h4><p className="muted mt-2 text-xs leading-5">{c.desc}</p><div className="mt-5 flex items-center gap-2 text-xs font-semibold text-teal">Buka modul <ChevronRight size={14}/></div></button>)}</div>
    <div className="mt-7 grid gap-4 lg:grid-cols-3"><div className="panel p-5 lg:col-span-2"><div className="flex items-center gap-2 text-teal"><Sparkles size={17}/><span className="text-xs font-bold">SARAN DOKTER ARCADE</span></div><h3 className="mt-3 font-display text-lg font-semibold">Mulai diagnosis dari gejala yang paling jelas</h3><p className="muted mt-2 text-sm leading-6">Catat kondisi mesin, indikator LED, suara, kode error, dan tegangan catu daya. Informasi yang terukur membantu mempersempit kemungkinan kerusakan.</p><button onClick={()=>setTab("doctor")} className="btn-secondary mt-4 inline-flex items-center gap-2 text-xs">Buka konsultasi <ArrowRight size={14}/></button></div><div className="stat-card p-5"><div className="flex items-center gap-2 text-teal"><ShieldCheck size={17}/><span className="text-xs font-bold">KESELAMATAN</span></div><p className="mt-3 text-sm font-semibold">Utamakan prosedur servis aman</p><p className="muted mt-2 text-xs leading-5">Putuskan sumber daya sebelum pemeriksaan fisik. Waspadai kapasitor bermuatan dan bagian tegangan tinggi.</p></div></div>
  </section>;
}
