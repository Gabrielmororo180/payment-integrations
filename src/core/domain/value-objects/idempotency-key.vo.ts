import { randomUUID } from 'node:crypto'

export class IdempotencyKey {
  private readonly value: string
  private static readonly UUID_V4_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  private constructor(value: string) {
    this.validate(value)
    this.value = value
  }

  private validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new Error('Idempotency key must be a non-empty string.')
    }
    if (!IdempotencyKey.UUID_V4_REGEX.test(value)) {
      throw new Error('Invalid idempotency key format. Must be a valid UUID v4.')
    }
  }

  public static create(value: string): IdempotencyKey {
    return new IdempotencyKey(value)
  }

  public static generate(): IdempotencyKey {
    return new IdempotencyKey(randomUUID())
  }

  public getValue(): string {
    return this.value
  }

  public equals(other: IdempotencyKey): boolean {
    return this.value === other.getValue()
  }
}
