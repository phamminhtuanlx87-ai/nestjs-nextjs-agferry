interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
      p-6 rounded-xl shadow-lg border transition-all
      bg-(--card) 
      border-(--border)
      ${className}
    `}
    >
      {children}
    </div>
  );
}
