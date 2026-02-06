// type MapPoint = {
//   x: number; // ποσοστό X (0–100)
//   y: number; // ποσοστό Y (0–100)
//   label: string; // κείμενο (προς το παρόν δεν βαθμολογείται)
// };

// type MapPointsLayerProps = {
//   points: MapPoint[];
//   onLabelChange: (index: number, value: string) => void;
//   onRemove: (index: number) => void;
// };

// // styles για input + label (ίδια πριν & μετά submit)
// const compactInputStyle = {
//   width: 70,
//   height: 18,
//   fontSize: 11,
//   padding: "1px 3px",
//   border: "1px solid #aaa",
//   borderRadius: 3,
//   outline: "none",
// };

// const compactBoxStyle = {
//   display: "flex",
//   gap: 3,
//   background: "white",
//   padding: "2px 3px",
//   border: "1px solid #ccc",
//   borderRadius: 4,
//   zIndex: 10,
// };

// // component: δείχνει όλα τα ήδη υποβληθέντα σημεία
// const MapPointsLayer = ({
//   points,
//   onLabelChange,
//   onRemove,
// }: MapPointsLayerProps) => {
//   return (
//     <>
//       {/* ήδη υποβληθέντα σημεία (μένουν) */}
//       {points.map((p, index) => (
//         <div key={index}>
//           {/* κουκίδα */}
//           <div
//             style={{
//               position: "absolute",
//               left: `${p.x}%`,
//               top: `${p.y}%`,
//               transform: "translate(-50%, -50%)",
//               width: 10,
//               height: 10,
//               borderRadius: "50%",
//               backgroundColor: "red", // εδώ αργότερα θα γίνει πράσινο/κόκκινο
//               pointerEvents: "none",
//             }}
//           />

//           {/* label δίπλα στην κουκίδα */}
//           <div
//             style={{
//               position: "absolute",
//               left: `${p.x}%`,
//               top: `${p.y}%`,
//               transform: "translate(10px, -50%)",
//               ...compactBoxStyle,
//             }}
//           >
//             <input
//               type="text"
//               value={p.label}
//               onChange={(e) => onLabelChange(index, e.target.value)}
//               placeholder="γράψε"
//               style={compactInputStyle}
//             />

//             {/* αφαίρεση σημείου */}
//             <button
//               style={{ fontSize: 11 }}
//               onClick={() => onRemove(index)}
//             >
//               ✖
//             </button>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// };

// export default MapPointsLayer;
