import "dotenv/config";
import { dbConnect } from "@/db/connection";
import mongoose from "mongoose";

// Import all models to register them
import "@/models/User";
import "@/models/School";
import "@/models/StudentProfile";
import "@/models/TeacherProfile";
import "@/models/ParentProfile";
import "@/models/PrincipalProfile";
import "@/models/TestTemplate";
import "@/models/StudentTestInstance";
import "@/models/TeacherObservation";
import "@/models/RAGDocument";
import "@/models/AIChatSession";
import "@/models/UploadedFile";

// Collection name to model name mapping
const COLLECTION_MODEL_MAP: Record<string, string> = {
  users: "User",
  user: "User",
  schools: "School",
  school: "School",
  studentprofiles: "StudentProfile",
  studentprofile: "StudentProfile",
  students: "StudentProfile",
  student: "StudentProfile",
  teacherprofiles: "TeacherProfile",
  teacherprofile: "TeacherProfile",
  teachers: "TeacherProfile",
  teacher: "TeacherProfile",
  parentprofiles: "ParentProfile",
  parentprofile: "ParentProfile",
  parents: "ParentProfile",
  parent: "ParentProfile",
  principalprofiles: "PrincipalProfile",
  principalprofile: "PrincipalProfile",
  principals: "PrincipalProfile",
  principal: "PrincipalProfile",
  testtemplates: "TestTemplate",
  testtemplate: "TestTemplate",
  templates: "TestTemplate",
  template: "TestTemplate",
  studenttestinstances: "StudentTestInstance",
  studenttestinstance: "StudentTestInstance",
  testinstances: "StudentTestInstance",
  testinstance: "StudentTestInstance",
  tests: "StudentTestInstance",
  test: "StudentTestInstance",
  teacherobservations: "TeacherObservation",
  teacherobservation: "TeacherObservation",
  observations: "TeacherObservation",
  observation: "TeacherObservation",
  ragdocuments: "RAGDocument",
  ragdocument: "RAGDocument",
  rag: "RAGDocument",
  aichatsessions: "AIChatSession",
  aichatsession: "AIChatSession",
  chatsessions: "AIChatSession",
  chatsession: "AIChatSession",
  uploadedfiles: "UploadedFile",
  uploadedfile: "UploadedFile",
  files: "UploadedFile",
  file: "UploadedFile",
};

interface FlushOptions {
  collection: string;
  filter?: string;
  confirm?: boolean;
  dryRun?: boolean;
}

function parseArgs(): FlushOptions {
  const args = process.argv.slice(2);
  const options: FlushOptions = {
    collection: "",
    confirm: false,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--collection":
      case "-c":
        options.collection = args[++i]?.toLowerCase() || "";
        break;
      case "--filter":
      case "-f":
        options.filter = args[++i];
        break;
      case "--confirm":
      case "-y":
        options.confirm = true;
        break;
      case "--dry-run":
      case "-d":
        options.dryRun = true;
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
        break;
      default:
        if (!options.collection && !arg.startsWith("-")) {
          options.collection = arg.toLowerCase();
        }
        break;
    }
  }

  return options;
}

function printHelp() {
  console.log(`
Usage: npm run flush -- [collection-name] [options]

Flush (delete all) documents from a MongoDB collection.

Options:
  -c, --collection <name>    Collection name to flush (required)
  -f, --filter <json>        Optional JSON filter (e.g., '{"status":"OPEN"}')
  -y, --confirm              Skip confirmation prompt (required to actually delete)
  -d, --dry-run              Show what would be deleted without actually deleting
  -h, --help                 Show this help message

Examples:
  npm run flush -- testinstances --confirm
  npm run flush -- -c users --confirm
  npm run flush -- testinstances --dry-run
  npm run flush -- alerts -f '{"status":"OPEN"}' --dry-run
  npm run flush -- StudentTestInstance --confirm

Available collections:
  - users, user
  - schools, school
  - students, studentprofiles
  - teachers, teacherprofiles
  - parents, parentprofiles
  - principals, principalprofiles
  - templates, testtemplates
  - tests, testinstances, studenttestinstances
  - observations, teacherobservations
  - rag, ragdocuments
  - chatsessions, aichatsessions
  - files, uploadedfiles
`);
}

async function flushCollection(options: FlushOptions) {
  try {
    await dbConnect();
    console.log("✓ Connected to database\n");

    const collectionName = options.collection;
    if (!collectionName) {
      console.error("❌ Error: Collection name is required");
      printHelp();
      process.exit(1);
    }

    // Get model name from mapping
    const modelName = COLLECTION_MODEL_MAP[collectionName];
    if (!modelName) {
      console.error(`❌ Error: Unknown collection "${collectionName}"`);
      console.log("\nAvailable collections:");
      Object.keys(COLLECTION_MODEL_MAP)
        .filter((k, i, arr) => arr.indexOf(k) === i)
        .slice(0, 10)
        .forEach((k) => console.log(`  - ${k}`));
      console.log("\nUse --help for full list");
      process.exit(1);
    }

    // Get the model
    const Model = mongoose.model(modelName);
    const modelCollectionName = Model.collection.name;

    // Parse filter if provided
    let filter: any = {};
    if (options.filter) {
      try {
        filter = JSON.parse(options.filter);
      } catch (e) {
        console.error(`❌ Error: Invalid JSON filter: ${options.filter}`);
        process.exit(1);
      }
    }

    // Count documents
    const count = await Model.countDocuments(filter);
    console.log(`Collection: ${modelCollectionName}`);
    console.log(`Model: ${modelName}`);
    if (Object.keys(filter).length > 0) {
      console.log(`Filter: ${JSON.stringify(filter)}`);
    }
    console.log(`Documents found: ${count}`);

    if (count === 0) {
      console.log("\n✓ No documents to delete.");
      process.exit(0);
    }

    if (options.dryRun) {
      console.log("\n🔍 DRY RUN: Would delete", count, "document(s)");
      console.log("Run without --dry-run to actually delete");
      process.exit(0);
    }

    // Ask for confirmation unless --confirm flag is set
    if (!options.confirm) {
      console.log(`\n⚠️  WARNING: This will delete ${count} document(s) from "${modelCollectionName}"`);
      console.log("\nTo proceed with deletion, run with --confirm flag:");
      console.log(`  npm run flush -- ${collectionName} --confirm`);
      process.exit(0);
    }

    // Delete documents
    console.log("\nDeleting documents...");
    const result = await Model.deleteMany(filter);
    console.log(`\n✓ Successfully deleted ${result.deletedCount} document(s)`);

    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Main execution
const options = parseArgs();
flushCollection(options);

