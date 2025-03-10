export default function Loading() {
  const styles = {
    container: {
      height: "40px",
      width: "40px",
      transformOrigin: "center",
      animation: "rotate 2s linear infinite",
      overflow: "visible",
    },
    car: {
      fill: "none",
      strokeDasharray: "1, 200",
      strokeDashoffset: "0",
      strokeLinecap: "round" as "butt" | "round" | "square" | "inherit",
      animation: "stretch 1.5s ease-in-out infinite",
      transition: "stroke 0.5s ease",
    },
    track: {
      fill: "none",
      opacity: "0",
      transition: "stroke 0.5s ease",
    },
    keyframes: `
      @keyframes rotate {
        100% {
          transform: rotate(360deg);
        }
      }
      @keyframes stretch {
        0% {
          stroke-dasharray: 0, 150;
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: 75, 150;
          stroke-dashoffset: -25;
        }
        100% {
          stroke-dashoffset: -100;
        }
      }
    `,
  };

  return (
    <div>
      <svg style={styles.container} viewBox="0 0 40 40" height="40" width="40">
        <circle
          style={styles.track}
          cx="20"
          cy="20"
          r="17.5"
          strokeWidth="5px"
          fill="none"
          className="stroke-gray-400 dark:stroke-gray-700"
        />
        <circle
          style={styles.car}
          cx="20"
          cy="20"
          r="17.5"
          strokeWidth="5px"
          className="stroke-primary-light dark:stroke-primary-dark"
        />
      </svg>
      <style>{styles.keyframes}</style>
    </div>
  );
}
