# Assisted Installer User Interface Library

React component library for
[https://github.com/openshift-assisted/assisted-ui](https://github.com/openshift-assisted/assisted-ui).

Please note, the project's upstream has been renamed and moved from **mareklibra/facet-lib** to
[https://github.com/openshift-assisted/assisted-ui-lib](https://github.com/openshift-assisted/assisted-ui-lib)
in December 2020.

[![NPM](https://img.shields.io/npm/v/openshift-assisted-ui-lib.svg)](https://www.npmjs.com/package/openshift-assisted-ui-lib)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @openshift-assisted/ui-lib
```

or

```
yarn add @openshift-assisted/ui-lib
```

## Development

### Prerequisites

This project depends on the following package

```bash
sudo dnf install -y inotify-tools
```

### Instructions

You can use the following steps in order to set up your dev environment.

1. Create a parent directory, e.g. `~/Projects`.
2. Create your own fork of this repo and `git clone` it.
   - ```bash
     cd ~/Projects
     git clone https://github.com/<username>/assisted-ui-lib.git
     ```
3. Install the project dependencies:
   - ```bash
     yarn install
     ```
4. Create a `apps/assisted-ui/.env.development.local` file and add the Assisted Installer API url
   - ```ini
     AIUI_APP_API_URL=http://<host-ip>:6008
     ```
5. Start the Assisted Installer Ui application
   - ```bash
     cd apps/assisted-ui
     yarn serve
     ```
6. Open http://127.0.0.1:5173/

### UHC portal

Assisted Installer UI is integrated in [uhc-portal](https://gitlab.cee.redhat.com/service/uhc-portal.git) (the full OCM app, GitLab access needed).

Use this environnement if you want to test the integration of ui-lib in uhc-portal. For development purposes prefer the use of assisted-ui application.

4. [Install yalc on your system](https://github.com/wclr/yalc#installation). yalc simulate the yarn publish workflow without publishing our packages to the remote registry.

   - ```bash
     yalc --version
     ```

5. In one terminal run ui-lib in watch mode. It will build and publish `@openshift-assisted/ui-lib` packages everytime you make a change.

   - ```bash
     cd libs/ui-lib
     yarn watch
     ```

6. In another terminal, fork and clone [uhc-portal](https://gitlab.cee.redhat.com/service/uhc-portal.git):

   - ```bash
      cd ~/Projects
      git clone https://gitlab.cee.redhat.com/<username>/uhc-portal.git
     ```

7. The first time, install npm dependencies and link `@openshift-assisted/ui-lib` and `@openshift-assisted/locales` using yalc. You can skip this after. The watcher on ui-lib will update the packages for you.

   - ```bash
      cd uhc-portal
      yarn install
      yalc link @openshift-assisted/ui-lib
      yalc link @openshift-assisted/locales
     ```

8. Now you can start uhc-portal. Please follow the [uhc-portal README](https://gitlab.cee.redhat.com/service/uhc-portal/-/blob/master/README.md)

   - ```bash
      yarn start
     ```

9. Visit https://ENV.foo.redhat.com:1337/openshift/assisted-installer/clusters/~new

### CIM

    todo

## Publish

To publish a new version of the package to
[npmjs.com](https://www.npmjs.com/package/openshift-assisted-ui-lib)

1. Create a new branch from `master` in this repo, called `release/v<some-semver-string>`.
2. [Draft a new release through GitHub's interface](https://github.com/openshift-assisted/assisted-ui-lib/releases/new).
3. Fill the form with the following details:
   1. Tag: `v<some-semver-string>`
   2. Target branch: `release/v<some-semver-string>` (same as in step 2 above).
   3. Title: `v<some-semver-string>`
   4. Description: Generate the release notes automatically (or edit the field manually)

## Updating the API types

The types used by Assisted Installer UI are defined in `src/common/api/types.ts` and they are
generated automatically by running `yarn update-api`.

## Troubleshooting

### Increasing the amount of inotify watchers

If you see the following error: `Error: ENOSPC: System limit for number of file watchers reached`,
you will need to increase the number of inotify watchers.  
From the terminal run the following commands:

```bash
$ sudo sh -c "echo fs.inotify.max_user_watches=524288 >> /etc/sysctl.conf"
$ sudo sysctl -p
```

## i18n

See [i18n](I18N.md) for information on our internationalization tools and guidelines

## License

Apache-2.0
