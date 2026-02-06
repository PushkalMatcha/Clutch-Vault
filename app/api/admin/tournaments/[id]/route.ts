import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';

// Schema for tournament update
const tournamentUpdateSchema = z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    type: z.enum(['Solo', 'Duo', 'Squad']).optional(),
    prize: z.number().min(0).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional().nullable(),
    maxTeams: z.number().min(2).optional(),
    status: z.enum(['Open', 'Registering', 'Last Call', 'In Progress', 'Completed']).optional(),
    imageUrl: z.string().optional().nullable(),
});

// Helper to check if user is admin
async function isAdmin(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { isAdmin: true }
    });
    return user?.isAdmin === true;
}

// GET single tournament
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!await isAdmin(session.user.id)) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const tournament = await prisma.tournament.findUnique({
            where: { id: parseInt(id) },
            include: {
                registrations: {
                    include: { user: { select: { id: true, username: true, email: true } } }
                },
                teams: true,
                _count: { select: { registrations: true, teams: true } }
            }
        });

        if (!tournament) {
            return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
        }

        return NextResponse.json({ tournament });
    } catch (error) {
        console.error('Admin tournament GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch tournament' }, { status: 500 });
    }
}

// PATCH - Update tournament
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!await isAdmin(session.user.id)) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const validatedData = tournamentUpdateSchema.parse(body);

        // Build update data
        const updateData: any = {};
        if (validatedData.name) updateData.name = validatedData.name;
        if (validatedData.description !== undefined) updateData.description = validatedData.description;
        if (validatedData.type) updateData.type = validatedData.type;
        if (validatedData.prize !== undefined) updateData.prize = validatedData.prize;
        if (validatedData.startTime) updateData.startTime = new Date(validatedData.startTime);
        if (validatedData.endTime !== undefined) updateData.endTime = validatedData.endTime ? new Date(validatedData.endTime) : null;
        if (validatedData.maxTeams !== undefined) updateData.maxTeams = validatedData.maxTeams;
        if (validatedData.status) updateData.status = validatedData.status;
        if (validatedData.imageUrl !== undefined) updateData.imageUrl = validatedData.imageUrl;

        const tournament = await prisma.tournament.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        return NextResponse.json({ tournament });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        console.error('Admin tournament PATCH error:', error);
        return NextResponse.json({ error: 'Failed to update tournament' }, { status: 500 });
    }
}

// DELETE tournament
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!await isAdmin(session.user.id)) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        await prisma.tournament.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Tournament deleted successfully' });
    } catch (error) {
        console.error('Admin tournament DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete tournament' }, { status: 500 });
    }
}
