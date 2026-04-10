import { useDraggable } from '@dnd-kit/core';
import type { LucideIcon } from 'lucide-react';

interface Props {
  type: string;
  label: string;
  icon: LucideIcon;
}

export const DraggableBlockType = ({ type, label, icon: Icon }: Props) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${type}`,
    data: {
      type,
      isNewBlock: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-grab transition-colors ${
        isDragging ? 'opacity-50' : 'hover:bg-gray-100 hover:border-gray-300'
      }`}
    >
      <Icon size={24} className="mb-2 text-gray-600" />
      <span className="text-xs font-medium text-center">{label}</span>
    </div>
  );
};
