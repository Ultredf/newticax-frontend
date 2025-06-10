import { create } from 'zustand';

interface Modal {
  id: string;
  component: React.ComponentType<any>;
  props?: any;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface UIState {
  // Modals
  modals: Modal[];
  openModal: (id: string, component: React.ComponentType<any>, props?: any) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Loading states
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  
  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Page states
  isScrolled: boolean;
  setIsScrolled: (scrolled: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Modals
  modals: [],
  
  openModal: (id, component, props) => {
    set((state) => ({
      modals: [...state.modals.filter(m => m.id !== id), { id, component, props }]
    }));
  },
  
  closeModal: (id) => {
    set((state) => ({
      modals: state.modals.filter(m => m.id !== id)
    }));
  },
  
  closeAllModals: () => {
    set({ modals: [] });
  },
  
  // Sidebar
  sidebarOpen: false,
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  // Loading
  globalLoading: false,
  
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  
  // Toasts
  toasts: [],
  
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));
    
    // Auto remove toast after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration || 5000);
    }
    
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  },
  
  // Page states
  isScrolled: false,
  
  setIsScrolled: (scrolled) => set({ isScrolled: scrolled }),
}));