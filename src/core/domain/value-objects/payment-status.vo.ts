import { InvalidPaymentValueError } from '../errors/domain.errors.js'

export type PaymentStatusType = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'REFUNDED'

/**
 * Value Object representing the Lifecycle Status of a Payment.
 * Encapsulates status transition validation and state classification.
 */
export class PaymentStatus {
  private readonly value: PaymentStatusType

  private static readonly VALID_STATUSES: PaymentStatusType[] = [
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED',
    'REFUNDED',
  ]

  private constructor(value: PaymentStatusType) {
    this.validate(value)
    this.value = value
  }

  /**
   * Validates that the provided status is a supported PaymentStatusType.
   */
  private validate(value: PaymentStatusType): void {
    if (!PaymentStatus.VALID_STATUSES.includes(value)) {
      throw new InvalidPaymentValueError(`Invalid payment status: ${value}`)
    }
  }

  /**
   * Factory method to create a PaymentStatus instance.
   */
  public static create(value: PaymentStatusType): PaymentStatus {
    return new PaymentStatus(value)
  }

  /**
   * Factory method to create a PENDING status.
   */
  public static pending(): PaymentStatus {
    return new PaymentStatus('PENDING')
  }

  /**
   * Returns the string representation of the payment status.
   */
  public getValue(): PaymentStatusType {
    return this.value
  }

  /**
   * Returns true if the status represents a terminal state (APPROVED, REJECTED, CANCELLED, REFUNDED).
   */
  public isTerminal(): boolean {
    return this.value !== 'PENDING'
  }

  /**
   * Returns true if the payment can be refunded (only APPROVED payments can be refunded).
   */
  public canRefund(): boolean {
    return this.value === 'APPROVED'
  }

  /**
   * Compares equality with another PaymentStatus instance.
   */
  public equals(other: PaymentStatus): boolean {
    return this.value === other.getValue()
  }
}
