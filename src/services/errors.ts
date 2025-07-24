export type ServiceErrorType = 'OrderFailed' | 'InvalidInput' | 'BusinessRule' | 'Repository' | 'Unknown';

export class ServiceError extends Error {
  type: ServiceErrorType;
  cause?: unknown;
  constructor(type: ServiceErrorType, message: string, cause?: unknown) {
    super(message);
    this.type = type;
    this.cause = cause;
  }
}
