import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = parseInt(session.user.id);

        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    { userId, status: 'accepted' },
                    { friendId: userId, status: 'accepted' }
                ]
            },
            include: {
                user: {
                    select: { id: true, username: true, avatar: true }
                },
                friend: {
                    select: { id: true, username: true, avatar: true }
                }
            }
        });

        // Format the response to show the friend (not the current user)
        const friends = friendships.map(f => ({
            id: f.id,
            friend: f.userId === userId ? f.friend : f.user,
            createdAt: f.createdAt
        }));

        return NextResponse.json(friends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        return NextResponse.json(
            { error: 'Failed to fetch friends' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = parseInt(session.user.id);
        const { friendId } = await req.json();

        // Check if friendship already exists
        const existing = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { userId, friendId },
                    { userId: friendId, friendId: userId }
                ]
            }
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Friend request already exists' },
                { status: 400 }
            );
        }

        // Create friend request
        const friendship = await prisma.friendship.create({
            data: {
                userId,
                friendId,
                status: 'pending'
            }
        });

        // Create notification for the friend
        await prisma.notification.create({
            data: {
                userId: friendId,
                title: 'New Friend Request',
                content: `You have a new friend request`,
                type: 'friend_request'
            }
        });

        return NextResponse.json(friendship, { status: 201 });
    } catch (error) {
        console.error('Error sending friend request:', error);
        return NextResponse.json(
            { error: 'Failed to send friend request' },
            { status: 500 }
        );
    }
}
