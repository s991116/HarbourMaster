import { HarbourPanelsChrome } from './HarbourPanelsChrome'

type HarbourLandscapeSidebarProps = {
  cleatDebug: boolean
}

export function HarbourLandscapeSidebar({ cleatDebug }: HarbourLandscapeSidebarProps) {
  return <HarbourPanelsChrome cleatDebug={cleatDebug} mode="landscape-sidebar" />
}
