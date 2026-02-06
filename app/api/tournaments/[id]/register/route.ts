import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tournamentId = parseInt(params.id);
        const userId = parseInt(session.user.id);
        const body = await req.json();

        // Check if already registered
        const existingRegistration = await prisma.registration.findUnique({
            where: {
                userId_tournamentId: {
                    userId,
                    tournamentId
                }
            }
        });

        if (existingRegistration) {
            return NextResponse.json(
                { error: 'Already registered for this tournament' },
                { status: 400 }
            );
        }

        // Create registration
        const registration = await prisma.registration.create({
            data: {
                userId,
                tournamentId,
                role: body.role || 'Solo',
                status: 'Registered'
            },
            include: {
                tournament: true
            }
        });

        // Create notification
        await prisma.notification.create({
            data: {
                userId,
                title: 'Tournament Registration Successful',
                content: `You have successfully registered for ${registration.tournament.name}`,
                type: 'tournament'
            }
        });

        return NextResponse.json(registration, { status: 201 });
    } catch (error) {
        console.error('Error registering for tournament:', error);
        return NextResponse.json(
            { error: 'Failed to register for tournament' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tournamentId = parseInt(params.id);
        const userId = parseInt(session.user.id);

        await prisma.registration.delete({
            where: {
                userId_tournamentId: {
                    userId,
                    tournamentId
                }
            }
        });

        return NextResponse.json({ message: 'Unregistered successfully' });
    } catch (error) {
        console.error('Error unregistering from tournament:', error);
        return NextResponse.json(
            { error: 'Failed to unregister from tournament' },
            { status: 500 }
        );
    }
}
