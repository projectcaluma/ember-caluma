import { ValidationResult } from "ember-validators";

export default class ValidatorService {
  validate(
    value: AnswerValue | undefined,
    validators: string[]
  ): Promise<ValidationResult[]>;
}
