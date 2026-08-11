import { describe, it, expect } from 'vitest';
import { Money } from '../../../src/core/domain/value-objects/money.vo.js';

describe('Money Value Object', () => {
  it('deve criar um objeto Money a partir de centavos inteiros', () => {
    const money = Money.fromCents(19990);
    expect(money.getCents()).toBe(19990);
    expect(money.toReais()).toBe(199.9);
  });

  it('deve criar um objeto Money a partir de valor em Reais', () => {
    const money = Money.fromReais(199.9);
    expect(money.getCents()).toBe(19990);
  });

  it('deve lancar erro ao tentar criar Money com valor decimal float em centavos', () => {
    expect(() => Money.fromCents(199.9)).toThrow(
      'Money amount must be an integer representing cents.',
    );
  });

  it('deve lancar erro ao tentar criar Money com valor negativo', () => {
    expect(() => Money.fromCents(-100)).toThrow('Money amount cannot be negative.');
  });

  it('deve formatar corretamente para BRL Moeda', () => {
    const money = Money.fromCents(19990);
    const formatted = money.formatFormatted();
    expect(formatted).toContain('199,90');
  });

  it('deve comparar a igualdade entre dois objetos Money', () => {
    const money1 = Money.fromCents(5000);
    const money2 = Money.fromCents(5000);
    const money3 = Money.fromCents(3000);

    expect(money1.equals(money2)).toBe(true);
    expect(money1.equals(money3)).toBe(false);
  });
});
