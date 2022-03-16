# Launch a CI Build on App Center

This action kicks off a build on an already-configured branch on App Center CI.
This is a slightly modified fork of Meercode's [action to configure branches](https://github.com/meercodeio/app-center-create-configuration).
If you're using this to kickoff builds, you'll need to run the aforemmentioned as a prior step to make this work.

## Inputs

### `appcenter-token`

**Required** Value of your App Center token. https://docs.microsoft.com/en-us/appcenter/api-docs/#creating-an-app-center-app-api-token.

### `project-id`

**Required** Value of your App Center project id. (org_name/project_name) ex: meercodeio/hello.ios

### `branch`

**Required** Name of the branch you want to build.
You can grab this using [Romain's inject-slug action](https://github.com/rlespinasse/github-slug-action).

## Example usage

```
uses: mszaro/app-center-start-build@1.0
with:
  appcenter-token: '${{ secrets.APP_CENTER_TOKEN }}'
  source-branch: '${{ env.GITHUB_HEAD_REF }}'
  project-id: 'MyAppCenterUsername/MyAppName'
```

## Chaining this step together with build configuration

If you want AppCenter to run CI builds automagically for new PRs, then your real GitHub Actions workflow would probably look something like this: 

`appcenter-on-pullrequest.yml`
(Clones AppCenter branch configuration from your target branch onto your source branch, then runs CI)
```
name: 'Configure & Launch AppCenter Build'
on:
  pull_request:
    types: [ opened, reopened ]
jobs:
  appcenter:
    name: 'Configure AppCenter CI for Source Branch'
    runs-on: ubuntu-latest
    steps:
      - name: 'Inject Slug Variables'
        uses: rlespinasse/github-slug-action@v4
      - name: 'Configure App Center Branch'
        uses: meercodeio/app-center-create-configuration@1.3.0
        with:
          appcenter-token: '${{ secrets.APP_CENTER_TOKEN }}'
          source-branch: '${{ env.GITHUB_BASE_REF }}'
          target-branch: '${{ env.GITHUB_HEAD_REF }}'
          project-id: 'MyAppCenterOrg/MyAppCenterApp'
      - name: 'Kickoff AppCenter CI Build'
        uses: mszaro/app-center-start-build@1.0
        with:
          appcenter-token: '${{ secrets.APP_CENTER_TOKEN }}'
          branch: '${{ env.GITHUB_HEAD_REF }}'
          project-id: 'MyAppCenterOrg/MyAppCenterApp'
```

`appcenter-on-push.yml`
(Just runs CI)
```
name: 'Configure AppCenter Build'
on:
  push:
    branches-ignore: ['mainline', 'release']
jobs:
  appcenter:
    name: 'Launch App Center Build'
    runs-on: ubuntu-latest
    steps:
      - name: 'Inject Slug Variables'
        uses: rlespinasse/github-slug-action@v4
      - name: Kickoff AppCenter CI Build
        uses: mszaro/app-center-start-build@1.0
        with:
          appcenter-token: '${{ secrets.APP_CENTER_TOKEN }}'
          branch: '${{ env.GITHUB_HEAD_REF }}'
          project-id: 'MyAppCenterOrg/MyAppCenterApp'
```