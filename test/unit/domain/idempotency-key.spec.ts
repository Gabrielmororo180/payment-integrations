import { describe, it, expect } from 'vitest'
import { IdempotencyKey } from '../../../src/core/domain/value-objects/idempotency-key.vo.js'

describe('IdempotencyKey Value Object', () => {
  it('deve criar uma IdempotencyKey com um UUID v4 valido', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000'
    const idempotencyKey = IdempotencyKey.create(validUuid)
    expect(idempotencyKey.getValue()).toBe(validUuid)
  })

  it('deve gerar uma nova IdempotencyKey valida com o metodo generate()', () => {
    const idempotencyKey = IdempotencyKey.generate()
    expect(idempotencyKey.getValue()).toBeDefined()
    expect(idempotencyKey.getValue().length).toBe(36)
  })

  it('deve lancar erro ao tentar criar com string invalida', () => {
    expect(() => IdempotencyKey.create('invalid-key-123')).toThrow(
      'Invalid idempotency key format. Must be a valid UUID v4.',
    )
  })

  it('deve lancar erro ao tentar criar com string vazia', () => {
    expect(() => IdempotencyKey.create('')).toThrow('Idempotency key must be a non-empty string.')
  })

  it('deve comparar a igualdade de duas IdempotencyKey', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000'
    const key1 = IdempotencyKey.create(uuid)
    const key2 = IdempotencyKey.create(uuid)
    const key3 = IdempotencyKey.generate()

    expect(key1.equals(key2)).toBe(true)
    expect(key1.equals(key3)).toBe(false)
  })
})
