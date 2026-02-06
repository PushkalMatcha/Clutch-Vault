import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/password';

async function main() {
    console.log('🌱 Starting database seed...');

    // Create sample users
    const users = await Promise.all([
        prisma.user.create({
            data: {
                email: 'john@example.com',
                username: 'john_codm',
                password: await hashPassword('password123'),
                avatar: '/placeholder.svg?height=100&width=100',
            },
        }),
        prisma.user.create({
            data: {
                email: 'sarah@example.com',
                username: 'sarah_pro',
                password: await hashPassword('password123'),
                avatar: '/placeholder.svg?height=100&width=100',
            },
        }),
        prisma.user.create({
            data: {
                email: 'mike@example.com',
                username: 'mike_sniper',
                password: await hashPassword('password123'),
                avatar: '/placeholder.svg?height=100&width=100',
            },
        }),
    ]);

    console.log('✅ Created 3 users');

    // Create sample tournaments
    const tournaments = await Promise.all([
        prisma.tournament.create({
            data: {
                name: 'CODM Pro League',
                description: 'Professional tournament for elite players',
                type: 'Squad',
                prize: 5000,
                startTime: new Date('2026-03-15T14:00:00'),
                endTime: new Date('2026-03-15T18:00:00'),
                maxTeams: 32,
                status: 'Registering',
                imageUrl: '/placeholder.svg?height=300&width=500',
            },
        }),
        prisma.tournament.create({
            data: {
                name: 'Weekend Warfare',
                description: 'Casual weekend tournament for all skill levels',
                type: 'Solo',
                prize: 2500,
                startTime: new Date('2026-03-20T14:00:00'),
                endTime: new Date('2026-03-20T17:00:00'),
                maxTeams: 64,
                status: 'Open',
                imageUrl: '/placeholder.svg?height=300&width=500',
            },
        }),
        prisma.tournament.create({
            data: {
                name: 'Clutch Cup',
                description: 'High stakes tournament with massive prize pool',
                type: 'Duo',
                prize: 10000,
                startTime: new Date('2026-03-25T14:00:00'),
                endTime: new Date('2026-03-25T20:00:00'),
                maxTeams: 16,
                status: 'Last Call',
                imageUrl: '/placeholder.svg?height=300&width=500',
            },
        }),
        prisma.tournament.create({
            data: {
                name: 'Elite Showdown',
                description: 'Tournament for the best of the best',
                type: 'Squad',
                prize: 1000,
                startTime: new Date('2026-04-01T14:00:00'),
                maxTeams: 48,
                status: 'Open',
            },
        }),
        prisma.tournament.create({
            data: {
                name: 'Sniper Challenge',
                description: 'Test your sniping skills',
                type: 'Solo',
                prize: 500,
                startTime: new Date('2026-04-05T14:00:00'),
                maxTeams: 100,
                status: 'Open',
            },
        }),
        prisma.tournament.create({
            data: {
                name: 'Battle Royale Masters',
                description: 'Ultimate BR tournament',
                type: 'Squad',
                prize: 7500,
                startTime: new Date('2026-04-10T14:00:00'),
                maxTeams: 24,
                status: 'Registering',
            },
        }),
    ]);

    console.log('✅ Created 6 tournaments');

    // Create sample registrations
    await prisma.registration.create({
        data: {
            userId: users[0].id,
            tournamentId: tournaments[0].id,
            role: 'Team Leader',
            status: 'Registered',
        },
    });

    await prisma.registration.create({
        data: {
            userId: users[1].id,
            tournamentId: tournaments[1].id,
            role: 'Solo',
            status: 'Registered',
        },
    });

    console.log('✅ Created sample registrations');

    // Create sample friendships
    await prisma.friendship.create({
        data: {
            userId: users[0].id,
            friendId: users[1].id,
            status: 'accepted',
        },
    });

    await prisma.friendship.create({
        data: {
            userId: users[0].id,
            friendId: users[2].id,
            status: 'pending',
        },
    });

    console.log('✅ Created sample friendships');

    // Create sample notifications
    await prisma.notification.create({
        data: {
            userId: users[0].id,
            title: 'Welcome to Clutch Vault!',
            content: 'Start browsing tournaments and register to compete.',
            type: 'system',
        },
    });

    await prisma.notification.create({
        data: {
            userId: users[0].id,
            title: 'Tournament Starting Soon',
            content: 'CODM Pro League starts in 1 hour!',
            type: 'tournament',
            read: false,
        },
    });

    console.log('✅ Created sample notifications');

    console.log('🎉 Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
