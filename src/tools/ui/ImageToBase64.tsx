import { useState, useCallback, type DragEvent, type ChangeEvent } from "react";

export default function ImageToBase64() {
  const [base64, setBase64] = useState("");
  const [preview, setPreview] = useState("");
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileInfo({ name: file.name, size: file.size });
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setBase64(result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
      <h2 className="text-lg font-semibold text-slate-800">Image to Base64</h2>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors ${
          dragging ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-slate-50"
        }`}
      >
        <span className="text-3xl">🖼️</span>
        <p className="text-sm text-slate-500">Drag & drop an image here, or click to browse</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {preview && (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <img src={preview} alt="Preview" className="max-h-48 rounded-lg border border-slate-200 object-contain" />
            {fileInfo && (
              <div className="text-sm text-slate-600 space-y-1">
                <p><span className="font-medium">Name:</span> {fileInfo.name}</p>
                <p><span className="font-medium">Size:</span> {formatSize(fileInfo.size)}</p>
                <p><span className="font-medium">Base64 length:</span> {base64.length.toLocaleString()} chars</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Base64 String</label>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              readOnly
              value={base64}
              rows={6}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-600 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
