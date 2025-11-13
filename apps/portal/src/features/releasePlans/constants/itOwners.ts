/**
 * IT Owners Constants
 *
 * Defines the list of IT Owners who can be assigned to release plans
 */

export interface ITOwner {
  id: string;
  name: string;
  email?: string;
  department?: string;
}

/**
 * Available IT Owners
 */
export const IT_OWNERS: ITOwner[] = [
  {
    id: "it-owner-1",
    name: "Alice Johnson",
    email: "alice.johnson@company.com",
    department: "Platform Engineering",
  },
  {
    id: "it-owner-2",
    name: "Bob Smith",
    email: "bob.smith@company.com",
    department: "Infrastructure",
  },
  {
    id: "it-owner-3",
    name: "Carol Davis",
    department: "DevOps",
  },
  {
    id: "it-owner-4",
    name: "David Wilson",
    email: "david.wilson@company.com",
    department: "Architecture",
  },
  {
    id: "it-owner-5",
    name: "Emma Brown",
    email: "emma.brown@company.com",
    department: "Release Management",
  },
];

/**
 * Get IT Owner by ID
 */
export function getITOwnerById(id: string): ITOwner | undefined {
  return IT_OWNERS.find((owner) => owner.id === id);
}

/**
 * Get IT Owner name by ID (fallback to "Unassigned")
 */
export function getITOwnerName(id?: string): string {
  if (!id) return "Unassigned";
  const owner = getITOwnerById(id);
  return owner ? owner.name : "Unassigned";
}
