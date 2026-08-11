import { describe, it, expect } from 'vitest'
import {
  PaymentStatus,
  PaymentStatusType,
} from '../../../src/core/domain/value-objects/payment-status.vo.js'

describe('PaymentStatus Value Object', () => {
  it('deve criar um PaymentStatus valido', () => {
    const status = PaymentStatus.create('APPROVED')
    expect(status.getValue()).toBe('APPROVED')
  })

  it('deve criar status PENDING a partir da fabrica estatica pending()', () => {
    const status = PaymentStatus.pending()
    expect(status.getValue()).toBe('PENDING')
  })

  it('deve lancar erro ao tentar criar status invalido', () => {
    expect(() => PaymentStatus.create('INVALID_STATUS' as PaymentStatusType)).toThrow(
      'Invalid payment status: INVALID_STATUS',
    )
  })

  it('deve identificar corretamente se um status e terminal', () => {
    expect(PaymentStatus.pending().isTerminal()).toBe(false)
    expect(PaymentStatus.create('APPROVED').isTerminal()).toBe(true)
    expect(PaymentStatus.create('REJECTED').isTerminal()).toBe(true)
    expect(PaymentStatus.create('CANCELLED').isTerminal()).toBe(true)
    expect(PaymentStatus.create('REFUNDED').isTerminal()).toBe(true)
  })

  it('deve identificar se um pagamento pode ser estornado (somente APPROVED)', () => {
    expect(PaymentStatus.create('APPROVED').canRefund()).toBe(true)
    expect(PaymentStatus.pending().canRefund()).toBe(false)
    expect(PaymentStatus.create('REJECTED').canRefund()).toBe(false)
  })

  it('deve comparar igualdade de dois PaymentStatus', () => {
    const status1 = PaymentStatus.create('APPROVED')
    const status2 = PaymentStatus.create('APPROVED')
    const status3 = PaymentStatus.create('PENDING')

    expect(status1.equals(status2)).toBe(true)
    expect(status1.equals(status3)).toBe(false)
  })
})
