// @ts-nocheck
/**
 * Examples of optimized logging usage
 * Demonstrates concise decorator patterns
 */

import {
  log,
  track,
  catchErrors,
  perf,
  logAction,
  useLog,
} from "./optimizedDecorators";

// Class-based components with decorators
export class ExampleService {
  // Ultra-concise logging - just one line
  @log()
  simpleMethod() {
    return "Hello World";
  }

  // Custom log level
  @log({ level: "debug" })
  debugMethod() {
    return "Debug info";
  }

  // Track user actions
  @track("user_clicked_button")
  handleClick() {
    return "Button clicked";
  }

  // Automatic error handling
  @catchErrors
  riskyOperation() {
    if (Math.random() > 0.5) {
      throw new Error("Random failure");
    }
    return "Success";
  }

  // Performance monitoring
  @perf
  expensiveOperation() {
    // Simulate work
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  }

  // Combined functionality - all-in-one
  @logAction({ track: true, perf: true, catch: true })
  complexAction() {
    // This method gets:
    // - Automatic logging
    // - User action tracking
    // - Performance monitoring
    // - Error handling
    // All with one decorator!
    return "Complex operation complete";
  }

  // Custom action name and component
  @logAction({
    track: true,
    action: "save_document",
    component: "DocumentEditor",
  })
  saveDocument() {
    return "Document saved";
  }
}

// Functional component example
export const ExampleFunctionalComponent = () => {
  // Get optimized logging hook
  const log = useLog("ExampleComponent");

  const handleSubmit = () => {
    // Single line logging
    log.info("Form submitted");

    // Single line tracking
    log.track("form_submit");

    // Combined action (log + track)
    log.action("validate_form", () => {
      // Your validation logic here
      return true;
    });

    // Error logging
    try {
      // risky operation
      throw new Error("Validation failed");
    } catch (error) {
      log.error("Form validation failed", error as Error);
    }
  };

  return null; // JSX would go here
};

// Before vs After comparison
export class BeforeAfterExample {
  // BEFORE: Verbose manual logging (old way)
  oldWayMethod() {
    const logger = console; // or your logger
    const startTime = performance.now();

    try {
      logger.log("Starting operation in BeforeAfterExample.oldWayMethod");

      // Your business logic
      const result = "operation result";

      const endTime = performance.now();
      logger.log(`Operation completed in ${endTime - startTime}ms`);

      // Track user action
      // monitoring.trackUserInteraction({...});

      return result;
    } catch (error) {
      logger.error("Operation failed:", error);
      throw error;
    }
  }

  // AFTER: Single decorator (new way)
  @logAction({ track: true, perf: true, catch: true })
  newWayMethod() {
    // Same business logic, but all logging/monitoring is automatic!
    return "operation result";
  }
}

/**
 * Usage patterns summary:
 *
 * 1. @log() - Basic logging with method name
 * 2. @log({ level: 'debug' }) - Custom log level
 * 3. @track('action_name') - User action tracking
 * 4. @catchErrors - Automatic error handling
 * 5. @perf - Performance monitoring
 * 6. @logAction({ track: true, perf: true, catch: true }) - All-in-one
 * 7. useLog('ComponentName') - Hook for functional components
 *
 * Benefits:
 * - 90% less boilerplate code
 * - Consistent logging patterns
 * - Automatic error handling
 * - Built-in performance monitoring
 * - Zero configuration needed
 */
