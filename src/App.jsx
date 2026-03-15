import {  useState, useRef, useEffect } from "react";

const STYLES = [
  { id: "story", label: "Storytelling", desc: "Une histoire personnelle qui captive" },
  { id: "liste", label: "Liste a valeur", desc: "X conseils / X erreurs / X lecons" },
  { id: "opinion", label: "Opinion forte", desc: "Un avis tranche qui cree le debat" },
  { id: "carrousel", label: "Carrousel", desc: "Structure slide par slide" },
];

const TONES = ["Professionnel", "Inspirant", "Educatif", "Provocateur", "Authentique"];

const FREE_LIMIT = 3;

function TypewriterText({ text, speed }) {
  const spd = speed || 12;
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
    }, spd);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span className="cursor">|</span>}
    </span>
  );
}

export default function App() {
  const [metier, setMetier] = useState("");
  const [sujet, setSujet] = useState("");
  const [style, setStyle] = useState("story");
  const [tone, setTone] = useState("Inspirant");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("generate");

  const remaining = FREE_LIMIT - count;
  const isLocked = count >= FREE_LIMIT;

  async function generate() {
    if (!metier.trim() || !sujet.trim()) return;
    if (isLocked) { setShowPro(true); return; }
    setLoading(true);
    setResult("");
    const styleObj = STYLES.find(function(s) { return s.id === style; });
    const prompt = "Tu es un expert LinkedIn avec 500k abonnes. Genere un post LinkedIn viral en francais.\n\nMetier de l'auteur : " + metier + "\nSujet / Idee : " + sujet + "\nStyle : " + styleObj.label + " - " + styleObj.desc + "\nTon : " + tone + "\n\nRegles STRICTES :\n- Commence par une accroche CHOC (1 ligne, pas de question banale)\n- Utilise des retours a la ligne frequents (1-2 phrases max par ligne)\n- Ajoute des emojis strategiques (pas trop)\n- Termine par un CTA engageant\n- Entre 150 et 280 mots\n- N'utilise JAMAIS 'Dans un monde ou...'\n\nEcris UNIQUEMENT le post, sans commentaire ni explication.";

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : "Erreur lors de la generation.";
      setResult(text);
      const newCount = count + 1;
      setCount(newCount);
      setHistory(function(h) { return [{ id: Date.now(), metier: metier, sujet: sujet, style: style, tone: tone, text: text }].concat(h).slice(0, 10); });
      if (newCount >= FREE_LIMIT) setTimeout(function() { setShowPro(true); }, 2000);
    } catch(e) {
      setResult("Une erreur est survenue. Reessaie.");
    }
    setLoading(false);
  }

  function copyText() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(function() { setCopied(false); }, 2000);
  }

  const css = [
    "@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');",
    "*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }",
    ":root { --ink: #0d0d0d; --paper: #f5f0e8; --cream: #ede8dc; --gold: #c9a84c; --gold-light: #e8c96a; --muted: #7a7468; --border: #d4cfc4; --white: #fff; --danger: #c0392b; }",
    "body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--ink); min-height: 100vh; }",
    ".app { max-width: 860px; margin: 0 auto; padding: 0 20px 80px; }",
    "header { display: flex; align-items: center; justify-content: space-between; padding: 28px 0 32px; border-bottom: 1.5px solid var(--border); margin-bottom: 40px; }",
    ".logo { display: flex; align-items: center; gap: 12px; }",
    ".logo-mark { width: 38px; height: 38px; background: var(--ink); border-radius: 10px; display: grid; place-items: center; font-family: 'Syne', sans-serif; font-weight: 800; color: var(--gold); font-size: 18px; }",
    ".logo-text { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: -0.5px; }",
    ".logo-sub { font-size: 11px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; }",
    ".pill-counter { background: var(--ink); color: var(--gold); font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 999px; }",
    ".pill-danger { background: var(--danger); color: white; }",
    ".tabs { display: flex; gap: 4px; margin-bottom: 36px; background: var(--cream); padding: 4px; border-radius: 12px; width: fit-content; }",
    ".tab-btn { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; padding: 8px 20px; border-radius: 9px; border: none; cursor: pointer; background: transparent; color: var(--muted); transition: all 0.2s; }",
    ".tab-btn.active { background: var(--white); color: var(--ink); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }",
    ".section-label { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }",
    ".input-field { width: 100%; padding: 14px 16px; background: var(--white); border: 1.5px solid var(--border); border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--ink); outline: none; transition: border-color 0.2s; }",
    ".input-field:focus { border-color: var(--gold); }",
    ".input-field::placeholder { color: #bbb; }",
    ".row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }",
    ".style-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; margin-bottom: 24px; }",
    ".style-card { padding: 14px 16px; border: 1.5px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.2s; background: var(--white); }",
    ".style-card.selected { border-color: var(--gold); background: #fefaf1; }",
    ".style-card-label { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; margin-bottom: 3px; }",
    ".style-card-desc { font-size: 12px; color: var(--muted); }",
    ".tone-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }",
    ".tone-chip { padding: 7px 16px; border-radius: 999px; border: 1.5px solid var(--border); font-size: 13px; cursor: pointer; background: var(--white); color: var(--ink); transition: all 0.18s; font-family: 'DM Sans', sans-serif; }",
    ".tone-chip.selected { background: var(--ink); color: var(--gold); border-color: var(--ink); }",
    ".gen-btn { width: 100%; padding: 18px; border-radius: 14px; border: none; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; background: var(--ink); color: var(--gold); transition: all 0.22s; }",
    ".gen-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }",
    ".gen-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }",
    ".gen-btn-inner { display: flex; align-items: center; justify-content: center; gap: 10px; }",
    ".result-box { margin-top: 36px; background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; overflow: hidden; }",
    ".result-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border); background: var(--cream); }",
    ".result-label { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }",
    ".copy-btn { padding: 7px 16px; border-radius: 999px; border: 1.5px solid var(--border); font-size: 12px; font-family: 'Syne', sans-serif; font-weight: 700; cursor: pointer; background: var(--white); color: var(--ink); transition: all 0.2s; }",
    ".copy-btn.copied { background: #27ae60; color: white; border-color: #27ae60; }",
    ".result-body { padding: 24px; font-size: 15px; line-height: 1.75; white-space: pre-wrap; color: var(--ink); }",
    ".cursor { animation: blink 0.8s steps(2) infinite; }",
    "@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }",
    ".loading-box { margin-top: 36px; padding: 40px; text-align: center; background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; }",
    ".spinner { width: 36px; height: 36px; border: 3px solid var(--border); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 0 auto 16px; }",
    "@keyframes spin { to { transform: rotate(360deg); } }",
    ".loading-text { font-family: 'Syne', sans-serif; font-size: 14px; color: var(--muted); font-weight: 600; }",
    ".history-empty { text-align: center; padding: 60px 20px; color: var(--muted); font-size: 15px; }",
    ".history-item { background: var(--white); border: 1.5px solid var(--border); border-radius: 14px; padding: 18px 20px; margin-bottom: 12px; cursor: pointer; transition: border-color 0.2s; }",
    ".history-item:hover { border-color: var(--gold); }",
    ".history-meta { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }",
    ".history-preview { font-size: 14px; color: var(--ink); line-height: 1.6; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }",
    ".modal-overlay { position: fixed; inset: 0; background: rgba(13,13,13,0.7); display: grid; place-items: center; z-index: 100; padding: 20px; }",
    ".modal { background: var(--paper); border-radius: 20px; padding: 40px 36px; max-width: 420px; width: 100%; text-align: center; border: 1.5px solid var(--border); }",
    ".modal-icon { font-size: 42px; margin-bottom: 16px; }",
    ".modal-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; margin-bottom: 10px; }",
    ".modal-desc { color: var(--muted); font-size: 15px; line-height: 1.6; margin-bottom: 28px; }",
    ".modal-price { background: var(--ink); color: var(--gold); border-radius: 14px; padding: 20px; margin-bottom: 24px; }",
    ".price-amount { font-family: 'Syne', sans-serif; font-size: 38px; font-weight: 800; }",
    ".price-period { font-size: 14px; opacity: 0.7; }",
    ".price-features { margin-top: 12px; font-size: 13px; opacity: 0.85; line-height: 1.8; }",
    ".modal-cta { width: 100%; padding: 16px; border-radius: 12px; border: none; cursor: pointer; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; background: var(--gold); color: var(--ink); margin-bottom: 10px; transition: all 0.2s; }",
    ".modal-close { background: none; border: none; color: var(--muted); font-size: 13px; cursor: pointer; padding: 8px; }",
  ].join("\n");

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header>
          <div className="logo">
            <div className="logo-mark">L</div>
            <div>
              <div className="logo-text">LinkedForge</div>
              <div className="logo-sub">Generateur de posts IA</div>
            </div>
          </div>
          <div className={"pill-counter" + (remaining <= 1 ? " pill-danger" : "")}>
            {isLocked ? "Passe Pro" : remaining + " post" + (remaining > 1 ? "s" : "") + " gratuit" + (remaining > 1 ? "s" : "")}
          </div>
        </header>

        <div className="tabs">
          <button className={"tab-btn" + (tab === "generate" ? " active" : "")} onClick={function() { setTab("generate"); }}>Generer</button>
          <button className={"tab-btn" + (tab === "history" ? " active" : "")} onClick={function() { setTab("history"); }}>Historique ({history.length})</button>
        </div>

        {tab === "generate" && (
          <div>
            <div className="row">
              <div>
                <div className="section-label">Ton metier</div>
                <input className="input-field" placeholder="ex: Coach business, Dev freelance..." value={metier} onChange={function(e) { setMetier(e.target.value); }} />
              </div>
              <div>
                <div className="section-label">Ton sujet ou idee</div>
                <input className="input-field" placeholder="ex: Pourquoi j'ai quitte mon CDI..." value={sujet} onChange={function(e) { setSujet(e.target.value); }} />
              </div>
            </div>

            <div className="section-label">Style du post</div>
            <div className="style-grid">
              {STYLES.map(function(s) {
                return (
                  <div key={s.id} className={"style-card" + (style === s.id ? " selected" : "")} onClick={function() { setStyle(s.id); }}>
                    <div className="style-card-label">{s.label}</div>
                    <div className="style-card-desc">{s.desc}</div>
                  </div>
                );
              })}
            </div>

            <div className="section-label">Ton</div>
            <div className="tone-row">
              {TONES.map(function(t) {
                return (
                  <button key={t} className={"tone-chip" + (tone === t ? " selected" : "")} onClick={function() { setTone(t); }}>{t}</button>
                );
              })}
            </div>

            <button className="gen-btn" onClick={generate} disabled={loading || !metier || !sujet}>
              <div className="gen-btn-inner">
                {loading ? "Generation en cours..." : isLocked ? "Passe Pro pour continuer" : "Generer mon post LinkedIn"}
              </div>
            </button>

            {loading && (
              <div className="loading-box">
                <div className="spinner"></div>
                <div className="loading-text">L'IA redige ton post...</div>
              </div>
            )}

            {result && !loading && (
              <div className="result-box">
                <div className="result-header">
                  <div className="result-label">Post genere</div>
                  <button className={"copy-btn" + (copied ? " copied" : "")} onClick={copyText}>
                    {copied ? "Copie !" : "Copier"}
                  </button>
                </div>
                <div className="result-body">
                  <TypewriterText text={result} speed={12} />
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <div>
            {history.length === 0 ? (
              <div className="history-empty">Aucun post genere pour l'instant.<br/>Commence a creer du contenu !</div>
            ) : (
              history.map(function(item) {
                return (
                  <div key={item.id} className="history-item" onClick={function() { setTab("generate"); setResult(item.text); setMetier(item.metier); setSujet(item.sujet); }}>
                    <div className="history-meta">{item.metier} · {item.sujet}</div>
                    <div className="history-preview">{item.text}</div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {showPro && (
        <div className="modal-overlay" onClick={function() { setShowPro(false); }}>
          <div className="modal" onClick={function(e) { e.stopPropagation(); }}>
            <div className="modal-icon">!</div>
            <div className="modal-title">Passe a Pro</div>
            <div className="modal-desc">Tu as utilise tes 3 posts gratuits. Debloque la generation illimitee pour booster ta presence LinkedIn.</div>
            <div className="modal-price">
              <div className="price-amount">19EUR</div>
              <div className="price-period">/ mois</div>
              <div className="price-features">
                Posts illimites<br/>
                Tous les styles et tons<br/>
                Historique complet<br/>
                Nouveaux formats chaque mois
              </div>
            </div>
            <button className="modal-cta">Commencer l'essai gratuit 7 jours</button>
            <button className="modal-close" onClick={function() { setShowPro(false); }}>Peut-etre plus tard</button>
          </div>
        </div>
      )}
    </>
  );
}
