import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const tournament = await prisma.tournament.findUnique({
            where: { id: parseInt(params.id) },
            include: {
                teams: {
                    include: {
                        leader: {
                            select: { id: true, username: true, avatar: true }
                        },
                        registrations: {
                            include: {
                                user: {
                                    select: { id: true, username: true, avatar: true }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: { registrations: true }
                }
            }
        });

        if (!tournament) {
            return NextResponse.json(
                { error: 'Tournament not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(tournament);
    } catch (error) {
        console.error('Error fetching tournament:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tournament' },
            { status: 500 }
        );
    }
}
