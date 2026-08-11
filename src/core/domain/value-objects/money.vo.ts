/**
 * Value Object representing a monetary amount stored strictly as integer cents.
 * Prevents floating point inaccuracies in financial calculations.
 */
export class Money {
  private readonly cents: number

  private constructor(cents: number) {
    this.validate(cents)
    this.cents = cents
  }

  /**
   * Validates that the amount is a non-negative integer representing cents.
   */
  private validate(cents: number): void {
    if (!Number.isInteger(cents)) {
      throw new Error('Money amount must be an integer representing cents.')
    }
    if (cents < 0) {
      throw new Error('Money amount cannot be negative.')
    }
  }

  /**
   * Factory method to create Money directly from an integer amount in cents.
   * Example: 19990 represents R$ 199,90.
   */
  public static fromCents(cents: number): Money {
    return new Money(cents)
  }

  /**
   * Factory method to create Money from a decimal value in Reais.
   * Converts the decimal to rounded integer cents.
   */
  public static fromReais(reais: number): Money {
    const cents = Math.round(reais * 100)
    return new Money(cents)
  }

  /**
   * Returns the integer amount in cents for persistence and API payloads.
   */
  public getCents(): number {
    return this.cents
  }

  /**
   * Returns the decimal value in Reais for display purposes.
   */
  public toReais(): number {
    return this.cents / 100
  }

  /**
   * Formats the amount to Brazilian Real currency format (BRL).
   */
  public formatFormatted(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.toReais())
  }

  /**
   * Compares equality with another Money Value Object.
   */
  public equals(other: Money): boolean {
    return this.cents === other.getCents()
  }
}
