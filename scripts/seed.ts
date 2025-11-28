import "dotenv/config";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/db/connection";
import { User } from "@/models/User";
import { School } from "@/models/School";
import { TeacherProfile } from "@/models/TeacherProfile";
import { StudentProfile } from "@/models/StudentProfile";
import { ParentProfile } from "@/models/ParentProfile";

const DEFAULT_PASSWORD = "welcome123";

async function ensureUser({
  email,
  name,
  role,
  password,
  schoolId = null,
}: {
  email: string;
  name: string;
  role: string;
  password: string;
  schoolId?: any;
}) {
  let user = await User.findOne({ email });
  if (!user) {
    const passwordHash = await bcrypt.hash(password, 10);
    user = await User.create({
      email,
      name,
      role,
      schoolId,
      passwordHash,
    });
    console.log(`Created ${role} user (${email} / ${password})`);
  }
  return user;
}

async function run() {
  try {
    await dbConnect();

    const masterAdmin = await ensureUser({
      email: "admin@mitr.local",
      name: "Master Admin",
      role: "MASTER_ADMIN",
      password: "admin123",
    });

    let school = await School.findOne({ name: "Sunrise Public School" });
    if (!school) {
      school = await School.create({
        name: "Sunrise Public School",
        city: "Mumbai",
        country: "India",
        settings: { assessmentFrequencyDays: 30 },
        createdByUserId: masterAdmin._id,
      });
      console.log("Seeded Sunrise Public School");
    }

    const principal = await ensureUser({
      email: "principal@sunrise.local",
      name: "Priya Nair",
      role: "PRINCIPAL",
      password: DEFAULT_PASSWORD,
      schoolId: school._id,
    });

    const teacherSeeds = [
      {
        email: "aryan.shah@sunrise.local",
        name: "Aryan Shah",
        grades: ["6", "7"],
        sections: ["A"],
      },
      {
        email: "meera.kr@sunrise.local",
        name: "Meera Krishnan",
        grades: ["8"],
        sections: ["B", "C"],
      },
    ];

    const teachers = [];
    for (const teacher of teacherSeeds) {
      const user = await ensureUser({
        email: teacher.email,
        name: teacher.name,
        role: "TEACHER",
        password: DEFAULT_PASSWORD,
        schoolId: school._id,
      });
      let profile = await TeacherProfile.findOne({ userId: user._id });
      if (!profile) {
        profile = await TeacherProfile.create({
          userId: user._id,
          schoolId: school._id,
          assignedGrades: teacher.grades,
          assignedSections: teacher.sections,
        });
        console.log(`Linked teacher profile for ${teacher.name}`);
      }
      teachers.push({ user, profile });
    }

    const studentSeeds = [
      {
        email: "aarav.patel@student.sunrise.local",
        name: "Aarav Patel",
        grade: "6",
        section: "A",
        rollNumber: "6A-01",
      },
      {
        email: "siya.desai@student.sunrise.local",
        name: "Siya Desai",
        grade: "8",
        section: "B",
        rollNumber: "8B-05",
      },
      {
        email: "kabir.khan@student.sunrise.local",
        name: "Kabir Khan",
        grade: "7",
        section: "A",
        rollNumber: "7A-11",
      },
    ];

    const studentProfiles = [];
    for (const student of studentSeeds) {
      const user = await ensureUser({
        email: student.email,
        name: student.name,
        role: "STUDENT",
        password: DEFAULT_PASSWORD,
        schoolId: school._id,
      });
      let profile = await StudentProfile.findOne({ userId: user._id });
      if (!profile) {
        profile = await StudentProfile.create({
          userId: user._id,
          schoolId: school._id,
          grade: student.grade,
          section: student.section,
          rollNumber: student.rollNumber,
        });
        console.log(`Created student profile for ${student.name}`);
      }
      studentProfiles.push({ email: student.email, user, profile });
    }

    const parentSeeds = [
      {
        email: "rhea.patel@parents.sunrise.local",
        name: "Rhea Patel",
        children: ["aarav.patel@student.sunrise.local"],
      },
      {
        email: "vikram.desai@parents.sunrise.local",
        name: "Vikram Desai",
        children: ["siya.desai@student.sunrise.local", "kabir.khan@student.sunrise.local"],
      },
    ];

    for (const parent of parentSeeds) {
      const user = await ensureUser({
        email: parent.email,
        name: parent.name,
        role: "PARENT",
        password: DEFAULT_PASSWORD,
        schoolId: school._id,
      });
      const childProfiles = parent.children
        .map((childEmail) => studentProfiles.find((s) => s.email === childEmail)?.profile?._id)
        .filter(Boolean);

      let profile = await ParentProfile.findOne({ userId: user._id });
      if (!profile) {
        profile = await ParentProfile.create({
          userId: user._id,
          schoolId: school._id,
          linkedStudentIds: childProfiles,
        });
        console.log(`Linked parent profile for ${parent.name}`);
      } else if (childProfiles.length) {
        profile.linkedStudentIds = childProfiles;
        await profile.save();
      }
    }

    console.log("Seed data ready. Default password:", DEFAULT_PASSWORD);
    console.log("Principal:", principal.email);
    console.log("Teachers:", teachers.map((t) => t.user.email).join(", "));
    console.log("Students:", studentProfiles.map((s) => s.email).join(", "));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
