import { Monitor, Moon, Sun } from 'lucide-react'

import { useTheme, type ThemeMode } from '../theme-provider'
import { ToggleGroup, ToggleItem } from './toggle-group'

const MODES: { value: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
]

/** Three explicit states rather than a two-way flip, so "follow the OS" stays
 *  reachable — a binary toggle silently strands users who want it. */
export function ThemeToggle() {
  const { mode, setMode } = useTheme()

  return (
    <ToggleGroup
      value={[mode]}
      onValueChange={(value) => {
        // Base UI hands back the full pressed set; this group is
        // single-select, so take the first and ignore an empty deselect.
        const next = value[0] as ThemeMode | undefined
        if (next) setMode(next)
      }}
      multiple={false}
      aria-label="Colour theme"
    >
      {MODES.map(({ value, label, Icon }) => (
        <ToggleItem key={value} value={value} aria-label={label} title={label}>
          <Icon />
        </ToggleItem>
      ))}
    </ToggleGroup>
  )
}
