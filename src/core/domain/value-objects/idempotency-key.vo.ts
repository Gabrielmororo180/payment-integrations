import { randomUUID } from 'node:crypto'

/**
 * Value Object representing a unique Idempotency Key (UUID v4 format).
 * Used to ensure payment mutation requests are processed safely without duplicate charges.
 */
export class IdempotencyKey {
  private readonly value: string
  private static readonly UUID_V4_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  private constructor(value: string) {
    this.validate(value)
    this.value = value
  }

  /**
   * Validates that the key is a non-empty, properly formatted UUID v4 string.
   */
  private validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new Error('Idempotency key must be a non-empty string.')
    }
    if (!IdempotencyKey.UUID_V4_REGEX.test(value)) {
      throw new Error('Invalid idempotency key format. Must be a valid UUID v4.')
    }
  }

  /**
   * Factory method to encapsulate an existing UUID v4 string.
   */
  public static create(value: string): IdempotencyKey {
    return new IdempotencyKey(value)
  }

  /**
   * Factory method to generate a new cryptographically strong UUID v4 IdempotencyKey.
   */
  public static generate(): IdempotencyKey {
    return new IdempotencyKey(randomUUID())
  }

  /**
   * Returns the string representation of the idempotency key.
   */
  public getValue(): string {
    return this.value
  }

  /**
   * Compares equality with another IdempotencyKey.
   */
  public equals(other: IdempotencyKey): boolean {
    return this.value === other.getValue()
  }
}
