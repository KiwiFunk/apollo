import { atom } from 'nanostores';


// Sidebar States
export const $isSidebarOpen = atom(false);

export const toggleSidebar = () => $isSidebarOpen.set(!$isSidebarOpen.get());
export const closeSidebar = () => $isSidebarOpen.set(false);

// Modal State
export const $isCreateModalOpen = atom(false);

export const setCreateModalOpen = (isOpen: boolean) => {
    $isCreateModalOpen.set(isOpen);
};