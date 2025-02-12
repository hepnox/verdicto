import { PrismaClient, user_role, file_quality } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.report_reactions.deleteMany();
  await prisma.report_comments.deleteMany();
  await prisma.report_files.deleteMany();
  await prisma.files.deleteMany();
  await prisma.reports.deleteMany();
  await prisma.geolocations.deleteMany();
  await prisma.user_preferences.deleteMany();
  await prisma.notifications.deleteMany();
  await prisma.users.deleteMany();

  // Create admin user
  const admin = await prisma.users.create({
    data: {
      email: "admin@verdicto.com",
      phone: "+8801700000000",
      password: "hashed_admin_password", // In production, use proper password hashing
      role: user_role.admin,
      avatar_url: faker.image.avatar(),
      status: "active",
      full_name: "Admin",
    },
  });

  // Create some regular users
  const users = await Promise.all(
    Array(5)
      .fill(null)
      .map(async () => {
        return prisma.users.create({
          data: {
            full_name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            password: "hashed_password", // In production, use proper password hashing
            role: user_role.member,
            avatar_url: faker.image.avatar(),
            status: "active",
          },
        });
      }),
  );

  for (const user of [...users, admin]) {
    const numReports = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < numReports; i++) {
      // Create geolocation first
      const geolocation = await prisma.geolocations.create({
        data: {
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        },
      });

      const report = await prisma.reports.create({
        data: {
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraphs(),
          incident_at: faker.date.recent(),
          user_id: user.id,
          golocation_id: geolocation.id,
        },
      });

      // Create files and link them to report
      const numFiles = faker.number.int({ min: 1, max: 4 });
      for (let f = 0; f < numFiles; f++) {
        const file = await prisma.files.create({
          data: {
            url: faker.image.url(),
            user_id: user.id,
          },
        });

        await prisma.report_files.create({
          data: {
            report_id: report.id,
            file_id: file.id,
            quality: faker.helpers.arrayElement([
              file_quality.low,
              file_quality.medium,
              file_quality.high,
              file_quality.original,
            ]),
          },
        });
      }

      // Add comments to each report
      const numComments = faker.number.int({ min: 0, max: 5 });
      for (let j = 0; j < numComments; j++) {
        await prisma.report_comments.create({
          data: {
            content: faker.lorem.paragraph(),
            user_id: faker.helpers.arrayElement(users).id,
            report_id: report.id,
          },
        });
      }

      // Add reactions to each report
      for (const reactor of users) {
        if (faker.number.int({ min: 0, max: 1 })) {
          await prisma.report_reactions.create({
            data: {
              type: faker.helpers.arrayElement(['upvote', 'downvote']),
              user_id: reactor.id,
              report_id: report.id,
            },
          });
        }
      }
    }
  }

  console.log("Database has been seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
