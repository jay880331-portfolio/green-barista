'use client';

interface NewsCategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

export default function NewsCategoryFilter({ categories, active, onChange }: NewsCategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
            active === cat
              ? 'bg-espresso text-white border-espresso'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
