'use client';

interface EventsFilterProps {
  value: boolean | undefined;
  onChange: (value?: boolean) => void;
}

export default function EventsFilter({ value, onChange }: EventsFilterProps) {
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="font-medium">Събития</h3>
      <div className="flex flex-col space-y-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value === undefined}
            onChange={() => onChange(undefined)}
            className="radio radio-sm"
          />
          <span>Всички кампании</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value === true}
            onChange={() => onChange(true)}
            className="radio radio-sm"
          />
          <span>Само с предстоящи събития</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value === false}
            onChange={() => onChange(false)}
            className="radio radio-sm"
          />
          <span>Без събития</span>
        </label>
      </div>
    </div>
  );
} 