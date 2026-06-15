import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://postgres.eamchcmjcpxtrfgrjcve:@academyintern12@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres",
  },
});