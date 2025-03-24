import React, { ReactNode } from 'react';

interface ResponsiveTableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export default function ResponsiveTable({ headers, children, className = '' }: ResponsiveTableProps) {
  return (
    <div className={`overflow-x-auto responsive-table rounded-lg ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th 
                key={index}
                scope="col" 
                className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {children}
        </tbody>
      </table>
    </div>
  );
}

// Row component for consistent styling
export function TableRow({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <tr className={`hover:bg-gray-50 ${className}`}>
      {children}
    </tr>
  );
}

// Cell component for consistent styling
export function TableCell({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className}`}>
      {children}
    </td>
  );
}

// Mobile-friendly table alternative for very small screens
export function CardList<T>({ 
  data, 
  renderItem, 
  className = '' 
}: { 
  data: T[], 
  renderItem: (item: T, index: number) => ReactNode,
  className?: string 
}) {
  return (
    <div className={`grid grid-cols-1 gap-4 ${className}`}>
      {data.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

// Responsive container that shows either table or cards based on screen size
export function ResponsiveContainer({
  tableView,
  cardView,
  showTable = true,
}: {
  tableView: ReactNode;
  cardView: ReactNode;
  showTable?: boolean;
}) {
  return (
    <>
      <div className={`${showTable ? 'hidden sm:block' : 'hidden'}`}>{tableView}</div>
      <div className={`${showTable ? 'sm:hidden' : 'block'}`}>{cardView}</div>
    </>
  );
} 