import { findTools } from "../src/lib/db";

async function test() {
    try {
        const result = await findTools({ limit: 5 });
        console.log("Tools found:", result.tools.length);
        console.log("Total count:", result.total);
        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

test();
