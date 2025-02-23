// components/Chat.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getContract, getProviderAndSigner } from '../lib/contract';
import { useUser } from '../Context/UserContext';
import toast from 'react-hot-toast';
import { Send, Trash2, User } from 'lucide-react';

interface Friend {
    pubkey: string;
    username: string;
    profileImage: string;
}

interface Message {
    sender: string;
    timestamp: string;
    msg: string;
    deletedBySender: boolean;
    deletedByReceiver: boolean;
}

export default function Chat() {
    const { ready, authenticated, user } = usePrivy();
    const { userProfile } = useUser();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const fetchFriends = async () => {
        if (!authenticated || !user?.wallet?.address) return;
        setLoading(true);
        try {
            const { signer } = await getProviderAndSigner();
            const contract = getContract(signer);
            const userExists = await contract.checkUserExists(
                user.wallet.address
            );
            if (!userExists) {
                toast.error('Please create an account first.');
                setLoading(false);
                return;
            }
            const friendList = await contract.getMyFriendList(0, 50);
            const friendsWithDetails = await Promise.all(
                friendList.map(async (friend: { pubkey: string }) => {
                    const username = await contract.getUsername(friend.pubkey);
                    const profileImage = await contract.getProfileImage(
                        friend.pubkey
                    );
                    return {
                        pubkey: friend.pubkey,
                        username,
                        profileImage: profileImage
                            ? profileImage.replace(
                                  'ipfs://',
                                  'https://ipfs.io/ipfs/'
                              )
                            : '',
                    };
                })
            );
            setFriends(friendsWithDetails);
        } catch (error) {
            console.error('Error fetching friends:', error);
            toast.error(
                'Failed to load friends: ' + (error.message || 'Unknown error')
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (friendAddress: string) => {
        if (!authenticated || !user?.wallet?.address) return;
        setLoading(true);
        try {
            const { signer } = await getProviderAndSigner();
            const contract = getContract(signer);
            const messageList = await contract.readMessage(
                friendAddress,
                0,
                50
            );
            setMessages(messageList);
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error(
                'Failed to load messages: ' + (error.message || 'Unknown error')
            );
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (
            !newMessage.trim() ||
            !selectedFriend ||
            !authenticated ||
            !user?.wallet?.address
        )
            return;
        setLoading(true);
        try {
            const { signer } = await getProviderAndSigner();
            const contract = getContract(signer);
            const tx = await contract.sendMessage(selectedFriend, newMessage);
            await tx.wait();
            toast.success('Message sent successfully!');
            setNewMessage('');
            await fetchMessages(selectedFriend);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(
                'Failed to send message: ' + (error.message || 'Unknown error')
            );
        } finally {
            setLoading(false);
        }
    };

    const deleteMessages = async () => {
        if (!selectedFriend || !authenticated || !user?.wallet?.address) return;
        setLoading(true);
        try {
            const { signer } = await getProviderAndSigner();
            const contract = getContract(signer);
            const tx = await contract.deleteMessages(selectedFriend);
            await tx.wait();
            setMessages((prevMessages) =>
                prevMessages.filter(
                    (msg) =>
                        msg.sender.toLowerCase() !==
                        user.wallet.address.toLowerCase()
                )
            );
            toast.success('Your messages deleted successfully!');
            scrollToBottom();
        } catch (error) {
            console.error('Error deleting messages:', error);
            toast.error(
                'Failed to delete messages: ' +
                    (error.message || 'Unknown error')
            );
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getSelectedFriendDetails = () => {
        const friend = friends.find((f) => f.pubkey === selectedFriend);
        return friend
            ? { username: friend.username, profileImage: friend.profileImage }
            : { username: 'Unknown', profileImage: '' };
    };

    const truncateUsername = (username: string) => {
        return username.length > 12 ? `${username.slice(0, 10)}…` : username;
    };

    const getMessageSenderName = (senderAddress: string) => {
        if (
            senderAddress.toLowerCase() === user?.wallet?.address.toLowerCase()
        ) {
            return 'Me';
        }
        const friend = friends.find(
            (f) => f.pubkey.toLowerCase() === senderAddress.toLowerCase()
        );
        return friend ? truncateUsername(friend.username) : 'Unknown';
    };

    useEffect(() => {
        if (ready && authenticated && user?.wallet?.address) {
            fetchFriends();
        }
    }, [ready, authenticated, user]);

    useEffect(() => {
        if (selectedFriend) {
            fetchMessages(selectedFriend);
        }
    }, [selectedFriend]);

    if (!ready) return <div className='p-4 text-white'>Loading...</div>;

    if (!authenticated) {
        return (
            <div className='p-4 text-center text-gray-300'>
                Please connect your wallet to use the chat.
            </div>
        );
    }

    return (
        <div className='flex flex-col top-20 min-h-screen bg-gradient-to-br from-gray-900 to-black text-white'>
            <h1 className='text-3xl font-bold mb-6'></h1>
            <h1 className='text-3xl font-bold mb-6'></h1>
            <div className='pt-32 px-6 pb-6 flex flex-col flex-1'>
                {' '}
                {/* Increased pt-20 to pt-24 */}
                <div className='flex gap-6 h-full'>
                    {/* Friends List */}
                    <div className='w-1/4 bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 flex flex-col max-h-[calc(100vh-16rem)]'>
                        <h2 className='text-xl font-semibold mb-4'>Friends</h2>
                        {loading && friends.length === 0 ? (
                            <p>Loading friends...</p>
                        ) : friends.length === 0 ? (
                            <p>
                                No friends yet. Add some friends to start
                                chatting!
                            </p>
                        ) : (
                            <ul className='space-y-2 flex-1 overflow-y-auto custom-scrollbar'>
                                {friends.map((friend) => (
                                    <li
                                        key={friend.pubkey}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-2 ${
                                            selectedFriend === friend.pubkey
                                                ? 'bg-purple-600/50'
                                                : 'bg-gray-700/50 hover:bg-gray-600/50'
                                        }`}
                                        onClick={() =>
                                            setSelectedFriend(friend.pubkey)
                                        }
                                    >
                                        {friend.profileImage ? (
                                            <img
                                                src={friend.profileImage}
                                                alt={`${friend.username}'s avatar`}
                                                className='w-8 h-8 rounded-full object-cover'
                                            />
                                        ) : (
                                            <User
                                                size={32}
                                                className='text-gray-400'
                                            />
                                        )}
                                        <span>{friend.username}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Chat Area */}
                    <div className='w-3/4 bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 flex flex-col max-h-[calc(100vh-16rem)]'>
                        {selectedFriend ? (
                            <>
                                <div className='flex justify-between items-center mb-4'>
                                    <div className='flex items-center gap-2'>
                                        {getSelectedFriendDetails()
                                            .profileImage ? (
                                            <img
                                                src={
                                                    getSelectedFriendDetails()
                                                        .profileImage
                                                }
                                                alt={`${
                                                    getSelectedFriendDetails()
                                                        .username
                                                }'s avatar`}
                                                className='w-8 h-8 rounded-full object-cover'
                                            />
                                        ) : (
                                            <User
                                                size={32}
                                                className='text-gray-400'
                                            />
                                        )}
                                        <h2 className='text-xl font-semibold'>
                                            {truncateUsername(
                                                getSelectedFriendDetails()
                                                    .username
                                            )}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={deleteMessages}
                                        className='flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-white py-2 px-3 rounded-lg transition-all duration-200'
                                        disabled={loading}
                                    >
                                        <Trash2 size={16} />
                                        Delete My Messages
                                    </button>
                                </div>
                                <div className='flex-1 overflow-y-auto mb-8 custom-scrollbar'>
                                    {loading && messages.length === 0 ? (
                                        <p>Loading messages...</p>
                                    ) : messages.length === 0 ? (
                                        <p>
                                            No messages yet. Start the
                                            conversation!
                                        </p>
                                    ) : (
                                        messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`mb-2 p-3 rounded-lg flex flex-col ${
                                                    msg.sender.toLowerCase() ===
                                                    user?.wallet?.address.toLowerCase()
                                                        ? 'bg-purple-600/50 ml-auto'
                                                        : 'bg-gray-700/50'
                                                } max-w-[70%]`}
                                            >
                                                <p className='font-semibold text-sm'>
                                                    {getMessageSenderName(
                                                        msg.sender
                                                    )}
                                                </p>
                                                <p>{msg.msg}</p>
                                                <p className='text-xs text-gray-400 mt-1'>
                                                    {new Date(
                                                        Number(msg.timestamp) *
                                                            1000
                                                    ).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                    <div ref={chatEndRef} />
                                </div>
                                <div className='flex gap-2'>
                                    <input
                                        type='text'
                                        value={newMessage}
                                        onChange={(e) =>
                                            setNewMessage(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                            e.key === 'Enter' && sendMessage()
                                        }
                                        placeholder='Type a message...'
                                        className='flex-1 bg-gray-700/50 text-white p-3 rounded-lg border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-purple-500'
                                        disabled={loading}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        className='bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-colors duration-200 flex items-center gap-2'
                                        disabled={loading || !newMessage.trim()}
                                    >
                                        <Send size={16} />
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className='flex-1 flex items-center justify-center'>
                                <p className='text-gray-400'>
                                    Select a friend to start chatting
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
