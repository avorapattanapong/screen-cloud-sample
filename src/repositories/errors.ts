export type RepositoryErrorType = 'NotFound' | 'Validation' | 'Unknown';

export class RepositoryError extends Error {
  type: RepositoryErrorType;
  cause?: unknown;
  constructor(type: RepositoryErrorType, message: string, cause?: unknown) {
    super(message);
    this.type = type;
    this.cause = cause;
  }
}
