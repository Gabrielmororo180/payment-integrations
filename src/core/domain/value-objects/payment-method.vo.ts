export type PaymentMethodType = 'PIX' | 'CREDIT_CARD'

/**
 * Value Object representing the payment method used for a transaction.
 * Currently supports PIX and CREDIT_CARD.
 */
export class PaymentMethod {
  private readonly value: PaymentMethodType

  private static readonly VALID_METHODS: PaymentMethodType[] = ['PIX', 'CREDIT_CARD']

  private constructor(value: PaymentMethodType) {
    this.validate(value)
    this.value = value
  }

  /**
   * Validates that the provided payment method is supported.
   */
  private validate(value: PaymentMethodType): void {
    if (!PaymentMethod.VALID_METHODS.includes(value)) {
      throw new Error(`Invalid payment method: ${value}`)
    }
  }

  /**
   * Factory method to create a PaymentMethod instance.
   */
  public static create(value: PaymentMethodType): PaymentMethod {
    return new PaymentMethod(value)
  }

  /**
   * Factory method for PIX payment method.
   */
  public static pix(): PaymentMethod {
    return new PaymentMethod('PIX')
  }

  /**
   * Factory method for CREDIT_CARD payment method.
   */
  public static creditCard(): PaymentMethod {
    return new PaymentMethod('CREDIT_CARD')
  }

  /**
   * Returns the string representation of the payment method.
   */
  public getValue(): PaymentMethodType {
    return this.value
  }

  /**
   * Returns true if the payment method is PIX.
   */
  public isPix(): boolean {
    return this.value === 'PIX'
  }

  /**
   * Compares equality with another PaymentMethod instance.
   */
  public equals(other: PaymentMethod): boolean {
    return this.value === other.getValue()
  }
}
