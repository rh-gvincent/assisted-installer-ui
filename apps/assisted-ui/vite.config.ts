import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react-swc';
import EnvironmentPlugin from 'vite-plugin-environment'


export default defineConfig(({ mode }) => {
  const envVarsPrefix = 'AIUI_';
  const env = loadEnv(mode, process.cwd(), envVarsPrefix,);
  return {
    build: {
      outDir: 'build',
      sourcemap: 'inline'
    },
    plugins: [
      EnvironmentPlugin(
        'all',
        {
          prefix: envVarsPrefix,
          defineOn: 'process.env'
        }
      ),
      react()
    ],
    server: {
      proxy: {
        '/api': {
          target: env.AIUI_APP_API_URL,
          changeOrigin: true,
        }
      },
    },
  };
});
