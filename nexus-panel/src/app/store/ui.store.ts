import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

  interface UiState {
    sidebarCollapsed: boolean;
    mobileDrawerOpen: boolean;
  }

  export const UiStore = signalStore(
    { providedIn: 'root' },
    withState<UiState>({
      sidebarCollapsed: false,
      mobileDrawerOpen: false,
    }),
    withMethods((store) => ({
      toggleSidebar() {
        patchState(store, { sidebarCollapsed: !store.sidebarCollapsed() });
      },
      toggleMobileDrawer() {
        patchState(store, { mobileDrawerOpen: !store.mobileDrawerOpen() });
      },
      closeMobileDrawer() {
        patchState(store, { mobileDrawerOpen: false });
      },
    }))
  );