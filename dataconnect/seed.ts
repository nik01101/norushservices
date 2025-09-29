
import {db, Services, TimeSlots} from './schema/schema';

async function seed() {
  await db
    .insert(Services)
    .values([
      {
        serviceId: 'furniture-assembly',
        name: 'Furniture Assembly',
        description:
          'Expert assembly for your flat-pack furniture. Quick, reliable, and hassle-free.',
        price: 50,
        imageUrl: '/landing/1.png',
        imageHint: 'furniture assembly',
        extraFee: 'The minimum service time is 2 hours.',
      },
      {
        serviceId: 'tv-mounting',
        name: 'Mounting',
        description: 'Secure and professional mounting services for any wall type.',
        price: 50,
        imageUrl: '/landing/2.png',
        imageHint: 'living room',
      },
      {
        serviceId: 'trash-removal',
        name: 'Trash Removal Furniture',
        description:
          'Efficient removal of unwanted furniture and trash. Extra fee may apply based on weight.',
        price: 50,
        imageUrl: '/landing/3.png',
        imageHint: 'trash furniture removal',
        extraFee: 'Extra fee depending on weight',
      },
      {
        serviceId: 'local-moving',
        name: 'Moving',
        description:
          'Efficient and careful moving services for your home or office within the city.',
        price: 80,
        imageUrl: '/landing/4.png',
        imageHint: 'moving boxes',
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(TimeSlots)
    .values([
      {time: '09:00 AM', available: true},
      {time: '10:00 AM', available: true},
      {time: '11:00 AM', available: true},
      {time: '12:00 PM', available: true},
      {time: '01:00 PM', available: false},
      {time: '02:00 PM', available: true},
      {time: '03:00 PM', available: true},
      {time: '04:00 PM', available: true},
    ])
    .onConflictDoNothing();

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
