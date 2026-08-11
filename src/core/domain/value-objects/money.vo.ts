export class Money {
  private readonly cents: number

  private constructor(cents: number) {
    this.validate(cents)
    this.cents = cents
  }

  private validate(cents: number): void {
    if (!Number.isInteger(cents)) {
      throw new Error('Money amount must be an integer representing cents.')
    }
    if (cents < 0) {
      throw new Error('Money amount cannot be negative.')
    }
  }

  public static fromCents(cents: number): Money {
    return new Money(cents)
  }

  public static fromReais(reais: number): Money {
    const cents = Math.round(reais * 100)
    return new Money(cents)
  }

  public getCents(): number {
    return this.cents
  }

  public toReais(): number {
    return this.cents / 100
  }

  public formatFormatted(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.toReais())
  }

  public equals(other: Money): boolean {
    return this.cents === other.getCents()
  }
}
