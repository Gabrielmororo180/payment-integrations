/**
 * Base abstract class for all domain errors in the application.
 */
export abstract class DomainError extends Error {
  public readonly name: string

  protected constructor(message: string, name: string) {
    super(message)
    this.name = name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Thrown when a monetary amount is invalid (e.g. negative or non-integer cents).
 */
export class InvalidAmountError extends DomainError {
  constructor(message: string = 'Invalid monetary amount.') {
    super(message, 'InvalidAmountError')
  }
}

/**
 * Thrown when an idempotency key is malformed or invalid UUID v4.
 */
export class InvalidIdempotencyKeyError extends DomainError {
  constructor(message: string = 'Invalid idempotency key format.') {
    super(message, 'InvalidIdempotencyKeyError')
  }
}

/**
 * Thrown when an unsupported or malformed payment status or method is provided.
 */
export class InvalidPaymentValueError extends DomainError {
  constructor(message: string = 'Invalid payment value.') {
    super(message, 'InvalidPaymentValueError')
  }
}

/**
 * Thrown when an illegal state transition is attempted on a Payment entity.
 */
export class InvalidStatusTransitionError extends DomainError {
  constructor(message: string = 'Invalid status transition.') {
    super(message, 'InvalidStatusTransitionError')
  }
}

/**
 * Thrown when a requested payment entity cannot be found.
 */
export class PaymentNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Payment with ID "${id}" was not found.`, 'PaymentNotFoundError')
  }
}
