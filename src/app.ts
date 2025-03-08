import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";


// Load environment variables
config({ path: "./.env" });

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "sk_test_51QyXoa2cwOoBDHjfcjFZD7t8HK75kXxfHDHPiGY3SeGgNFpAdbPSMzkgf7rX60YRSpaCxxgioQ7dqrJ2nccOeKnK00eYnyIlyR";
export const redisTTL = process.env.REDIS_TTL || 60 * 60 * 4;

connectDB(mongoURI);
export const stripe = new Stripe(stripeKey);

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});

// Import Routes
import userRoute from "./routes/user.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/dashboard.js";

app.use("/api/v1/user", userRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Mongodb',mongoURI)
});
