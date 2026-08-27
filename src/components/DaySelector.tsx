import { format } from 'date-fns'
import { GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Day } from '../types'
import { useEditMode } from '../context/EditModeContext'
import { useTripStore } from '../context/TripContext'

interface DaySelectorProps {
  days: Day[]
  activeIndex: number
  onSelect: (index: number) => void
}

interface DayPillProps {
  day: Day
  index: number
  active: boolean
  onSelect: () => void
  editMode: boolean
}

function DayPill({ day, index, active, onSelect, editMode }: DayPillProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: day.id,
    disabled: !editMode,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex min-w-[64px] flex-none flex-col items-center rounded-2xl px-3 py-2 transition-colors ${
        active
          ? 'bg-ai text-washi shadow-sm'
          : 'bg-washi-dim text-sumi/60 hover:bg-sakura-dim/60 dark:bg-white/5 dark:text-white/50 dark:hover:bg-white/10'
      } ${isDragging ? 'z-10 opacity-80' : ''}`}
    >
      {editMode && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute -top-1.5 left-1/2 flex -translate-x-1/2 touch-none items-center justify-center rounded-full bg-sumi/30 p-0.5 text-washi dark:bg-white/30"
          aria-label="Drag to reorder"
        >
          <GripVertical size={10} />
        </button>
      )}
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onClick={onSelect}
        className="flex flex-col items-center"
      >
        <span className="text-[10px] font-medium tracking-wide uppercase opacity-70">
          {format(new Date(`${day.date}T00:00:00`), 'EEE')}
        </span>
        <span className="font-serif text-lg leading-tight">{index + 1}</span>
        <span className="max-w-[64px] truncate text-[10px] opacity-80">{day.city}</span>
      </button>
    </div>
  )
}

export default function DaySelector({ days, activeIndex, onSelect }: DaySelectorProps) {
  const { editMode } = useEditMode()
  const { reorderDays } = useTripStore()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIndex = days.findIndex((d) => d.id === active.id)
    const toIndex = days.findIndex((d) => d.id === over.id)
    if (fromIndex === -1 || toIndex === -1) return
    reorderDays(fromIndex, toIndex)
  }

  return (
    <div className="sticky top-0 z-10 border-b border-sumi/10 bg-washi/95 backdrop-blur dark:border-white/10 dark:bg-ink/95">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={days.map((d) => d.id)} strategy={horizontalListSortingStrategy}>
          <div
            className="no-scrollbar mx-auto flex max-w-xl gap-2 overflow-x-auto px-4 py-3 sm:px-6"
            role="tablist"
            aria-label="Trip days"
          >
            {days.map((day, index) => (
              <DayPill
                key={day.id}
                day={day}
                index={index}
                active={index === activeIndex}
                onSelect={() => onSelect(index)}
                editMode={editMode}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
