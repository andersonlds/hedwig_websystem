import { Plus } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  description: string;
  onAdd?: () => void;
}

export default function SectionHeader({ title, description, onAdd }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-8 mb-12">
      <div>
        <h1 className="text-4xl font-display font-black text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {onAdd && (
        <button 
          onClick={onAdd}
          className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary text-background font-black tracking-widest text-xs shadow-glow hover:shadow-glow-strong"
        >
          <Plus className="h-4 w-4" /> NOVO ITEM
        </button>
      )}
    </div>
  );
}
