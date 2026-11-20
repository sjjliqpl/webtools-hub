import { useState } from "react";

interface Unit {
  key: string;
  label: string;
  toMeter: number;
}

const UNITS: Unit[] = [
  { key: "m", label: "米 (m)", toMeter: 1 },
  { key: "km", label: "千米 (km)", toMeter: 1000 },
  { key: "cm", label: "厘米 (cm)", toMeter: 0.01 },
  { key: "mm", label: "毫米 (mm)", toMeter: 0.001 },
  { key: "inch", label: "英寸 (inch)", toMeter: 0.0254 },
  { key: "ft", label: "英尺 (ft)", toMeter: 0.3048 },
];

export default function LengthConverter() {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("m");

  const numValue = parseFloat(value) || 0;
  const selectedUnit = UNITS.find((u) => u.key === unit)!;
  const meters = numValue * selectedUnit.toMeter;

  return (
    <div className="tool-surface">
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="请输入数值"
          className="flex-1 rounded-md border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          {UNITS.map((u) => (
            <option key={u.key} value={u.key}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {UNITS.filter((u) => u.key !== unit).map((u) => {
          const converted = meters / u.toMeter;
          return (
            <div key={u.key} className="bg-blue-50 rounded-md p-4">
              <p className="text-xs text-slate-500 mb-1">{u.label}</p>
              <p className="text-lg font-bold text-slate-800">
                {value !== "" ? converted.toLocaleString(undefined, { maximumFractionDigits: 6 }) : "—"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
