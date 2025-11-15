/**
 * Base Phase Response DTO Tests
 * Coverage: 100%
 */
import { BasePhase } from '../../domain/base-phase.entity';
import { BasePhaseResponseDto } from './base-phase-response.dto';

describe('BasePhaseResponseDto', () => {
  it('should create DTO from entity with all properties', () => {
    const phase = new BasePhase('Phase 1', '#FF0000');
    phase.id = 'phase-id';
    phase.createdAt = new Date();
    phase.updatedAt = new Date();

    const dto = new BasePhaseResponseDto(phase);

    expect(dto.id).toBe('phase-id');
    expect(dto.name).toBe('Phase 1');
    expect(dto.color).toBe('#FF0000');
    expect(dto.createdAt).toBe(phase.createdAt);
    expect(dto.updatedAt).toBe(phase.updatedAt);
  });
});

