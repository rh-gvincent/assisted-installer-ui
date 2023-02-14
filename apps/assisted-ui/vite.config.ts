import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_',);
  return {
    define: {
      // VITE_APP_API_URL: 'http://edge-13.edge.lab.eng.rdu2.redhat.com:6008',
      // VITE_APP_API_ROOT: '/api/assisted-install',
      VITE_APP_VERSION: "'0.0.0+sha.54538b4a'",
      // VITE_APP_GIT_SHA: '54538b4a',
      // VITE_APP_IMAGE_REPO: 'quay.io/edge-infrastructure/assisted-installer-ui'
    },
    build: {
      outDir: 'build',
      sourcemap: 'hidden'
    },
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_API_URL,
          changeOrigin: true,
        }
      },
    },
  };
});
