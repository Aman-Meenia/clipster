import { defineConfig } from "prisma/config";
import config from "./config/config";

console.log("Config " + config.POSTGRES_URL);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: config.POSTGRES_URL ?? "",
  },
});
