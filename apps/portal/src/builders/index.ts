/**
 * Builder Functions
 *
 * Centralized location for builder/factory functions that construct domain objects.
 * Builders encapsulate object creation logic and make code more maintainable and testable.
 *
 * @module builders
 */

export {
  buildComponentConfig,
  getAvailableComponentTypes,
  type ComponentConfig,
} from "./componentConfigBuilder";
