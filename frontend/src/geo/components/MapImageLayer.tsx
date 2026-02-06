type MapImageLayerProps = {
  maxWidth?: number; // μέγιστο πλάτος container
  disabled: boolean; // αν επιτρέπεται click ή όχι
  onMapClick: (x: number, y: number) => void; // επιστρέφει ποσοστά (0–100)
};

// component: δείχνει χάρτη + overlay για click
const MapImageLayer = ({
  maxWidth = 900,
  disabled,
  onMapClick,
}: MapImageLayerProps) => {
  // click πάνω στο overlay
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    // πραγματικές διαστάσεις του overlay (ίδιες με της εικόνας)
    const rect = e.currentTarget.getBoundingClientRect();

    // offsetX / offsetY είναι ήδη relative στο element
    // τα μετατρέπουμε σε ποσοστά για responsive συμπεριφορά
    const xPercentage = (e.nativeEvent.offsetX / rect.width) * 100;
    const yPercentage = (e.nativeEvent.offsetY / rect.height) * 100;

    onMapClick(xPercentage, yPercentage);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth,
      }}
    >
      {/* χάρτης */}
      <img
        src={`${import.meta.env.BASE_URL}mapOfGreecce.png`}
        alt="Χάρτης Ελλάδας"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
      />

      {/* overlay για click – τα coords ξεκινούν από την εικόνα */}
      <div
        onClick={handleClick}
        style={{
          position: "absolute",
          inset: 0,
          cursor: disabled ? "not-allowed" : "crosshair",
        }}
      />
    </div>
  );
};

export default MapImageLayer;
