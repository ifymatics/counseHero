
import { app } from "./app";
import { db } from "./config/db";

(async () => {
    await db();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`)
    });
})();
