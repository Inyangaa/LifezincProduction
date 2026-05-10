import { useEffect, useState } from "react";

const STORAGE_KEY = "lifezinc-has-seen-onboarding";

type Slide = {
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    title: "Welcome to LifeZinc",
    body: "Track how you feel, see patterns, and get real, proven mental health tools that fit your stage of life."
  },
  {
    title: "Pick how you feel",
    body: "Tap emojis and issues like money, school, relationships, or anxiety. LifeZinc turns them into tailored support."
  },
  {
    title: "Get tools that fit you",
    body: "We use your age and context to avoid bad advice and offer steps, resources, and calming exercises that actually fit your life."
  }
];

interface Props {
  forceShow?: boolean;
}

export function OnboardingIntro({ forceShow = false }: Props) {
  const [open, setOpen] = useState(() => {
    if (forceShow) return true;
    if (typeof window === "undefined") return false;
    return !window.localStorage.getItem(STORAGE_KEY);
  });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (forceShow && !open) {
      setOpen(true);
    }
  }, [forceShow, open]);

  if (!open) return null;

  const slide = SLIDES[current];

  function close() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
    setOpen(false);
  }

  function next() {
    if (current === SLIDES.length - 1) {
      close();
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function back() {
    if (current === 0) return;
    setCurrent((c) => c - 1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transform animate-slideUp">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
            LifeZinc intro
          </p>
          <button
            type="button"
            onClick={close}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium"
          >
            Skip
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {slide.title}
        </h2>
        <p className="text-base text-gray-700 leading-relaxed">
          {slide.body}
        </p>

        <div className="mt-6 flex items-center justify-center gap-2">
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              className={
                "h-2.5 w-2.5 rounded-full transition-all " +
                (idx === current ? "bg-teal-600 scale-125" : "bg-gray-300")
              }
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {current > 0 && (
            <button
              type="button"
              onClick={back}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={next}
            className="rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-2 text-sm font-bold text-white shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all"
          >
            {current === SLIDES.length - 1 ? "Start using LifeZinc" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
