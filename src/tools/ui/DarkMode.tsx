import { useState } from "react";

export default function DarkMode() {
  const [dark, setDark] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Dark Mode 切换演示</h2>
        <button
          onClick={() => setDark(!dark)}
          className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
            dark ? "bg-indigo-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 flex items-center justify-center text-xs ${
              dark ? "left-9" : "left-1"
            }`}
          >
            {dark ? "🌙" : "☀️"}
          </span>
        </button>
      </div>

      <div
        className={`rounded-2xl p-6 transition-all duration-500 ${
          dark ? "bg-slate-900 text-white" : "bg-white text-slate-800 border border-slate-200"
        }`}
      >
        <header className="mb-6">
          <h1
            className={`text-2xl font-bold mb-2 transition-colors duration-500 ${
              dark ? "text-white" : "text-slate-900"
            }`}
          >
            示例页面
          </h1>
          <p
            className={`text-sm transition-colors duration-500 ${
              dark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            这是一个用于演示深色模式切换效果的迷你网页。
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            { title: "功能特性", desc: "支持实时切换明暗主题，所有元素平滑过渡。" },
            { title: "设计系统", desc: "基于 Tailwind CSS 构建，保持一致的视觉风格。" },
            { title: "响应式", desc: "自适应不同屏幕尺寸，移动端体验友好。" },
            { title: "可访问性", desc: "遵循无障碍设计规范，对比度符合 WCAG 标准。" },
          ].map((card) => (
            <div
              key={card.title}
              className={`rounded-xl p-4 transition-all duration-500 ${
                dark
                  ? "bg-slate-800 border border-slate-700"
                  : "bg-slate-50 border border-slate-100"
              }`}
            >
              <h3
                className={`font-semibold mb-1 transition-colors duration-500 ${
                  dark ? "text-white" : "text-slate-800"
                }`}
              >
                {card.title}
              </h3>
              <p
                className={`text-sm transition-colors duration-500 ${
                  dark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`rounded-xl p-4 text-sm transition-all duration-500 ${
            dark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-600"
          }`}
        >
          当前模式：<span className="font-semibold">{dark ? "🌙 深色模式" : "☀️ 浅色模式"}</span>
        </div>
      </div>
    </div>
  );
}
