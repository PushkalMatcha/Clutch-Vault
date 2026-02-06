import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');

        const where: any = {};
        if (type) where.type = type;
        if (status) where.status = status;

        const tournaments = await prisma.tournament.findMany({
            where,
            orderBy: { startTime: 'asc' },
            include: {
                _count: {
                    select: { registrations: true }
                }
            }
        });

        return NextResponse.json({ tournaments });
    } catch (error) {
        console.error('Error fetching tournaments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tournaments' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        const tournament = await prisma.tournament.create({
            data: {
                name: body.name,
                description: body.description,
                type: body.type,
                prize: body.prize,
                startTime: new Date(body.startTime),
                endTime: body.endTime ? new Date(body.endTime) : null,
                maxTeams: body.maxTeams,
                status: body.status || 'Open',
                imageUrl: body.imageUrl,
            }
        });

        return NextResponse.json(tournament, { status: 201 });
    } catch (error) {
        console.error('Error creating tournament:', error);
        return NextResponse.json(
            { error: 'Failed to create tournament' },
            { status: 500 }
        );
    }
}
