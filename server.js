import "dotenv/config";
import app from "./app.js";

if (!process.env.POLYGON_API_KEY || !process.env.GEMINI_API_KEY) {
    console.error("Missing required API keys in .env");
    process.exit(1);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is running on port ${PORT}`);
    } else {
        console.log("Error: ", error);
    }
});

export default app;