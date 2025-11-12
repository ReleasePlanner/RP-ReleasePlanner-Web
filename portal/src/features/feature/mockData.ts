/**
 * Mock Feature Data
 *
 * Sample feature data for testing and development
 */

import type { Feature, ProductWithFeatures } from "./types";
import { FEATURE_CATEGORIES, PRODUCT_OWNERS } from "./constants";

/**
 * Mock features for Release Planner Suite (prod-1)
 */
const releasePlannerFeatures: Feature[] = [
  {
    id: "feat-1",
    name: "User Authentication System",
    description:
      "Complete authentication and authorization system with OAuth2 support",
    category: FEATURE_CATEGORIES[0], // Authentication
    status: "completed",
    createdBy: PRODUCT_OWNERS[0],
    technicalDescription:
      "Implements JWT-based authentication with refresh tokens. Supports OAuth2 providers (Google, GitHub). Includes role-based access control (RBAC).",
    businessDescription:
      "Enables secure user login and session management. Supports single sign-on (SSO) for enterprise customers.",
    productId: "prod-1",
    createdAt: "2024-10-15",
    updatedAt: "2025-01-10",
  },
  {
    id: "feat-2",
    name: "Gantt Chart Visualization",
    description:
      "Interactive Gantt chart for timeline visualization and task management",
    category: FEATURE_CATEGORIES[4], // UI/UX
    status: "completed",
    createdBy: PRODUCT_OWNERS[1],
    technicalDescription:
      "Built with D3.js and React. Supports drag-and-drop, zoom, pan, and filtering. Real-time updates via WebSocket.",
    businessDescription:
      "Provides visual representation of project timelines. Helps teams understand dependencies and critical paths.",
    productId: "prod-1",
    createdAt: "2024-11-01",
    updatedAt: "2025-01-15",
  },
  {
    id: "feat-3",
    name: "Release Plan Templates",
    description:
      "Pre-configured templates for common release planning scenarios",
    category: FEATURE_CATEGORIES[6], // Documentation
    status: "in-progress",
    createdBy: PRODUCT_OWNERS[2],
    technicalDescription:
      "Template system with JSON schema validation. Supports custom fields and workflows. Version control for templates.",
    businessDescription:
      "Accelerates release planning by providing industry-standard templates. Reduces setup time by 70%.",
    productId: "prod-1",
    createdAt: "2024-12-01",
    updatedAt: "2025-01-20",
  },
  {
    id: "feat-4",
    name: "API Rate Limiting",
    description:
      "Implement rate limiting to prevent API abuse and ensure fair usage",
    category: FEATURE_CATEGORIES[2], // Security
    status: "planned",
    createdBy: PRODUCT_OWNERS[0],
    technicalDescription:
      "Token bucket algorithm. Configurable limits per endpoint and user tier. Redis-backed distributed rate limiting.",
    businessDescription:
      "Protects API infrastructure from abuse. Enables tiered pricing models based on usage limits.",
    productId: "prod-1",
    createdAt: "2025-01-05",
    updatedAt: "2025-01-05",
  },
  {
    id: "feat-5",
    name: "Real-time Collaboration",
    description: "Multi-user real-time editing with conflict resolution",
    category: FEATURE_CATEGORIES[4], // UI/UX
    status: "in-progress",
    createdBy: PRODUCT_OWNERS[3],
    technicalDescription:
      "Operational Transform (OT) algorithm. WebSocket-based synchronization. Conflict resolution with last-write-wins fallback.",
    businessDescription:
      "Enables multiple team members to collaborate simultaneously on release plans. Reduces coordination overhead.",
    productId: "prod-1",
    createdAt: "2024-12-15",
    updatedAt: "2025-01-18",
  },
  {
    id: "feat-6",
    name: "Export to PDF/Excel",
    description: "Export release plans to PDF and Excel formats",
    category: FEATURE_CATEGORIES[6], // Documentation
    status: "planned",
    createdBy: PRODUCT_OWNERS[4],
    technicalDescription:
      "PDF generation using jsPDF. Excel export using SheetJS. Customizable templates and branding.",
    businessDescription:
      "Enables sharing release plans with stakeholders who don't have access to the platform. Supports offline review.",
    productId: "prod-1",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-10",
  },
];

/**
 * Mock features for Analytics Platform (prod-2)
 */
const analyticsPlatformFeatures: Feature[] = [
  {
    id: "feat-7",
    name: "Custom Dashboard Builder",
    description:
      "Drag-and-drop interface for creating custom analytics dashboards",
    category: FEATURE_CATEGORIES[4], // UI/UX
    status: "completed",
    createdBy: PRODUCT_OWNERS[1],
    technicalDescription:
      "React DnD library. Widget system with plugin architecture. Real-time data binding with WebSocket.",
    businessDescription:
      "Allows users to create personalized dashboards without technical knowledge. Increases user engagement by 40%.",
    productId: "prod-2",
    createdAt: "2024-09-20",
    updatedAt: "2025-01-12",
  },
  {
    id: "feat-8",
    name: "Data Export API",
    description: "RESTful API for programmatic data export and integration",
    category: FEATURE_CATEGORIES[7], // Integration
    status: "completed",
    createdBy: PRODUCT_OWNERS[2],
    technicalDescription:
      "REST API with OAuth2 authentication. Supports JSON, CSV, and XML formats. Pagination and filtering.",
    businessDescription:
      "Enables integration with external systems. Supports automated reporting and data pipelines.",
    productId: "prod-2",
    createdAt: "2024-10-10",
    updatedAt: "2025-01-08",
  },
  {
    id: "feat-9",
    name: "Advanced Filtering",
    description: "Multi-dimensional filtering with complex query builder",
    category: FEATURE_CATEGORIES[4], // UI/UX
    status: "in-progress",
    createdBy: PRODUCT_OWNERS[3],
    technicalDescription:
      "Query builder UI component. Supports AND/OR logic, date ranges, and custom operators. Optimized for large datasets.",
    businessDescription:
      "Enables users to drill down into specific data subsets. Reduces time to insights by 50%.",
    productId: "prod-2",
    createdAt: "2024-12-05",
    updatedAt: "2025-01-22",
  },
  {
    id: "feat-10",
    name: "Scheduled Reports",
    description: "Automated report generation and email delivery",
    category: FEATURE_CATEGORIES[5], // Infrastructure
    status: "planned",
    createdBy: PRODUCT_OWNERS[4],
    technicalDescription:
      "Cron-based scheduler. Email service integration (SendGrid). Template engine for report customization.",
    businessDescription:
      "Automates routine reporting tasks. Ensures stakeholders receive timely updates without manual intervention.",
    productId: "prod-2",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
  },
];

/**
 * Mock product features data
 */
export const MOCK_PRODUCT_FEATURES: ProductWithFeatures[] = [
  {
    id: "prod-1",
    name: "Release Planner Suite",
    features: releasePlannerFeatures,
  },
  {
    id: "prod-2",
    name: "Analytics Platform",
    features: analyticsPlatformFeatures,
  },
];
