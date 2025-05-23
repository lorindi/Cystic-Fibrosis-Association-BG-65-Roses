'use client';

interface RatingFilterProps {
  value: number | undefined;
  onChange: (value?: number) => void;
}

export default function RatingFilter({ value, onChange }: RatingFilterProps) {
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="font-medium">Минимален рейтинг</h3>
      <div className="flex flex-col space-y-1">
        {[0, 1, 2, 3, 4, 5].map((rating) => (
          <label key={rating} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={rating === 0 ? !value : value === rating}
              onChange={() => onChange(rating === 0 ? undefined : rating)}
              className="radio radio-sm"
            />
            <span>
              {rating === 0 ? 'Всички' : `${rating} ${rating === 1 ? 'звезда' : 'звезди'} или повече`}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
} 