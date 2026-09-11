declare namespace cv {
  // Core types
  class Mat {
    rows: number;
    cols: number;
    type: number;
    data: Uint8Array;
    data32S: Int32Array;
    clone(): Mat;
    delete(): void;
    roi(rect: Rect): Mat;
    copyTo(mat: Mat): void;
    intAt(row: number, col: number): number;
  }

  class MatVector {
    size(): number;
    get(i: number): Mat;
    set(i: number, mat: Mat): void;
    delete(): void;
  }

  class Size {
    constructor(width: number, height: number);
    width: number;
    height: number;
  }

  class Point {
    constructor(x: number, y: number);
  }

  class Rect {
    constructor(x: number, y: number, width: number, height: number);
    x: number;
    y: number;
    width: number;
    height: number;
  }

  // Constants
  const COLOR_RGBA2GRAY: number;
  const COLOR_GRAY2RGBA: number;
  const COLOR_RGBA2RGB: number;
  const COLOR_RGB2Lab: number;
  const COLOR_Lab2RGB: number;
  const COLOR_RGB2RGBA: number;
  const MORPH_RECT: number;
  const RETR_EXTERNAL: number;
  const CHAIN_APPROX_SIMPLE: number;
  const INTER_LINEAR: number;
  const CV_32FC2: number;

  // Functions
  function imread(source: HTMLCanvasElement | HTMLImageElement): Mat;
  function imshow(canvas: HTMLCanvasElement, mat: Mat): void;
  function cvtColor(src: Mat, dst: Mat, code: number): void;
  function GaussianBlur(src: Mat, dst: Mat, ksize: Size, sigmaX: number): void;
  function Canny(src: Mat, dst: Mat, threshold1: number, threshold2: number): void;
  function dilate(src: Mat, dst: Mat, kernel: Mat, anchor: Point, iterations: number): void;
  function getStructuringElement(shape: number, ksize: Size): Mat;
  function findContours(image: Mat, contours: MatVector, hierarchy: Mat, mode: number, method: number): void;
  function contourArea(contour: Mat): number;
  function arcLength(curve: Mat, closed: boolean): number;
  function approxPolyDP(curve: Mat, approxCurve: Mat, epsilon: number, closed: boolean): void;
  function boundingRect(array: Mat): Rect;
  function minAreaRect(points: Mat): RotatedRect;
  function getRotationMatrix2D(center: Point, angle: number, scale: number): Mat;
  function warpAffine(src: Mat, dst: Mat, M: Mat, dsize: Size, flags?: number): void;
  function getPerspectiveTransform(src: Mat, dst: Mat): Mat;
  function warpPerspective(src: Mat, dst: Mat, M: Mat, dsize: Size, flags?: number): void;
  function matFromArray(rows: number, cols: number, type: number, data: number[]): Mat;
  function split(src: Mat, mv: MatVector): void;
  function merge(mv: MatVector, dst: Mat): void;
  function normalize(src: Mat, dst: Mat, alpha: number, beta: number, normType: number): void;

  class RotatedRect {
    angle: number;
    size: Size;
  }

  class CLAHE {
    constructor(clipLimit: number, tileGridSize: Size);
    apply(src: Mat, dst: Mat): void;
    delete(): void;
  }
}
