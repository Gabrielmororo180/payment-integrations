import { randomUUID } from 'node:crypto'
import { Money } from '../value-objects/money.vo.js'
import { IdempotencyKey } from '../value-objects/idempotency-key.vo.js'
import { PaymentStatus } from '../value-objects/payment-status.vo.js'
import { PaymentMethod } from '../value-objects/payment-method.vo.js'

export interface CreatePaymentProps {
  amount: Money
  method: PaymentMethod
  idempotencyKey: IdempotencyKey
}

export interface RestorePaymentProps {
  id: string
  amount: Money
  status: PaymentStatus
  method: PaymentMethod
  idempotencyKey: IdempotencyKey
  externalId?: string
  provider?: string
  qrCode?: string
  qrCodeBase64?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Payment Domain Entity.
 * Represents a payment transaction in the core domain with business rules and state transitions.
 */
export class Payment {
  private readonly id: string
  private readonly amount: Money
  private status: PaymentStatus
  private readonly method: PaymentMethod
  private readonly idempotencyKey: IdempotencyKey
  private externalId?: string
  private provider?: string
  private qrCode?: string
  private qrCodeBase64?: string
  private readonly createdAt: Date
  private updatedAt: Date

  private constructor(props: RestorePaymentProps) {
    this.id = props.id
    this.amount = props.amount
    this.status = props.status
    this.method = props.method
    this.idempotencyKey = props.idempotencyKey
    this.externalId = props.externalId
    this.provider = props.provider
    this.qrCode = props.qrCode
    this.qrCodeBase64 = props.qrCodeBase64
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  /**
   * Factory method to create a new Payment instance in PENDING status.
   */
  public static create(props: CreatePaymentProps): Payment {
    const now = new Date()
    return new Payment({
      id: randomUUID(),
      amount: props.amount,
      status: PaymentStatus.pending(),
      method: props.method,
      idempotencyKey: props.idempotencyKey,
      createdAt: now,
      updatedAt: now,
    })
  }

  /**
   * Factory method to restore an existing Payment instance from persistence.
   */
  public static restore(props: RestorePaymentProps): Payment {
    return new Payment(props)
  }

  /**
   * Approves the payment and binds the external provider transaction ID.
   */
  public approve(externalId: string, provider: string): void {
    if (this.status.isTerminal()) {
      throw new Error(`Cannot approve payment in terminal status: ${this.status.getValue()}`)
    }
    this.status = PaymentStatus.create('APPROVED')
    this.externalId = externalId
    this.provider = provider
    this.touch()
  }

  /**
   * Rejects the payment transaction.
   */
  public reject(externalId?: string, provider?: string): void {
    if (this.status.isTerminal()) {
      throw new Error(`Cannot reject payment in terminal status: ${this.status.getValue()}`)
    }
    this.status = PaymentStatus.create('REJECTED')
    if (externalId) this.externalId = externalId
    if (provider) this.provider = provider
    this.touch()
  }

  /**
   * Cancels the pending payment.
   */
  public cancel(): void {
    if (this.status.isTerminal()) {
      throw new Error(`Cannot cancel payment in terminal status: ${this.status.getValue()}`)
    }
    this.status = PaymentStatus.create('CANCELLED')
    this.touch()
  }

  /**
   * Refunds an approved payment transaction.
   */
  public refund(): void {
    if (!this.status.canRefund()) {
      throw new Error(`Cannot refund payment with status: ${this.status.getValue()}`)
    }
    this.status = PaymentStatus.create('REFUNDED')
    this.touch()
  }

  /**
   * Sets PIX payment details (QR code string and base64 image).
   */
  public setPixDetails(qrCode: string, qrCodeBase64?: string): void {
    this.qrCode = qrCode
    this.qrCodeBase64 = qrCodeBase64
    this.touch()
  }

  private touch(): void {
    this.updatedAt = new Date()
  }

  // Getters
  public getId(): string {
    return this.id
  }

  public getAmount(): Money {
    return this.amount
  }

  public getStatus(): PaymentStatus {
    return this.status
  }

  public getMethod(): PaymentMethod {
    return this.method
  }

  public getIdempotencyKey(): IdempotencyKey {
    return this.idempotencyKey
  }

  public getExternalId(): string | undefined {
    return this.externalId
  }

  public getProvider(): string | undefined {
    return this.provider
  }

  public getQrCode(): string | undefined {
    return this.qrCode
  }

  public getQrCodeBase64(): string | undefined {
    return this.qrCodeBase64
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }
}
