/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://InterviewPro_owner:wyBI8QiF1kza@ep-dawn-pond-a1tanqjb.ap-southeast-1.aws.neon.tech/InterviewPro?sslmode=require",
  },
};
