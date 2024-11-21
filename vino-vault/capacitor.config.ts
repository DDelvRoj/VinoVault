import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.dev.vinovault',
  appName: 'Vino Vault',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp:{
      enabled:true
    }
  }
};

export default config;
