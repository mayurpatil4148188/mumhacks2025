import "dotenv/config";
import { dbConnect } from "@/db/connection";
import { TestTemplate } from "@/models/TestTemplate";
import { User } from "@/models/User";

/**
 * Baseline questions for Classes 1-4 (ages 6-10)
 * 25 questions covering 8 domains:
 * - Bullying
 * - Self-harm risk
 * - Family stress
 * - Academic pressure
 * - Social isolation
 * - Trauma
 * - Neglect
 * - Eating disorders
 */

const baselineQuestions = [
  // Bullying (4 questions)
  {
    id: "base-1",
    text: "Do other children say mean things to you or about you?",
    answerType: "LIKERT_1_5",
    domainTags: ["Bullying"],
    weight: 1,
  },
  {
    id: "base-2",
    text: "Do you feel safe when you are at school?",
    answerType: "LIKERT_1_5",
    domainTags: ["Bullying", "Social isolation"],
    weight: 1,
  },
  {
    id: "base-3",
    text: "Do other children leave you out of games or activities?",
    answerType: "LIKERT_1_5",
    domainTags: ["Bullying", "Social isolation"],
    weight: 1,
  },
  {
    id: "base-4",
    text: "Have you been pushed, hit, or hurt by other children?",
    answerType: "LIKERT_1_5",
    domainTags: ["Bullying", "Trauma"],
    weight: 1,
  },

  // Self-harm risk (3 questions)
  {
    id: "base-5",
    text: "Do you sometimes feel so sad that you don't want to do anything?",
    answerType: "LIKERT_1_5",
    domainTags: ["Self-harm risk", "Trauma"],
    weight: 1,
  },
  {
    id: "base-6",
    text: "Do you ever feel like hurting yourself when you are upset?",
    answerType: "LIKERT_1_5",
    domainTags: ["Self-harm risk"],
    weight: 1,
  },
  {
    id: "base-7",
    text: "Do you feel happy most of the time?",
    answerType: "LIKERT_1_5",
    domainTags: ["Self-harm risk", "Social isolation"],
    weight: 1,
    options: [
      { label: "Never", value: 1 },
      { label: "Rarely", value: 2 },
      { label: "Sometimes", value: 3 },
      { label: "Often", value: 4 },
      { label: "Always", value: 5 },
    ],
  },

  // Family stress (4 questions)
  {
    id: "base-8",
    text: "Do you worry about things happening at home?",
    answerType: "LIKERT_1_5",
    domainTags: ["Family stress", "Trauma"],
    weight: 1,
  },
  {
    id: "base-9",
    text: "Do your family members fight or argue a lot?",
    answerType: "LIKERT_1_5",
    domainTags: ["Family stress", "Trauma"],
    weight: 1,
  },
  {
    id: "base-10",
    text: "Do you have to help take care of your family a lot?",
    answerType: "LIKERT_1_5",
    domainTags: ["Family stress", "Neglect"],
    weight: 1,
  },
  {
    id: "base-11",
    text: "Do you feel loved and cared for by your family?",
    answerType: "LIKERT_1_5",
    domainTags: ["Family stress", "Neglect"],
    weight: 1,
  },

  // Academic pressure (4 questions)
  {
    id: "base-12",
    text: "Do you feel worried about your school work?",
    answerType: "LIKERT_1_5",
    domainTags: ["Academic pressure"],
    weight: 1,
  },
  {
    id: "base-13",
    text: "Do you feel like you have too much homework?",
    answerType: "LIKERT_1_5",
    domainTags: ["Academic pressure"],
    weight: 1,
  },
  {
    id: "base-14",
    text: "Do you worry about getting good marks in school?",
    answerType: "LIKERT_1_5",
    domainTags: ["Academic pressure", "Family stress"],
    weight: 1,
  },
  {
    id: "base-15",
    text: "Do you feel tired because of school work?",
    answerType: "LIKERT_1_5",
    domainTags: ["Academic pressure"],
    weight: 1,
  },

  // Social isolation (3 questions)
  {
    id: "base-16",
    text: "Do you have friends you can play with?",
    answerType: "LIKERT_1_5",
    domainTags: ["Social isolation"],
    weight: 1,
  },
  {
    id: "base-17",
    text: "Do you feel lonely when you are at school?",
    answerType: "LIKERT_1_5",
    domainTags: ["Social isolation"],
    weight: 1,
  },
  {
    id: "base-18",
    text: "Do you have someone you can talk to when you feel sad?",
    answerType: "LIKERT_1_5",
    domainTags: ["Social isolation", "Trauma"],
    weight: 1,
  },

  // Trauma (3 questions)
  {
    id: "base-19",
    text: "Have you seen or heard something scary that still bothers you?",
    answerType: "LIKERT_1_5",
    domainTags: ["Trauma"],
    weight: 1,
  },
  {
    id: "base-20",
    text: "Do you have bad dreams or nightmares?",
    answerType: "LIKERT_1_5",
    domainTags: ["Trauma", "Self-harm risk"],
    weight: 1,
  },
  {
    id: "base-21",
    text: "Do you feel scared even when you are safe?",
    answerType: "LIKERT_1_5",
    domainTags: ["Trauma"],
    weight: 1,
  },

  // Neglect (2 questions)
  {
    id: "base-22",
    text: "Do you have enough food to eat at home?",
    answerType: "LIKERT_1_5",
    domainTags: ["Neglect", "Eating disorders"],
    weight: 1,
  },
  {
    id: "base-23",
    text: "Do grown-ups at home help you when you need help?",
    answerType: "LIKERT_1_5",
    domainTags: ["Neglect", "Family stress"],
    weight: 1,
  },

  // Eating disorders (2 questions)
  {
    id: "base-24",
    text: "Do you worry about how your body looks?",
    answerType: "LIKERT_1_5",
    domainTags: ["Eating disorders"],
    weight: 1,
  },
  {
    id: "base-25",
    text: "Do you sometimes skip meals or not eat when you are hungry?",
    answerType: "LIKERT_1_5",
    domainTags: ["Eating disorders", "Neglect"],
    weight: 1,
  },
];

async function seedBaselineQuestions() {
  try {
    await dbConnect();
    console.log("Connected to database");

    // Find or create a master admin user to use as createdBy
    let adminUser = await User.findOne({ role: "MASTER_ADMIN" });
    if (!adminUser) {
      adminUser = await User.findOne({ role: "PRINCIPAL" });
    }
    if (!adminUser) {
      console.error("No admin or principal user found. Please run seed.ts first to create users.");
      process.exit(1);
    }

    // Check if baseline template already exists
    const existingTemplate = await TestTemplate.findOne({
      type: "BASELINE",
      name: "Baseline Wellbeing Scan - Classes 1-4",
    });

    if (existingTemplate) {
      console.log("Baseline template already exists. Updating with new questions...");
      existingTemplate.questions = baselineQuestions;
      existingTemplate.description = "Starter assessment to gauge overall wellbeing across key domains for students in Classes 1-4 (ages 6-10).";
      await existingTemplate.save();
      console.log("✓ Updated baseline template with 25 questions");
    } else {
      // Create new baseline template
      const baselineTemplate = await TestTemplate.create({
        type: "BASELINE",
        name: "Baseline Wellbeing Scan - Classes 1-4",
        description: "Starter assessment to gauge overall wellbeing across key domains for students in Classes 1-4 (ages 6-10).",
        questions: baselineQuestions,
        createdBy: adminUser._id,
        schoolId: null, // Global template, not school-specific
      });
      console.log("✓ Created baseline template with 25 questions");
      console.log(`  Template ID: ${baselineTemplate._id}`);
    }

    // Print summary
    console.log("\n=== Baseline Questions Summary ===");
    console.log(`Total questions: ${baselineQuestions.length}`);
    console.log("\nQuestions by domain:");
    const domainCounts: Record<string, number> = {};
    baselineQuestions.forEach((q) => {
      q.domainTags.forEach((tag) => {
        domainCounts[tag] = (domainCounts[tag] || 0) + 1;
      });
    });
    Object.entries(domainCounts).forEach(([domain, count]) => {
      console.log(`  ${domain}: ${count} question(s)`);
    });

    console.log("\n✓ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding baseline questions:", error);
    process.exit(1);
  }
}

seedBaselineQuestions();
