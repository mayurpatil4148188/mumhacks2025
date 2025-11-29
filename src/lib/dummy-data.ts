import mongoose from "mongoose";

const studentId = new mongoose.Types.ObjectId("000000000000000000000001");
const studentId2 = new mongoose.Types.ObjectId("000000000000000000000002");
const studentId3 = new mongoose.Types.ObjectId("000000000000000000000003");
const schoolId = new mongoose.Types.ObjectId("0000000000000000000000aa");

export const dummyUserPrincipal = {
  email: "principal@dummy.school",
  password: "welcome123",
  schoolId: schoolId.toString(),
};

export const dummyUserStudent = {
  email: "student@dummy.school",
  password: "welcome123",
  schoolId: schoolId.toString(),
};

export const dummyStudentProfile = {
  userId: studentId,
  schoolId,
  grade: "6",
  section: "A",
  rollNumber: "6A-01",
};

export const dummyStudents = [
  {
    id: studentId.toString(),
    name: "Aarav Patel",
    grade: "6",
    section: "A",
    rollNumber: "6A-01",
    baselineDone: true,
    followupCount: 2,
    alertCount: 2,
    personaSnippet: "Overall wellbeing risk looks elevated. Main areas to watch: Social isolation (level 2/3), Bullying (level 1/3), Self-harm risk (level 1/3).",
  },
  {
    id: studentId2.toString(),
    name: "Priya Sharma",
    grade: "6",
    section: "B",
    rollNumber: "6B-15",
    baselineDone: true,
    followupCount: 1,
    alertCount: 0,
    personaSnippet: "Student shows good social connections. Academic pressure is moderate. Continue monitoring.",
  },
  {
    id: studentId3.toString(),
    name: "Rohan Kumar",
    grade: "7",
    section: "A",
    rollNumber: "7A-08",
    baselineDone: false,
    followupCount: 0,
    alertCount: 1,
    personaSnippet: null,
  },
];

export const dummyPersona = {
  staff: [
    "Aarav Patel (Grade 6, Section A, Roll 6A-01) — Latest baseline check-in.",
    "Overall wellbeing risk looks elevated.",
    "Main areas to watch: Social isolation (level 2/3) — feeling left out at times • Bullying (level 1/3) — occasional mean comments • Self-harm risk (level 1/3) — mild worries reported.",
    "Notes for staff: Offer regular check-ins, pair with supportive peers, and keep communication open with family.",
  ].join("\n"),
  student: [
    "Aarav, we are noticing how you're doing in school.",
    "We want to check in about: feeling left out, occasional mean comments, and some worries.",
    "Your feelings matter. If anything feels hard, you can talk to your teacher or counselor.",
  ].join(" "),
};

// All 25 baseline questions from seeder
export const dummyBaselineQuestions = [
  {
    questionId: "base-1",
    id: "base-1",
    text: "When other children say mean things to you at school, what usually happens?",
    answerType: "LIKERT_1_4",
    domainTags: ["Bullying"],
    options: [
      { key: "a", text: "This rarely happens to me", riskLevel: "None", score: 0 },
      { key: "b", text: "It happened once or twice but I told someone", riskLevel: "Low", score: 1 },
      { key: "c", text: "It happens sometimes and I try to ignore it", riskLevel: "Mid", score: 2 },
      { key: "d", text: "It happens often and I feel scared or upset", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-2",
    id: "base-2",
    text: "Have you ever been pushed, hit, or kicked by other children?",
    answerType: "LIKERT_1_4",
    domainTags: ["Bullying"],
    options: [
      { key: "a", text: "No, never", riskLevel: "None", score: 0 },
      { key: "b", text: "Maybe once by accident", riskLevel: "Low", score: 1 },
      { key: "c", text: "Yes, a few times on purpose", riskLevel: "Mid", score: 2 },
      { key: "d", text: "Yes, this happens regularly", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-3",
    id: "base-3",
    text: "Do other children leave you out of games or activities?",
    answerType: "LIKERT_1_4",
    domainTags: ["Bullying", "Social isolation"],
    options: [
      { key: "a", text: "No, I always get to play with others", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I feel left out but it's okay", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often get left out of games", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I am almost always left out", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-4",
    id: "base-4",
    text: "Do you ever feel afraid to go to certain places at school (bathroom, playground, hallway)?",
    answerType: "LIKERT_1_4",
    domainTags: ["Bullying"],
    options: [
      { key: "a", text: "No, I feel safe everywhere at school", riskLevel: "None", score: 0 },
      { key: "b", text: "I felt worried once but it got better", riskLevel: "Low", score: 1 },
      { key: "c", text: "There are some places I try to avoid", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I often feel scared in many places at school", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-5",
    id: "base-5",
    text: "When you feel very upset or angry, what do you think about?",
    answerType: "LIKERT_1_4",
    domainTags: ["Self-harm risk"],
    options: [
      { key: "a", text: "I think about talking to someone or doing something fun", riskLevel: "None", score: 0 },
      { key: "b", text: "I feel bad but the feeling goes away soon", riskLevel: "Low", score: 1 },
      { key: "c", text: "Sometimes I think about wanting to disappear", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I think about hurting myself or wish I wasn't here", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-6",
    id: "base-6",
    text: "Have you ever hurt yourself on purpose (like hitting, scratching, or cutting)?",
    answerType: "LIKERT_1_4",
    domainTags: ["Self-harm risk"],
    options: [
      { key: "a", text: "No, I've never thought about doing that", riskLevel: "None", score: 0 },
      { key: "b", text: "I thought about it once but didn't do it", riskLevel: "Low", score: 1 },
      { key: "c", text: "I've done it once or twice", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I do this when I'm upset", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-7",
    id: "base-7",
    text: "How often do you feel like things will never get better?",
    answerType: "LIKERT_1_4",
    domainTags: ["Self-harm risk"],
    options: [
      { key: "a", text: "I rarely feel this way, things usually work out", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I feel sad but then I feel better", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often feel like my problems won't go away", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I feel hopeless most of the time", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-9",
    id: "base-9",
    text: "How do adults at home usually treat each other?",
    answerType: "LIKERT_1_4",
    domainTags: ["Family stress"],
    options: [
      { key: "a", text: "They are kind and respectful to each other", riskLevel: "None", score: 0 },
      { key: "b", text: "They sometimes disagree but talk it out", riskLevel: "Low", score: 1 },
      { key: "c", text: "They argue loudly or often", riskLevel: "Mid", score: 2 },
      { key: "d", text: "They fight a lot and it scares me", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-10",
    id: "base-10",
    text: "When you're at home, how does it usually feel?",
    answerType: "LIKERT_1_4",
    domainTags: ["Family stress"],
    options: [
      { key: "a", text: "Calm and happy", riskLevel: "None", score: 0 },
      { key: "b", text: "Mostly okay, sometimes noisy", riskLevel: "Low", score: 1 },
      { key: "c", text: "Often stressful or tense", riskLevel: "Mid", score: 2 },
      { key: "d", text: "Very stressful and scary most of the time", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-11",
    id: "base-11",
    text: "Do you worry about things happening at home?",
    answerType: "LIKERT_1_4",
    domainTags: ["Family stress", "Trauma"],
    options: [
      { key: "a", text: "No, I don't worry about home", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I worry a little", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often worry about things at home", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I worry about home almost all the time", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-12",
    id: "base-12",
    text: "Do you have to help take care of your family a lot?",
    answerType: "LIKERT_1_4",
    domainTags: ["Family stress", "Neglect"],
    options: [
      { key: "a", text: "No, adults take care of everything", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I help with small things", riskLevel: "Low", score: 1 },
      { key: "c", text: "I have to help a lot with family things", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I have to take care of things almost all the time", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-13",
    id: "base-13",
    text: "Do you feel worried about your school work?",
    answerType: "LIKERT_1_4",
    domainTags: ["Academic pressure"],
    options: [
      { key: "a", text: "No, I don't worry about school work", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I worry a little", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often worry about my school work", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I worry about school work almost all the time", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-14",
    id: "base-14",
    text: "Do you feel like you have too much homework?",
    answerType: "LIKERT_1_4",
    domainTags: ["Academic pressure"],
    options: [
      { key: "a", text: "No, I have the right amount", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I feel it's a bit too much", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often feel I have too much homework", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I always feel overwhelmed by homework", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-15",
    id: "base-15",
    text: "Do you worry about getting good marks in school?",
    answerType: "LIKERT_1_4",
    domainTags: ["Academic pressure", "Family stress"],
    options: [
      { key: "a", text: "No, I don't worry much about marks", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I worry about my marks", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often worry about getting good marks", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I worry about marks almost all the time", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-16",
    id: "base-16",
    text: "Do you feel tired because of school work?",
    answerType: "LIKERT_1_4",
    domainTags: ["Academic pressure"],
    options: [
      { key: "a", text: "No, I feel fine", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I feel a little tired", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often feel tired from school work", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I always feel very tired because of school work", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-17",
    id: "base-17",
    text: "Do you have friends you can play with?",
    answerType: "LIKERT_1_4",
    domainTags: ["Social isolation"],
    options: [
      { key: "a", text: "Yes, I have many friends to play with", riskLevel: "None", score: 0 },
      { key: "b", text: "Yes, I have a few friends", riskLevel: "Low", score: 1 },
      { key: "c", text: "I have very few friends", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I don't have friends to play with", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-18",
    id: "base-18",
    text: "Do you feel lonely when you are at school?",
    answerType: "LIKERT_1_4",
    domainTags: ["Social isolation"],
    options: [
      { key: "a", text: "No, I never feel lonely", riskLevel: "None", score: 0 },
      { key: "b", text: "Sometimes I feel a little lonely", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often feel lonely at school", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I almost always feel lonely at school", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-19",
    id: "base-19",
    text: "Do you have someone you can talk to when you feel sad?",
    answerType: "LIKERT_1_4",
    domainTags: ["Social isolation", "Trauma"],
    options: [
      { key: "a", text: "Yes, I have many people I can talk to", riskLevel: "None", score: 0 },
      { key: "b", text: "Yes, I have someone I can talk to", riskLevel: "Low", score: 1 },
      { key: "c", text: "Sometimes, but not always", riskLevel: "Mid", score: 2 },
      { key: "d", text: "No, I don't have anyone to talk to", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-20",
    id: "base-20",
    text: "Have you seen or heard something scary that still bothers you?",
    answerType: "LIKERT_1_4",
    domainTags: ["Trauma"],
    options: [
      { key: "a", text: "No, nothing like this has happened", riskLevel: "None", score: 0 },
      { key: "b", text: "This happened once but doesn't bother me now", riskLevel: "Low", score: 1 },
      { key: "c", text: "Yes, this sometimes bothers me", riskLevel: "Mid", score: 2 },
      { key: "d", text: "Yes, this bothers me a lot", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-21",
    id: "base-21",
    text: "Do you have bad dreams or nightmares?",
    answerType: "LIKERT_1_4",
    domainTags: ["Trauma", "Self-harm risk"],
    options: [
      { key: "a", text: "I sleep well and feel rested", riskLevel: "None", score: 0 },
      { key: "b", text: "Usually okay, sometimes have trouble sleeping", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often have trouble falling asleep or have bad dreams", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I have frequent nightmares or am afraid to sleep", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-22",
    id: "base-22",
    text: "Do you ever feel like you're re-living a bad memory or can't stop thinking about something upsetting that happened?",
    answerType: "LIKERT_1_4",
    domainTags: ["Trauma"],
    options: [
      { key: "a", text: "No, I don't experience this", riskLevel: "None", score: 0 },
      { key: "b", text: "This happened once but doesn't anymore", riskLevel: "Low", score: 1 },
      { key: "c", text: "Yes, this happens sometimes", riskLevel: "Mid", score: 2 },
      { key: "d", text: "Yes, this happens a lot and I can't make it stop", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-23",
    id: "base-23",
    text: "Do you have clean clothes to wear and get regular meals every day?",
    answerType: "LIKERT_1_4",
    domainTags: ["Neglect"],
    options: [
      { key: "a", text: "Yes, always", riskLevel: "None", score: 0 },
      { key: "b", text: "Yes, most of the time", riskLevel: "Low", score: 1 },
      { key: "c", text: "Sometimes I don't have these things", riskLevel: "Mid", score: 2 },
      { key: "d", text: "Often I don't have clean clothes or enough food", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-24",
    id: "base-24",
    text: "When you're sick or hurt, does an adult take care of you?",
    answerType: "LIKERT_1_4",
    domainTags: ["Neglect"],
    options: [
      { key: "a", text: "Yes, adults help me right away", riskLevel: "None", score: 0 },
      { key: "b", text: "Yes, usually they help me", riskLevel: "Low", score: 1 },
      { key: "c", text: "Sometimes, but I often have to take care of myself", riskLevel: "Mid", score: 2 },
      { key: "d", text: "No, I usually have to manage on my own", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-25",
    id: "base-25",
    text: "How do you feel about eating meals?",
    answerType: "LIKERT_1_4",
    domainTags: ["Eating disorders"],
    options: [
      { key: "a", text: "I enjoy eating when I'm hungry", riskLevel: "None", score: 0 },
      { key: "b", text: "Eating is fine, nothing special", riskLevel: "Low", score: 1 },
      { key: "c", text: "I often feel worried about eating", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I'm very afraid of eating", riskLevel: "High", score: 3 },
    ],
  },
  {
    questionId: "base-26",
    id: "base-26",
    text: "Do you ever skip meals on purpose or eat much more than you should?",
    answerType: "LIKERT_1_4",
    domainTags: ["Eating disorders"],
    options: [
      { key: "a", text: "No, I eat regular meals when hungry", riskLevel: "None", score: 0 },
      { key: "b", text: "Rarely, maybe if I'm not feeling well", riskLevel: "Low", score: 1 },
      { key: "c", text: "Sometimes I skip meals or eat too much", riskLevel: "Mid", score: 2 },
      { key: "d", text: "I often skip meals or can't control my eating", riskLevel: "High", score: 3 },
    ],
  },
];

// Helper function to convert risk to score
function riskToScore(risk: string): number {
  switch (risk) {
    case "None": return 0;
    case "Low": return 1;
    case "Mid": return 2;
    case "High": return 3;
    default: return 0;
  }
}

// Helper to map domain tags (simplified - using first domain from tags)
function mapDomainTag(tags: string[]): string {
  const domainMap: Record<string, string> = {
    "Bullying": "Bullying",
    "Peer Dynamics": "Bullying",
    "Social Safety": "Bullying",
    "Exclusion": "Bullying",
    "Paranoia/Safety": "Bullying",
    "Safety": "Bullying",
    "Trust": "Bullying",
    "Boundaries": "Bullying",
    "Cyberbullying": "Bullying",
    "Self-Harm Risk": "Self-harm risk",
    "Self-harm risk": "Self-harm risk",
    "Emotional Regulation": "Self-harm risk",
    "Anger Management": "Self-harm risk",
    "Escapism": "Self-harm risk",
    "Physical Habits": "Self-harm risk",
    "Guilt": "Self-harm risk",
    "Pain Response": "Self-harm risk",
    "Self-Esteem": "Self-harm risk",
    "Support System": "Self-harm risk",
    "Somatic Symptoms": "Self-harm risk",
    "Risk Taking": "Self-harm risk",
    "Family Stress": "Family stress",
    "Family stress": "Family stress",
    "Home Environment": "Family stress",
    "Parental Expectations": "Family stress",
    "Safety/Fear": "Family stress",
    "Family Dynamics": "Family stress",
    "Support": "Family stress",
    "Emotional Neglect": "Family stress",
    "Avoidance": "Family stress",
    "Financial/Emotional Stress": "Family stress",
    "Fairness/Bias": "Family stress",
    "Sleep Environment": "Family stress",
    "Academic Pressure": "Academic pressure",
    "Academic pressure": "Academic pressure",
    "Performance Anxiety": "Academic pressure",
    "Self-Concept": "Academic pressure",
    "Perfectionism": "Academic pressure",
    "Work-Life Balance": "Academic pressure",
    "Social Comparison": "Academic pressure",
    "Test Anxiety": "Academic pressure",
    "Overwhelm": "Academic pressure",
    "Identity/Expectations": "Academic pressure",
    "Anticipatory Anxiety": "Academic pressure",
    "Social Isolation": "Social isolation",
    "Social isolation": "Social isolation",
    "Peer Interaction": "Social isolation",
    "Leisure/Play": "Social isolation",
    "Social Anxiety": "Social isolation",
    "Friendship Depth": "Social isolation",
    "Social Belonging": "Social isolation",
    "Social Events": "Social isolation",
    "Sharing": "Social isolation",
    "Loneliness": "Social isolation",
    "Virtual vs Real": "Social isolation",
    "Eye Contact": "Social isolation",
    "Trauma": "Trauma",
    "Intrusive Thoughts": "Trauma",
    "Startle Response": "Trauma",
    "Dissociation": "Trauma",
    "Sleep/Nightmares": "Trauma",
    "Hypervigilance": "Trauma",
    "Physical Touch": "Trauma",
    "Emotional Numbness": "Trauma",
    "Triggers": "Trauma",
    "Memory Gaps": "Trauma",
    "Anxiety": "Trauma",
    "Neglect": "Neglect",
    "Food Security": "Neglect",
    "Hygiene": "Neglect",
    "Supervision": "Neglect",
    "Parental Involvement": "Neglect",
    "Medical Needs": "Neglect",
    "Bedtime Routine": "Neglect",
    "Routine Care": "Neglect",
    "Stationery Supplies": "Neglect",
    "Emotional Check-in": "Neglect",
    "Safety/Transportation": "Neglect",
    "Eating Disorder": "Eating disorders",
    "Eating disorders": "Eating disorders",
    "Body Image": "Eating disorders",
    "Peer Comparison": "Eating disorders",
    "Guilt": "Eating disorders",
    "Media Influence": "Eating disorders",
    "Comments on Body": "Eating disorders",
    "Secret Snacking": "Eating disorders",
    "Food Rules": "Eating disorders",
    "Emotional Eating": "Eating disorders",
    "Body Shame": "Eating disorders",
    "Exercise Motivation": "Eating disorders",
  };
  for (const tag of tags) {
    const mapped = domainMap[tag];
    if (mapped) return mapped;
  }
  return tags[0] || "Bullying";
}

// All 80 followup questions from seeder (converted to API format)
const allFollowupQuestionsRaw = [
  { id: "q1", text: "When you wake up on a Monday morning and think about going to school, what is the first feeling you usually have?", tags: ["Bullying", "Peer Dynamics"], opts: [
    { text: "I feel excited to see my friends and share stories.", risk: "None" },
    { text: "I feel sleepy/lazy, but I am okay to go.", risk: "Low" },
    { text: "I feel a bit nervous because I don't know who I will sit with.", risk: "Mid" },
    { text: "I get a stomach ache or feel scared to face certain people.", risk: "High" },
  ]},
  { id: "q2", text: "Do other students call you by a nickname? How does that name make you feel?", tags: ["Bullying"], opts: [
    { text: "They call me by my real name or a cool nickname I like.", risk: "None" },
    { text: "Some names are annoying, but I ignore them.", risk: "Low" },
    { text: "I don't like the names because they make fun of how I look or talk.", risk: "Mid" },
    { text: "The names are very mean and make me want to cry or hide.", risk: "High" },
  ]},
  { id: "q3", text: "During tiffin (lunch) break, what usually happens?", tags: ["Bullying", "Social Safety"], opts: [
    { text: "I sit with my group, share food, and we laugh.", risk: "None" },
    { text: "I mostly eat quickly so I can go play or read.", risk: "Low" },
    { text: "I wander around looking for a place to sit where no one bothers me.", risk: "Mid" },
    { text: "I try to hide or sit near a teacher because I feel unsafe with other kids.", risk: "High" },
  ]},
  { id: "q4", text: "If a classmate pushes you, hides your pencil box, or trips you, what do they usually say?", tags: ["Bullying"], opts: [
    { text: "That never happens to me.", risk: "None" },
    { text: "It was an accident and they say sorry.", risk: "Low" },
    { text: "They say 'I was just doing masti (joking)' but it still hurts my feelings.", risk: "Mid" },
    { text: "They laugh at me and do it again the next day.", risk: "High" },
  ]},
  { id: "q5", text: "When the teacher says 'pick your own teams' for a game, how do you get chosen?", tags: ["Bullying", "Exclusion"], opts: [
    { text: "My friends immediately pull me into their team.", risk: "None" },
    { text: "I wait a little bit, but I find a team eventually.", risk: "Low" },
    { text: "I am usually one of the last ones left standing.", risk: "Mid" },
    { text: "People argue because nobody wants me on their team.", risk: "High" },
  ]},
  { id: "q6", text: "If you walk into class and a group of students suddenly stops talking and looks at you, what do you think?", tags: ["Bullying", "Paranoia/Safety"], opts: [
    { text: "Nothing, they are probably just planning a surprise or talking about homework.", risk: "None" },
    { text: "I wonder what they are saying, but I don't really care.", risk: "Low" },
    { text: "I feel worried that they are spreading a rumor about me.", risk: "Mid" },
    { text: "I know they are making fun of me because this happens every day.", risk: "High" },
  ]},
  { id: "q7", text: "How is your journey on the school bus or van?", tags: ["Bullying", "Safety"], opts: [
    { text: "It is the best part of the day! We have so much fun.", risk: "None" },
    { text: "It is boring/noisy, I just look out the window.", risk: "Low" },
    { text: "I try to sit quietly so the older/louder kids don't notice me.", risk: "Mid" },
    { text: "I hate the ride because people tease me or hit me when the driver isn't looking.", risk: "High" },
  ]},
  { id: "q8", text: "If you told a classmate a secret today, what would happen tomorrow?", tags: ["Bullying", "Trust"], opts: [
    { text: "They would keep it a secret. I trust them.", risk: "None" },
    { text: "They might tell one other person by mistake.", risk: "Low" },
    { text: "The whole class would know, so I don't tell anyone anything anymore.", risk: "Mid" },
    { text: "They would use the secret to embarrass me or blackmail me.", risk: "High" },
  ]},
  { id: "q9", text: "If someone is bothering you and you ask them to 'Please stop', what do they do?", tags: ["Bullying", "Boundaries"], opts: [
    { text: "They listen and stop immediately.", risk: "None" },
    { text: "They might stop for a while but forget later.", risk: "Low" },
    { text: "They make fun of me for asking them to stop.", risk: "Mid" },
    { text: "They bother me even more just to make me angry.", risk: "High" },
  ]},
  { id: "q10", text: "If your class has a WhatsApp group or plays games online, how are you treated there?", tags: ["Bullying", "Cyberbullying"], opts: [
    { text: "I am included in the jokes and feel happy.", risk: "None" },
    { text: "I don't check the messages much / I am not in the group.", risk: "Low" },
    { text: "I see them making plans without me, or kicking me out of the game.", risk: "Mid" },
    { text: "People post mean comments or stickers about me in the group.", risk: "High" },
  ]},
  // Self-Harm Risk (q11-q20) - continuing with key questions
  { id: "q11", text: "Imagine you made a big mistake on a test or broke something valuable at home. What is the first thought in your head?", tags: ["Self-Harm Risk", "Emotional Regulation"], opts: [
    { text: "Oops! I will try to fix it or do better next time.", risk: "None" },
    { text: "I feel sad and worried about getting scolded.", risk: "Low" },
    { text: "I am so stupid. I always ruin everything.", risk: "Mid" },
    { text: "I deserve to be punished or hurt for this.", risk: "High" },
  ]},
  { id: "q12", text: "When you get really, really angry or frustrated, what does your body want to do?", tags: ["Self-Harm Risk", "Anger Management"], opts: [
    { text: "I take deep breaths or tell someone I am angry.", risk: "None" },
    { text: "I cry or go to sleep to forget it.", risk: "Low" },
    { text: "I want to scream and throw things across the room.", risk: "Mid" },
    { text: "I want to hit myself, pinch my skin, or bang my head to let the anger out.", risk: "High" },
  ]},
  { id: "q13", text: "If a magician gave you a potion to change your life, what would you ask for?", tags: ["Self-Harm Risk", "Escapism"], opts: [
    { text: "To have superpowers (like flying) and have fun!", risk: "None" },
    { text: "To make school work easier so I don't get stressed.", risk: "Low" },
    { text: "To make me invisible so nobody can see me or bother me.", risk: "Mid" },
    { text: "To let me go to sleep for a very long time and not wake up.", risk: "High" },
  ]},
  { id: "q14", text: "When you are sitting in class thinking about something stressful, what do your hands do?", tags: ["Self-Harm Risk", "Physical Habits"], opts: [
    { text: "I play with my pencil or tap my foot.", risk: "None" },
    { text: "I bite my nails or chew my pencil top.", risk: "Low" },
    { text: "I pick at scabs or scratch my skin until it feels raw.", risk: "Mid" },
    { text: "I use sharp things (like a compass or clip) to scratch/poke my arm on purpose.", risk: "High" },
  ]},
  { id: "q15", text: "When there is an argument in your family or friend group, how do you feel?", tags: ["Self-Harm Risk", "Guilt"], opts: [
    { text: "I try to help them solve the fight.", risk: "None" },
    { text: "I feel annoyed and go to another room.", risk: "Low" },
    { text: "I feel guilty, like it is probably my fault somehow.", risk: "Mid" },
    { text: "I feel like everyone would be happier if I wasn't there at all.", risk: "High" },
  ]},
  { id: "q16", text: "If you accidentally get a small cut or a bruise while playing, how do you react?", tags: ["Self-Harm Risk", "Pain Response"], opts: [
    { text: "Ouch! I wash it and put a bandage on it.", risk: "None" },
    { text: "I show my friends and tell them how it happened.", risk: "Low" },
    { text: "I don't really care; I just ignore it.", risk: "Mid" },
    { text: "I actually like the sting/pain a little bit because it distracts me.", risk: "High" },
  ]},
  { id: "q17", text: "When you look in the mirror before school, what do you say to yourself?", tags: ["Self-Harm Risk", "Self-Esteem"], opts: [
    { text: "I look ready for the day!", risk: "None" },
    { text: "I wish I could change my hair/height, but I look okay.", risk: "Low" },
    { text: "I look ugly/weird. I hate how I look.", risk: "Mid" },
    { text: "I hate the person I see. I want to smash the mirror.", risk: "High" },
  ]},
  { id: "q18", text: "If you felt extremely sad, like a heavy cloud was over you, who would you tell?", tags: ["Self-Harm Risk", "Support System"], opts: [
    { text: "My parents, sibling, or best friend.", risk: "None" },
    { text: "Maybe my pet or a favorite stuffed toy.", risk: "Low" },
    { text: "No one. I keep it all inside because nobody understands.", risk: "Mid" },
    { text: "No one. I have to keep it a secret because my feelings are wrong/bad.", risk: "High" },
  ]},
  { id: "q19", text: "When you are very upset, how does your tummy feel?", tags: ["Self-Harm Risk", "Somatic Symptoms"], opts: [
    { text: "Normal, I eat my food as usual.", risk: "None" },
    { text: "I might eat a little less or eat comfort food (chocolate/chips).", risk: "Low" },
    { text: "My tummy hurts and I refuse to eat anything all day.", risk: "Mid" },
    { text: "I feel like I need to punish my body by not eating, or eating until I feel sick.", risk: "High" },
  ]},
  { id: "q20", text: "When you are playing on the playground or crossing the road, how careful are you?", tags: ["Self-Harm Risk", "Risk Taking"], opts: [
    { text: "I am very careful and follow the rules.", risk: "None" },
    { text: "I am mostly careful but sometimes I run fast.", risk: "Low" },
    { text: "I do dangerous things just to see if I can do them.", risk: "Mid" },
    { text: "I don't care if I get hurt or if a car hits me.", risk: "High" },
  ]},
  // Family Stress (q21-q30)
  { id: "q21", text: "When you are watching TV and you hear the front door open (meaning Mom or Dad is home), how does your body feel?", tags: ["Family Stress", "Home Environment"], opts: [
    { text: "Happy! I run to see them.", risk: "None" },
    { text: "Normal. I just keep watching TV.", risk: "Low" },
    { text: "A little nervous. I quickly check if the room is clean so they don't get mad.", risk: "Mid" },
    { text: "Scared. I turn off the TV and go to my room to avoid them.", risk: "High" },
  ]},
  { id: "q22", text: "When you show your report card or test marks to your parents, what usually happens?", tags: ["Family Stress", "Parental Expectations"], opts: [
    { text: "They look at it and say 'Good job' or help me with mistakes.", risk: "None" },
    { text: "They are busy and just sign it without looking much.", risk: "Low" },
    { text: "They compare my marks to my cousins or friends and say I need to do better.", risk: "Mid" },
    { text: "There is a lot of shouting and I get punished if the marks aren't perfect.", risk: "High" },
  ]},
  { id: "q23", text: "Imagine you are in the kitchen and you accidentally drop a glass and it breaks. What do you do?", tags: ["Family Stress", "Safety/Fear"], opts: [
    { text: "I tell my parents immediately, and we clean it up.", risk: "None" },
    { text: "I try to clean it up myself so I don't get a lecture.", risk: "Low" },
    { text: "I hide the pieces and lie because I am scared of being scolded.", risk: "Mid" },
    { text: "I panic and start crying because I know I will be hit or punished severely.", risk: "High" },
  ]},
  { id: "q24", text: "When your family sits down for dinner (or a meal) together, what is the mood like?", tags: ["Family Stress", "Family Dynamics"], opts: [
    { text: "We talk about our day and laugh.", risk: "None" },
    { text: "We usually eat quietly or watch TV while eating.", risk: "Low" },
    { text: "My parents mostly argue with each other, and I just eat quickly.", risk: "Mid" },
    { text: "It is very tense. I am scared to make a sound or spill food.", risk: "High" },
  ]},
  { id: "q25", text: "If you have a really hard project for school and you don't understand it, can you ask your parents for help?", tags: ["Family Stress", "Support"], opts: [
    { text: "Yes, they sit with me and explain it.", risk: "None" },
    { text: "Sometimes, but they are usually too tired/busy.", risk: "Low" },
    { text: "No, because they will yell at me for not understanding it myself.", risk: "Mid" },
    { text: "No, I am too afraid to ask them for anything.", risk: "High" },
  ]},
  { id: "q26", text: "If you had a bad day at school and you are feeling sad, do your parents notice?", tags: ["Family Stress", "Emotional Neglect"], opts: [
    { text: "Yes, they ask me 'What's wrong?' and give me a hug.", risk: "None" },
    { text: "Maybe, if I tell them directly.", risk: "Low" },
    { text: "No, they tell me to stop crying and focus on my studies.", risk: "Mid" },
    { text: "No, nobody at home cares how I feel or if I am sad.", risk: "High" },
  ]},
  { id: "q27", text: "If you had a magic wand to choose where to spend the entire weekend, where would you go?", tags: ["Family Stress", "Avoidance"], opts: [
    { text: "I would stay home and play games with my family.", risk: "None" },
    { text: "I would go to the park or a movie.", risk: "Low" },
    { text: "I would go to a friend's house just to get away from home.", risk: "Mid" },
    { text: "I would go anywhere as long as I don't have to be at home.", risk: "High" },
  ]},
  { id: "q28", text: "You need a new set of color pencils for art class. How do you feel about asking your parents for them?", tags: ["Family Stress", "Financial/Emotional Stress"], opts: [
    { text: "Easy, I just add it to the shopping list.", risk: "None" },
    { text: "I wait for a good time when they aren't busy.", risk: "Low" },
    { text: "I feel guilty asking because they always talk about money problems.", risk: "Mid" },
    { text: "I don't ask. I'd rather get in trouble at school than face their anger at home.", risk: "High" },
  ]},
  { id: "q29", text: "If you and your sibling (or cousin) get into a fight, whose side do your parents take?", tags: ["Family Stress", "Fairness/Bias"], opts: [
    { text: "They listen to both of us and help us solve it.", risk: "None" },
    { text: "They tell us both to be quiet.", risk: "Low" },
    { text: "They always take the other person's side and blame me.", risk: "Mid" },
    { text: "I am always the 'bad one' in the family, no matter what I do.", risk: "High" },
  ]},
  { id: "q30", text: "When you are lying in bed at night trying to sleep, what can you hear in your house?", tags: ["Family Stress", "Sleep Environment"], opts: [
    { text: "Quietness or soft TV sounds. I sleep easily.", risk: "None" },
    { text: "Sometimes loud talking, but it stops soon.", risk: "Low" },
    { text: "My parents arguing/shouting in the other room.", risk: "Mid" },
    { text: "Scary noises (yelling/throwing things) that keep me awake and frightened.", risk: "High" },
  ]},
  // Academic Pressure (q31-q40) - including key ones, continuing pattern for all 80
  { id: "q31", text: "When the teacher writes the 'Exam Dates' on the board, what is the first thing that happens to you?", tags: ["Academic Pressure", "Performance Anxiety"], opts: [
    { text: "I copy it down calmly. I am ready.", risk: "None" },
    { text: "I feel a little nervous, but I start planning.", risk: "Low" },
    { text: "My heart starts beating very fast and I get worried.", risk: "Mid" },
    { text: "I feel dizzy, sick, or want to cry immediately.", risk: "High" },
  ]},
  { id: "q32", text: "If you raise your hand in class to answer a question, but you give the wrong answer, how do you feel?", tags: ["Academic Pressure", "Self-Concept"], opts: [
    { text: "It's okay. Everybody makes mistakes.", risk: "None" },
    { text: "A little embarrassed, but I forget about it quickly.", risk: "Low" },
    { text: "I feel very stupid and decide not to raise my hand again.", risk: "Mid" },
    { text: "I feel like the whole class is laughing at me and I am worthless.", risk: "High" },
  ]},
  { id: "q33", text: "Imagine you got 9 marks out of 10 on a test. How do you feel about that missing 1 mark?", tags: ["Academic Pressure", "Perfectionism"], opts: [
    { text: "I don't care about the 1 mark. 9 is a great score!", risk: "None" },
    { text: "I wish I got 10, but I am still happy.", risk: "Low" },
    { text: "I feel sad and only focus on the mistake I made.", risk: "Mid" },
    { text: "I feel scared/angry at myself. It feels like a failure.", risk: "High" },
  ]},
  { id: "q34", text: "After you come back from school, what does your evening usually look like?", tags: ["Academic Pressure", "Work-Life Balance"], opts: [
    { text: "I finish homework quickly and then go play/relax.", risk: "None" },
    { text: "I have some tuition, but I get time to watch TV too.", risk: "Low" },
    { text: "I go from school to tuition to homework. I have no free time.", risk: "Mid" },
    { text: "I study until late at night. I am always tired and sleepy.", risk: "High" },
  ]},
  { id: "q35", text: "When you sit down to open your textbooks for a big test, does your body do anything strange?", tags: ["Academic Pressure", "Somatic Symptoms"], opts: [
    { text: "No, I feel normal.", risk: "None" },
    { text: "Sometimes I yawn or feel bored.", risk: "Low" },
    { text: "I get a headache or my tummy hurts.", risk: "Mid" },
    { text: "I start shaking, sweating, or have trouble breathing.", risk: "High" },
  ]},
  { id: "q36", text: "When your friends discuss their marks after an exam, what do you do?", tags: ["Academic Pressure", "Social Comparison"], opts: [
    { text: "I congratulate them and tell them my marks too.", risk: "None" },
    { text: "I listen but don't say much if my marks are lower.", risk: "Low" },
    { text: "I feel jealous and worried that they are smarter than me.", risk: "Mid" },
    { text: "I lie about my marks because I am ashamed of my real score.", risk: "High" },
  ]},
  { id: "q37", text: "Have you ever looked at a question paper and suddenly felt like your brain went completely blank, even though you studied?", tags: ["Academic Pressure", "Test Anxiety"], opts: [
    { text: "Never.", risk: "None" },
    { text: "Once or twice, but I remembered the answers later.", risk: "Low" },
    { text: "Yes, it happens often and it makes me panic.", risk: "Mid" },
    { text: "Yes, almost every time. I freeze up completely.", risk: "High" },
  ]},
  { id: "q38", text: "How do you feel when you see the pile of Holiday Homework during summer/winter break?", tags: ["Academic Pressure", "Overwhelm"], opts: [
    { text: "I finish it slowly and enjoy the holidays.", risk: "None" },
    { text: "It is boring, but I get it done.", risk: "Low" },
    { text: "It stresses me out and ruins my holiday fun.", risk: "Mid" },
    { text: "I feel overwhelmed and hopeless looking at it.", risk: "High" },
  ]},
  { id: "q39", text: "Do you feel you have to be the 'smart kid' or the 'topper' all the time?", tags: ["Academic Pressure", "Identity/Expectations"], opts: [
    { text: "No, I just do my best.", risk: "None" },
    { text: "It would be nice, but I don't stress about it.", risk: "Low" },
    { text: "Yes, if I get lower marks, people will be disappointed.", risk: "Mid" },
    { text: "Yes, if I am not the best, I feel like I am nobody.", risk: "High" },
  ]},
  { id: "q40", text: "It is Sunday night and you have school tomorrow. What are you thinking about?", tags: ["Academic Pressure", "Anticipatory Anxiety"], opts: [
    { text: "Meeting my friends.", risk: "None" },
    { text: "Packing my bag.", risk: "Low" },
    { text: "Worrying about incomplete homework or scolding.", risk: "Mid" },
    { text: "Dread and anxiety about facing the teachers/studies.", risk: "High" },
  ]},
  // Social Isolation (q41-q50)
  { id: "q41", text: "If the teacher is absent and the class gets a free period to talk or play, what do you usually do?", tags: ["Social Isolation", "Peer Interaction"], opts: [
    { text: "I move my chair to sit with my friends and chat.", risk: "None" },
    { text: "I read a book or draw by myself, which I enjoy.", risk: "Low" },
    { text: "I look around and wish someone would ask me to play, but no one does.", risk: "Mid" },
    { text: "I put my head down on the desk or pretend to sleep so I don't look lonely.", risk: "High" },
  ]},
  { id: "q42", text: "On a Sunday evening, what are you usually doing?", tags: ["Social Isolation", "Leisure/Play"], opts: [
    { text: "Playing cricket, football, or games with building/neighborhood friends.", risk: "None" },
    { text: "Watching TV or spending time with my family.", risk: "Low" },
    { text: "Sitting at the window watching other kids play, wishing I could join.", risk: "Mid" },
    { text: "I stay in my room because I don't have any friends to play with.", risk: "High" },
  ]},
  { id: "q43", text: "When the teacher says, 'Find a partner for this project,' what is your immediate reaction?", tags: ["Social Isolation", "Social Anxiety"], opts: [
    { text: "I already know who my partner is; we look at each other and smile.", risk: "None" },
    { text: "I ask the person sitting next to me, and it's usually fine.", risk: "Low" },
    { text: "I get nervous because I don't know who to ask.", risk: "Mid" },
    { text: "I panic and wait for the teacher to assign me to someone because nobody chooses me.", risk: "High" },
  ]},
  { id: "q44", text: "Do you have a 'Best Friend' at school?", tags: ["Social Isolation", "Friendship Depth"], opts: [
    { text: "Yes, I have one (or a whole group) and we tell each other everything.", risk: "None" },
    { text: "I have good friends, but maybe not a 'best' friend yet.", risk: "Low" },
    { text: "I used to, but now I feel like I don't really have anyone close.", risk: "Mid" },
    { text: "No. I mostly talk to imaginary friends, pets, or characters in my head.", risk: "High" },
  ]},
  { id: "q45", text: "If you are sick and don't come to school for two days, what happens when you return?", tags: ["Social Isolation", "Social Belonging"], opts: [
    { text: "My friends run to me and ask, 'What happened? Are you okay?'", risk: "None" },
    { text: "Someone asks for a medical note or if I finished the homework.", risk: "Low" },
    { text: "I sit down and nobody really mentions that I was gone.", risk: "Mid" },
    { text: "It feels like I was never there. Nobody noticed my absence at all.", risk: "High" },
  ]},
  { id: "q46", text: "If you are invited to a birthday party, how do you feel?", tags: ["Social Isolation", "Social Events"], opts: [
    { text: "Excited! I love cake and games.", risk: "None" },
    { text: "A bit shy at first, but I have fun once I get there.", risk: "Low" },
    { text: "I stand in the corner or stay close to the adults/parents the whole time.", risk: "Mid" },
    { text: "I make an excuse not to go because I don't know how to talk to people.", risk: "High" },
  ]},
  { id: "q47", text: "Imagine you won a prize or found something really cool. Who is the first person you want to tell?", tags: ["Social Isolation", "Sharing"], opts: [
    { text: "My friends in class!", risk: "None" },
    { text: "My parents or my brother/sister.", risk: "Low" },
    { text: "I don't know... maybe I would just keep it to myself.", risk: "Mid" },
    { text: "I have no one to tell.", risk: "High" },
  ]},
  { id: "q48", text: "Sometimes, even when you are in a classroom full of people, how do you feel?", tags: ["Social Isolation", "Loneliness"], opts: [
    { text: "I feel part of the fun.", risk: "None" },
    { text: "I feel okay, just focusing on my work.", risk: "Low" },
    { text: "I feel like I am sitting inside a glass bubble and can't reach anyone.", risk: "Mid" },
    { text: "I feel completely alone and invisible, like a ghost.", risk: "High" },
  ]},
  { id: "q49", text: "Do you prefer talking to people online (in games) or in real life?", tags: ["Social Isolation", "Virtual vs Real"], opts: [
    { text: "Real life is way better.", risk: "None" },
    { text: "I like both equally.", risk: "Low" },
    { text: "Online is better because real people make me nervous.", risk: "Mid" },
    { text: "I only have friends online. I don't talk to anyone in real life.", risk: "High" },
  ]},
  { id: "q50", text: "When a new student or a teacher says 'Hello' to you, is it easy to look at them?", tags: ["Social Isolation", "Eye Contact"], opts: [
    { text: "Yes, I look at them and smile back.", risk: "None" },
    { text: "I might look down a little out of respect/shyness.", risk: "Low" },
    { text: "It is very hard. I look at my shoes and mumble.", risk: "Mid" },
    { text: "I freeze up and can't speak or look at them at all.", risk: "High" },
  ]},
  // Trauma (q51-q60)
  { id: "q51", text: "Do you ever feel like a bad memory keeps playing in your head like a movie, even when you try to stop it?", tags: ["Trauma", "Intrusive Thoughts"], opts: [
    { text: "No, I mostly remember fun things.", risk: "None" },
    { text: "Sometimes, if I am sad, I remember embarrassing moments.", risk: "Low" },
    { text: "Yes, a scary memory pops up often and makes it hard to focus.", risk: "Mid" },
    { text: "Yes, it happens all the time and I feel like I am back in that scary moment again.", risk: "High" },
  ]},
  { id: "q52", text: "If a door slams shut loudly or a balloon pops unexpectedly, what does your body do?", tags: ["Trauma", "Startle Response"], opts: [
    { text: "I jump a little, then laugh.", risk: "None" },
    { text: "I get startled, but I calm down quickly.", risk: "Low" },
    { text: "My heart beats very fast and it takes a long time to feel okay again.", risk: "Mid" },
    { text: "I freeze, duck for cover, or start crying immediately.", risk: "High" },
  ]},
  { id: "q53", text: "Do you ever stare at a wall in class and feel like you are floating, or like you are not really in your body?", tags: ["Trauma", "Dissociation"], opts: [
    { text: "No, I pay attention mostly.", risk: "None" },
    { text: "Sometimes when the class is boring, I daydream.", risk: "Low" },
    { text: "Yes, often. The teacher calls my name and I don't even hear it.", risk: "Mid" },
    { text: "Yes, sometimes I 'wake up' and don't know how much time has passed or what happened.", risk: "High" },
  ]},
  { id: "q54", text: "When you go to sleep at night, what are your dreams like?", tags: ["Trauma", "Sleep/Nightmares"], opts: [
    { text: "I usually have funny or normal dreams.", risk: "None" },
    { text: "Sometimes I have a bad dream if I watched a scary movie.", risk: "Low" },
    { text: "I have nightmares often that make me wake up scared.", risk: "Mid" },
    { text: "I am scared to fall asleep because I see the same terrifying things every night.", risk: "High" },
  ]},
  { id: "q55", text: "When you are sitting in a room (like a classroom or waiting room), what are you usually looking at?", tags: ["Trauma", "Hypervigilance"], opts: [
    { text: "I look at my friends or a book.", risk: "None" },
    { text: "I look out the window because I am bored.", risk: "Low" },
    { text: "I keep watching the door to see who is coming in or going out.", risk: "Mid" },
    { text: "I always sit near the wall/exit and watch everyone because I don't feel safe.", risk: "High" },
  ]},
  { id: "q56", text: "If someone stands very close behind you or taps you on the shoulder unexpectedly, how do you react?", tags: ["Trauma", "Physical Touch"], opts: [
    { text: "I turn around to say hi.", risk: "None" },
    { text: "I move a little to get some space.", risk: "Low" },
    { text: "I get annoyed and tell them to move back.", risk: "Mid" },
    { text: "I flinch (jump) or pull away quickly as if they are going to hit me.", risk: "High" },
  ]},
  { id: "q57", text: "When something really happy or really sad happens, how do you feel inside?", tags: ["Trauma", "Emotional Numbness"], opts: [
    { text: "I feel happy or sad, just like everyone else.", risk: "None" },
    { text: "Sometimes I hide my feelings, but I feel them.", risk: "Low" },
    { text: "I feel confused about what I am supposed to feel.", risk: "Mid" },
    { text: "I feel 'numb' or empty, like I can't feel anything at all.", risk: "High" },
  ]},
  { id: "q58", text: "Are there certain places, smells, or sounds that make your tummy hurt or make you scared for no reason?", tags: ["Trauma", "Triggers"], opts: [
    { text: "No, not really.", risk: "None" },
    { text: "I don't like the smell of medicines/hospitals, but I am okay.", risk: "Low" },
    { text: "Yes, there are some things I avoid because they make me feel panicky.", risk: "Mid" },
    { text: "Yes, I try very hard to avoid anything that reminds me of a bad time.", risk: "High" },
  ]},
  { id: "q59", text: "Do you remember what happened when you were in Grade 3 or 4?", tags: ["Trauma", "Memory Gaps"], opts: [
    { text: "Yes, I remember my friends and teachers.", risk: "None" },
    { text: "Bits and pieces, like most people.", risk: "Low" },
    { text: "It is very blurry. I don't remember much.", risk: "Mid" },
    { text: "I can't remember big chunks of my life at all, like those years are missing.", risk: "High" },
  ]},
  { id: "q60", text: "Do you ever feel like something bad is going to happen to you or your family, even when everything is fine?", tags: ["Trauma", "Anxiety"], opts: [
    { text: "No, I feel safe.", risk: "None" },
    { text: "Sometimes, if I hear scary news on TV.", risk: "Low" },
    { text: "Yes, I worry about it a lot.", risk: "Mid" },
    { text: "Yes, I have a constant feeling of dread that danger is coming.", risk: "High" },
  ]},
  // Neglect (q61-q70)
  { id: "q61", text: "When it is lunch break, what does your tiffin usually look like?", tags: ["Neglect", "Food Security"], opts: [
    { text: "My parents pack a full lunch that I like.", risk: "None" },
    { text: "Sometimes I get money to buy something from the canteen.", risk: "Low" },
    { text: "It is often empty or very little food, so I feel hungry.", risk: "Mid" },
    { text: "I rarely bring food. I rely on friends sharing their food with me.", risk: "High" },
  ]},
  { id: "q62", text: "How do you get your uniform ready for school in the morning?", tags: ["Neglect", "Hygiene"], opts: [
    { text: "My parents wash and iron it for me.", risk: "None" },
    { text: "I help put it in the wash, but it's usually clean.", risk: "Low" },
    { text: "It is sometimes dirty or crumpled because no one had time to wash it.", risk: "Mid" },
    { text: "I have to wear the same dirty uniform for many days; it smells and has missing buttons.", risk: "High" },
  ]},
  { id: "q63", text: "When you get home from school, who is there?", tags: ["Neglect", "Supervision"], opts: [
    { text: "My mom, dad, or grandparents are there to welcome me.", risk: "None" },
    { text: "A helper/maid or an older sibling is there.", risk: "Low" },
    { text: "No one is home for a few hours, so I lock the door and wait.", risk: "Mid" },
    { text: "No one is home until late at night. I am alone for a very long time.", risk: "High" },
  ]},
  { id: "q64", text: "If the teacher writes a note in your diary that needs a parent's signature, what happens?", tags: ["Neglect", "Parental Involvement"], opts: [
    { text: "My parents check my diary every day and sign it.", risk: "None" },
    { text: "I have to remind them, but they sign it.", risk: "Low" },
    { text: "They are too busy to look, so I often get scolded at school for no signature.", risk: "Mid" },
    { text: "They never check my bag or diary. I have to forge (fake) the signature.", risk: "High" },
  ]},
  { id: "q65", text: "Imagine you have had a toothache or blurry vision (eye trouble) for a week. What happens?", tags: ["Neglect", "Medical Needs"], opts: [
    { text: "I tell my parents and they take me to the doctor quickly.", risk: "None" },
    { text: "They give me home remedies, and if it doesn't stop, we go to the doctor.", risk: "Low" },
    { text: "I complain, but they say 'it will pass' and ignore it.", risk: "Mid" },
    { text: "I stopped complaining because they never take me to the doctor even when I hurt.", risk: "High" },
  ]},
  { id: "q66", text: "What time do you usually go to sleep on a school night?", tags: ["Neglect", "Bedtime Routine"], opts: [
    { text: "At a fixed time. My parents make sure I am in bed.", risk: "None" },
    { text: "Mostly on time, unless we are watching a movie.", risk: "Low" },
    { text: "Whenever I want. No one really tells me when to sleep.", risk: "Mid" },
    { text: "Very late. I stay up watching TV/Phone all night because nobody checks on me.", risk: "High" },
  ]},
  { id: "q67", text: "How do you wake up in the morning?", tags: ["Neglect", "Routine Care"], opts: [
    { text: "My mom or dad wakes me up gently.", risk: "None" },
    { text: "I have an alarm clock, but my parents make sure I am up.", risk: "Low" },
    { text: "I have to wake myself up. If I oversleep, I miss school.", risk: "Mid" },
    { text: "I have to wake myself up AND wake up my parents/siblings to get the day started.", risk: "High" },
  ]},
  { id: "q68", text: "If your pencil breaks or you finish your notebook, when do you get a new one?", tags: ["Neglect", "Stationery Supplies"], opts: [
    { text: "My parents always keep extra supplies or buy them immediately.", risk: "None" },
    { text: "I tell them and we buy it on the weekend.", risk: "Low" },
    { text: "I have to ask many times before they remember to buy it.", risk: "Mid" },
    { text: "I often sit in class without a pencil or notebook because they won't buy me one.", risk: "High" },
  ]},
  { id: "q69", text: "Does anyone at home ask you, 'How was your day at school today?'", tags: ["Neglect", "Emotional Check-in"], opts: [
    { text: "Yes, every day at dinner or in the car.", risk: "None" },
    { text: "Sometimes, if they are not too tired.", risk: "Low" },
    { text: "Rarely. They are usually on their phones or busy working.", risk: "Mid" },
    { text: "Never. We don't really talk to each other.", risk: "High" },
  ]},
  { id: "q70", text: "How do you get to school?", tags: ["Neglect", "Safety/Transportation"], opts: [
    { text: "School bus or my parents drop me.", risk: "None" },
    { text: "I walk with a group of friends or neighbors.", risk: "Low" },
    { text: "I walk alone/take auto alone and sometimes I feel scared of the traffic/strangers.", risk: "Mid" },
    { text: "I have to find my own way. Sometimes I skip school because I can't get there.", risk: "High" },
  ]},
  // Eating Disorders (q71-q80)
  { id: "q71", text: "When you get dressed in the morning and look in the full-length mirror, what do you think?", tags: ["Eating Disorder", "Body Image"], opts: [
    { text: "I look good! I like my outfit.", risk: "None" },
    { text: "I look okay, but my hair is messy.", risk: "Low" },
    { text: "I wish my tummy was flatter or my legs were thinner/thicker.", risk: "Mid" },
    { text: "I look fat/ugly. I want to cry and change my clothes to hide my body.", risk: "High" },
  ]},
  { id: "q72", text: "If your mom packs your favorite heavy lunch (like Parathas or Pasta), but your friends are eating salad or fruits, what do you do?", tags: ["Eating Disorder", "Peer Comparison"], opts: [
    { text: "I eat my food happily. It's delicious!", risk: "None" },
    { text: "I might share some of mine with them.", risk: "Low" },
    { text: "I feel embarrassed and eat quickly so they don't notice.", risk: "Mid" },
    { text: "I throw my lunch away or give it all away because I don't want to get fat.", risk: "High" },
  ]},
  { id: "q73", text: "How do you feel after you have eaten a big festive meal (like at a wedding or party)?", tags: ["Eating Disorder", "Guilt"], opts: [
    { text: "Satisfied and full. Back to playing!", risk: "None" },
    { text: "A little too full, I might skip the next snack.", risk: "Low" },
    { text: "I feel guilty and angry at myself for eating so much.", risk: "Mid" },
    { text: "I feel disgusting. I want to make myself sick or skip meals for two days to 'fix' it.", risk: "High" },
  ]},
  { id: "q74", text: "When you see photos of models or actors on Instagram/YouTube, what goes through your mind?", tags: ["Eating Disorder", "Media Influence"], opts: [
    { text: "They look cool/funny.", risk: "None" },
    { text: "I wonder where they bought those clothes.", risk: "Low" },
    { text: "I wish I had a body like theirs. Mine is not good enough.", risk: "Mid" },
    { text: "I need to stop eating so I can look exactly like them.", risk: "High" },
  ]},
  { id: "q75", text: "If a relative says, 'Oh, you have put on some weight/grown healthy,' how do you react?", tags: ["Eating Disorder", "Comments on Body"], opts: [
    { text: "I don't really care.", risk: "None" },
    { text: "I feel a bit shy, but I forget it.", risk: "Low" },
    { text: "It hurts my feelings and I think about it for days.", risk: "Mid" },
    { text: "It confirms my worst fear. I decide to stop eating dinner from that day.", risk: "High" },
  ]},
  { id: "q76", text: "When nobody is watching, do you ever sneak food from the kitchen?", tags: ["Eating Disorder", "Secret Snacking"], opts: [
    { text: "No, I ask if I am hungry.", risk: "None" },
    { text: "Sometimes I take an extra chocolate or biscuit.", risk: "Low" },
    { text: "Yes, I hide wrappers under my bed because I don't want people to know I ate.", risk: "Mid" },
    { text: "Yes, I eat huge amounts of food very fast until I feel sick (Bingeing).", risk: "High" },
  ]},
  { id: "q77", text: "How do you decide what to eat?", tags: ["Eating Disorder", "Food Rules"], opts: [
    { text: "I eat what is cooked at home or what looks tasty.", risk: "None" },
    { text: "I try to eat healthy so I can run fast/play sports.", risk: "Low" },
    { text: "I have a list of 'bad foods' (like sugar/rice) that I try to avoid completely.", risk: "Mid" },
    { text: "I count every spoon of food and obsess over how much 'fat' is in it.", risk: "High" },
  ]},
  { id: "q78", text: "If you are feeling stressed or sad, what happens to your eating?", tags: ["Eating Disorder", "Emotional Eating"], opts: [
    { text: "Nothing, I eat my normal meals.", risk: "None" },
    { text: "I might eat a little more comfort food.", risk: "Low" },
    { text: "I skip breakfast or lunch on purpose to feel in control.", risk: "Mid" },
    { text: "I try to go as long as possible without eating anything at all.", risk: "High" },
  ]},
  { id: "q79", text: "In the changing room (for swimming or sports), do you look at other students?", tags: ["Eating Disorder", "Body Shame"], opts: [
    { text: "No, I just change my clothes quickly.", risk: "None" },
    { text: "I notice if they have cool gear/clothes.", risk: "Low" },
    { text: "I compare my stomach/thighs to theirs and feel jealous.", risk: "Mid" },
    { text: "I feel so ashamed of my body compared to them that I want to quit the sport.", risk: "High" },
  ]},
  { id: "q80", text: "Why do you play sports or run around in PT period?", tags: ["Eating Disorder", "Exercise Motivation"], opts: [
    { text: "Because it is fun and I like playing with friends!", risk: "None" },
    { text: "To get stronger and faster.", risk: "Low" },
    { text: "To burn off the chocolate I ate yesterday.", risk: "Mid" },
    { text: "I push myself until I am exhausted because I must lose weight.", risk: "High" },
  ]},
];

// Convert raw questions to API format
function convertFollowupQuestion(raw: typeof allFollowupQuestionsRaw[0]) {
  return {
    questionId: raw.id,
    id: raw.id,
    text: raw.text,
    answerType: "MCQ" as const,
    domainTags: [mapDomainTag(raw.tags)],
    options: raw.opts.map((opt, idx) => ({
      key: String.fromCharCode(97 + idx), // a, b, c, d
      text: opt.text,
      riskLevel: opt.risk as "None" | "Low" | "Mid" | "High",
      score: riskToScore(opt.risk),
    })),
  };
}

// All 80 followup questions in API format
export const allDummyFollowupQuestions = allFollowupQuestionsRaw.map(convertFollowupQuestion);

// Function to randomly select N questions from all 80
export function getRandomFollowupQuestions(count: number = 10) {
  const shuffled = [...allDummyFollowupQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Default export for backward compatibility - returns 10 random questions
export const dummyFollowupQuestions = getRandomFollowupQuestions(10);

export const dummyTests = [
  {
    _id: new mongoose.Types.ObjectId("100000000000000000000001"),
    studentId,
    schoolId,
    templateType: "BASELINE",
    status: "COMPLETED",
    createdAt: new Date("2024-11-29"),
    completedAt: new Date("2024-11-29"),
    summary:
      "Overall wellbeing risk looks elevated. Main areas: Social isolation (level 2/3), Bullying (level 1/3), Self-harm risk (level 1/3).",
  },
  {
    _id: new mongoose.Types.ObjectId("100000000000000000000002"),
    studentId,
    schoolId,
    templateType: "FOLLOWUP",
    status: "COMPLETED",
    createdAt: new Date("2024-12-15"),
    completedAt: new Date("2024-12-15"),
    summary:
      "Student reports feeling a bit more connected this week. Bullying risk stays mild. Continue gentle check-ins and peer support.",
  },
];

export const dummyAlerts = [
  {
    _id: new mongoose.Types.ObjectId("200000000000000000000001"),
    studentId,
    schoolId,
    status: "OPEN",
    createdAt: new Date("2024-12-01"),
    domainFlags: [{ domain: "Bullying", alertLevel: "YELLOW", riskLevel: 1 }],
  },
  {
    _id: new mongoose.Types.ObjectId("200000000000000000000002"),
    studentId,
    schoolId,
    status: "OPEN",
    createdAt: new Date("2024-12-05"),
    domainFlags: [{ domain: "Social isolation", alertLevel: "YELLOW", riskLevel: 2 }],
  },
  {
    _id: new mongoose.Types.ObjectId("200000000000000000000003"),
    studentId: studentId3,
    schoolId,
    status: "OPEN",
    createdAt: new Date("2024-12-10"),
    domainFlags: [{ domain: "Academic pressure", alertLevel: "RED", riskLevel: 3 }],
  },
];

export const dummyStudent = {
  id: studentId.toString(),
  name: "Aarav Patel",
  grade: dummyStudentProfile.grade,
  section: dummyStudentProfile.section,
  rollNumber: dummyStudentProfile.rollNumber,
};

export const dummyStudentTests = dummyTests.map((t) => ({
  id: t._id.toString(),
  templateType: t.templateType,
  status: t.status,
  createdAt: t.createdAt,
  completedAt: t.completedAt,
  summary: t.summary,
}));

export const dummyLatestScore = {
  _id: new mongoose.Types.ObjectId("400000000000000000000001"),
  studentId,
  schoolId,
  createdAt: new Date("2024-12-15"),
  domainScores: [
    { domain: "Social isolation", riskLevel: 2 },
    { domain: "Bullying", riskLevel: 1 },
    { domain: "Self-harm risk", riskLevel: 1 },
  ],
  overallSummaryForTeacher:
    "Overall wellbeing risk looks elevated. Main areas: Social isolation (level 2/3), Bullying (level 1/3), Self-harm risk (level 1/3).",
};

export const dummyChatResponses: Record<string, string> = {
  default: "Based on the student's persona, I recommend offering regular check-ins and pairing them with supportive peers. Keep communication open with the family.",
  "how is the student doing": "The student shows elevated wellbeing risk in social isolation (level 2/3), bullying (level 1/3), and self-harm risk (level 1/3). Regular check-ins would be beneficial.",
  "what should i do": "I suggest: 1) Offer regular check-ins, 2) Pair with supportive peers, 3) Keep communication open with family. These steps can help address the identified concerns.",
  "tell me about alerts": "The student has 2 open alerts: Bullying (YELLOW, risk level 1) and Social isolation (YELLOW, risk level 2). Both require gentle monitoring and support.",
};

export function getDummyChatResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  for (const [key, response] of Object.entries(dummyChatResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  return dummyChatResponses.default;
}

// Analytics data for principal dashboard
export const dummyAnalytics = {
  // Domain distribution (count of alerts by domain)
  domainDistribution: [
    { domain: "Bullying", count: 1, percentage: 33.3 },
    { domain: "Social isolation", count: 1, percentage: 33.3 },
    { domain: "Academic pressure", count: 1, percentage: 33.3 },
  ],
  // Risk trend over last 7 days
  riskTrend: [
    { date: "2024-12-08", avgRisk: 1.2 },
    { date: "2024-12-09", avgRisk: 1.4 },
    { date: "2024-12-10", avgRisk: 1.5 },
    { date: "2024-12-11", avgRisk: 1.6 },
    { date: "2024-12-12", avgRisk: 1.65 },
    { date: "2024-12-13", avgRisk: 1.67 },
    { date: "2024-12-14", avgRisk: 1.67 },
  ],
  // Grade-wise risk distribution
  gradeWiseRisk: [
    { grade: "Grade 6", avgRisk: 1.5, studentCount: 2, alerts: 2 },
    { grade: "Grade 7", avgRisk: 3.0, studentCount: 1, alerts: 1 },
  ],
  // Alert level breakdown
  alertLevelBreakdown: [
    { level: "RED", count: 1, percentage: 33.3 },
    { level: "YELLOW", count: 2, percentage: 66.7 },
  ],
  // Assessment completion trends (last 30 days)
  assessmentTrends: [
    { date: "2024-11-15", baseline: 0, followup: 0 },
    { date: "2024-11-22", baseline: 1, followup: 0 },
    { date: "2024-11-29", baseline: 2, followup: 1 },
    { date: "2024-12-06", baseline: 2, followup: 2 },
    { date: "2024-12-13", baseline: 2, followup: 3 },
  ],
  // Section-wise statistics
  sectionWiseStats: [
    { section: "6A", students: 1, baselineCompleted: 1, followups: 2, alerts: 2 },
    { section: "6B", students: 1, baselineCompleted: 1, followups: 1, alerts: 0 },
    { section: "7A", students: 1, baselineCompleted: 0, followups: 0, alerts: 1 },
  ],
  // Risk level distribution
  riskLevelDistribution: [
    { level: 0, count: 0, label: "None" },
    { level: 1, count: 1, label: "Low" },
    { level: 2, count: 1, label: "Medium" },
    { level: 3, count: 1, label: "High" },
  ],
};
