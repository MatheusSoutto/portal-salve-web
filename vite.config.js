import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      // dev specific config
      plugins: [reactRefresh()],
      server: {
        host: '0.0.0.0',
        hmr: {
          port: 443,
        }
      }
    }
  } else {
    // command === 'build'
    return {
      // build specific config
      base: '/portal-salve-web/'
    }
  }
  
});
