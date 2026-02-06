import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { tournamentId, teammates, teamName } = body;

        if (!tournamentId) {
            return NextResponse.json({ error: 'Tournament ID is required' }, { status: 400 });
        }

        const userId = parseInt(session.user.id);
        const tId = parseInt(tournamentId);

        // Check if already registered
        const existingRegistration = await prisma.registration.findFirst({
            where: {
                userId: userId,
                tournamentId: tId
            }
        });

        if (existingRegistration) {
            return NextResponse.json({ error: 'You are already registered for this tournament' }, { status: 400 });
        }

        // Generate a random room code
        const roomCode = `CLUTCH-${Math.floor(1000 + Math.random() * 9000)}-VAULT`;

        // Create the team
        const team = await prisma.team.create({
            data: {
                name: teamName || `${session.user.name}'s Team`,
                tournamentId: tId,
                leaderId: userId,
                roomCode: roomCode,
                teammates: teammates || [] // Store teammates as JSON
            } as any
        });

        // Register the leader
        const registration = await prisma.registration.create({
            data: {
                userId: userId,
                tournamentId: tId,
                teamId: team.id,
                role: 'Team Leader',
                status: 'Registered'
            }
        });

        return NextResponse.json({
            success: true,
            team: team,
            registration: registration,
            roomCode: roomCode
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Failed to register' },
            { status: 500 }
        );
    }
}
