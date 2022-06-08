---
id: org
title: GitHub Organizational Data
sidebar_label: Org Data
# prettier-ignore
description: Importing users and groups from a GitHub organization into Backstage
---

The Backstage catalog can be set up to ingest organizational data - users and
teams - directly from an organization in GitHub or GitHub Enterprise. The result
is a hierarchy of
[`User`](../../features/software-catalog/descriptor-format.md#kind-user) and
[`Group`](../../features/software-catalog/descriptor-format.md#kind-group) kind
entities that mirror your org setup.

> Note: This adds `User` and `Group` entities to the catalog, but does not
> provide authentication. See the
> [GitHub auth provider](../../auth/github/provider.md) for that.

## Installation

This guide will use the Entity Provider method. If you for some reason prefer
the Processor method (not recommended), it is described separately below.

The provider is not installed by default, therefore you have to add a dependency
to `@backstage/plugin-catalog-backend-module-github` to your backend package.

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-github
```

> Note: When configuring to use a Provider instead of a Processor you do not
> need to add a _location_ pointing to your GitHub server/organization

Update the catalog plugin initialization in your backend to add the provider and
schedule it:

```diff
 // packages/backend/src/plugins/catalog.ts
+import { GitHubOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-github';

 export default async function createPlugin(
   env: PluginEnvironment,
 ): Promise<Router> {
   const builder = await CatalogBuilder.create(env);

+  // The org URL below needs to match a configured integrations.github entry
+  // specified in your app-config.
+  builder.addEntityProvider(
+    GitHubOrgEntityProvider.fromConfig(env.config, {
+      id: 'production',
+      orgUrl: 'https://github.com/backstage',
+      logger: env.logger,
+      schedule: env.scheduler.createScheduledTaskRunner({
+        frequency: { minutes: 60 },
+        timeout: { minutes: 15 },
+      }),
+    }),
+  );
```

## Configuration

As mentioned above, you also must have some configuration in your app-config
that describes the targets that you want to import. This lets the entity
provider know what authorization to use, and what the API endpoints are. You may
or may not have such an entry already added since before:

```yaml
integrations:
  github:
    # example for public github
    - host: github.com
      token: ${GITHUB_TOKEN}
    # example for a private GitHub Enterprise instance
    - host: ghe.example.net
      apiBaseUrl: https://ghe.example.net/api/v3
      token: ${GHE_TOKEN}
```

These examples use `${}` placeholders to reference environment variables. This
is often suitable for production setups, but also means that you will have to
supply those variables to the backend as it starts up. If you want, for local
development in particular, you can experiment first by putting the actual tokens
in a mirrored config directly in your `app-config.local.yaml` as well.

If Backstage is configured to use GitHub Apps authentication you must grant
`Read-Only` access for `Members` under `Organization` in order to ingest users
correctly. You can modify the app's permissions under the organization settings,
`https://github.com/organizations/{ORG}/settings/apps/{APP_NAME}/permissions`.

![permissions](../../assets/integrations/github/permissions.png)

**Please note that when you change permissions, the app owner will get an email
that must be approved first before the changes are applied.**

![email](../../assets/integrations/github/email.png)

## Using a Processor instead of a Provider

An alternative to using the Provider for ingesting organizational entities is to
use a Processor. This is the old way that's based on registering locations with
the proper type and target, triggering the processor to run.

The drawback of this method is that it will leave orphaned Group/User entities
whenever they are deleted on your GitHub server, and you cannot control the
frequency with which they are refreshed, separately from other processors.

### Processor Installation

The `GithubOrgReaderProcessor` is not registered by default, so you have to
install and register it in the catalog plugin:

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-catalog-backend-module-github
```

```typescript
// packages/backend/src/plugins/catalog.ts
import { GithubOrgReaderProcessor } from '@backstage/plugin-catalog-backend-module-github';
// ...
builder.addProcessor(
  GithubOrgReaderProcessor.fromConfig(env.config, { logger: env.logger }),
);
```

### Processor Configuration

The integration section of your app-config needs to be set up in the same way as
for the Entity Provider - see above.

In addition to that, you typically want to add a few static locations to your
app-config, which reference your organizations to import. The following
configuration enables an import of the teams and users under the org
`https://github.com/my-org-name` on public GitHub.

```yaml
catalog:
  locations:
    - type: github-org
      target: https://github.com/my-org-name
      rules:
        - allow: [User, Group]
```
