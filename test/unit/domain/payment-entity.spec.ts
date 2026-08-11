import { describe, it, expect } from 'vitest'
import { Payment } from '../../../src/core/domain/entities/payment.entity.js'
import { Money } from '../../../src/core/domain/value-objects/money.vo.js'
import { IdempotencyKey } from '../../../src/core/domain/value-objects/idempotency-key.vo.js'
import { PaymentMethod } from '../../../src/core/domain/value-objects/payment-method.vo.js'
import { PaymentStatus } from '../../../src/core/domain/value-objects/payment-status.vo.js'

describe('Payment Entity', () => {
  const createPaymentProps = () => ({
    amount: Money.fromCents(19990),
    method: PaymentMethod.pix(),
    idempotencyKey: IdempotencyKey.generate(),
  })

  it('deve criar uma nova entidade Payment com status PENDING', () => {
    const payment = Payment.create(createPaymentProps())

    expect(payment.getId()).toBeDefined()
    expect(payment.getAmount().getCents()).toBe(19990)
    expect(payment.getStatus().getValue()).toBe('PENDING')
    expect(payment.getMethod().isPix()).toBe(true)
    expect(payment.getIdempotencyKey()).toBeDefined()
    expect(payment.getCreatedAt()).toBeInstanceOf(Date)
    expect(payment.getUpdatedAt()).toBeInstanceOf(Date)
  })

  it('deve aprovar um pagamento pendente e registrar dados do provedor externo', () => {
    const payment = Payment.create(createPaymentProps())
    payment.approve('mp_123456789', 'MERCADO_PAGO')

    expect(payment.getStatus().getValue()).toBe('APPROVED')
    expect(payment.getExternalId()).toBe('mp_123456789')
    expect(payment.getProvider()).toBe('MERCADO_PAGO')
  })

  it('deve lancar erro ao tentar aprovar um pagamento ja em status terminal', () => {
    const payment = Payment.create(createPaymentProps())
    payment.approve('mp_123456789', 'MERCADO_PAGO')

    expect(() => payment.approve('mp_987654321', 'MERCADO_PAGO')).toThrow(
      'Cannot approve payment in terminal status: APPROVED',
    )
  })

  it('deve rejeitar um pagamento pendente', () => {
    const payment = Payment.create(createPaymentProps())
    payment.reject('mp_rejected_123', 'MERCADO_PAGO')

    expect(payment.getStatus().getValue()).toBe('REJECTED')
    expect(payment.getExternalId()).toBe('mp_rejected_123')
  })

  it('deve cancelar um pagamento pendente', () => {
    const payment = Payment.create(createPaymentProps())
    payment.cancel()

    expect(payment.getStatus().getValue()).toBe('CANCELLED')
  })

  it('deve estornar um pagamento aprovado com sucesso', () => {
    const payment = Payment.create(createPaymentProps())
    payment.approve('mp_123456789', 'MERCADO_PAGO')
    payment.refund()

    expect(payment.getStatus().getValue()).toBe('REFUNDED')
  })

  it('deve lancar erro ao tentar estornar um pagamento que nao esta aprovado', () => {
    const payment = Payment.create(createPaymentProps())

    expect(() => payment.refund()).toThrow('Cannot refund payment with status: PENDING')
  })

  it('deve definir detalhes do PIX (QR Code e QR Code Base64)', () => {
    const payment = Payment.create(createPaymentProps())
    payment.setPixDetails('00020126580014br.gov.bcb.pix...', 'data:image/png;base64,iVBORw0KGgo...')

    expect(payment.getQrCode()).toBe('00020126580014br.gov.bcb.pix...')
    expect(payment.getQrCodeBase64()).toBe('data:image/png;base64,iVBORw0KGgo...')
  })

  it('deve restaurar um pagamento existente a partir do banco/repositorio', () => {
    const now = new Date()
    const payment = Payment.restore({
      id: 'custom_id_123',
      amount: Money.fromCents(5000),
      status: PaymentStatus.create('APPROVED'),
      method: PaymentMethod.creditCard(),
      idempotencyKey: IdempotencyKey.generate(),
      externalId: 'ext_999',
      provider: 'STRIPE',
      createdAt: now,
      updatedAt: now,
    })

    expect(payment.getId()).toBe('custom_id_123')
    expect(payment.getAmount().getCents()).toBe(5000)
    expect(payment.getStatus().getValue()).toBe('APPROVED')
    expect(payment.getProvider()).toBe('STRIPE')
  })
})
