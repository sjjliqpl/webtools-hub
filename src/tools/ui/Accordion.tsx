import { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "What is the difference between HTML, CSS, and JavaScript?",
    answer:
      "HTML provides the structure and content of a web page, CSS handles the visual presentation and layout, and JavaScript adds interactivity and dynamic behavior. Together, they form the core technologies of the web.",
  },
  {
    question: "What is responsive web design?",
    answer:
      "Responsive web design is an approach that ensures web pages render well on all screen sizes and devices. It uses flexible grids, fluid images, and CSS media queries to adapt the layout to the viewing environment.",
  },
  {
    question: "What is a CSS framework and why use one?",
    answer:
      "A CSS framework like Tailwind CSS or Bootstrap provides pre-written CSS code to help you build layouts and style components faster. They promote consistency, reduce repetitive code, and often include responsive design utilities out of the box.",
  },
  {
    question: "How does the browser render a web page?",
    answer:
      "The browser parses HTML to build the DOM tree, processes CSS to create the CSSOM, combines them into a render tree, calculates layout (positions and sizes), and finally paints the pixels on screen. JavaScript can modify both the DOM and CSSOM at any point.",
  },
  {
    question: "What is the Virtual DOM in React?",
    answer:
      "The Virtual DOM is a lightweight in-memory representation of the real DOM. When state changes, React creates a new virtual tree, diffs it with the previous one, and only applies the minimal set of real DOM updates needed — making UI updates efficient.",
  },
  {
    question: "What are Web APIs and how do they work?",
    answer:
      "Web APIs (like REST or GraphQL) are interfaces that allow client applications to communicate with servers over HTTP. The client sends requests with specific methods (GET, POST, etc.), and the server responds with data, typically in JSON format.",
  },
];

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">FAQ</h2>

      <div className="divide-y divide-slate-100">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i}>
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-3 py-4 text-left"
              >
                <span className="text-sm font-medium text-slate-800">{item.question}</span>
                <span
                  className={`text-slate-400 text-xs transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                >
                  ▶
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pb-4 text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
