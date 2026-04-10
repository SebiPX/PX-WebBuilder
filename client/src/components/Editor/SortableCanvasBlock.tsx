import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { BlockRenderer } from './Blocks/BlockRenderer';
import { useProjectStore } from '../../store/useProjectStore';
import type { Block } from '../../types';

interface Props {
  block: Block;
}

export const SortableCanvasBlock = ({ block }: Props) => {
  const { selectedBlockId, setSelectedBlockId } = useProjectStore();
  
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({
    id: block.id,
    data: {
      type: 'SortableBlock'
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBlockId(block.id);
      }}
      className={`relative rounded-3xl transition-all bg-white shadow-sm group ${
        selectedBlockId === block.id 
          ? 'ring-4 ring-purple-500 ring-offset-2' 
          : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
      }`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        title="Halten um zu verschieben"
        className="absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-3 lg:p-4 cursor-grab active:cursor-grabbing text-gray-400 hover:text-black z-50 transition-opacity flex items-center justify-center bg-white shadow-md rounded-full border border-gray-100"
      >
        <GripVertical size={24} />
      </div>
      <div className="pointer-events-none w-full">
         <BlockRenderer block={block} />
      </div>
    </div>
  );
};
