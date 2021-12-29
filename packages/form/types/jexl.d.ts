export declare class Jexl {
  evalSync: (expression: string, context?: unknown) => unknown;
  addTransform: (name: string, fn: (...args: unknown[]) => unknown) => void;
  addBinaryOp: (
    name: string,
    precedence: number,
    fn: (...args: unknown[]) => unknown
  ) => void;
}
