import { useState, useRef, useEffect } from "react";

const STYLES = [
  { id: "story", label: "📖 Storytelling", desc: "Une histoire personnelle qui captive" },
  { id: "liste", label: "📋 Liste à valeur", desc: "X conseils / X erreurs / X leçons" },
  { id: "opinion", label: "🔥 Opinion forte", desc: "Un avis tranché qui crée le débat" },
  { id: "carrousel", label: "🎠 Idée de carrousel", desc: "Structure slide par slide" },
];

const TONES = ["Professionnel", "Inspirant", "Éducatif", "Provocateur", "Authentique"];

const FREE_LIMIT = 3;

function TypewriterText({ text, speed = 12 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    idx.current = 0;
    if (!text) return;
    const iv = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current++;
      } else {
        setDone(true);
        clearInterval(iv);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span className="cursor">▌</span>}
    </span>
  );
}

export default function App() {
  const [metier, setMetier] = useState("");
  const [sujet, setSujet] = useState("");
  const [style, setStyle] = useState("story");
  const [tone, setTone] = useState("Inspirant");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);​​​​​​​​​​​​​​​​
