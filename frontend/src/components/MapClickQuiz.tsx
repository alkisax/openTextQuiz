import { useState } from "react";

type MapClickQuizProps = {
  maxWidth?: number;
  points: MapPoint[];
  setPoints: React.Dispatch<React.SetStateAction<MapPoint[]>>;
  maxPoints: number;
};

type MapPoint = {
  x: number;
  y: number;
  label: string;
};

// compact styles για input + label (ίδια πριν & μετά submit)
const compactInputStyle: React.CSSProperties = {
  width: 70,
  height: 18,
  fontSize: 11,
  padding: "1px 3px",
  border: "1px solid #aaa",
  borderRadius: 3,
  outline: "none",
};

const compactBoxStyle: React.CSSProperties = {
  display: "flex",
  gap: 3,
  background: "white",
  padding: "2px 3px",
  border: "1px solid #ccc",
  borderRadius: 4,
  zIndex: 10,
};

// component: δείχνει χάρτη + overlay για click
const MapClickQuiz = ({
  maxWidth = 900,
  points,
  setPoints,
  maxPoints,
}: MapClickQuizProps) => {
  // προσωρινό σημείο (όσο γράφουμε)
  const [draftPoint, setDraftPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [label, setLabel] = useState("");

  // click πάνω στο overlay
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // αν γράφουμε ήδη ή έχουμε 4 σημεία, μπλοκ
    if (draftPoint || points.length >= maxPoints) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const xPercentage = (e.nativeEvent.offsetX / rect.width) * 100;
    const yPercentage = (e.nativeEvent.offsetY / rect.height) * 100;

    setDraftPoint({ x: xPercentage, y: yPercentage });
    setLabel("");
  };

  const handleSubmit = () => {
    if (!draftPoint || !label.trim()) return;

    setPoints((prev) => [...prev, { x: draftPoint.x, y: draftPoint.y, label }]);

    // μετά την υποβολή:
    // - η κουκίδα μένει
    // - το label μένει
    // - φεύγει μόνο το κουμπί υποβολής
    setDraftPoint(null);
    setLabel("");
  };

  const handleCancelDraft = () => {
    setDraftPoint(null);
    setLabel("");
  };

  const updatePointLabel = (index: number, value: string) => {
    setPoints((prev) =>
      prev.map((p, i) => (i === index ? { ...p, label: value } : p)),
    );
  };

  const removePoint = (index: number) => {
    // αν ακυρώσουμε ενα σημείο να μπορούμε να το ξαναβάλουμε
    setPoints((prev) => prev.filter((_, i) => i !== index));
  };

  // if (readOnly) return;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth,
      }}
    >
      {/* wrapper εικόνας */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth,
        }}
      >
        {/* χάρτης */}
        <img
          src="/mapOfGreecce.png"
          alt="Χάρτης Ελλάδας"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />

        {/* overlay για click */}
        <div
          onClick={handleClick}
          style={{
            position: "absolute",
            inset: 0,
            cursor:
              draftPoint || points.length >= 4 ? "not-allowed" : "crosshair",
          }}
        />

        {/* ήδη υποβληθέντα σημεία (ΜΕΝΟΥΝ) */}
        {points.map((p, index) => (
          <div key={index}>
            {/* κουκίδα - ΜΕΝΕΙ ΑΚΡΙΒΩΣ στο click */}
            <div
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%, -50%)",
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "red",
                pointerEvents: "none",
              }}
            />

            {/* label δίπλα στην κουκίδα - ΜΕΝΕΙ μετά το submit */}
            <div
              style={{
                position: "absolute",
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(10px, -50%)",
                ...compactBoxStyle,
              }}
            >
              <input
                type="text"
                value={p.label}
                onChange={(e) => updatePointLabel(index, e.target.value)}
                placeholder="γράψε"
                style={compactInputStyle}
              />

              {/* μετά την υποβολή μένει ΜΟΝΟ η ακύρωση */}
              <button
                style={{ fontSize: 11 }}
                onClick={() => removePoint(index)}
              >
                ✖
              </button>
            </div>
          </div>
        ))}

        {/* draft κουκίδα + input */}
        {draftPoint && (
          <>
            {/* κουκίδα draft - ΜΕΝΕΙ ΑΚΡΙΒΩΣ στο click */}
            <div
              style={{
                position: "absolute",
                left: `${draftPoint.x}%`,
                top: `${draftPoint.y}%`,
                transform: "translate(-50%, -50%)",
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "blue",
                pointerEvents: "none",
              }}
            />

            {/* input δίπλα στην κουκίδα */}
            <div
              style={{
                position: "absolute",
                left: `${draftPoint.x}%`,
                top: `${draftPoint.y}%`,
                transform: "translate(10px, -50%)",
                ...compactBoxStyle,
              }}
            >
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="γράψε"
                style={compactInputStyle}
              />

              {/* πριν την υποβολή φαίνεται και το submit */}
              <button style={{ fontSize: 11 }} onClick={handleSubmit}>
                ✔
              </button>
              <button style={{ fontSize: 11 }} onClick={handleCancelDraft}>
                ✖
              </button>
            </div>
          </>
        )}
      </div>

      {/* debug panel */}
      <div
        style={{
          marginTop: 12,
          fontFamily: "monospace",
        }}
      >
        <div>Σημεία: {points.length} / 4</div>
        {points.map((p, i) => (
          <div key={i}>
            {i + 1}. ({p.x.toFixed(2)}, {p.y.toFixed(2)}) → {p.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapClickQuiz;
