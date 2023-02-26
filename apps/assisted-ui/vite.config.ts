import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react-swc';
import EnvironmentPlugin from 'vite-plugin-environment'
import { makeDynamicEnvVars } from './scripts/toolbox.js';

export default defineConfig(async ({ mode }) => {  
  const envVarsPrefix = 'AIUI_';
  const env = loadEnv(mode, process.cwd(), envVarsPrefix);
  const dynamicEnvVars = await makeDynamicEnvVars();

  return {
    build: {
      emptyOutDir: true,
      outDir: 'build',
      sourcemap: true,
    },
    plugins: [
      EnvironmentPlugin(
        dynamicEnvVars,
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
