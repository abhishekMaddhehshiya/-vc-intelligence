import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label?: string;
}

export default function Select({ value, onChange, options, label }: SelectProps) {
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input appearance-none pr-10 cursor-pointer"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
      </div>
    </div>
  );
}
