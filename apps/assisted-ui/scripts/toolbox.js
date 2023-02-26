import 'zx/globals';

export const makeDynamicEnvVars = async () => {
  $.verbose = false
  const commitSignature = (await $`git rev-parse --short HEAD`).toString().trim();

  return {
    AIUI_APP_API_ROOT: process.env.AIUI_APP_API_ROOT ?? '/api/assisted-install',
    AIUI_APP_IMAGE_REPO: process.env.AIUI_APP_IMAGE_REPO ?? 'quay.io/edge-infrastructure/assisted-installer-ui',
    AIUI_APP_GIT_SHA: process.env.AIUI_APP_GIT_SHA ?? commitSignature,
    AIUI_APP_VERSION: process.env.AIUI_APP_VERSION ?? `0.0.0+sha.${commitSignature}`,
  };
};
