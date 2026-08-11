import { describe, it, expect } from 'vitest'
import {
  DomainError,
  InvalidAmountError,
  InvalidIdempotencyKeyError,
  InvalidPaymentValueError,
  InvalidStatusTransitionError,
  PaymentNotFoundError,
} from '../../../src/core/domain/errors/domain.errors.js'

describe('Domain Errors', () => {
  it('deve instanciar InvalidAmountError como uma subclasse de DomainError', () => {
    const error = new InvalidAmountError('Valor invalido')
    expect(error).toBeInstanceOf(DomainError)
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('InvalidAmountError')
    expect(error.message).toBe('Valor invalido')
  })

  it('deve instanciar InvalidIdempotencyKeyError', () => {
    const error = new InvalidIdempotencyKeyError()
    expect(error).toBeInstanceOf(DomainError)
    expect(error.name).toBe('InvalidIdempotencyKeyError')
    expect(error.message).toBe('Invalid idempotency key format.')
  })

  it('deve instanciar InvalidPaymentValueError', () => {
    const error = new InvalidPaymentValueError('Status invalido')
    expect(error).toBeInstanceOf(DomainError)
    expect(error.name).toBe('InvalidPaymentValueError')
    expect(error.message).toBe('Status invalido')
  })

  it('deve instanciar InvalidStatusTransitionError', () => {
    const error = new InvalidStatusTransitionError('Transicao ilegal')
    expect(error).toBeInstanceOf(DomainError)
    expect(error.name).toBe('InvalidStatusTransitionError')
  })

  it('deve instanciar PaymentNotFoundError com mensagem contendo o ID', () => {
    const error = new PaymentNotFoundError('pay_123456')
    expect(error).toBeInstanceOf(DomainError)
    expect(error.name).toBe('PaymentNotFoundError')
    expect(error.message).toBe('Payment with ID "pay_123456" was not found.')
  })
})
