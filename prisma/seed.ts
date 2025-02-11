import { PrismaClient, UserRole } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.vote.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.crimeReport.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@verdicto.com',
      phoneNumber: '+8801700000000',
      password: 'hashed_admin_password', // In production, use proper password hashing
      role: UserRole.ADMIN,
      profileImage: faker.image.avatar(),
      bio: faker.person.bio(),
    },
  })

  // Create some regular users
  const users = await Promise.all(
    Array(5).fill(null).map(async () => {
      return prisma.user.create({
        data: {
          email: faker.internet.email(),
          phoneNumber: faker.phone.number({ style: 'international' }),
          password: 'hashed_password', // In production, use proper password hashing
          role: UserRole.VERIFIED,
          profileImage: faker.image.avatar(),
          bio: faker.person.bio(),
        },
      })
    })
  )

  // Create crime reports
  const divisions = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet']
  const districts = ['City Center', 'North', 'South', 'East', 'West']

  for (const user of [...users, admin]) {
    const numReports = faker.number.int({ min: 1, max: 3 })
    
    for (let i = 0; i < numReports; i++) {
      const report = await prisma.crimeReport.create({
        data: {
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraphs(),
          aiDescription: faker.lorem.paragraph(),
          division: faker.helpers.arrayElement(divisions),
          district: faker.helpers.arrayElement(districts),
          images: Array(faker.number.int({ min: 1, max: 4 }))
            .fill(null)
            .map(() => faker.image.url()),
          video: faker.helpers.maybe(() => faker.internet.url()),
          location: {
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
          },
          crimeTime: faker.date.recent(),
          verificationScore: faker.number.int({ min: -10, max: 50 }),
          authorId: user.id,
        },
      })

      // Add comments to each report
      const numComments = faker.number.int({ min: 0, max: 5 })
      for (let j = 0; j < numComments; j++) {
        await prisma.comment.create({
          data: {
            content: faker.lorem.paragraph(),
            proof: faker.image.url(),
            authorId: faker.helpers.arrayElement(users).id,
            reportId: report.id,
          },
        })
      }

      // Add votes to each report
      for (const voter of users) {
        if (faker.number.int({ min: 0, max: 1 })) {
          await prisma.vote.create({
            data: {
              value: faker.helpers.arrayElement([-1, 1]),
              userId: voter.id,
              reportId: report.id,
            },
          })
        }
      }
    }
  }

  console.log('Database has been seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 