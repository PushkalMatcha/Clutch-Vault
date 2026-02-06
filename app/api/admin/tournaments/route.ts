import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';

// Schema for tournament validation
const tournamentSchema = z.object({
    name: z.string().min(3, 'Tournament name must be at least 3 characters'),
    description: z.string().optional(),
    type: z.enum(['Solo', 'Duo', 'Squad']),
    prize: z.number().min(0),
    startTime: z.string(),
    endTime: z.string().optional(),
    maxTeams: z.number().min(2),
    status: z.enum(['Open', 'Registering', 'Last Call', 'In Progress', 'Completed']).optional(),
    imageUrl: z.string().optional(),
});

// Helper to check if user is admin
async function isAdmin(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { isAdmin: true }
    });
    return user?.isAdmin === true;
}

// GET all tournaments (admin view with more details)
export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!await isAdmin(session.user.id)) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const tournaments = await prisma.tournament.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { registrations: true, teams: true }
                }
            }
        });

        return NextResponse.json({ tournaments });
    } catch (error) {
        console.error('Admin tournaments GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 });
    }
}

// POST - Create a new tournament
export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!await isAdmin(session.user.id)) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const validatedData = tournamentSchema.parse(body);

        const tournament = await prisma.tournament.create({
            data: {
                name: validatedData.name,
                description: validatedData.description,
                type: validatedData.type,
                prize: validatedData.prize,
                startTime: new Date(validatedData.startTime),
                endTime: validatedData.endTime ? new Date(validatedData.endTime) : null,
                maxTeams: validatedData.maxTeams,
                status: validatedData.status || 'Open',
                imageUrl: validatedData.imageUrl,
            }
        });

        return NextResponse.json({ tournament }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        console.error('Admin tournament POST error:', error);
        return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 });
    }
}
