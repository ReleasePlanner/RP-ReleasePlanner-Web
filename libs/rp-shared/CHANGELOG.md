# Changelog

## [0.0.1] - 2024-01-XX

### Added
- Initial release of `@rp-release-planner/rp-shared` library
- Core defensive validators (framework-agnostic):
  - `validateString` - Validates string inputs
  - `validateId` - Validates ID strings
  - `validateObject` - Validates object existence
  - `validateArray` - Validates array inputs
  - `validateNumber` - Validates numeric values
  - `validateDateString` - Validates date strings
  - `validatePassword` - Validates password strings
  - `validateEmailFormat` - Validates email format
  - `validateRange` - Validates numeric ranges
- Utility functions:
  - `safeTrim` - Safely trims strings
  - `isNotEmpty` - Checks if string is not empty
- NestJS adapters that wrap core validators to throw `BadRequestException`
- Comprehensive test suite for both core validators and NestJS adapters
- Full TypeScript type definitions
- Documentation (README.md, MIGRATION.md)

### Migration
- Migrated all defensive validators from `apps/api/src/common/utils/defensive-validators.ts`
- Updated all API services and repositories to use the new shared library
- Maintained backward compatibility with existing code

