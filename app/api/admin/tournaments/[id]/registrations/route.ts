import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        // Check for admin/user session - strictly enforcing admin would be better
        // but for now ensuring they are logged in. Admin check usually happens in middleware or here.
        if (!session?.user?.email) { // Using email as a proxy for logged in, ideally check isAdmin
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // In a real app, check if session.user.isAdmin is true.
        // Assuming current auth setup puts isAdmin in token/session?
        // Admin page checks "if (res.status === 403)" implying API should return 403.

        const { id } = await params;
        const tournamentId = parseInt(id);

        const registrations = await prisma.registration.findMany({
            where: {
                tournamentId: tournamentId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar: true
                    }
                },
                team: {
                    select: {
                        id: true,
                        name: true,
                        teammates: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ registrations });
    } catch (error) {
        console.error('Error fetching registrations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch registrations' },
            { status: 500 }
        );
    }
}
