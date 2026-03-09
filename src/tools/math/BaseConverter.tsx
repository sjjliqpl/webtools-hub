import { useState } from "react";

type Base = "bin" | "oct" | "dec" | "hex";

const fields: { key: Base; label: string; base: number; placeholder: string }[] = [
  { key: "bin", label: "二进制 (Binary)", base: 2, placeholder: "例如: 1010" },
  { key: "oct", label: "八进制 (Octal)", base: 8, placeholder: "例如: 12" },
  { key: "dec", label: "十进制 (Decimal)", base: 10, placeholder: "例如: 10" },
  { key: "hex", label: "十六进制 (Hex)", base: 16, placeholder: "例如: A" },
];

export default function BaseConverter() {
  const [values, setValues] = useState<Record<Base, string>>({
    bin: "",
    oct: "",
    dec: "",
    hex: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (key: Base, value: string, base: number) => {
    if (value === "") {
      setValues({ bin: "", oct: "", dec: "", hex: "" });
      setError("");
      return;
    }

    const patterns: Record<number, RegExp> = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9a-fA-F]+$/,
    };

    if (!patterns[base].test(value)) {
      setValues((prev) => ({ ...prev, [key]: value }));
      setError(`无效的${fields.find((f) => f.key === key)?.label}输入`);
      return;
    }

    setError("");
    const decimal = parseInt(value, base);
    if (isNaN(decimal)) {
      setError("转换失败");
      return;
    }

    setValues({
      bin: decimal.toString(2),
      oct: decimal.toString(8),
      dec: decimal.toString(10),
      hex: decimal.toString(16).toUpperCase(),
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-5">进制转换</h2>
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              {f.label}
            </label>
            <input
              type="text"
              value={values[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => handleChange(f.key, e.target.value, f.base)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
