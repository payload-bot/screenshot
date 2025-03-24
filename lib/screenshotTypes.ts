export type ElementBasedBound = {
  selector: string;
  edge: "top" | "bottom" | "left" | "right";
};

export interface CaptureOptions {
  [index: string]:
    | string
    | number
    | Array<string>
    | ElementBasedBound
    | undefined;

  waitFor?: string | Array<string>;
  top: number | ElementBasedBound;
  bottom?: number | ElementBasedBound;
  left: number | ElementBasedBound;
  right?: number | ElementBasedBound;
  cssPath?: string;
}