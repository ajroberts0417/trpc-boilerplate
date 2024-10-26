// src/client/pages/Profile.tsx
import { useUser } from '@clerk/clerk-react';
import { trpc } from '../utils/trpc';

export const Profile = () => {
    const { user } = useUser();
    const { data: messages, isLoading } = trpc.getAll.useQuery();
    const userMessages = messages?.filter(m => m.authorId === user?.id);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex items-center space-x-4">
                    <img
                        src={user?.imageUrl}
                        alt={user?.fullName || 'Profile'}
                        className="w-20 h-20 rounded-full"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{user?.fullName}</h1>
                        <p className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Your Tweets</h2>
            <div className="space-y-4">
                {userMessages?.map((message) => (
                    <div key={message.id} className="border p-4 rounded bg-white">
                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="mt-2">{message.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};