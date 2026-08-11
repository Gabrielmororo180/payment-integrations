import { describe, it, expect } from 'vitest'
import {
  PaymentMethod,
  PaymentMethodType,
} from '../../../src/core/domain/value-objects/payment-method.vo.js'

describe('PaymentMethod Value Object', () => {
  it('deve criar um PaymentMethod valido para PIX', () => {
    const method = PaymentMethod.pix()
    expect(method.getValue()).toBe('PIX')
    expect(method.isPix()).toBe(true)
  })

  it('deve criar um PaymentMethod valido para CREDIT_CARD', () => {
    const method = PaymentMethod.creditCard()
    expect(method.getValue()).toBe('CREDIT_CARD')
    expect(method.isPix()).toBe(false)
  })

  it('deve lancar erro ao tentar criar um metodo de pagamento invalido', () => {
    expect(() => PaymentMethod.create('BOLETO' as PaymentMethodType)).toThrow(
      'Invalid payment method: BOLETO',
    )
  })

  it('deve comparar igualdade entre dois PaymentMethod', () => {
    const method1 = PaymentMethod.pix()
    const method2 = PaymentMethod.create('PIX')
    const method3 = PaymentMethod.creditCard()

    expect(method1.equals(method2)).toBe(true)
    expect(method1.equals(method3)).toBe(false)
  })
})
