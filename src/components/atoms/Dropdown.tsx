import React from "react";

type DropdownProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

type DropdownVariant = "pending" | "completed" | "approved" | "rejected";

const statusStyles: Record<DropdownVariant, string> = {
  pending: "text-orange-800 bg-orange-100",
  completed: "text-green-800 bg-green-100",
  approved: "text-yellow-800 bg-yellow-100",
  rejected: "text-red-800 bg-red-100",
};

export default function Dropdown({ value, options, onChange }: DropdownProps) {
  const getStatusVariant = (status: string): DropdownVariant => {
    switch (status) {
      case "approved":
        return "approved";
      case "completed":
        return "completed";
      case "rejected":
        return "rejected";
      case "pending":
      default:
        return "pending";
    }
  };

  const variant = getStatusVariant(value);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`py-2 px-4 rounded-md border ${statusStyles[variant]} text-sm w-full`}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}
