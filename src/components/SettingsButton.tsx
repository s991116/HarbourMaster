import { HarbourPopupButton } from './HarbourPopupButton'
import { SettingsWindowContent } from './SettingsWindow'

type SettingsButtonProps = {
  className?: string
}

export function SettingsButton({ className = '' }: SettingsButtonProps) {
  return (
    <HarbourPopupButton
      label="Settings"
      windowTitle="Settings"
      titleId="settings-window-title"
      className={className}
    >
      <SettingsWindowContent />
    </HarbourPopupButton>
  )
}
