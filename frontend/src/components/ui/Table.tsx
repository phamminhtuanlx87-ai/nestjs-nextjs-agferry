interface HeaderConfig {
  label: string;
  key: string;
  className?: string; // Để tùy chỉnh ẩn hiện hoặc độ rộng
  align?: "left" | "center" | "right";
}

interface TableProps {
  headers: HeaderConfig[];
  children: React.ReactNode;
}

export default function Table({ headers, children }: TableProps) {
  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-500 uppercase tracking-wider text-xs font-semibold">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className={`px-6 py-4 ${header.className || ""} ${
                  header.align === "right" ? "text-right" : 
                  header.align === "center" ? "text-center" : "text-left"
                }`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-800">
          {children}
        </tbody>
      </table>
    </div>
  );
}