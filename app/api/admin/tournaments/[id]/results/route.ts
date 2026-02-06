import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        // Authorization check
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const tournamentId = parseInt(id);
        const { results } = await req.json();
        // Expected format: results = [{ registrationId: 1, placement: 1, earnings: 500 }, ...]

        if (!Array.isArray(results)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        // Transaction to update all results
        await prisma.$transaction(
            results.map((result: any) =>
                prisma.registration.update({
                    where: { id: result.registrationId },
                    data: {
                        placement: result.placement || null,
                        earnings: result.earnings || 0
                    }
                })
            )
        );

        // Optionally fetch updated list or just return success
        return NextResponse.json({ message: 'Results updated successfully' });
    } catch (error) {
        console.error('Error updating results:', error);
        return NextResponse.json(
            { error: 'Failed to update results' },
            { status: 500 }
        );
    }
}
