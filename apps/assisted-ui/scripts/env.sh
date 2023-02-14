export AIUI_APP_API_ROOT=${AIUI_APP_API_ROOT:-"/api/assisted-install"}
export AIUI_APP_GIT_SHA=${AIUI_APP_GIT_SHA:-"$(git rev-parse --short HEAD)"}
export AIUI_APP_IMAGE_REPO=${AIUI_APP_IMAGE_REPO:-"quay.io/edge-infrastructure/assisted-installer-ui"}
export AIUI_APP_VERSION=${AIUI_APP_VERSION:-"0.0.0+sha.$AIUI_APP_GIT_SHA"}
