/**
 * Normalizes version to full format for comparison: MAJOR.SUBVERSION.MINOR.PATCH (x.x.x.x)
 */
export function normalizeVersion(version: string): string {
  if (!version || version.trim().length === 0) return "0.0.0.0";
  const parts = version.trim().split(".").map((p) => Number.parseInt(p, 10) || 0);
  while (parts.length < 4) {
    parts.push(0);
  }
  return parts.slice(0, 4).join(".");
}

/**
 * Compares two semantic versions
 * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
  const normalized1 = normalizeVersion(v1);
  const normalized2 = normalizeVersion(v2);
  const parts1 = normalized1.split(".").map((p) => Number.parseInt(p, 10));
  const parts2 = normalized2.split(".").map((p) => Number.parseInt(p, 10));

  for (let i = 0; i < 4; i++) {
    if (parts1[i] < parts2[i]) return -1;
    if (parts1[i] > parts2[i]) return 1;
  }
  return 0;
}

export function validateVersionFormat(version: string): boolean {
  if (!version.trim()) return false;
  const semverPattern =
    /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
  const shortPattern = /^(\d+)\.(\d+)$/;
  const singlePattern = /^(\d+)$/;
  return semverPattern.test(version) || shortPattern.test(version) || singlePattern.test(version);
}

export type VersionValidationResult = {
  isValid: boolean;
  error: string;
};

export function validateVersion(
  version: string,
  currentVersion?: string
): VersionValidationResult {
  if (!version.trim()) {
    return { isValid: false, error: "" };
  }

  if (!validateVersionFormat(version)) {
    return {
      isValid: false,
      error: "Invalid format. Use semantic versioning (e.g., 1.0.0)",
    };
  }

  if (currentVersion) {
    const comparison = compareVersions(version, currentVersion);
    if (comparison <= 0) {
      return {
        isValid: false,
        error: `The new version must be greater than the current version (${currentVersion})`,
      };
    }
  }

  return { isValid: true, error: "" };
}

