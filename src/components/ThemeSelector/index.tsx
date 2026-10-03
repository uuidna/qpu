'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** Light or dark, remembered: the choice is written to data-theme at once and to localStorage for the next visit. */
export function ThemeSelector() {
  const toggle = () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </Button>
  )
}
