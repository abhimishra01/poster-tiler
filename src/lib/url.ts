// Internal URLs. They work at the site root and under a base path such as /poster-tiler/ (GitHub Pages).
const root = import.meta.env.BASE_URL.replace(/\/+$/, '');
export const withBase = (path: string) => `${root}/${path.replace(/^\/+/, '')}`;
// The page path without the base, for example "/about/".
export const stripBase = (pathname: string) => (root && pathname.startsWith(root) ? pathname.slice(root.length) || '/' : pathname);
