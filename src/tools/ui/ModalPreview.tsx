import { useState, useEffect } from "react";

type ModalType = "confirm" | "form" | "fullscreen" | null;

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-200 ${
        animate ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`transition-all duration-200 ${
          animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function ModalPreview() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const close = () => setActiveModal(null);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
      <h2 className="text-lg font-semibold text-slate-800">Modal Dialogs</h2>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveModal("confirm")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Confirm Dialog
        </button>
        <button
          onClick={() => setActiveModal("form")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Form Modal
        </button>
        <button
          onClick={() => setActiveModal("fullscreen")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Fullscreen Modal
        </button>
      </div>

      {/* Confirm Dialog */}
      <Modal open={activeModal === "confirm"} onClose={close}>
        <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4 space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 text-xl">ℹ️</span>
            <h3 className="text-lg font-semibold text-slate-800">Confirm Action</h3>
          </div>
          <p className="text-sm text-slate-600">
            Are you sure you want to proceed with this action? This operation cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={close}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={close}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      {/* Form Modal */}
      <Modal open={activeModal === "form"} onClose={close}>
        <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Contact Form</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={close}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={close}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>

      {/* Fullscreen Modal */}
      <Modal open={activeModal === "fullscreen"} onClose={close}>
        <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Fullscreen Modal</h3>
            <button
              onClick={close}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-slate-600 space-y-3">
            <p>
              This is a larger modal suitable for displaying detailed content, long forms, or rich media.
              It supports scrolling when the content exceeds the viewport height.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
              et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center text-slate-500">
                  Content block {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
