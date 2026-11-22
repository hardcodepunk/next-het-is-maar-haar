export const MOBILE_QUERY = "(max-width: 759.98px)";

export type Box = [x: number, y: number, w: number, h?: number, rotate?: number];

const pct = (v: number) => `${+(v * 100).toFixed(3)}%`;

const toVars = (prefix: string, [x, y, w, h, rotate]: Box) => ({
  [`--${prefix}x`]: pct(x),
  [`--${prefix}y`]: pct(y),
  [`--${prefix}w`]: pct(w),
  ...(h !== undefined ? { [`--${prefix}h`]: pct(h) } : {}),
  ...(rotate ? { [`--${prefix}r`]: `${rotate}deg` } : {}),
});

export const place = (desktop: Box, mobile?: Box) => ({
  ...toVars("", desktop),
  ...(mobile ? toVars("m", mobile) : {}),
});
