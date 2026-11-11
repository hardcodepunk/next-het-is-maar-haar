export const place = (x: number, y: number, w: number, h: number, rotate = 0) => ({
  left: `${x * 100}%`,
  top: `${y * 100}%`,
  width: `${w * 100}%`,
  height: `${h * 100}%`,
  ...(rotate ? { transform: `rotate(${rotate}deg)` } : {}),
});
