# RP-Release-Planner-Web
MyPlanner System - My Project module: including API, Web/Mobile Client and Infrastructure

## Git Flow Workflow

This repository follows the Git Flow branching model.

- **Production branch**: `main`
- **Integration branch**: `develop`
- **Prefixes**: `feature/`, `release/`, `hotfix/`, `support/`

### Prerequisites

Git Flow configuration is already set for this repo to use `main` and `develop` with standard prefixes. If you have the Git Flow CLI installed, you can use the commands below.

### Daily usage

- **Start a feature**: `git flow feature start <name>`
- **Publish a feature** (share on origin): `git flow feature publish <name>`
- **Finish a feature** (merge to `develop`): `git flow feature finish <name>`

### Releases

- **Start a release** from `develop`: `git flow release start <version>`
- Stabilize on the `release/<version>` branch (docs, version, fixes)
- **Finish a release** (merge to `main` and `develop`, tag): `git flow release finish <version>`

### Hotfixes

- **Start a hotfix** from `main`: `git flow hotfix start <version>`
- **Finish a hotfix** (merge to `main` and `develop`, tag): `git flow hotfix finish <version>`

### Branch naming examples

- Features: `feature/user-authentication`
- Releases: `release/1.2.0`
- Hotfixes: `hotfix/1.2.1`

### Notes

- Open pull requests from `feature/*` and `release/*` branches into `develop`.
- Open hotfix pull requests into `main` (the finish step merges back to `develop`).