require("dotenv").config();
// import { v2 } from "cloudinary";
// v2.config({ api_key: "", api_secret: "", cloud_name: "" });
// v2.uploader.upload("", {}).then((res) => {
//   v2.url(res.public_id, {
//     transformation: [{ quality: "auto", fetch_format: "jpg" }],
//   });
// });

const configs = {
  PORT: process.env.PORT || 5000,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
  PAYSTACK_BASE_URL: process.env.PAYSTACK_BASE_URL,
  PAYSTACK_TEST_SECRET_KEY: process.env.PAYSTACK_TEST_SECRET_KEY,
  PAYSTACK_TEST_PUBLIC_KEY: process.env.PAYSTACK_TEST_PUBLIC_KEY,
  PAYSTACK_LIVE_SECRET_KEY: process.env.PAYSTACK_LIVE_SECRET_KEY,
  PAYSTACK_LIVE_PUBLIC_KEY: process.env.PAYSTACK_LIVE_PUBLIC_KEY,
  DATARELOADED_BASE_URL: process.env.DATARELOADED_BASE_URL,
  DATARELOADED_API_KEY: process.env.DATARELOADED_API_KEY,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
};

export default configs;
