/**
 * Product data and utilities for Release Planner
 *
 * This file contains sample product data and utility functions
 * for managing products and their components.
 */

import type {
  Product,
  ComponentVersion,
  FeatureVersion,
} from "../components/Plan/CommonDataCard/types";

// Sample products data with version control - in a real application, this would come from an API
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "rp-suite",
    name: "Release Planner Suite",
    description: "Complete release planning and management platform",
    components: [
      {
        id: "rp-web",
        name: "Web Application",
        type: "web",
        version: "2.1.4",
        description: "Main web interface for release planning",
        status: "production",
        lastUpdated: "2025-10-15",
      },
      {
        id: "rp-portal",
        name: "Admin Portal",
        type: "web",
        version: "1.8.2",
        description: "Administrative dashboard and controls",
        status: "production",
        lastUpdated: "2025-10-10",
      },
      {
        id: "rp-api",
        name: "API Service",
        type: "service",
        version: "3.0.1",
        description: "Core backend API for all operations",
        status: "production",
        lastUpdated: "2025-10-20",
      },
      {
        id: "rp-mobile",
        name: "Mobile App",
        type: "mobile",
        version: "1.5.0-beta",
        description: "iOS and Android application",
        status: "testing",
        lastUpdated: "2025-11-01",
      },
    ],
    features: [
      {
        id: "rp-gantt-charts",
        name: "Gantt Chart Visualization",
        description:
          "Interactive Gantt charts for project timeline visualization",
        priority: "high",
        status: "completed",
        assignedTeam: "Frontend Team",
        category: "ui",
        estimatedHours: 80,
        lastUpdated: "2025-10-15",
      },
      {
        id: "rp-milestone-tracking",
        name: "Milestone Tracking",
        description: "Track and manage project milestones and deliverables",
        priority: "high",
        status: "in-progress",
        assignedTeam: "Backend Team",
        category: "backend",
        estimatedHours: 60,
        lastUpdated: "2025-11-02",
      },
      {
        id: "rp-resource-allocation",
        name: "Resource Allocation Management",
        description: "Manage team resource allocation across projects",
        priority: "medium",
        status: "testing",
        assignedTeam: "Full-stack Team",
        category: "backend",
        estimatedHours: 120,
        lastUpdated: "2025-10-28",
      },
      {
        id: "rp-notifications",
        name: "Real-time Notifications",
        description: "Push notifications for project updates and deadlines",
        priority: "medium",
        status: "backlog",
        assignedTeam: "Mobile Team",
        category: "integration",
        estimatedHours: 40,
        lastUpdated: "2025-10-20",
      },
    ],
  },
  {
    id: "analytics-platform",
    name: "Analytics Platform",
    description: "Business intelligence and reporting solution",
    components: [
      {
        id: "analytics-dashboard",
        name: "Web Dashboard",
        type: "dashboard",
        version: "4.2.1",
        description: "Interactive analytics and visualization interface",
        status: "production",
        lastUpdated: "2025-10-25",
      },
      {
        id: "data-service",
        name: "Data Service",
        type: "service",
        version: "2.7.3",
        description: "Data processing and aggregation service",
        status: "production",
        lastUpdated: "2025-10-22",
      },
      {
        id: "etl-pipeline",
        name: "ETL Pipeline",
        type: "service",
        version: "1.9.0",
        description: "Extract, Transform, Load data pipeline",
        status: "production",
        lastUpdated: "2025-10-18",
      },
      {
        id: "report-engine",
        name: "Report Engine",
        type: "service",
        description: "Automated report generation system",
        status: "development",
        lastUpdated: "2025-10-30",
      },
    ],
    features: [
      {
        id: "analytics-real-time",
        name: "Real-time Data Analytics",
        description: "Process and visualize data in real-time",
        priority: "critical",
        status: "completed",
        assignedTeam: "Data Team",
        category: "backend",
        estimatedHours: 160,
        lastUpdated: "2025-10-25",
      },
      {
        id: "analytics-custom-reports",
        name: "Custom Report Builder",
        description: "Drag-and-drop custom report creation",
        priority: "high",
        status: "in-progress",
        assignedTeam: "Frontend Team",
        category: "ui",
        estimatedHours: 100,
        lastUpdated: "2025-11-01",
      },
      {
        id: "analytics-ml-insights",
        name: "Machine Learning Insights",
        description: "AI-powered predictive analytics and insights",
        priority: "medium",
        status: "backlog",
        assignedTeam: "AI Team",
        category: "backend",
        estimatedHours: 200,
        lastUpdated: "2025-10-30",
      },
      {
        id: "analytics-data-export",
        name: "Advanced Data Export",
        description: "Export data in multiple formats with scheduling",
        priority: "low",
        status: "testing",
        assignedTeam: "Backend Team",
        category: "integration",
        estimatedHours: 40,
        lastUpdated: "2025-10-28",
      },
    ],
  },
  {
    id: "customer-portal",
    name: "Customer Portal",
    description: "Self-service customer management portal",
    components: [
      {
        id: "customer-web",
        name: "Web Portal",
        type: "web",
        version: "3.1.2",
        description: "Customer self-service web interface",
        status: "production",
        lastUpdated: "2025-10-28",
      },
      {
        id: "customer-mobile",
        name: "Mobile App",
        type: "mobile",
        version: "2.0.5",
        description: "Customer mobile application",
        status: "production",
        lastUpdated: "2025-10-26",
      },
      {
        id: "auth-service",
        name: "Authentication Service",
        type: "service",
        version: "1.4.7",
        description: "User authentication and authorization",
        status: "production",
        lastUpdated: "2025-10-24",
      },
      {
        id: "notification-service",
        name: "Notification Service",
        type: "service",
        version: "0.8.1-rc",
        description: "Email and push notification system",
        status: "testing",
        lastUpdated: "2025-11-02",
      },
    ],
    features: [
      {
        id: "customer-profile-management",
        name: "Profile Management",
        description: "Complete customer profile and account management",
        priority: "high",
        status: "completed",
        assignedTeam: "Frontend Team",
        category: "ui",
        estimatedHours: 80,
        lastUpdated: "2025-10-28",
      },
      {
        id: "customer-support-chat",
        name: "Live Support Chat",
        description: "Real-time customer support chat integration",
        priority: "medium",
        status: "in-progress",
        assignedTeam: "Full-stack Team",
        category: "integration",
        estimatedHours: 120,
        lastUpdated: "2025-11-02",
      },
      {
        id: "customer-billing-history",
        name: "Billing History & Invoices",
        description: "View and manage billing history and download invoices",
        priority: "high",
        status: "testing",
        assignedTeam: "Backend Team",
        category: "backend",
        estimatedHours: 60,
        lastUpdated: "2025-10-30",
      },
      {
        id: "customer-preferences",
        name: "Notification Preferences",
        description: "Manage communication and notification preferences",
        priority: "medium",
        status: "backlog",
        assignedTeam: "Mobile Team",
        category: "ui",
        estimatedHours: 40,
        lastUpdated: "2025-10-26",
      },
    ],
  },
  {
    id: "payment-gateway",
    name: "Payment Gateway",
    description: "Secure payment processing system",
    components: [
      {
        id: "payment-gateway-api",
        name: "API Gateway",
        type: "gateway",
        version: "5.1.0",
        description: "Payment processing API gateway",
        status: "production",
        lastUpdated: "2025-10-12",
      },
      {
        id: "payment-core",
        name: "Payment Service",
        type: "service",
        version: "2.3.8",
        description: "Core payment processing engine",
        status: "production",
        lastUpdated: "2025-10-14",
      },
      {
        id: "security-module",
        name: "Security Module",
        type: "service",
        version: "1.7.2",
        description: "Payment security and encryption",
        status: "production",
        lastUpdated: "2025-10-16",
      },
      {
        id: "payment-admin",
        name: "Admin Portal",
        type: "web",
        version: "1.2.4",
        description: "Payment administration interface",
        status: "production",
        lastUpdated: "2025-10-08",
      },
    ],
    features: [
      {
        id: "payment-multi-currency",
        name: "Multi-Currency Support",
        description:
          "Support for multiple currencies with real-time conversion",
        priority: "critical",
        status: "completed",
        assignedTeam: "Payment Team",
        category: "backend",
        estimatedHours: 100,
        lastUpdated: "2025-10-16",
      },
      {
        id: "payment-fraud-detection",
        name: "Fraud Detection System",
        description: "AI-powered fraud detection and prevention",
        priority: "critical",
        status: "in-progress",
        assignedTeam: "Security Team",
        category: "security",
        estimatedHours: 180,
        lastUpdated: "2025-11-01",
      },
      {
        id: "payment-recurring-billing",
        name: "Recurring Billing",
        description: "Automated recurring payment processing",
        priority: "high",
        status: "testing",
        assignedTeam: "Backend Team",
        category: "backend",
        estimatedHours: 80,
        lastUpdated: "2025-10-28",
      },
      {
        id: "payment-refund-system",
        name: "Automated Refund System",
        description: "Streamlined refund processing and management",
        priority: "medium",
        status: "blocked",
        assignedTeam: "Payment Team",
        category: "backend",
        estimatedHours: 60,
        lastUpdated: "2025-10-20",
      },
    ],
  },
  {
    id: "content-management",
    name: "Content Management System",
    description: "Enterprise content and document management",
    components: [
      {
        id: "cms-web",
        name: "Web CMS",
        type: "web",
        version: "6.0.2",
        description: "Content management web interface",
        status: "production",
        lastUpdated: "2025-10-29",
      },
      {
        id: "file-service",
        name: "File Service",
        type: "service",
        version: "3.4.1",
        description: "File storage and management service",
        status: "production",
        lastUpdated: "2025-10-27",
      },
      {
        id: "search-engine",
        name: "Search Engine",
        type: "service",
        version: "2.1.9",
        description: "Full-text search and indexing",
        status: "production",
        lastUpdated: "2025-10-21",
      },
      {
        id: "workflow-engine",
        name: "Workflow Engine",
        type: "service",
        description: "Content approval and workflow system",
        status: "development",
        lastUpdated: "2025-11-03",
      },
    ],
    features: [
      {
        id: "cms-version-control",
        name: "Content Version Control",
        description:
          "Track and manage content versions with rollback capabilities",
        priority: "high",
        status: "completed",
        assignedTeam: "Backend Team",
        category: "backend",
        estimatedHours: 120,
        lastUpdated: "2025-10-29",
      },
      {
        id: "cms-collaborative-editing",
        name: "Collaborative Editing",
        description: "Real-time collaborative content editing",
        priority: "medium",
        status: "in-progress",
        assignedTeam: "Full-stack Team",
        category: "integration",
        estimatedHours: 150,
        lastUpdated: "2025-11-03",
      },
      {
        id: "cms-approval-workflow",
        name: "Content Approval Workflow",
        description: "Multi-step content approval and publishing workflow",
        priority: "high",
        status: "testing",
        assignedTeam: "Backend Team",
        category: "backend",
        estimatedHours: 90,
        lastUpdated: "2025-10-31",
      },
      {
        id: "cms-seo-optimization",
        name: "SEO Optimization Tools",
        description: "Built-in SEO analysis and optimization recommendations",
        priority: "medium",
        status: "backlog",
        assignedTeam: "Frontend Team",
        category: "ui",
        estimatedHours: 60,
        lastUpdated: "2025-10-25",
      },
    ],
  },
];

/**
 * Gets a product by its ID
 */
export function getProductById(productId: string): Product | undefined {
  return SAMPLE_PRODUCTS.find((product) => product.id === productId);
}

/**
 * Gets components for a specific product
 */
export function getProductComponents(productId: string): ComponentVersion[] {
  const product = getProductById(productId);
  return product ? product.components : [];
}

/**
 * Gets features for a specific product
 */
export function getProductFeatures(productId: string): FeatureVersion[] {
  const product = getProductById(productId);
  return product ? product.features : [];
}

/**
 * Gets all available products
 */
export function getAllProducts(): Product[] {
  return SAMPLE_PRODUCTS;
}

/**
 * Searches products by name (case-insensitive)
 */
export function searchProductsByName(searchTerm: string): Product[] {
  if (!searchTerm.trim()) {
    return SAMPLE_PRODUCTS;
  }

  const lowercaseSearch = searchTerm.toLowerCase();
  return SAMPLE_PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseSearch) ||
      (product.description &&
        product.description.toLowerCase().includes(lowercaseSearch))
  );
}

/**
 * Gets products that have a specific component
 */
export function getProductsByComponent(componentName: string): Product[] {
  return SAMPLE_PRODUCTS.filter((product) =>
    product.components.some(
      (component) =>
        component.name.toLowerCase().includes(componentName.toLowerCase()) ||
        component.type.toLowerCase().includes(componentName.toLowerCase())
    )
  );
}

export default {
  SAMPLE_PRODUCTS,
  getProductById,
  getProductComponents,
  getProductFeatures,
  getAllProducts,
  searchProductsByName,
  getProductsByComponent,
};
