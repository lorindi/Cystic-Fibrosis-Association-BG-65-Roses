'use client';

interface ActiveFilterProps {
  value: boolean | null | undefined;
  onChange: (value: boolean | null) => void;
}

export default function ActiveFilter({ value, onChange }: ActiveFilterProps) {
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="font-medium">Статус на кампанията</h3>
      <div className="flex flex-col space-y-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            checked={value === true} 
            onChange={() => onChange(true)} 
            className="radio radio-sm" 
          />
          <span>Активни</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            checked={value === false} 
            onChange={() => onChange(false)} 
            className="radio radio-sm"
          />
          <span>Неактивни</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="radio" 
            checked={value === null || value === undefined} 
            onChange={() => onChange(null)} 
            className="radio radio-sm"
          />
          <span>Всички</span>
        </label>
      </div>
    </div>
  );
} 