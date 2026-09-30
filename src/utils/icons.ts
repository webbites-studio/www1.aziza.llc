/**
 * Inline SVG icon set
 * Replaces the former lucide-react icons with dependency-free markup.
 */

export type IconName =
  | 'arrow-left'
  | 'calendar'
  | 'check'
  | 'chevron-right'
  | 'circle-dollar'
  | 'eye'
  | 'file-text'
  | 'layout-dashboard'
  | 'log-out'
  | 'map-pin'
  | 'menu'
  | 'plus'
  | 'search'
  | 'shield-check'
  | 'trash'
  | 'users'
  | 'x';

// Shapes are drawn on a 24x24 grid with a 2px stroke so the existing `svg` CSS rules still apply.
const shapes: Record<IconName, string> = {
  'arrow-left': '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  'calendar': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'circle-dollar': '<circle cx="12" cy="12" r="9"/><path d="M12 6.5v11"/><path d="M14.5 9.5A2 2 0 0 0 12.5 8h-1a2 2 0 0 0 0 4h1a2 2 0 0 1 0 4h-1a2 2 0 0 1-2-1.5"/>',
  'eye': '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  'file-text': '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/>',
  'layout-dashboard': '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  'menu': '<path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/>',
  'plus': '<path d="M12 5v14"/><path d="M5 12h14"/>',
  'search': '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  'shield-check': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  'trash': '<path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};

export function icon(name: IconName): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name]}</svg>`;
}
