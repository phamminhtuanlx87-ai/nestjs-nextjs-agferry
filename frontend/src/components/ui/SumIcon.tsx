type SummaryProps = {
  variant: "projects" | "progress" | "done" | "warning";
};
const SumIcon = ({ variant }: SummaryProps) => {
  switch (variant) {
    case "projects":
      return (
        <svg
          className="w-10 h-10 opacity-70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 21h18M9 8h1m-1 4h1m-1 4h1m4-8h1m-1 4h1m-1 4h1M5 3h14v18H5z"
          />
        </svg>
      );

    case "progress":
      return (
        <svg
          className="w-10 h-10 opacity-70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      );

    case "done":
      return (
        <svg
          className="w-10 h-10 opacity-80"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6M9 16h6M9 8h6M5 3h14v18H5z"
          />
        </svg>
      );

    case "warning":
      return (
        <svg
          className="w-10 h-10 opacity-80"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      );

    default:
      return null;
  }
};
export default SumIcon;
