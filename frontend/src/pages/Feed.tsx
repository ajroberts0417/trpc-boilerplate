// src/client/pages/Feed.tsx
import React from 'react';
import { trpc } from '../utils/trpc';
import { useAuth } from '@clerk/clerk-react';

export const Feed = () => {
    const [newMessage, setNewMessage] = React.useState('');
    const { data: messages, isLoading } = trpc.getAll.useQuery();

    const createMessage = trpc.create.useMutation({
        onSuccess: () => {
            trpc.useContext().getAll.invalidate();
            setNewMessage('');
        },
    });

    const deleteMessage = trpc.delete.useMutation({
        onSuccess: () => {
            trpc.useContext().getAll.invalidate();
        },
    });

    const { userId } = useAuth();

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createMessage.mutate({ content: newMessage });
                }}
                className="mb-6"
            >
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="What's happening?"
                    maxLength={280}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={!newMessage.trim()}
                >
                    Tweet
                </button>
            </form>

            <div className="space-y-4">
                {messages?.map((message) => (
                    <div key={message.id} className="border p-4 rounded bg-white">
                        <div className="flex justify-between">
                            <div>
                                <span className="font-bold">{message.author.name}</span>
                                <span className="text-gray-500 ml-2">
                                    {new Date(message.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            {message.authorId === userId && (
                                <button
                                    onClick={() => deleteMessage.mutate({ id: message.id })}
                                    className="text-red-500"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                        <p className="mt-2">{message.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
