import "dotenv/config";
import { dbConnect } from "@/db/connection";
import { TestTemplate } from "@/models/TestTemplate";
import { User } from "@/models/User";
import { Question } from "@/types";

/**
 * Baseline questions for Classes 1-4 (ages 6-10)
 * 25 questions covering 8 domains with LIKERT_1_4 format:
 * - Bullying (4 questions)
 * - Self-harm risk (3 questions)
 * - Family stress (4 questions)
 * - Academic pressure (4 questions)
 * - Social isolation (3 questions)
 * - Trauma (3 questions)
 * - Neglect (2 questions)
 * - Eating disorders (2 questions)
 */

const baselineQuestions: Question[] = [
  // Bullying (4 questions)
  {
    id: "base-1",
    text: "When other children say mean things to you at school, what usually happens?",
    answerType: "LIKERT_1_4",
    domainTags: ["Bullying"],
    weight: 1,
    options: [
      { key: "a", text: "This rarely happens to me", riskLevel: "None", score: 0 },
      { key: "b", text: "It happened once or twice but I told someone", riskLevel: "Low", score: 1 },
      { key: "c", text: "It happens sometimes and I try to ignore it", riskLevel: "Mid", score: 2 },
      { key: "d", text: "It happens often and I feel scared or upset", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-2",
    text: "Have you ever been pushed, hit, or kicked by other children?",
    answerType: "LIKERT_1_4",
    domainTags: ["Bullying"],
    weight: 1,
    options: [
      { key: "a", text: "No, never", riskLevel: "None", score: 0 },
      { key: "b", text: "Maybe once by accident", riskLevel: "Low", score: 1 },
      { key: "c", text: "Yes, a few times on purpose", riskLevel: "Mid", score: 2 },
      { key: "d", text: "Yes, this happens regularly", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-3",
    text: "Do other children leave you out of games or activities?",
    answerType: "LIKERT_1_4",
    domainTags: ["Bullying", "Social isolation"],
    weight: 1,
    options: [
      { key: "a", text: "No, I always get to play with others", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I feel left out but it's okay", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often get left out of games", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I am almost always left out", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-4",
    text: "Do you ever feel afraid to go to certain places at school (bathroom, playground, hallway)?",
    answerType: "LIKERT_1_4",
    domainTags: ["Bullying"],
    weight: 1,
    options: [
      { key: "a", text: "No, I feel safe everywhere at school", riskLevel: "None", score: 0 },
      { key: "b", text: "I felt worried once but it got better", riskLevel: "Low", score: 1 },
      { key: "c", text: "There are some places I try to avoid", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I often feel scared in many places at school", riskLevel: "High", score: 3 },
    ],
  },

  // Self-harm risk (3 questions)
  {
    id: "base-5",
    text: "When you feel very upset or angry, what do you think about?",
    answerType: "LIKERT_1_4",
    domainTags: ["Self-harm risk"],
    weight: 1,
    options: [
      { key: "a", text: "I think about talking to someone or doing something fun", riskLevel: "None", score: 0 },
      { key: "b", text: "I feel bad but the feeling goes away soon", riskLevel: "Low", score: 1 },
      { key: "c", text: "Sometimes I think about wanting to disappear", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I think about hurting myself or wish I wasn't here", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-6",
    text: "Have you ever hurt yourself on purpose (like hitting, scratching, or cutting)?",
    answerType: "LIKERT_1_4",
    domainTags: ["Self-harm risk"],
    weight: 1,
    options: [
      { key: "a", text: "No, I've never thought about doing that", riskLevel: "None", score: 0 },
      { key: "b", text: "I thought about it once but didn't do it", riskLevel: "Low", score: 1 },
      { key: "c", text: "I've done it once or twice", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I do this when I'm upset", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-7",
    text: "How often do you feel like things will never get better?",
    answerType: "LIKERT_1_4",
    domainTags: ["Self-harm risk"],
    weight: 1,
    options: [
      { key: "a", text: "I rarely feel this way, things usually work out", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I feel sad but then I feel better", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often feel like my problems won't go away", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I feel hopeless most of the time", riskLevel: "High", score: 3 },
    ],
  },

  // Family stress (4 questions)
  {
    id: "base-9",
    text: "How do adults at home usually treat each other?",
    answerType: "LIKERT_1_4",
    domainTags: ["Family stress"],
    weight: 1,
    options: [
      { key: "a", text: "They are kind and respectful to each other", riskLevel: "None", score: 0 },
      { key: "b", text: "They sometimes disagree but talk it out", riskLevel: "Low", score: 1 },
      { key: "c", text: "They argue loudly or often", riskLevel: "Mid", score: 2 },
      { key: "d", text: "They fight a lot and it scares me", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-10",
    text: "When you're at home, how does it usually feel?",
    answerType: "LIKERT_1_4",
    domainTags: ["Family stress"],
    weight: 1,
    options: [
      { key: "a", text: "Calm and happy", riskLevel: "None", score: 0 },
      { key: "b", text: "Mostly okay, sometimes noisy", riskLevel: "Low", score: 1 },
      { key: "c", text: "Often stressful or tense", riskLevel: "Mid", score: 2 },
      { key: "d", text: "Very stressful and scary most of the time", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-11",
    text: "Do you worry about things happening at home?",
    answerType: "LIKERT_1_4",
    domainTags: ["Family stress", "Trauma"],
    weight: 1,
    options: [
      { key: "a", text: "No, I don't worry about home", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I worry a little", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often worry about things at home", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I worry about home almost all the time", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-12",
    text: "Do you have to help take care of your family a lot?",
    answerType: "LIKERT_1_4",
    domainTags: ["Family stress", "Neglect"],
    weight: 1,
    options: [
      { key: "a", text: "No, adults take care of everything", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I help with small things", riskLevel: "Low", score: 1 },
      { key: "c", text: "I have to help a lot with family things", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I have to take care of things almost all the time", riskLevel: "High", score: 3 },
    ],
  },

  // Academic pressure (4 questions)
  {
    id: "base-13",
    text: "Do you feel worried about your school work?",
    answerType: "LIKERT_1_4",
    domainTags: ["Academic pressure"],
    weight: 1,
    options: [
      { key: "a", text: "No, I don't worry about school work", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I worry a little", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often worry about my school work", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I worry about school work almost all the time", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-14",
    text: "Do you feel like you have too much homework?",
    answerType: "LIKERT_1_4",
    domainTags: ["Academic pressure"],
    weight: 1,
    options: [
      { key: "a", text: "No, I have the right amount", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I feel it's a bit too much", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often feel I have too much homework", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I always feel overwhelmed by homework", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-15",
    text: "Do you worry about getting good marks in school?",
    answerType: "LIKERT_1_4",
    domainTags: ["Academic pressure", "Family stress"],
    weight: 1,
    options: [
      { key: "a", text: "No, I don't worry much about marks", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I worry about my marks", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often worry about getting good marks", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I worry about marks almost all the time", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-16",
    text: "Do you feel tired because of school work?",
    answerType: "LIKERT_1_4",
    domainTags: ["Academic pressure"],
    weight: 1,
    options: [
      { key: "a", text: "No, I feel fine", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I feel a little tired", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often feel tired from school work", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I always feel very tired because of school work", riskLevel: "High", score: 3 },
    ],
  },

  // Social isolation (3 questions)
  {
    id: "base-17",
    text: "Do you have friends you can play with?",
    answerType: "LIKERT_1_4",
    domainTags: ["Social isolation"],
    weight: 1,
    options: [
      { key: "a", text: "Yes, I have many friends to play with", riskLevel: "None", score: 0 },
      { key: "b", text: "Yes, I have a few friends", riskLevel: "Low", score: 1 },
      { key: "c", text: "I have very few friends", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I don't have friends to play with", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-18",
    text: "Do you feel lonely when you are at school?",
    answerType: "LIKERT_1_4",
    domainTags: ["Social isolation"],
    weight: 1,
    options: [
      { key: "a", text: "No, I never feel lonely", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I feel a little lonely", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often feel lonely at school", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I almost always feel lonely at school", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-19",
    text: "Do you have someone you can talk to when you feel sad?",
    answerType: "LIKERT_1_4",
    domainTags: ["Social isolation", "Trauma"],
    weight: 1,
    options: [
      { key: "a", text: "Yes, I have many people I can talk to", riskLevel: "None", score: 0 },
      { key: "b", text: "Yes, I have someone I can talk to", riskLevel: "Low", score: 1 },
      { key: "c", text: "Sometimes, but not always", riskLevel: "Mid", score: 2 },
      { key: "d", text: "No, I don't have anyone to talk to", riskLevel: "High", score: 3 },
    ],
  },

  // Trauma (3 questions)
  {
    id: "base-20",
    text: "Have you seen or heard something scary that still bothers you?",
    answerType: "LIKERT_1_4",
    domainTags: ["Trauma"],
    weight: 1,
    options: [
      { key: "a", text: "No, nothing like this has happened", riskLevel: "None", score: 0 },
      { key: "b", text: "This happened once but doesn't bother me now", riskLevel: "Low", score: 1 },
      { key: "c", text: "Yes, this sometimes bothers me", riskLevel: "Mid", score: 2 },
      { key: "d", text: "Yes, this bothers me a lot", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-21",
    text: "Do you have bad dreams or nightmares?",
    answerType: "LIKERT_1_4",
    domainTags: ["Trauma", "Self-harm risk"],
    weight: 1,
    options: [
      { key: "a", text: "I sleep well and feel rested", riskLevel: "None", score: 0 },
      { key: "b", text: "Usually okay, sometimes have trouble sleeping", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often have trouble falling asleep or have bad dreams", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I have frequent nightmares or am afraid to sleep", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-22",
    text: "Do you ever feel like you're re-living a bad memory or can't stop thinking about something upsetting that happened?",
    answerType: "LIKERT_1_4",
    domainTags: ["Trauma"],
    weight: 1,
    options: [
      { key: "a", text: "No, I don't experience this", riskLevel: "None", score: 0 },
      { key: "b", text: "This happened once but doesn't anymore", riskLevel: "Low", score: 1 },
      { key: "c", text: "Yes, this happens sometimes", riskLevel: "Mid", score: 2 },
      { key: "d", text: "Yes, this happens a lot and I can't make it stop", riskLevel: "High", score: 3 },
    ],
  },

  // Neglect (2 questions)
  {
    id: "base-23",
    text: "Do you have clean clothes to wear and get regular meals every day?",
    answerType: "LIKERT_1_4",
    domainTags: ["Neglect"],
    weight: 1,
    options: [
      { key: "a", text: "Yes, always", riskLevel: "None", score: 0 },
      { key: "b", text: "Yes, most of the time", riskLevel: "Low", score: 1 },
      { key: "c", text: "Sometimes I don't have these things", riskLevel: "Mid", score: 2 },
      { key: "d", text: "Often I don't have clean clothes or enough food", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-24",
    text: "When you're sick or hurt, does an adult take care of you?",
    answerType: "LIKERT_1_4",
    domainTags: ["Neglect"],
    weight: 1,
    options: [
      { key: "a", text: "Yes, adults help me right away", riskLevel: "None", score: 0 },
      { key: "b", text: "Yes, usually they help me", riskLevel: "Low", score: 1 },
      { key: "c", text: "Sometimes, but I often have to take care of myself", riskLevel: "Mid", score: 2 },
      { key: "d", text: "No, I usually have to manage on my own", riskLevel: "High", score: 3 },
    ],
  },

  // Eating disorders (2 questions) - simplified for younger children
  {
    id: "base-25",
    text: "How do you feel about eating meals?",
    answerType: "LIKERT_1_4",
    domainTags: ["Eating disorders"],
    weight: 1,
    options: [
      { key: "a", text: "I enjoy eating when I'm hungry", riskLevel: "None", score: 0 },
      { key: "b", text: "Eating is fine, nothing special", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often feel worried about eating", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I'm very afraid of eating", riskLevel: "High", score: 3 },
    ],
  },
  {
    id: "base-26",
    text: "Do you ever skip meals on purpose or eat much more than you should?",
    answerType: "LIKERT_1_4",
    domainTags: ["Eating disorders"],
    weight: 1,
    options: [
      { key: "a", text: "No, I eat regular meals when hungry", riskLevel: "None", score: 0 },
      { key: "b", text: "Rarely, maybe if I'm not feeling well", riskLevel: "Low", score: 1 },
      { key: "c", text: "Sometimes I skip meals or eat too much", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I often skip meals or can't control my eating", riskLevel: "High", score: 3 },
    ],
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
      existingTemplate.description = "25-question Social-Emotional Learning baseline for Classes 1-4 (ages 6-10). 4-option risk scale: None/Low/Mid/High.";
      await existingTemplate.save();
      console.log(`✓ Updated baseline template with ${baselineQuestions.length} questions`);
    } else {
      // Create new baseline template
      const baselineTemplate = await TestTemplate.create({
        type: "BASELINE",
        name: "Baseline Wellbeing Scan - Classes 1-4",
        description: "25-question Social-Emotional Learning baseline for Classes 1-4 (ages 6-10). 4-option risk scale: None/Low/Mid/High.",
        questions: baselineQuestions,
        createdBy: adminUser._id,
        schoolId: null, // Global template, not school-specific
      });
      console.log(`✓ Created baseline template with ${baselineQuestions.length} questions`);
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
