import { useEffect, useState } from 'react'
import { useDebouncedCallback } from '../hooks/useDebouncedCallback'

interface EditableTextProps {
  value: string
  onCommit: (value: string) => void
  as?: 'input' | 'textarea'
  className?: string
  placeholder?: string
}

export default function EditableText({
  value,
  onCommit,
  as = 'input',
  className = '',
  placeholder,
}: EditableTextProps) {
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])
  const debouncedCommit = useDebouncedCallback(onCommit, 500)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocal(e.target.value)
    debouncedCommit(e.target.value)
  }

  const sharedClassName = `w-full rounded bg-ai/5 px-1.5 py-0.5 -mx-1.5 focus:bg-ai/10 focus:outline-none dark:bg-white/5 dark:focus:bg-white/10 ${className}`

  if (as === 'textarea') {
    return (
      <textarea
        rows={2}
        value={local}
        onChange={handleChange}
        onBlur={() => onCommit(local)}
        placeholder={placeholder}
        className={sharedClassName}
      />
    )
  }

  return (
    <input
      type="text"
      value={local}
      onChange={handleChange}
      onBlur={() => onCommit(local)}
      placeholder={placeholder}
      className={sharedClassName}
    />
  )
}
