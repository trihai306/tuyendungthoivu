import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { TableHead } from "./table"

interface SortableHeaderProps {
  /** Display label */
  label: string
  /** The field name sent to API (must match backend allowedSorts) */
  field: string
  /** Current sort value, e.g. "-created_at" or "full_name" */
  currentSort: string
  /** Called with new sort value */
  onSort: (sort: string) => void
  /** Additional className for TableHead */
  className?: string
}

export function SortableHeader({
  label,
  field,
  currentSort,
  onSort,
  className = "",
}: SortableHeaderProps) {
  const isActive = currentSort === field || currentSort === `-${field}`
  const isDesc = currentSort === `-${field}`

  function handleClick() {
    if (!isActive) {
      // First click: sort asc
      onSort(field)
    } else if (!isDesc) {
      // Second click: sort desc
      onSort(`-${field}`)
    } else {
      // Third click: remove sort (back to default)
      onSort("-created_at")
    }
  }

  return (
    <TableHead
      className={`cursor-pointer select-none hover:bg-muted/50 transition-colors ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (
          isDesc ? (
            <ArrowDown className="h-3.5 w-3.5 text-primary" />
          ) : (
            <ArrowUp className="h-3.5 w-3.5 text-primary" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/40" />
        )}
      </div>
    </TableHead>
  )
}
