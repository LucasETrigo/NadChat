// components/AllUsers.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getContract, getProviderAndSigner } from '../lib/contract';
import toast from 'react-hot-toast';
import { UserPlus, User, Check } from 'lucide-react';

interface User {
    name: string;
    accountAddress: string;
    profileImage: string;
}

interface Friend {
    pubkey: string;
}

export default function AllUsers() {
    const { ready, authenticated, user } = usePrivy();
    const [users, setUsers] = useState<User[]>([]);
    const [friends, setFriends] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [manualAddress, setManualAddress] = useState('');

    const fetchUsersAndFriends = async () => {
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

            const userList = await contract.getAllAppUser(0, 50);
            const usersWithDetails = await Promise.all(
                userList.map(
                    async (u: { name: string; accountAddress: string }) => {
                        const profileImage = await contract.getProfileImage(
                            u.accountAddress
                        );
                        console.log(
                            'Profile image for',
                            u.accountAddress,
                            ':',
                            profileImage
                        );
                        return {
                            name: u.name,
                            accountAddress: u.accountAddress,
                            profileImage: profileImage
                                ? profileImage.replace(
                                      'ipfs://',
                                      'https://ipfs.io/ipfs/'
                                  )
                                : '',
                        };
                    }
                )
            );
            const recentUsers = usersWithDetails
                .reverse()
                .slice(0, 10)
                .filter(
                    (u: User) =>
                        u.accountAddress.toLowerCase() !==
                        user.wallet.address.toLowerCase()
                );
            setUsers(recentUsers);

            const friendList: Friend[] = await contract.getMyFriendList(0, 50);
            setFriends(friendList.map((f) => f.pubkey.toLowerCase()));
        } catch (error) {
            console.error('Error fetching users or friends:', error);
            toast.error(
                'Failed to load data: ' + (error.message || 'Unknown error')
            );
        } finally {
            setLoading(false);
        }
    };

    const addFriend = async (friendAddress: string) => {
        if (!authenticated || !user?.wallet?.address) return;
        setLoading(true);
        try {
            const { signer } = await getProviderAndSigner();
            const contract = getContract(signer);
            const tx = await contract.addFriend(friendAddress);
            await tx.wait();
            toast.success(`Added ${friendAddress.slice(0, 6)}... as a friend!`);
            setFriends((prev) => [...prev, friendAddress.toLowerCase()]);
            setManualAddress('');
        } catch (error) {
            console.error('Error adding friend:', error);
            toast.error(
                'Failed to add friend: ' + (error.message || 'Unknown error')
            );
        } finally {
            setLoading(false);
        }
    };

    const handleManualAdd = () => {
        if (!manualAddress || !/^0x[a-fA-F0-9]{40}$/.test(manualAddress)) {
            toast.error('Please enter a valid Ethereum address (e.g., 0x...)');
            return;
        }
        addFriend(manualAddress);
    };

    useEffect(() => {
        if (ready && authenticated && user?.wallet?.address) {
            fetchUsersAndFriends();
        }
    }, [ready, authenticated, user]);

    if (!ready) return <div className='p-4 text-white'>Loading...</div>;

    if (!authenticated) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center'>
                <div className='text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700/30'>
                    <h2 className='text-2xl font-bold text-gray-300 mb-4'>
                        You have to Login first to view this page
                    </h2>
                    <p className='text-gray-400'>
                        Please connect your wallet to access the All Users page.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 flex flex-col pt-36'>
            <h1 className='text-3xl font-bold mb-6'></h1>
            <div className='mb-4 flex gap-2'>
                <input
                    type='text'
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="Enter friend's address (e.g., 0x...)"
                    className='flex-1 bg-gray-700/50 text-white p-3 rounded-lg border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
                <button
                    onClick={handleManualAdd}
                    className='bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2'
                    disabled={loading || !manualAddress}
                >
                    <UserPlus size={16} />
                    Add
                </button>
            </div>
            <div className='bg-gray-800/50 rounded-xl p-4 pt-6 border border-gray-700/30 h-[50vh] overflow-y-auto custom-scrollbar'>
                {loading ? (
                    <p>Loading users...</p>
                ) : users.length === 0 ? (
                    <p className='text-gray-400'>
                        No public users found. Use the input above to add a
                        friend by address.
                    </p>
                ) : (
                    <ul className='space-y-4'>
                        {users.map((user) => (
                            <li
                                key={user.accountAddress}
                                className='flex justify-between items-center p-3 bg-gray-700/50 rounded-lg'
                            >
                                <div className='flex items-center gap-2'>
                                    {user.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={`${user.name}'s avatar`}
                                            className='w-8 h-8 rounded-full object-cover'
                                            onError={(e) => {
                                                console.log(
                                                    'Image failed to load:',
                                                    user.profileImage
                                                );
                                                e.currentTarget.src =
                                                    '/default-avatar.png';
                                            }}
                                        />
                                    ) : (
                                        <User
                                            size={32}
                                            className='text-gray-400'
                                        />
                                    )}
                                    <div>
                                        <p className='font-semibold'>
                                            {user.name}
                                        </p>
                                        <p className='text-sm text-gray-400'>
                                            {user.accountAddress.slice(0, 6)}...
                                            {user.accountAddress.slice(-4)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        addFriend(user.accountAddress)
                                    }
                                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors duration-200 ${
                                        friends.includes(
                                            user.accountAddress.toLowerCase()
                                        )
                                            ? 'bg-green-600/50 text-white cursor-default'
                                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                                    }`}
                                    disabled={
                                        loading ||
                                        friends.includes(
                                            user.accountAddress.toLowerCase()
                                        )
                                    }
                                >
                                    {friends.includes(
                                        user.accountAddress.toLowerCase()
                                    ) ? (
                                        <>
                                            <Check size={16} />
                                            Added
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={16} />
                                            Add Friend
                                        </>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
