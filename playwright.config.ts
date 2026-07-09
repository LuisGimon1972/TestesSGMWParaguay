import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on'
    // ❌ NÃO coloque storageState aqui ainda
  },
});