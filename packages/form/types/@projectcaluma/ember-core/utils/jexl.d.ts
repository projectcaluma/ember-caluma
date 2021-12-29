import { Jexl } from "jexl";

type JexlASTNodeType =
  | "BinaryExpression"
  | "UnaryExpression"
  | "FunctionCall"
  | "Literal";

interface JexlASTNode {
  type: JexlASTNodeType;

  operator?: string;
  name?: string;
  value?: unknown;
  pool?: string;

  _parent?: JexlASTNode;
  left?: JexlASTNode;
  right?: JexlASTNode;
  args?: JexlASTNode[];
}

interface JexlTransformAST {
  type: "FunctionCall";
  pool: "transforms";
  name: string;
  args: JexlASTNode[];
}

export declare function intersects(left: unknown[], right: unknown): boolean;
export declare function mapby(
  arr: unknown[],
  ...keys: string[]
): Record<string, unknown> | null;
export declare function getAST(jexl: Jexl, expression: string): JexlASTNode;
export declare function getTransforms(ast: JexlASTNode): JexlTransformAST[];
