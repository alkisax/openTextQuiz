import { useState } from 'react';

type MapClickQuizProps = {
  maxWidth?: number; // π.χ. 900
};

type MapPoint = {
  x: number;
  y: number;
  label: string;
};

// component: δείχνει χάρτη + overlay για click
const MapClickQuiz = ({ maxWidth = 900 }: MapClickQuizProps) => {
  // τελικά σημεία (μέχρι 4)
  const [points, setPoints] = useState<MapPoint[]>([]);

  // προσωρινό σημείο (όσο γράφουμε)
  const [draftPoint, setDraftPoint] = useState<{ x: number; y: number } | null>(null);
  const [label, setLabel] = useState('');

  // click πάνω στο overlay
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // αν γράφουμε ήδη ή έχουμε 4 σημεία, μπλοκ
    if (draftPoint || points.length >= 4) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const xPercentage = (e.nativeEvent.offsetX / rect.width) * 100;
    const yPercentage = (e.nativeEvent.offsetY / rect.height) * 100;

    setDraftPoint({ x: xPercentage, y: yPercentage });
    setLabel('');
  };

  const handleSubmit = () => {
    if (!draftPoint || !label.trim()) return;

    setPoints((prev) => [
      ...prev,
      { x: draftPoint.x, y: draftPoint.y, label },
    ]);

    setDraftPoint(null);
    setLabel('');
  };

  const handleCancel = () => {
    setDraftPoint(null);
    setLabel('');
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth,
      }}
    >
      {/* wrapper εικόνας */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth,
        }}
      >
        {/* χάρτης */}
        <img
          src='/mapOfGreecce.png'
          alt='Χάρτης Ελλάδας'
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />

        {/* overlay για click */}
        <div
          onClick={handleClick}
          style={{
            position: 'absolute',
            inset: 0,
            cursor: draftPoint || points.length >= 4 ? 'not-allowed' : 'crosshair',
          }}
        />

        {/* ήδη υποβληθέντα σημεία (ΜΕΝΟΥΝ) */}
        {points.map((p, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: 'red',
              pointerEvents: 'none',
            }}
            title={p.label}
          />
        ))}

        {/* draft κουκίδα + input */}
        {draftPoint && (
          <>
            <div
              style={{
                position: 'absolute',
                left: `${draftPoint.x}%`,
                top: `${draftPoint.y}%`,
                transform: 'translate(-50%, -50%)',
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: 'blue',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                position: 'absolute',
                left: `${draftPoint.x}%`,
                top: `${draftPoint.y}%`,
                transform: 'translate(12px, -50%)',
                display: 'flex',
                gap: 4,
                background: 'white',
                padding: 4,
                border: '1px solid #ccc',
                borderRadius: 4,
                zIndex: 10,
              }}
            >
              <input
                type='text'
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder='γράψε απάντηση'
              />

              <button onClick={handleSubmit}>✔</button>
              <button onClick={handleCancel}>✖</button>
            </div>
          </>
        )}
      </div>

      {/* debug panel */}
      <div
        style={{
          marginTop: 12,
          fontFamily: 'monospace',
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
