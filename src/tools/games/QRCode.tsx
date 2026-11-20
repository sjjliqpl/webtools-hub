import { useState, useEffect, useRef } from "react";
import QRCodeLib from "qrcode";

type ErrorLevel = "L" | "M" | "Q" | "H";

export default function QRCode() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [dataUrl, setDataUrl] = useState<string>("");
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!text.trim()) return;
    let cancelled = false;
    QRCodeLib.toDataURL(text, { width: size, margin: 2, errorCorrectionLevel: errorLevel })
      .then(value => { if (!cancelled) setDataUrl(value); })
      .catch(() => { if (!cancelled) setDataUrl(""); });
    return () => { cancelled = true; };
  }, [text, size, errorLevel]);

  const download = () => {
    if (!dataUrl || !linkRef.current) return;
    linkRef.current.href = dataUrl;
    linkRef.current.download = "qrcode.png";
    linkRef.current.click();
  };

  return (
    <div className="tool-surface max-w-md mx-auto">
      <input
        type="text"
        value={text}
        onChange={(e) => { setText(e.target.value); setDataUrl(""); }}
        placeholder="输入文本或 URL"
        className="w-full px-4 py-2 border border-slate-200 rounded-md text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-xs text-slate-500 mb-1">尺寸</label>
          <select
            value={size}
            onChange={(e) => { setSize(Number(e.target.value)); setDataUrl(""); }}
            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={128}>128 px</option>
            <option value={256}>256 px</option>
            <option value={512}>512 px</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-slate-500 mb-1">纠错等级</label>
          <select
            value={errorLevel}
            onChange={(e) => { setErrorLevel(e.target.value as ErrorLevel); setDataUrl(""); }}
            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="L">L (低)</option>
            <option value="M">M (中)</option>
            <option value="Q">Q (较高)</option>
            <option value="H">H (高)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center mb-4 p-4 bg-slate-50 rounded-md min-h-[160px] items-center">
        {dataUrl ? (
          <img src={dataUrl} alt="QR Code" style={{ width: size, height: "auto", maxWidth: "100%" }} />
        ) : (
          <span className="text-slate-400 text-sm">请输入内容以生成二维码</span>
        )}
      </div>

      <a ref={linkRef} className="hidden" />
      <button
        onClick={download}
        disabled={!dataUrl}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        下载 PNG
      </button>
    </div>
  );
}
