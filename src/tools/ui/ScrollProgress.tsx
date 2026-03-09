import { useState, useEffect } from "react";

const PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel tortor facilisis, finibus magna nec, tincidunt sapien. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras hendrerit nunc a lectus efficitur, eu posuere enim volutpat.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
  "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
  "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.",
  "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.",
];

const CARDS = [
  { title: "Performance", desc: "Optimize load times and runtime speed for the best user experience." },
  { title: "Accessibility", desc: "Ensure all users can navigate and interact with your application." },
  { title: "Security", desc: "Protect user data and guard against common web vulnerabilities." },
  { title: "Scalability", desc: "Design systems that handle growth in users and data gracefully." },
  { title: "Maintainability", desc: "Write clean, modular code that's easy to update and debug." },
  { title: "Testing", desc: "Comprehensive tests give confidence when shipping new features." },
];

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1">
        <div
          style={{
            width: `${progress}%`,
            background: "linear-gradient(to right, #6366f1, #ec4899)",
          }}
          className="h-full transition-[width] duration-75"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Scroll Progress Demo</h2>
          <p className="text-sm text-slate-500 mt-1">Scroll the page to see the progress bar at the top.</p>
        </div>

        <div className="space-y-6">
          {PARAGRAPHS.map((text, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-700">Section {i + 1}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map((card, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <h4 className="text-sm font-semibold text-slate-800">{card.title}</h4>
              <p className="text-xs text-slate-500">{card.desc}</p>
            </div>
          ))}
        </div>

        {PARAGRAPHS.map((text, i) => (
          <p key={`extra-${i}`} className="text-sm text-slate-600 leading-relaxed">{text}</p>
        ))}
      </div>
    </>
  );
}
