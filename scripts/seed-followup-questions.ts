import "dotenv/config";
import { dbConnect } from "@/db/connection";
import { TestTemplate } from "@/models/TestTemplate";
import { User } from "@/models/User";
import { Question, Domain } from "@/types";

/**
 * Follow-up questions for Grade 5 (ages 10-11)
 * 80 questions covering 8 domains with MCQ format
 * Comprehensive Social Emotional Learning (SEL) Assessment
 * "My School, My Life & Me"
 */

// Helper function to map domain tags to the 8 main domains
function mapDomainTags(tags: string[]): Domain[] {
  const domainMap: Record<string, Domain> = {
    Bullying: "Bullying",
    "Peer Dynamics": "Bullying",
    "Social Safety": "Bullying",
    Exclusion: "Bullying",
    "Paranoia/Safety": "Bullying",
    Safety: "Bullying",
    Trust: "Bullying",
    Boundaries: "Bullying",
    Cyberbullying: "Bullying",
    "Self-Harm Risk": "Self-harm risk",
    "Self-harm risk": "Self-harm risk",
    "Emotional Regulation": "Self-harm risk",
    "Anger Management": "Self-harm risk",
    Escapism: "Self-harm risk",
    "Physical Habits": "Self-harm risk",
    Guilt: "Self-harm risk",
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
    Support: "Family stress",
    "Emotional Neglect": "Family stress",
    Avoidance: "Family stress",
    "Financial/Emotional Stress": "Family stress",
    "Fairness/Bias": "Family stress",
    "Sleep Environment": "Family stress",
    "Academic Pressure": "Academic pressure",
    "Academic pressure": "Academic pressure",
    "Performance Anxiety": "Academic pressure",
    "Self-Concept": "Academic pressure",
    Perfectionism: "Academic pressure",
    "Work-Life Balance": "Academic pressure",
    "Social Comparison": "Academic pressure",
    "Test Anxiety": "Academic pressure",
    Overwhelm: "Academic pressure",
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
    Sharing: "Social isolation",
    Loneliness: "Social isolation",
    "Virtual vs Real": "Social isolation",
    "Eye Contact": "Social isolation",
    Trauma: "Trauma",
    "Intrusive Thoughts": "Trauma",
    "Startle Response": "Trauma",
    Dissociation: "Trauma",
    "Sleep/Nightmares": "Trauma",
    Hypervigilance: "Trauma",
    "Physical Touch": "Trauma",
    "Emotional Numbness": "Trauma",
    Triggers: "Trauma",
    "Memory Gaps": "Trauma",
    Anxiety: "Trauma",
    Neglect: "Neglect",
    "Food Security": "Neglect",
    Hygiene: "Neglect",
    Supervision: "Neglect",
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
    "Media Influence": "Eating disorders",
    "Comments on Body": "Eating disorders",
    "Secret Snacking": "Eating disorders",
    "Food Rules": "Eating disorders",
    "Emotional Eating": "Eating disorders",
    "Body Shame": "Eating disorders",
    "Exercise Motivation": "Eating disorders",
  };

  const mappedDomains = new Set<Domain>();
  for (const tag of tags) {
    const mapped = domainMap[tag];
    if (mapped) {
      mappedDomains.add(mapped);
    }
  }
  // Fallback to first domain if no mapping found
  if (mappedDomains.size === 0 && tags.length > 0) {
    mappedDomains.add("Bullying");
  }
  return Array.from(mappedDomains);
}

// Helper function to convert risk to score
function riskToScore(risk: string): number {
  switch (risk) {
    case "None":
      return 0;
    case "Low":
      return 1;
    case "Mid":
      return 2;
    case "High":
      return 3;
    default:
      return 0;
  }
}

// Helper to create question from raw data
function createQuestion(
  id: string,
  text: string,
  domainTags: string[],
  options: { text: string; risk: string }[]
): Question {
  return {
    id,
    text,
    answerType: "MCQ",
    domainTags: mapDomainTags(domainTags),
    weight: 1,
    options: options.map((opt, idx) => ({
      key: String.fromCharCode(97 + idx), // a, b, c, d
      text: opt.text,
      riskLevel: opt.risk as "None" | "Low" | "Mid" | "High",
      score: riskToScore(opt.risk),
    })),
  };
}

// All 80 follow-up questions
const followupQuestions: Question[] = [
  // Bullying questions (q1-q10)
  createQuestion(
    "q1",
    "When you wake up on a Monday morning and think about going to school, what is the first feeling you usually have?",
    ["Bullying", "Peer Dynamics"],
    [
      { text: "I feel excited to see my friends and share stories.", risk: "None" },
      { text: "I feel sleepy/lazy, but I am okay to go.", risk: "Low" },
      { text: "I feel a bit nervous because I don't know who I will sit with.", risk: "Mid" },
      { text: "I get a stomach ache or feel scared to face certain people.", risk: "High" },
    ]
  ),
  createQuestion(
    "q2",
    "Do other students call you by a nickname? How does that name make you feel?",
    ["Bullying"],
    [
      { text: "They call me by my real name or a cool nickname I like.", risk: "None" },
      { text: "Some names are annoying, but I ignore them.", risk: "Low" },
      { text: "I don't like the names because they make fun of how I look or talk.", risk: "Mid" },
      { text: "The names are very mean and make me want to cry or hide.", risk: "High" },
    ]
  ),
  createQuestion(
    "q3",
    "During tiffin (lunch) break, what usually happens?",
    ["Bullying", "Social Safety"],
    [
      { text: "I sit with my group, share food, and we laugh.", risk: "None" },
      { text: "I mostly eat quickly so I can go play or read.", risk: "Low" },
      { text: "I wander around looking for a place to sit where no one bothers me.", risk: "Mid" },
      { text: "I try to hide or sit near a teacher because I feel unsafe with other kids.", risk: "High" },
    ]
  ),
  createQuestion(
    "q4",
    "If a classmate pushes you, hides your pencil box, or trips you, what do they usually say?",
    ["Bullying"],
    [
      { text: "That never happens to me.", risk: "None" },
      { text: "It was an accident and they say sorry.", risk: "Low" },
      { text: "They say 'I was just doing masti (joking)' but it still hurts my feelings.", risk: "Mid" },
      { text: "They laugh at me and do it again the next day.", risk: "High" },
    ]
  ),
  createQuestion(
    "q5",
    "When the teacher says 'pick your own teams' for a game, how do you get chosen?",
    ["Bullying", "Exclusion"],
    [
      { text: "My friends immediately pull me into their team.", risk: "None" },
      { text: "I wait a little bit, but I find a team eventually.", risk: "Low" },
      { text: "I am usually one of the last ones left standing.", risk: "Mid" },
      { text: "People argue because nobody wants me on their team.", risk: "High" },
    ]
  ),
  createQuestion(
    "q6",
    "If you walk into class and a group of students suddenly stops talking and looks at you, what do you think?",
    ["Bullying", "Paranoia/Safety"],
    [
      { text: "Nothing, they are probably just planning a surprise or talking about homework.", risk: "None" },
      { text: "I wonder what they are saying, but I don't really care.", risk: "Low" },
      { text: "I feel worried that they are spreading a rumor about me.", risk: "Mid" },
      { text: "I know they are making fun of me because this happens every day.", risk: "High" },
    ]
  ),
  createQuestion(
    "q7",
    "How is your journey on the school bus or van?",
    ["Bullying", "Safety"],
    [
      { text: "It is the best part of the day! We have so much fun.", risk: "None" },
      { text: "It is boring/noisy, I just look out the window.", risk: "Low" },
      { text: "I try to sit quietly so the older/louder kids don't notice me.", risk: "Mid" },
      { text: "I hate the ride because people tease me or hit me when the driver isn't looking.", risk: "High" },
    ]
  ),
  createQuestion(
    "q8",
    "If you told a classmate a secret today, what would happen tomorrow?",
    ["Bullying", "Trust"],
    [
      { text: "They would keep it a secret. I trust them.", risk: "None" },
      { text: "They might tell one other person by mistake.", risk: "Low" },
      { text: "The whole class would know, so I don't tell anyone anything anymore.", risk: "Mid" },
      { text: "They would use the secret to embarrass me or blackmail me.", risk: "High" },
    ]
  ),
  createQuestion(
    "q9",
    "If someone is bothering you and you ask them to 'Please stop', what do they do?",
    ["Bullying", "Boundaries"],
    [
      { text: "They listen and stop immediately.", risk: "None" },
      { text: "They might stop for a while but forget later.", risk: "Low" },
      { text: "They make fun of me for asking them to stop.", risk: "Mid" },
      { text: "They bother me even more just to make me angry.", risk: "High" },
    ]
  ),
  createQuestion(
    "q10",
    "If your class has a WhatsApp group or plays games online, how are you treated there?",
    ["Bullying", "Cyberbullying"],
    [
      { text: "I am included in the jokes and feel happy.", risk: "None" },
      { text: "I don't check the messages much / I am not in the group.", risk: "Low" },
      { text: "I see them making plans without me, or kicking me out of the game.", risk: "Mid" },
      { text: "People post mean comments or stickers about me in the group.", risk: "High" },
    ]
  ),
  // Self-Harm Risk questions (q11-q20)
  createQuestion(
    "q11",
    "Imagine you made a big mistake on a test or broke something valuable at home. What is the first thought in your head?",
    ["Self-Harm Risk", "Emotional Regulation"],
    [
      { text: "Oops! I will try to fix it or do better next time.", risk: "None" },
      { text: "I feel sad and worried about getting scolded.", risk: "Low" },
      { text: "I am so stupid. I always ruin everything.", risk: "Mid" },
      { text: "I deserve to be punished or hurt for this.", risk: "High" },
    ]
  ),
  createQuestion(
    "q12",
    "When you get really, really angry or frustrated, what does your body want to do?",
    ["Self-Harm Risk", "Anger Management"],
    [
      { text: "I take deep breaths or tell someone I am angry.", risk: "None" },
      { text: "I cry or go to sleep to forget it.", risk: "Low" },
      { text: "I want to scream and throw things across the room.", risk: "Mid" },
      { text: "I want to hit myself, pinch my skin, or bang my head to let the anger out.", risk: "High" },
    ]
  ),
  createQuestion(
    "q13",
    "If a magician gave you a potion to change your life, what would you ask for?",
    ["Self-Harm Risk", "Escapism"],
    [
      { text: "To have superpowers (like flying) and have fun!", risk: "None" },
      { text: "To make school work easier so I don't get stressed.", risk: "Low" },
      { text: "To make me invisible so nobody can see me or bother me.", risk: "Mid" },
      { text: "To let me go to sleep for a very long time and not wake up.", risk: "High" },
    ]
  ),
  createQuestion(
    "q14",
    "When you are sitting in class thinking about something stressful, what do your hands do?",
    ["Self-Harm Risk", "Physical Habits"],
    [
      { text: "I play with my pencil or tap my foot.", risk: "None" },
      { text: "I bite my nails or chew my pencil top.", risk: "Low" },
      { text: "I pick at scabs or scratch my skin until it feels raw.", risk: "Mid" },
      { text: "I use sharp things (like a compass or clip) to scratch/poke my arm on purpose.", risk: "High" },
    ]
  ),
  createQuestion(
    "q15",
    "When there is an argument in your family or friend group, how do you feel?",
    ["Self-Harm Risk", "Guilt"],
    [
      { text: "I try to help them solve the fight.", risk: "None" },
      { text: "I feel annoyed and go to another room.", risk: "Low" },
      { text: "I feel guilty, like it is probably my fault somehow.", risk: "Mid" },
      { text: "I feel like everyone would be happier if I wasn't there at all.", risk: "High" },
    ]
  ),
  createQuestion(
    "q16",
    "If you accidentally get a small cut or a bruise while playing, how do you react?",
    ["Self-Harm Risk", "Pain Response"],
    [
      { text: "Ouch! I wash it and put a bandage on it.", risk: "None" },
      { text: "I show my friends and tell them how it happened.", risk: "Low" },
      { text: "I don't really care; I just ignore it.", risk: "Mid" },
      { text: "I actually like the sting/pain a little bit because it distracts me.", risk: "High" },
    ]
  ),
  createQuestion(
    "q17",
    "When you look in the mirror before school, what do you say to yourself?",
    ["Self-Harm Risk", "Self-Esteem"],
    [
      { text: "I look ready for the day!", risk: "None" },
      { text: "I wish I could change my hair/height, but I look okay.", risk: "Low" },
      { text: "I look ugly/weird. I hate how I look.", risk: "Mid" },
      { text: "I hate the person I see. I want to smash the mirror.", risk: "High" },
    ]
  ),
  createQuestion(
    "q18",
    "If you felt extremely sad, like a heavy cloud was over you, who would you tell?",
    ["Self-Harm Risk", "Support System"],
    [
      { text: "My parents, sibling, or best friend.", risk: "None" },
      { text: "Maybe my pet or a favorite stuffed toy.", risk: "Low" },
      { text: "No one. I keep it all inside because nobody understands.", risk: "Mid" },
      { text: "No one. I have to keep it a secret because my feelings are wrong/bad.", risk: "High" },
    ]
  ),
  createQuestion(
    "q19",
    "When you are very upset, how does your tummy feel?",
    ["Self-Harm Risk", "Somatic Symptoms"],
    [
      { text: "Normal, I eat my food as usual.", risk: "None" },
      { text: "I might eat a little less or eat comfort food (chocolate/chips).", risk: "Low" },
      { text: "My tummy hurts and I refuse to eat anything all day.", risk: "Mid" },
      { text: "I feel like I need to punish my body by not eating, or eating until I feel sick.", risk: "High" },
    ]
  ),
  createQuestion(
    "q20",
    "When you are playing on the playground or crossing the road, how careful are you?",
    ["Self-Harm Risk", "Risk Taking"],
    [
      { text: "I am very careful and follow the rules.", risk: "None" },
      { text: "I am mostly careful but sometimes I run fast.", risk: "Low" },
      { text: "I do dangerous things just to see if I can do them.", risk: "Mid" },
      { text: "I don't care if I get hurt or if a car hits me.", risk: "High" },
    ]
  ),
  // Family Stress questions (q21-q30)
  createQuestion(
    "q21",
    "When you are watching TV and you hear the front door open (meaning Mom or Dad is home), how does your body feel?",
    ["Family Stress", "Home Environment"],
    [
      { text: "Happy! I run to see them.", risk: "None" },
      { text: "Normal. I just keep watching TV.", risk: "Low" },
      { text: "A little nervous. I quickly check if the room is clean so they don't get mad.", risk: "Mid" },
      { text: "Scared. I turn off the TV and go to my room to avoid them.", risk: "High" },
    ]
  ),
  createQuestion(
    "q22",
    "When you show your report card or test marks to your parents, what usually happens?",
    ["Family Stress", "Parental Expectations"],
    [
      { text: "They look at it and say 'Good job' or help me with mistakes.", risk: "None" },
      { text: "They are busy and just sign it without looking much.", risk: "Low" },
      { text: "They compare my marks to my cousins or friends and say I need to do better.", risk: "Mid" },
      { text: "There is a lot of shouting and I get punished if the marks aren't perfect.", risk: "High" },
    ]
  ),
  createQuestion(
    "q23",
    "Imagine you are in the kitchen and you accidentally drop a glass and it breaks. What do you do?",
    ["Family Stress", "Safety/Fear"],
    [
      { text: "I tell my parents immediately, and we clean it up.", risk: "None" },
      { text: "I try to clean it up myself so I don't get a lecture.", risk: "Low" },
      { text: "I hide the pieces and lie because I am scared of being scolded.", risk: "Mid" },
      { text: "I panic and start crying because I know I will be hit or punished severely.", risk: "High" },
    ]
  ),
  createQuestion(
    "q24",
    "When your family sits down for dinner (or a meal) together, what is the mood like?",
    ["Family Stress", "Family Dynamics"],
    [
      { text: "We talk about our day and laugh.", risk: "None" },
      { text: "We usually eat quietly or watch TV while eating.", risk: "Low" },
      { text: "My parents mostly argue with each other, and I just eat quickly.", risk: "Mid" },
      { text: "It is very tense. I am scared to make a sound or spill food.", risk: "High" },
    ]
  ),
  createQuestion(
    "q25",
    "If you have a really hard project for school and you don't understand it, can you ask your parents for help?",
    ["Family Stress", "Support"],
    [
      { text: "Yes, they sit with me and explain it.", risk: "None" },
      { text: "Sometimes, but they are usually too tired/busy.", risk: "Low" },
      { text: "No, because they will yell at me for not understanding it myself.", risk: "Mid" },
      { text: "No, I am too afraid to ask them for anything.", risk: "High" },
    ]
  ),
  createQuestion(
    "q26",
    "If you had a bad day at school and you are feeling sad, do your parents notice?",
    ["Family Stress", "Emotional Neglect"],
    [
      { text: "Yes, they ask me 'What's wrong?' and give me a hug.", risk: "None" },
      { text: "Maybe, if I tell them directly.", risk: "Low" },
      { text: "No, they tell me to stop crying and focus on my studies.", risk: "Mid" },
      { text: "No, nobody at home cares how I feel or if I am sad.", risk: "High" },
    ]
  ),
  createQuestion(
    "q27",
    "If you had a magic wand to choose where to spend the entire weekend, where would you go?",
    ["Family Stress", "Avoidance"],
    [
      { text: "I would stay home and play games with my family.", risk: "None" },
      { text: "I would go to the park or a movie.", risk: "Low" },
      { text: "I would go to a friend's house just to get away from home.", risk: "Mid" },
      { text: "I would go anywhere as long as I don't have to be at home.", risk: "High" },
    ]
  ),
  createQuestion(
    "q28",
    "You need a new set of color pencils for art class. How do you feel about asking your parents for them?",
    ["Family Stress", "Financial/Emotional Stress"],
    [
      { text: "Easy, I just add it to the shopping list.", risk: "None" },
      { text: "I wait for a good time when they aren't busy.", risk: "Low" },
      { text: "I feel guilty asking because they always talk about money problems.", risk: "Mid" },
      { text: "I don't ask. I'd rather get in trouble at school than face their anger at home.", risk: "High" },
    ]
  ),
  createQuestion(
    "q29",
    "If you and your sibling (or cousin) get into a fight, whose side do your parents take?",
    ["Family Stress", "Fairness/Bias"],
    [
      { text: "They listen to both of us and help us solve it.", risk: "None" },
      { text: "They tell us both to be quiet.", risk: "Low" },
      { text: "They always take the other person's side and blame me.", risk: "Mid" },
      { text: "I am always the 'bad one' in the family, no matter what I do.", risk: "High" },
    ]
  ),
  createQuestion(
    "q30",
    "When you are lying in bed at night trying to sleep, what can you hear in your house?",
    ["Family Stress", "Sleep Environment"],
    [
      { text: "Quietness or soft TV sounds. I sleep easily.", risk: "None" },
      { text: "Sometimes loud talking, but it stops soon.", risk: "Low" },
      { text: "My parents arguing/shouting in the other room.", risk: "Mid" },
      { text: "Scary noises (yelling/throwing things) that keep me awake and frightened.", risk: "High" },
    ]
  ),
  // Academic Pressure questions (q31-q40)
  createQuestion(
    "q31",
    "When the teacher writes the 'Exam Dates' on the board, what is the first thing that happens to you?",
    ["Academic Pressure", "Performance Anxiety"],
    [
      { text: "I copy it down calmly. I am ready.", risk: "None" },
      { text: "I feel a little nervous, but I start planning.", risk: "Low" },
      { text: "My heart starts beating very fast and I get worried.", risk: "Mid" },
      { text: "I feel dizzy, sick, or want to cry immediately.", risk: "High" },
    ]
  ),
  createQuestion(
    "q32",
    "If you raise your hand in class to answer a question, but you give the wrong answer, how do you feel?",
    ["Academic Pressure", "Self-Concept"],
    [
      { text: "It's okay. Everybody makes mistakes.", risk: "None" },
      { text: "A little embarrassed, but I forget about it quickly.", risk: "Low" },
      { text: "I feel very stupid and decide not to raise my hand again.", risk: "Mid" },
      { text: "I feel like the whole class is laughing at me and I am worthless.", risk: "High" },
    ]
  ),
  createQuestion(
    "q33",
    "Imagine you got 9 marks out of 10 on a test. How do you feel about that missing 1 mark?",
    ["Academic Pressure", "Perfectionism"],
    [
      { text: "I don't care about the 1 mark. 9 is a great score!", risk: "None" },
      { text: "I wish I got 10, but I am still happy.", risk: "Low" },
      { text: "I feel sad and only focus on the mistake I made.", risk: "Mid" },
      { text: "I feel scared/angry at myself. It feels like a failure.", risk: "High" },
    ]
  ),
  createQuestion(
    "q34",
    "After you come back from school, what does your evening usually look like?",
    ["Academic Pressure", "Work-Life Balance"],
    [
      { text: "I finish homework quickly and then go play/relax.", risk: "None" },
      { text: "I have some tuition, but I get time to watch TV too.", risk: "Low" },
      { text: "I go from school to tuition to homework. I have no free time.", risk: "Mid" },
      { text: "I study until late at night. I am always tired and sleepy.", risk: "High" },
    ]
  ),
  createQuestion(
    "q35",
    "When you sit down to open your textbooks for a big test, does your body do anything strange?",
    ["Academic Pressure", "Somatic Symptoms"],
    [
      { text: "No, I feel normal.", risk: "None" },
      { text: "Sometimes I yawn or feel bored.", risk: "Low" },
      { text: "I get a headache or my tummy hurts.", risk: "Mid" },
      { text: "I start shaking, sweating, or have trouble breathing.", risk: "High" },
    ]
  ),
  createQuestion(
    "q36",
    "When your friends discuss their marks after an exam, what do you do?",
    ["Academic Pressure", "Social Comparison"],
    [
      { text: "I congratulate them and tell them my marks too.", risk: "None" },
      { text: "I listen but don't say much if my marks are lower.", risk: "Low" },
      { text: "I feel jealous and worried that they are smarter than me.", risk: "Mid" },
      { text: "I lie about my marks because I am ashamed of my real score.", risk: "High" },
    ]
  ),
  createQuestion(
    "q37",
    "Have you ever looked at a question paper and suddenly felt like your brain went completely blank, even though you studied?",
    ["Academic Pressure", "Test Anxiety"],
    [
      { text: "Never.", risk: "None" },
      { text: "Once or twice, but I remembered the answers later.", risk: "Low" },
      { text: "Yes, it happens often and it makes me panic.", risk: "Mid" },
      { text: "Yes, almost every time. I freeze up completely.", risk: "High" },
    ]
  ),
  createQuestion(
    "q38",
    "How do you feel when you see the pile of Holiday Homework during summer/winter break?",
    ["Academic Pressure", "Overwhelm"],
    [
      { text: "I finish it slowly and enjoy the holidays.", risk: "None" },
      { text: "It is boring, but I get it done.", risk: "Low" },
      { text: "It stresses me out and ruins my holiday fun.", risk: "Mid" },
      { text: "I feel overwhelmed and hopeless looking at it.", risk: "High" },
    ]
  ),
  createQuestion(
    "q39",
    "Do you feel you have to be the 'smart kid' or the 'topper' all the time?",
    ["Academic Pressure", "Identity/Expectations"],
    [
      { text: "No, I just do my best.", risk: "None" },
      { text: "It would be nice, but I don't stress about it.", risk: "Low" },
      { text: "Yes, if I get lower marks, people will be disappointed.", risk: "Mid" },
      { text: "Yes, if I am not the best, I feel like I am nobody.", risk: "High" },
    ]
  ),
  createQuestion(
    "q40",
    "It is Sunday night and you have school tomorrow. What are you thinking about?",
    ["Academic Pressure", "Anticipatory Anxiety"],
    [
      { text: "Meeting my friends.", risk: "None" },
      { text: "Packing my bag.", risk: "Low" },
      { text: "Worrying about incomplete homework or scolding.", risk: "Mid" },
      { text: "Dread and anxiety about facing the teachers/studies.", risk: "High" },
    ]
  ),
  // Social Isolation questions (q41-q50)
  createQuestion(
    "q41",
    "If the teacher is absent and the class gets a free period to talk or play, what do you usually do?",
    ["Social Isolation", "Peer Interaction"],
    [
      { text: "I move my chair to sit with my friends and chat.", risk: "None" },
      { text: "I read a book or draw by myself, which I enjoy.", risk: "Low" },
      { text: "I look around and wish someone would ask me to play, but no one does.", risk: "Mid" },
      { text: "I put my head down on the desk or pretend to sleep so I don't look lonely.", risk: "High" },
    ]
  ),
  createQuestion(
    "q42",
    "On a Sunday evening, what are you usually doing?",
    ["Social Isolation", "Leisure/Play"],
    [
      { text: "Playing cricket, football, or games with building/neighborhood friends.", risk: "None" },
      { text: "Watching TV or spending time with my family.", risk: "Low" },
      { text: "Sitting at the window watching other kids play, wishing I could join.", risk: "Mid" },
      { text: "I stay in my room because I don't have any friends to play with.", risk: "High" },
    ]
  ),
  createQuestion(
    "q43",
    "When the teacher says, 'Find a partner for this project,' what is your immediate reaction?",
    ["Social Isolation", "Social Anxiety"],
    [
      { text: "I already know who my partner is; we look at each other and smile.", risk: "None" },
      { text: "I ask the person sitting next to me, and it's usually fine.", risk: "Low" },
      { text: "I get nervous because I don't know who to ask.", risk: "Mid" },
      { text: "I panic and wait for the teacher to assign me to someone because nobody chooses me.", risk: "High" },
    ]
  ),
  createQuestion(
    "q44",
    "Do you have a 'Best Friend' at school?",
    ["Social Isolation", "Friendship Depth"],
    [
      { text: "Yes, I have one (or a whole group) and we tell each other everything.", risk: "None" },
      { text: "I have good friends, but maybe not a 'best' friend yet.", risk: "Low" },
      { text: "I used to, but now I feel like I don't really have anyone close.", risk: "Mid" },
      { text: "No. I mostly talk to imaginary friends, pets, or characters in my head.", risk: "High" },
    ]
  ),
  createQuestion(
    "q45",
    "If you are sick and don't come to school for two days, what happens when you return?",
    ["Social Isolation", "Social Belonging"],
    [
      { text: "My friends run to me and ask, 'What happened? Are you okay?'", risk: "None" },
      { text: "Someone asks for a medical note or if I finished the homework.", risk: "Low" },
      { text: "I sit down and nobody really mentions that I was gone.", risk: "Mid" },
      { text: "It feels like I was never there. Nobody noticed my absence at all.", risk: "High" },
    ]
  ),
  createQuestion(
    "q46",
    "If you are invited to a birthday party, how do you feel?",
    ["Social Isolation", "Social Events"],
    [
      { text: "Excited! I love cake and games.", risk: "None" },
      { text: "A bit shy at first, but I have fun once I get there.", risk: "Low" },
      { text: "I stand in the corner or stay close to the adults/parents the whole time.", risk: "Mid" },
      { text: "I make an excuse not to go because I don't know how to talk to people.", risk: "High" },
    ]
  ),
  createQuestion(
    "q47",
    "Imagine you won a prize or found something really cool. Who is the first person you want to tell?",
    ["Social Isolation", "Sharing"],
    [
      { text: "My friends in class!", risk: "None" },
      { text: "My parents or my brother/sister.", risk: "Low" },
      { text: "I don't know... maybe I would just keep it to myself.", risk: "Mid" },
      { text: "I have no one to tell.", risk: "High" },
    ]
  ),
  createQuestion(
    "q48",
    "Sometimes, even when you are in a classroom full of people, how do you feel?",
    ["Social Isolation", "Loneliness"],
    [
      { text: "I feel part of the fun.", risk: "None" },
      { text: "I feel okay, just focusing on my work.", risk: "Low" },
      { text: "I feel like I am sitting inside a glass bubble and can't reach anyone.", risk: "Mid" },
      { text: "I feel completely alone and invisible, like a ghost.", risk: "High" },
    ]
  ),
  createQuestion(
    "q49",
    "Do you prefer talking to people online (in games) or in real life?",
    ["Social Isolation", "Virtual vs Real"],
    [
      { text: "Real life is way better.", risk: "None" },
      { text: "I like both equally.", risk: "Low" },
      { text: "Online is better because real people make me nervous.", risk: "Mid" },
      { text: "I only have friends online. I don't talk to anyone in real life.", risk: "High" },
    ]
  ),
  createQuestion(
    "q50",
    "When a new student or a teacher says 'Hello' to you, is it easy to look at them?",
    ["Social Isolation", "Eye Contact"],
    [
      { text: "Yes, I look at them and smile back.", risk: "None" },
      { text: "I might look down a little out of respect/shyness.", risk: "Low" },
      { text: "It is very hard. I look at my shoes and mumble.", risk: "Mid" },
      { text: "I freeze up and can't speak or look at them at all.", risk: "High" },
    ]
  ),
  // Trauma questions (q51-q60)
  createQuestion(
    "q51",
    "Do you ever feel like a bad memory keeps playing in your head like a movie, even when you try to stop it?",
    ["Trauma", "Intrusive Thoughts"],
    [
      { text: "No, I mostly remember fun things.", risk: "None" },
      { text: "Sometimes, if I am sad, I remember embarrassing moments.", risk: "Low" },
      { text: "Yes, a scary memory pops up often and makes it hard to focus.", risk: "Mid" },
      { text: "Yes, it happens all the time and I feel like I am back in that scary moment again.", risk: "High" },
    ]
  ),
  createQuestion(
    "q52",
    "If a door slams shut loudly or a balloon pops unexpectedly, what does your body do?",
    ["Trauma", "Startle Response"],
    [
      { text: "I jump a little, then laugh.", risk: "None" },
      { text: "I get startled, but I calm down quickly.", risk: "Low" },
      { text: "My heart beats very fast and it takes a long time to feel okay again.", risk: "Mid" },
      { text: "I freeze, duck for cover, or start crying immediately.", risk: "High" },
    ]
  ),
  createQuestion(
    "q53",
    "Do you ever stare at a wall in class and feel like you are floating, or like you are not really in your body?",
    ["Trauma", "Dissociation"],
    [
      { text: "No, I pay attention mostly.", risk: "None" },
      { text: "Sometimes when the class is boring, I daydream.", risk: "Low" },
      { text: "Yes, often. The teacher calls my name and I don't even hear it.", risk: "Mid" },
      { text: "Yes, sometimes I 'wake up' and don't know how much time has passed or what happened.", risk: "High" },
    ]
  ),
  createQuestion(
    "q54",
    "When you go to sleep at night, what are your dreams like?",
    ["Trauma", "Sleep/Nightmares"],
    [
      { text: "I usually have funny or normal dreams.", risk: "None" },
      { text: "Sometimes I have a bad dream if I watched a scary movie.", risk: "Low" },
      { text: "I have nightmares often that make me wake up scared.", risk: "Mid" },
      { text: "I am scared to fall asleep because I see the same terrifying things every night.", risk: "High" },
    ]
  ),
  createQuestion(
    "q55",
    "When you are sitting in a room (like a classroom or waiting room), what are you usually looking at?",
    ["Trauma", "Hypervigilance"],
    [
      { text: "I look at my friends or a book.", risk: "None" },
      { text: "I look out the window because I am bored.", risk: "Low" },
      { text: "I keep watching the door to see who is coming in or going out.", risk: "Mid" },
      { text: "I always sit near the wall/exit and watch everyone because I don't feel safe.", risk: "High" },
    ]
  ),
  createQuestion(
    "q56",
    "If someone stands very close behind you or taps you on the shoulder unexpectedly, how do you react?",
    ["Trauma", "Physical Touch"],
    [
      { text: "I turn around to say hi.", risk: "None" },
      { text: "I move a little to get some space.", risk: "Low" },
      { text: "I get annoyed and tell them to move back.", risk: "Mid" },
      { text: "I flinch (jump) or pull away quickly as if they are going to hit me.", risk: "High" },
    ]
  ),
  createQuestion(
    "q57",
    "When something really happy or really sad happens, how do you feel inside?",
    ["Trauma", "Emotional Numbness"],
    [
      { text: "I feel happy or sad, just like everyone else.", risk: "None" },
      { text: "Sometimes I hide my feelings, but I feel them.", risk: "Low" },
      { text: "I feel confused about what I am supposed to feel.", risk: "Mid" },
      { text: "I feel 'numb' or empty, like I can't feel anything at all.", risk: "High" },
    ]
  ),
  createQuestion(
    "q58",
    "Are there certain places, smells, or sounds that make your tummy hurt or make you scared for no reason?",
    ["Trauma", "Triggers"],
    [
      { text: "No, not really.", risk: "None" },
      { text: "I don't like the smell of medicines/hospitals, but I am okay.", risk: "Low" },
      { text: "Yes, there are some things I avoid because they make me feel panicky.", risk: "Mid" },
      { text: "Yes, I try very hard to avoid anything that reminds me of a bad time.", risk: "High" },
    ]
  ),
  createQuestion(
    "q59",
    "Do you remember what happened when you were in Grade 3 or 4?",
    ["Trauma", "Memory Gaps"],
    [
      { text: "Yes, I remember my friends and teachers.", risk: "None" },
      { text: "Bits and pieces, like most people.", risk: "Low" },
      { text: "It is very blurry. I don't remember much.", risk: "Mid" },
      { text: "I can't remember big chunks of my life at all, like those years are missing.", risk: "High" },
    ]
  ),
  createQuestion(
    "q60",
    "Do you ever feel like something bad is going to happen to you or your family, even when everything is fine?",
    ["Trauma", "Anxiety"],
    [
      { text: "No, I feel safe.", risk: "None" },
      { text: "Sometimes, if I hear scary news on TV.", risk: "Low" },
      { text: "Yes, I worry about it a lot.", risk: "Mid" },
      { text: "Yes, I have a constant feeling of dread that danger is coming.", risk: "High" },
    ]
  ),
  // Neglect questions (q61-q70)
  createQuestion(
    "q61",
    "When it is lunch break, what does your tiffin usually look like?",
    ["Neglect", "Food Security"],
    [
      { text: "My parents pack a full lunch that I like.", risk: "None" },
      { text: "Sometimes I get money to buy something from the canteen.", risk: "Low" },
      { text: "It is often empty or very little food, so I feel hungry.", risk: "Mid" },
      { text: "I rarely bring food. I rely on friends sharing their food with me.", risk: "High" },
    ]
  ),
  createQuestion(
    "q62",
    "How do you get your uniform ready for school in the morning?",
    ["Neglect", "Hygiene"],
    [
      { text: "My parents wash and iron it for me.", risk: "None" },
      { text: "I help put it in the wash, but it's usually clean.", risk: "Low" },
      { text: "It is sometimes dirty or crumpled because no one had time to wash it.", risk: "Mid" },
      { text: "I have to wear the same dirty uniform for many days; it smells and has missing buttons.", risk: "High" },
    ]
  ),
  createQuestion(
    "q63",
    "When you get home from school, who is there?",
    ["Neglect", "Supervision"],
    [
      { text: "My mom, dad, or grandparents are there to welcome me.", risk: "None" },
      { text: "A helper/maid or an older sibling is there.", risk: "Low" },
      { text: "No one is home for a few hours, so I lock the door and wait.", risk: "Mid" },
      { text: "No one is home until late at night. I am alone for a very long time.", risk: "High" },
    ]
  ),
  createQuestion(
    "q64",
    "If the teacher writes a note in your diary that needs a parent's signature, what happens?",
    ["Neglect", "Parental Involvement"],
    [
      { text: "My parents check my diary every day and sign it.", risk: "None" },
      { text: "I have to remind them, but they sign it.", risk: "Low" },
      { text: "They are too busy to look, so I often get scolded at school for no signature.", risk: "Mid" },
      { text: "They never check my bag or diary. I have to forge (fake) the signature.", risk: "High" },
    ]
  ),
  createQuestion(
    "q65",
    "Imagine you have had a toothache or blurry vision (eye trouble) for a week. What happens?",
    ["Neglect", "Medical Needs"],
    [
      { text: "I tell my parents and they take me to the doctor quickly.", risk: "None" },
      { text: "They give me home remedies, and if it doesn't stop, we go to the doctor.", risk: "Low" },
      { text: "I complain, but they say 'it will pass' and ignore it.", risk: "Mid" },
      { text: "I stopped complaining because they never take me to the doctor even when I hurt.", risk: "High" },
    ]
  ),
  createQuestion(
    "q66",
    "What time do you usually go to sleep on a school night?",
    ["Neglect", "Bedtime Routine"],
    [
      { text: "At a fixed time. My parents make sure I am in bed.", risk: "None" },
      { text: "Mostly on time, unless we are watching a movie.", risk: "Low" },
      { text: "Whenever I want. No one really tells me when to sleep.", risk: "Mid" },
      { text: "Very late. I stay up watching TV/Phone all night because nobody checks on me.", risk: "High" },
    ]
  ),
  createQuestion(
    "q67",
    "How do you wake up in the morning?",
    ["Neglect", "Routine Care"],
    [
      { text: "My mom or dad wakes me up gently.", risk: "None" },
      { text: "I have an alarm clock, but my parents make sure I am up.", risk: "Low" },
      { text: "I have to wake myself up. If I oversleep, I miss school.", risk: "Mid" },
      { text: "I have to wake myself up AND wake up my parents/siblings to get the day started.", risk: "High" },
    ]
  ),
  createQuestion(
    "q68",
    "If your pencil breaks or you finish your notebook, when do you get a new one?",
    ["Neglect", "Stationery Supplies"],
    [
      { text: "My parents always keep extra supplies or buy them immediately.", risk: "None" },
      { text: "I tell them and we buy it on the weekend.", risk: "Low" },
      { text: "I have to ask many times before they remember to buy it.", risk: "Mid" },
      { text: "I often sit in class without a pencil or notebook because they won't buy me one.", risk: "High" },
    ]
  ),
  createQuestion(
    "q69",
    "Does anyone at home ask you, 'How was your day at school today?'",
    ["Neglect", "Emotional Check-in"],
    [
      { text: "Yes, every day at dinner or in the car.", risk: "None" },
      { text: "Sometimes, if they are not too tired.", risk: "Low" },
      { text: "Rarely. They are usually on their phones or busy working.", risk: "Mid" },
      { text: "Never. We don't really talk to each other.", risk: "High" },
    ]
  ),
  createQuestion(
    "q70",
    "How do you get to school?",
    ["Neglect", "Safety/Transportation"],
    [
      { text: "School bus or my parents drop me.", risk: "None" },
      { text: "I walk with a group of friends or neighbors.", risk: "Low" },
      { text: "I walk alone/take auto alone and sometimes I feel scared of the traffic/strangers.", risk: "Mid" },
      { text: "I have to find my own way. Sometimes I skip school because I can't get there.", risk: "High" },
    ]
  ),
  // Eating Disorders questions (q71-q80)
  createQuestion(
    "q71",
    "When you get dressed in the morning and look in the full-length mirror, what do you think?",
    ["Eating Disorder", "Body Image"],
    [
      { text: "I look good! I like my outfit.", risk: "None" },
      { text: "I look okay, but my hair is messy.", risk: "Low" },
      { text: "I wish my tummy was flatter or my legs were thinner/thicker.", risk: "Mid" },
      { text: "I look fat/ugly. I want to cry and change my clothes to hide my body.", risk: "High" },
    ]
  ),
  createQuestion(
    "q72",
    "If your mom packs your favorite heavy lunch (like Parathas or Pasta), but your friends are eating salad or fruits, what do you do?",
    ["Eating Disorder", "Peer Comparison"],
    [
      { text: "I eat my food happily. It's delicious!", risk: "None" },
      { text: "I might share some of mine with them.", risk: "Low" },
      { text: "I feel embarrassed and eat quickly so they don't notice.", risk: "Mid" },
      { text: "I throw my lunch away or give it all away because I don't want to get fat.", risk: "High" },
    ]
  ),
  createQuestion(
    "q73",
    "How do you feel after you have eaten a big festive meal (like at a wedding or party)?",
    ["Eating Disorder", "Guilt"],
    [
      { text: "Satisfied and full. Back to playing!", risk: "None" },
      { text: "A little too full, I might skip the next snack.", risk: "Low" },
      { text: "I feel guilty and angry at myself for eating so much.", risk: "Mid" },
      { text: "I feel disgusting. I want to make myself sick or skip meals for two days to 'fix' it.", risk: "High" },
    ]
  ),
  createQuestion(
    "q74",
    "When you see photos of models or actors on Instagram/YouTube, what goes through your mind?",
    ["Eating Disorder", "Media Influence"],
    [
      { text: "They look cool/funny.", risk: "None" },
      { text: "I wonder where they bought those clothes.", risk: "Low" },
      { text: "I wish I had a body like theirs. Mine is not good enough.", risk: "Mid" },
      { text: "I need to stop eating so I can look exactly like them.", risk: "High" },
    ]
  ),
  createQuestion(
    "q75",
    "If a relative says, 'Oh, you have put on some weight/grown healthy,' how do you react?",
    ["Eating Disorder", "Comments on Body"],
    [
      { text: "I don't really care.", risk: "None" },
      { text: "I feel a bit shy, but I forget it.", risk: "Low" },
      { text: "It hurts my feelings and I think about it for days.", risk: "Mid" },
      { text: "It confirms my worst fear. I decide to stop eating dinner from that day.", risk: "High" },
    ]
  ),
  createQuestion(
    "q76",
    "When nobody is watching, do you ever sneak food from the kitchen?",
    ["Eating Disorder", "Secret Snacking"],
    [
      { text: "No, I ask if I am hungry.", risk: "None" },
      { text: "Sometimes I take an extra chocolate or biscuit.", risk: "Low" },
      { text: "Yes, I hide wrappers under my bed because I don't want people to know I ate.", risk: "Mid" },
      { text: "Yes, I eat huge amounts of food very fast until I feel sick (Bingeing).", risk: "High" },
    ]
  ),
  createQuestion(
    "q77",
    "How do you decide what to eat?",
    ["Eating Disorder", "Food Rules"],
    [
      { text: "I eat what is cooked at home or what looks tasty.", risk: "None" },
      { text: "I try to eat healthy so I can run fast/play sports.", risk: "Low" },
      { text: "I have a list of 'bad foods' (like sugar/rice) that I try to avoid completely.", risk: "Mid" },
      { text: "I count every spoon of food and obsess over how much 'fat' is in it.", risk: "High" },
    ]
  ),
  createQuestion(
    "q78",
    "If you are feeling stressed or sad, what happens to your eating?",
    ["Eating Disorder", "Emotional Eating"],
    [
      { text: "Nothing, I eat my normal meals.", risk: "None" },
      { text: "I might eat a little more comfort food.", risk: "Low" },
      { text: "I skip breakfast or lunch on purpose to feel in control.", risk: "Mid" },
      { text: "I try to go as long as possible without eating anything at all.", risk: "High" },
    ]
  ),
  createQuestion(
    "q79",
    "In the changing room (for swimming or sports), do you look at other students?",
    ["Eating Disorder", "Body Shame"],
    [
      { text: "No, I just change my clothes quickly.", risk: "None" },
      { text: "I notice if they have cool gear/clothes.", risk: "Low" },
      { text: "I compare my stomach/thighs to theirs and feel jealous.", risk: "Mid" },
      { text: "I feel so ashamed of my body compared to them that I want to quit the sport.", risk: "High" },
    ]
  ),
  createQuestion(
    "q80",
    "Why do you play sports or run around in PT period?",
    ["Eating Disorder", "Exercise Motivation"],
    [
      { text: "Because it is fun and I like playing with friends!", risk: "None" },
      { text: "To get stronger and faster.", risk: "Low" },
      { text: "To burn off the chocolate I ate yesterday.", risk: "Mid" },
      { text: "I push myself until I am exhausted because I must lose weight.", risk: "High" },
    ]
  ),
];

async function seedFollowupQuestions() {
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

    // Check if follow-up template already exists
    const existingTemplate = await TestTemplate.findOne({
      type: "FOLLOWUP",
      name: "My School, My Life & Me",
    });

    if (existingTemplate) {
      console.log("Follow-up template already exists. Updating with new questions...");
      existingTemplate.questions = followupQuestions;
      existingTemplate.description = "Comprehensive Social Emotional Learning (SEL) Assessment for Grade 5 (Indian Context) covering 8 key categories. 80 questions with MCQ format.";
      await existingTemplate.save();
      console.log(`✓ Updated follow-up template with ${followupQuestions.length} questions`);
    } else {
      // Create new follow-up template
      const followupTemplate = await TestTemplate.create({
        type: "FOLLOWUP",
        name: "My School, My Life & Me",
        description: "Comprehensive Social Emotional Learning (SEL) Assessment for Grade 5 (Indian Context) covering 8 key categories. 80 questions with MCQ format.",
        questions: followupQuestions,
        createdBy: adminUser._id,
        schoolId: null, // Global template, not school-specific
      });
      console.log(`✓ Created follow-up template with ${followupQuestions.length} questions`);
      console.log(`  Template ID: ${followupTemplate._id}`);
    }

    // Print summary
    console.log("\n=== Follow-up Questions Summary ===");
    console.log(`Total questions: ${followupQuestions.length}`);
    console.log("\nQuestions by domain:");
    const domainCounts: Record<string, number> = {};
    followupQuestions.forEach((q) => {
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
    console.error("Error seeding follow-up questions:", error);
    process.exit(1);
  }
}

seedFollowupQuestions();

