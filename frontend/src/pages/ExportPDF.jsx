import { useEffect, useMemo, useState } from "react";

export default function ExportPDF() {
  const [data, setData] = useState({ title: "", contentHTML: "", createdAt: null });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("export_note"));
      if (saved) setData(saved);
    } catch {}
    // Set a print-friendly document title
    document.title = "EchoNote Export";
  }, []);

  const createdDisplay = useMemo(() => {
    if (!data?.createdAt) return "";
    try {
      const d = new Date(data.createdAt);
      return d.toLocaleString([], { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch { return ""; }
  }, [data]);

  const exportedDisplay = useMemo(() => {
    const d = new Date();
    return d.toLocaleString([], { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-200">
      {/* Local print styles specifically for export layout */}
      <style>{`
        /* Remove browser-added print header/footer (user must also disable in dialog) */
        @page { size: A4; margin: 0; }
        html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

        .pdf-container {
          background: #fff;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          margin-left: auto; margin-right: auto; margin-top: 3rem; margin-bottom: 3rem;
          overflow: hidden; position: relative; display: flex; flex-direction: column;
          width: 210mm; min-height: 297mm; padding: 30mm 25mm 35mm 25mm;
        }
        .content-text { font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"; font-size: 11pt; line-height: 1.7; color: #1E293B; }
        @media print {
          body { background: #fff; }
          .pdf-container { margin: 0; box-shadow: none; width: 100%; padding: 20mm 15mm 25mm 15mm; break-inside: avoid; page-break-inside: avoid; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Controls */}
      <div className="no-print fixed top-6 right-6 flex gap-3 z-50">
        <button onClick={() => window.print()} className="bg-white border border-slate-200 px-4 py-2 rounded shadow-sm flex items-center gap-2 hover:bg-white/80 transition-colors text-sm font-semibold text-slate-700">
          <span className="material-symbols-outlined text-sm">print</span>
          Print PDF
        </button>
        <button onClick={() => window.print()} className="bg-[#14B8A6] text-white px-4 py-2 rounded shadow-sm flex items-center gap-2 hover:bg-[#0D9488] transition-colors text-sm font-semibold">
          <span className="material-symbols-outlined text-sm">download</span>
          Download .pdf
        </button>
      </div>

      <div className="pdf-container">
        {/* Header */}
        <header className="flex items-start justify-between mb-16">
          <div className="flex items-center gap-4">
            <div className="bg-[#14B8A6] w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-2xl">mic</span>
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#1E293B] leading-none">EchoNote</h2>
              <p className="text-[9pt] text-[#14B8A6] font-medium mt-1 tracking-wide">Intelligent Audio Synthesis</p>
            </div>
          </div>
          <div className="text-right flex flex-col gap-1 border-r-2 border-[#14B8A6]/20 pr-4">
            <div className="flex flex-col">
              <span className="text-[8pt] font-bold uppercase text-slate-500 tracking-tighter">Created</span>
              <span className="text-[10pt] font-medium text-[#1E293B]">{createdDisplay}</span>
            </div>
            <div className="flex flex-col mt-2">
              <span className="text-[8pt] font-bold uppercase text-slate-500/70 tracking-tighter">Exported</span>
              <span className="text-[10pt] font-medium text-[#1E293B]/70">{exportedDisplay}</span>
            </div>
          </div>
        </header>

        {/* Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-[#1E293B] mb-4 tracking-tight">{data.title || "Untitled"}</h1>
          <div className="h-[2px] bg-[#14B8A6] w-full" />
        </div>

        {/* Body */}
        <article className="content-text flex-1">
          {data.contentHTML ? (
            <div className="prose prose-sm max-w-none prose-headings:text-[#1E293B] prose-p:my-3 prose-p:text-[#1E293B]"
                 dangerouslySetInnerHTML={{ __html: data.contentHTML }} />
          ) : (
            <p className="text-slate-500">No content to export.</p>
          )}
        </article>

        {/* Footer */}
        <footer className="mt-auto absolute bottom-0 left-0 w-full">
          <div className="bg-[#14B8A6] h-1.5 w-full" />
          <div className="px-[25mm] py-6 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2">
              <p className="text-[9pt] font-semibold text-[#1E293B]">Generated by EchoNote</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[8pt] text-slate-500 font-medium uppercase tracking-widest">Confidential Report</span>
              <p className="text-[10pt] font-bold text-[#1E293B]">01</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
