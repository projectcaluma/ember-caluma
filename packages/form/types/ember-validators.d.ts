interface ValidationError {
  type: string;
  value: unknown;
  context: { errorMsg?: string };
  message?: string;
}

type ValidationResult = true | ValidationError;

export declare function validate(
  type: string,
  ...args: unknown[]
): ValidationResult;
