"use client";

import React from "react";

type TableProps = {
  headers: string[];  // Array of column headers
  data: any[];  // Array of data rows
  renderRow: (row: any) => React.ReactNode;  // Function to render each row
};

export default function Table({ headers, data, renderRow }: TableProps) {
  return (
    <div className="overflow-x-auto border-t border-gray-300">
      <table className="min-w-full text-gray-600 text-sm">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((header) => (
              <th
                key={header}
                className="text-xs font-medium border-b px-4 py-4 text-left text-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="text-center py-4 text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index} className="border-b">
                {renderRow(row)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
