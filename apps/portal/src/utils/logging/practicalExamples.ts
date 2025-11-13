// @ts-nocheck
/**
 * Practical examples of optimized logging in action
 * Shows before/after comparisons and real-world usage
 */

import {
  L,
  createComponentLogger,
  useComponentLogger,
  logMethod,
} from "./simpleLogging";
import { useLog } from "./optimizedDecorators";

// Example 1: Before/After - Manual logging vs Optimized logging

class UserServiceBefore {
  saveUser(userData: { name: string; email: string }) {
    // Old way - lots of boilerplate
    console.log("UserService.saveUser called");
    const startTime = performance.now();

    try {
      // Simulate API call
      const result = { id: Date.now(), ...userData };

      const endTime = performance.now();
      console.log(`User saved successfully in ${endTime - startTime}ms`);

      // Manual tracking
      // monitoring.trackUserInteraction({ action: 'save_user', component: 'UserService' });

      return result;
    } catch (error) {
      console.error("Failed to save user:", error);
      throw error;
    }
  }
}

class UserServiceAfter {
  private log = createComponentLogger("UserService");

  saveUser(userData: { name: string; email: string }) {
    // New way - one line does everything
    return L.all(
      () => {
        // Just your business logic here
        return { id: Date.now(), ...userData };
      },
      {
        component: "UserService",
        message: "saveUser called",
        action: "save_user",
        time: true,
      }
    );
  }

  // Even simpler for basic operations
  deleteUser(id: number) {
    return L.log(
      () => {
        // Business logic
        return { deleted: true, id };
      },
      "User deleted",
      "UserService"
    );
  }

  // Safe operations with fallback
  getUserPreferences(userId: number) {
    return L.safe(
      () => {
        // Risky operation that might fail
        if (userId < 0) throw new Error("Invalid user ID");
        return { theme: "dark", notifications: true };
      },
      { theme: "light", notifications: false },
      "UserService"
    );
  }
}

// Example 2: React Functional Component

const UserProfile = ({ userId }: { userId: number }) => {
  const log = useComponentLogger("UserProfile");

  const handleSaveProfile = (profileData: object) => {
    // Automatic logging + tracking with one wrapper
    return log.handler(() => {
      // Your save logic here
      console.log("Saving profile:", profileData);
      return { success: true };
    }, "save_profile")();
  };

  const handleDeleteAccount = () => {
    // Safe operation with fallback
    const result = log.safe(
      () => {
        // Risky delete operation
        if (userId <= 0) throw new Error("Cannot delete invalid user");
        return { deleted: true };
      },
      { deleted: false }
    );

    if (result.deleted) {
      log.log("Account deleted successfully");
    }
  };

  // Using alternative hook pattern
  const altLog = useLog("UserProfile");

  const handleExportData = () => {
    // Super concise logging
    altLog.info("Starting data export");
    altLog.track("export_data");

    return altLog.action("export_user_data", () => {
      // Business logic
      return { exported: true, timestamp: new Date() };
    });
  };

  React.useEffect(() => {
    log.lifecycle("mount", `User ${userId} profile loaded`);
    return () => log.lifecycle("unmount");
  }, []);

  return null; // JSX would go here
};

// Example 3: Class with method logging

class PlanManagerOriginal {
  createPlan(planData: object) {
    console.log("PlanManager.createPlan called with:", planData);
    const start = performance.now();

    try {
      // Business logic
      const plan = { id: Date.now(), ...planData, status: "active" };

      console.log(`Plan created in ${performance.now() - start}ms`);
      // monitoring.trackUserInteraction({ action: 'create_plan', component: 'PlanManager' });

      return plan;
    } catch (error) {
      console.error("Plan creation failed:", error);
      throw error;
    }
  }
}

class PlanManagerOptimized {
  createPlan = logMethod(
    (planData: object) => {
      // Just the business logic
      return { id: Date.now(), ...planData, status: "active" };
    },
    "PlanManager",
    "createPlan"
  );

  private log = createComponentLogger("PlanManager");

  updatePlan(planId: number, updates: object) {
    return L.time(
      () => {
        // Timed execution
        return { id: planId, ...updates, updatedAt: new Date() };
      },
      "Plan update operation",
      "PlanManager"
    );
  }

  deletePlan(planId: number) {
    return L.track(
      () => {
        // Tracked user action
        return { deleted: true, planId };
      },
      "delete_plan",
      "PlanManager"
    );
  }

  async fetchPlans() {
    return await L.safeAsync(
      async () => {
        // Safe async operation
        const response = await fetch("/api/plans");
        if (!response.ok) throw new Error("Failed to fetch");
        return response.json();
      },
      [],
      "PlanManager"
    );
  }
}

// Example 4: Utility functions demonstration

export const demonstrateLogging = () => {
  console.log("=== Logging Optimization Demo ===");

  // 1. Simple operations
  const result1 = L.log(
    () => {
      return "Hello World";
    },
    "Simple greeting",
    "Demo"
  );

  // 2. Timed operations
  const result2 = L.time(
    () => {
      let sum = 0;
      for (let i = 0; i < 1000000; i++) sum += i;
      return sum;
    },
    "Heavy calculation",
    "Demo"
  );

  // 3. Tracked user actions
  const result3 = L.track(
    () => {
      return { clicked: true };
    },
    "demo_button_click",
    "Demo"
  );

  // 4. Safe operations
  const result4 = L.safe(
    () => {
      if (Math.random() > 0.5) throw new Error("Random failure");
      return { success: true };
    },
    { success: false },
    "Demo"
  );

  // 5. Combined operations
  const result5 = L.all(
    () => {
      return { processed: true, timestamp: Date.now() };
    },
    {
      component: "Demo",
      message: "Processing data",
      action: "process_data",
      time: true,
    }
  );

  console.log("Results:", { result1, result2, result3, result4, result5 });
};

/**
 * Summary of benefits:
 *
 * BEFORE (old manual way):
 * - 15+ lines of boilerplate per method
 * - Inconsistent logging patterns
 * - Easy to forget error handling
 * - Manual performance tracking
 * - Repetitive code everywhere
 *
 * AFTER (optimized logging):
 * - 1-3 lines for full logging functionality
 * - Consistent patterns across app
 * - Automatic error handling with fallbacks
 * - Built-in performance monitoring
 * - Clean, readable business logic
 *
 * CODE REDUCTION: ~90% less logging boilerplate
 * MAINTAINABILITY: Much easier to maintain consistent logging
 * RELIABILITY: Built-in error handling and fallbacks
 * PERFORMANCE: Automatic performance monitoring
 * TRACKING: Seamless user action tracking
 */

export default {
  UserServiceAfter,
  PlanManagerOptimized,
  UserProfile,
  demonstrateLogging,
};
