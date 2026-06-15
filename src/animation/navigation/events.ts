export const NAVIGATION_EVENT = "second-student:navigate-to";
export const NAVIGATION_STARTED_EVENT = "second-student:navigation-started";
export const NAVIGATION_SETTLED_EVENT = "second-student:navigation-settled";
export const ENTRY_OVERLAY_STARTED_EVENT = "second-student:entry-overlay-started";
export const ENTRY_OVERLAY_DISMISSED_EVENT = "second-student:entry-overlay-dismissed";

export type NavigationDirection = -1 | 1;

export type NavigationRequest = {
  direction?: NavigationDirection;
  splitStep?: number;
  targetId?: string;
};

export type NavigationSettledDetail = {
  id: string;
  index: number;
  splitStep?: number;
};

export type EntryOverlayDetail = {
  id?: string;
};
