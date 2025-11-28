import "dotenv/config";
import { dbConnect } from "@/db/connection";
import { StudentTestInstance } from "@/models/StudentTestInstance";

async function flushTestInstances() {
  try {
    await dbConnect();
    console.log("Connected to database");

    const count = await StudentTestInstance.countDocuments();
    console.log(`Found ${count} test instance(s) to delete`);

    if (count === 0) {
      console.log("No test instances to delete.");
      process.exit(0);
    }

    const result = await StudentTestInstance.deleteMany({});
    console.log(`✓ Successfully deleted ${result.deletedCount} test instance(s)`);

    process.exit(0);
  } catch (error) {
    console.error("Error flushing test instances:", error);
    process.exit(1);
  }
}

flushTestInstances();

