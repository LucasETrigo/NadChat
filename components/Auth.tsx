// components/Auth.tsx
import React, { useState, useEffect, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
    getContract,
    getProviderAndSigner,
    switchToMonadTestnet,
} from '../lib/contract';
import { Transition } from '@headlessui/react';
import { UserCircle, Edit, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUser } from '../Context/UserContext';
import {
    SwitchNetworkModal,
    CreateAccountModal,
    UpdateProfileModal,
} from './modals';

export default function Auth() {
    const { ready, authenticated, user, login, logout } = usePrivy();
    const { userProfile, setUserProfile } = useUser();
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [userExists, setUserExists] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSwitchNetworkModalOpen, setIsSwitchNetworkModalOpen] =
        useState(false);
    const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
        useState(false);
    const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] =
        useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const [lastCheckedAddress, setLastCheckedAddress] = useState<string | null>(
        null
    ); // Track last checked address

    const checkChainAndUser = async (address: string) => {
        try {
            const { provider, signer } = await getProviderAndSigner();
            const network = await provider.getNetwork();
            const currentChainId = Number(network.chainId);

            if (currentChainId !== 10143) {
                setIsSwitchNetworkModalOpen(true);
                setIsCreateAccountModalOpen(false);
                setIsUserMenuOpen(false);
                return;
            }

            const contract = getContract(signer);
            const exists = await contract.checkUserExists(address);
            setUserExists(exists);
            setLastCheckedAddress(address); // Update last checked address

            if (exists) {
                const profileImg = await contract.getProfileImage(address);
                const name = await contract.getUsername(address);
                setUserProfile({ profileImage: profileImg, displayName: name });
                setIsCreateAccountModalOpen(false);
                setIsSwitchNetworkModalOpen(false);
                setIsUserMenuOpen(false);
            } else {
                setUserProfile({ profileImage: '', displayName: '' });
                setIsCreateAccountModalOpen(true);
                setIsSwitchNetworkModalOpen(false);
                setIsUserMenuOpen(false);
            }
        } catch (error: any) {
            console.error('Error checking chain or user:', error);
            if (error.message.includes('Please switch to Monad Testnet')) {
                setIsSwitchNetworkModalOpen(true);
                setIsCreateAccountModalOpen(false);
                setIsUserMenuOpen(false);
            }
        }
    };

    useEffect(() => {
        if (!ready) return;

        if (
            authenticated &&
            user?.wallet?.address &&
            user.wallet.address !== lastCheckedAddress
        ) {
            // Run check for initial login or address change
            checkChainAndUser(user.wallet.address);
        } else if (!authenticated) {
            // Reset all states when unauthenticated
            setIsSwitchNetworkModalOpen(false);
            setIsCreateAccountModalOpen(false);
            setIsUpdateProfileModalOpen(false);
            setIsUserMenuOpen(false);
            setUserExists(false);
            setUserProfile({ profileImage: '', displayName: '' });
            setLastCheckedAddress(null);
        }

        const handleAccountsChanged = async (accounts: string[]) => {
            if (accounts.length > 0 && accounts[0] !== user?.wallet?.address) {
                setIsSwitchNetworkModalOpen(false);
                setIsCreateAccountModalOpen(false);
                setIsUpdateProfileModalOpen(false);
                setIsUserMenuOpen(false);
                setUserExists(false);
                setUserProfile({ profileImage: '', displayName: '' });
                await logout();
                // Let Privy re-authenticate; useEffect will handle the new address
            } else if (accounts.length === 0) {
                setIsSwitchNetworkModalOpen(false);
                setIsCreateAccountModalOpen(false);
                setIsUpdateProfileModalOpen(false);
                setIsUserMenuOpen(false);
                setUserExists(false);
                setUserProfile({ profileImage: '', displayName: '' });
                setLastCheckedAddress(null);
                await logout();
            }
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener(
                    'accountsChanged',
                    handleAccountsChanged
                );
            }
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [
        ready,
        authenticated,
        user,
        login,
        logout,
        setUserProfile,
        lastCheckedAddress,
    ]);

    const handleSwitchNetwork = async () => {
        setLoading(true);
        try {
            await switchToMonadTestnet();
            if (user?.wallet?.address) {
                await checkChainAndUser(user.wallet.address);
            }
        } catch (error) {
            console.error('Switch failed:', error);
            toast.error(
                'Failed to switch network: ' +
                    (error.message || 'Unknown error'),
                {
                    style: {
                        background:
                            'linear-gradient(to right, #ef4444, #f87171)',
                        color: '#ffffff',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        maxWidth: '400px',
                        wordBreak: 'break-word',
                        fontSize: '14px',
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = async () => {
        if (!username) return toast.error('Please enter a username');
        setLoading(true);
        try {
            let imageHash = '';
            if (profileImage) {
                const formData = new FormData();
                formData.append('file', profileImage);
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok)
                    throw new Error('Failed to upload image to Pinata');
                const data = await response.json();
                imageHash = data.ipfsHash;
            }

            const { signer } = await getProviderAndSigner();
            const contract = getContract(signer);
            const tx = await contract.createAccount(username, imageHash, true);
            await tx.wait();
            toast.success('Account created successfully!', {
                style: {
                    background: 'linear-gradient(to right, #6b48ff, #8b5cf6)',
                    color: '#ffffff',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                    maxWidth: '400px',
                    wordBreak: 'break-word',
                    fontSize: '14px',
                },
                iconTheme: { primary: '#ffffff', secondary: '#6b48ff' },
            });

            setUsername('');
            setProfileImage(null);
            setUserProfile({
                profileImage: imageHash || userProfile.profileImage,
                displayName: username,
            });
            setIsCreateAccountModalOpen(false);
            setUserExists(true);
        } catch (error) {
            console.error('Detailed error:', error);
            toast.error(
                'Failed to create account: ' +
                    (error.message || 'Unknown error'),
                {
                    style: {
                        background:
                            'linear-gradient(to right, #ef4444, #f87171)',
                        color: '#ffffff',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        maxWidth: '400px',
                        wordBreak: 'break-word',
                        fontSize: '14px',
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!username) return toast.error('Please enter a username');
        setLoading(true);
        try {
            let imageHash = '';
            if (profileImage) {
                const formData = new FormData();
                formData.append('file', profileImage);
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok)
                    throw new Error('Failed to upload image to Pinata');
                const data = await response.json();
                imageHash = data.ipfsHash;
            }

            const { signer } = await getProviderAndSigner();
            const contract = getContract(signer);
            const tx = await contract.updateProfile(username, imageHash, true);
            await tx.wait();
            toast.success('Profile updated successfully!', {
                style: {
                    background: 'linear-gradient(to right, #6b48ff, #8b5cf6)',
                    color: '#ffffff',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                    maxWidth: '400px',
                    wordBreak: 'break-word',
                    fontSize: '14px',
                },
                iconTheme: { primary: '#ffffff', secondary: '#6b48ff' },
            });

            setUsername('');
            setProfileImage(null);
            setUserProfile({
                profileImage: imageHash || userProfile.profileImage,
                displayName: username,
            });
            setIsUpdateProfileModalOpen(false);
        } catch (error) {
            console.error('Detailed error:', error);
            toast.error(
                'Failed to update profile: ' +
                    (error.message || 'Unknown error'),
                {
                    style: {
                        background:
                            'linear-gradient(to right, #ef4444, #f87171)',
                        color: '#ffffff',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        maxWidth: '400px',
                        wordBreak: 'break-word',
                        fontSize: '14px',
                    },
                }
            );
        } finally {
            setLoading(false);
        }
    };

    const handleProfileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!userExists) return;
        if (isUserMenuOpen) {
            setIsUserMenuOpen(false);
        } else {
            setIsUserMenuOpen(true);
        }
    };

    if (!ready) return <div className='p-4 text-white'>Loading...</div>;

    return (
        <div className='p-4 relative'>
            {!authenticated ? (
                <button
                    onClick={login}
                    className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200'
                >
                    Connect Wallet
                </button>
            ) : (
                <div className='relative'>
                    <button
                        onClick={handleProfileClick}
                        className={`flex items-center gap-2 focus:outline-none group ${
                            !userExists ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                        disabled={!userExists}
                    >
                        {userProfile.profileImage ? (
                            <img
                                src={userProfile.profileImage.replace(
                                    'ipfs://',
                                    'https://ipfs.io/ipfs/'
                                )}
                                alt='Profile'
                                className='w-8 h-8 rounded-full object-cover group-hover:ring-2 group-hover:ring-purple-500 transition-all duration-200'
                            />
                        ) : (
                            <UserCircle className='w-8 h-8 text-gray-300 group-hover:text-purple-400 transition-colors duration-200' />
                        )}
                        <p className='text-gray-300 group-hover:text-white transition-colors duration-200'>
                            {userProfile.displayName ||
                                user?.wallet?.address.slice(0, 6) + '...'}
                        </p>
                    </button>

                    <Transition
                        show={isUserMenuOpen}
                        enter='transition ease-out duration-200'
                        enterFrom='opacity-0 scale-95'
                        enterTo='opacity-100 scale-100'
                        leave='transition ease-in duration-150'
                        leaveFrom='opacity-100 scale-100'
                        leaveTo='opacity-0 scale-95'
                    >
                        <div
                            ref={userMenuRef}
                            className='absolute right-0 mt-2 w-48 rounded-xl bg-gradient-to-br from-[#181123] to-[#2a1b3d] border border-gray-700/50 shadow-xl shadow-purple-900/20 p-4 z-50'
                        >
                            <div className='flex flex-col gap-2'>
                                <button
                                    onClick={() => {
                                        setUsername(userProfile.displayName);
                                        setProfileImage(null);
                                        setIsUpdateProfileModalOpen(true);
                                        setIsUserMenuOpen(false);
                                    }}
                                    className='flex items-center gap-2 w-full text-left bg-purple-600/20 hover:bg-purple-600/40 text-white py-2 px-3 rounded-lg transition-all duration-200 hover:shadow-md'
                                >
                                    <Edit size={16} />
                                    <span>Edit Profile</span>
                                </button>
                                <button
                                    onClick={logout}
                                    className='flex items-center gap-2 w-full text-left bg-red-500/20 hover:bg-red-500/40 text-white py-2 px-3 rounded-lg transition-all duration-200 hover:shadow-md'
                                >
                                    <LogOut size={16} />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>
            )}

            <SwitchNetworkModal
                isOpen={isSwitchNetworkModalOpen}
                onClose={() => setIsSwitchNetworkModalOpen(false)}
                onSwitch={handleSwitchNetwork}
                loading={loading}
            />

            <CreateAccountModal
                isOpen={isCreateAccountModalOpen}
                onClose={() => {}}
                onCreate={handleCreateAccount}
                username={username}
                setUsername={setUsername}
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                loading={loading}
            />

            <UpdateProfileModal
                isOpen={isUpdateProfileModalOpen}
                onClose={() => setIsUpdateProfileModalOpen(false)}
                onUpdate={handleUpdateProfile}
                username={username}
                setUsername={setUsername}
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                loading={loading}
            />
        </div>
    );
}
