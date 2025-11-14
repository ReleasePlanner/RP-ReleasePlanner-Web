/**
 * IT Owner Response DTO Tests
 * Coverage: 100%
 */
import { ITOwner } from '../../domain/it-owner.entity';
import { ITOwnerResponseDto } from './it-owner-response.dto';

describe('ITOwnerResponseDto', () => {
  it('should create DTO from entity', () => {
    const owner = new ITOwner('Owner 1');
    owner.id = 'owner-id';
    owner.createdAt = new Date();
    owner.updatedAt = new Date();

    const dto = new ITOwnerResponseDto(owner);

    expect(dto.id).toBe('owner-id');
    expect(dto.name).toBe('Owner 1');
    expect(dto.createdAt).toBe(owner.createdAt);
    expect(dto.updatedAt).toBe(owner.updatedAt);
  });
});

