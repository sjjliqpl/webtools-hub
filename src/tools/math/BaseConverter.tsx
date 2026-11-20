import { useState } from "react";
import { convertBase } from "../../lib/toolMath";

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

    try {
      const converted = convertBase(value, base);
      setValues({ bin: converted[2], oct: converted[8], dec: converted[10], hex: converted[16], [key]: value });
      setError("");
    } catch (cause) {
      setValues({ bin: "", oct: "", dec: "", hex: "", [key]: value });
      setError((cause as Error).message);
    }
  };

  return (
    <div className="tool-surface">
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-md px-4 py-2">
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
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
