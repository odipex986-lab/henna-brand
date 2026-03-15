import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", router);

const frontendPath = path.join(process.cwd(), "..", "al-mehandi", "dist", "public");
app.use(express.static(frontendPath));
app.get("(.*)", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;
