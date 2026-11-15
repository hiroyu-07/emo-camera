import type { FilterFunction } from 'react-native';

/**
 * Converts the RN CSS-style `filter` array (saturate/contrast/brightness/hueRotate/grayscale)
 * into a Skia ColorMatrix (20-value array), so the same look can be baked into a static
 * photo via @shopify/react-native-skia — the `filter` style prop itself doesn't render on
 * this RN version's CameraView or Image, so this is the reliable alternative.
 *
 * Each individual filter is represented as a 4x4 linear part + 4-length offset (affine
 * transform on RGBA), matching the W3C Filter Effects matrices. Filters compose in the
 * order they appear, same as CSS `filter` chains.
 */

type Linear = number[]; // 16 values, row-major 4x4
type Offset = number[]; // 4 values

const IDENTITY_LINEAR: Linear = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const ZERO_OFFSET: Offset = [0, 0, 0, 0];

function multiply4x4(a: Linear, b: Linear): Linear {
  const out = new Array(16).fill(0);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += a[row * 4 + k] * b[k * 4 + col];
      }
      out[row * 4 + col] = sum;
    }
  }
  return out;
}

function applyLinearToVector(m: Linear, v: Offset): Offset {
  const out = [0, 0, 0, 0];
  for (let row = 0; row < 4; row++) {
    let sum = 0;
    for (let k = 0; k < 4; k++) {
      sum += m[row * 4 + k] * v[k];
    }
    out[row] = sum;
  }
  return out;
}

/** Composes "apply `first`, then `second`" into a single affine transform. */
function compose(
  first: { linear: Linear; offset: Offset },
  second: { linear: Linear; offset: Offset }
): { linear: Linear; offset: Offset } {
  const linear = multiply4x4(second.linear, first.linear);
  const offset = applyLinearToVector(second.linear, first.offset).map(
    (v, i) => v + second.offset[i]
  );
  return { linear, offset };
}

function saturateOp(s: number) {
  const linear: Linear = [
    0.213 + 0.787 * s,
    0.715 - 0.715 * s,
    0.072 - 0.072 * s,
    0,
    0.213 - 0.213 * s,
    0.715 + 0.285 * s,
    0.072 - 0.072 * s,
    0,
    0.213 - 0.213 * s,
    0.715 - 0.715 * s,
    0.072 + 0.928 * s,
    0,
    0,
    0,
    0,
    1,
  ];
  return { linear, offset: ZERO_OFFSET };
}

function grayscaleOp(amount: number) {
  const a = 1 - amount;
  const linear: Linear = [
    0.2126 + 0.7874 * a,
    0.7152 - 0.7152 * a,
    0.0722 - 0.0722 * a,
    0,
    0.2126 - 0.2126 * a,
    0.7152 + 0.2848 * a,
    0.0722 - 0.0722 * a,
    0,
    0.2126 - 0.2126 * a,
    0.7152 - 0.7152 * a,
    0.0722 + 0.9278 * a,
    0,
    0,
    0,
    0,
    1,
  ];
  return { linear, offset: ZERO_OFFSET };
}

function brightnessOp(b: number) {
  const linear: Linear = [b, 0, 0, 0, 0, b, 0, 0, 0, 0, b, 0, 0, 0, 0, 1];
  return { linear, offset: ZERO_OFFSET };
}

function contrastOp(c: number) {
  const linear: Linear = [c, 0, 0, 0, 0, c, 0, 0, 0, 0, c, 0, 0, 0, 0, 1];
  const t = 0.5 * (1 - c);
  return { linear, offset: [t, t, t, 0] };
}

function hueRotateOp(deg: number) {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const linear: Linear = [
    0.213 + cos * 0.787 - sin * 0.213,
    0.715 - cos * 0.715 - sin * 0.715,
    0.072 - cos * 0.072 + sin * 0.928,
    0,
    0.213 - cos * 0.213 + sin * 0.143,
    0.715 + cos * 0.285 + sin * 0.14,
    0.072 - cos * 0.072 - sin * 0.283,
    0,
    0.213 - cos * 0.213 - sin * 0.787,
    0.715 - cos * 0.715 + sin * 0.715,
    0.072 + cos * 0.928 + sin * 0.072,
    0,
    0,
    0,
    0,
    1,
  ];
  return { linear, offset: ZERO_OFFSET };
}

/** Builds a flat 20-value Skia ColorMatrix equivalent to the given RN `filter` array. */
export function buildSkiaColorMatrix(filters: readonly FilterFunction[]): number[] {
  let acc = { linear: IDENTITY_LINEAR, offset: ZERO_OFFSET };

  for (const f of filters) {
    let op: { linear: Linear; offset: Offset } | null = null;
    if ('saturate' in f) op = saturateOp(Number(f.saturate));
    else if ('grayscale' in f) op = grayscaleOp(Number(f.grayscale));
    else if ('brightness' in f) op = brightnessOp(Number(f.brightness));
    else if ('contrast' in f) op = contrastOp(Number(f.contrast));
    else if ('hueRotate' in f) op = hueRotateOp(Number(f.hueRotate));
    if (op) acc = compose(acc, op);
  }

  const { linear, offset } = acc;
  return [
    linear[0],
    linear[1],
    linear[2],
    linear[3],
    offset[0],
    linear[4],
    linear[5],
    linear[6],
    linear[7],
    offset[1],
    linear[8],
    linear[9],
    linear[10],
    linear[11],
    offset[2],
    linear[12],
    linear[13],
    linear[14],
    linear[15],
    offset[3],
  ];
}
