import { useState, useEffect } from "react";

interface TypingEffectConfig {
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBeforeDeleting?: number;
}

export const useTypingEffect = (
  initialText: string,
  finalText: string | undefined,
  config: TypingEffectConfig = {}
) => {
  const [placeholder, setPlaceholder] = useState("");
  const [phase, setPhase] = useState<
    "typing" | "waiting" | "deleting" | "final-typing"
  >("typing");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const {
      typingSpeed = 150,
      deletingSpeed = 100,
      delayBeforeDeleting = 1500,
    } = config;

    let timeoutId: number | null = null;

    const animate = () => {
      switch (phase) {
        case "typing":
          if (index <= initialText.length) {
            setPlaceholder(initialText.slice(0, index));
            setIndex(index + 1);
          } else {
            setPhase("waiting");
          }
          break;

        case "waiting":
          timeoutId = window.setTimeout(() => {
            setPhase("deleting");
          }, delayBeforeDeleting);
          break;

        case "deleting":
          if (index > 0) {
            setPlaceholder(initialText.slice(0, index - 1));
            setIndex(index - 1);
          } else {
            setPhase("final-typing");
          }
          break;

        case "final-typing":
          if (finalText && index <= finalText.length) {
            setPlaceholder(finalText.slice(0, index));
            setIndex(index + 1);
          }
          break;
      }
    };

    const intervalId = window.setInterval(
      () => {
        animate();
      },
      phase === "deleting" ? deletingSpeed : typingSpeed
    );

    return () => {
      window.clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [phase, index, initialText, finalText, config]);

  // Reset effect when finalText changes
  useEffect(() => {
    setPhase("typing");
    setIndex(0);
    setPlaceholder("");
  }, [finalText]);

  return placeholder;
};
