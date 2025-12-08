import { atom } from 'nanostores';

export const $isSidebarOpen = atom(false);

export const toggleSidebar = () => $isSidebarOpen.set(!$isSidebarOpen.get());
export const closeSidebar = () => $isSidebarOpen.set(false);