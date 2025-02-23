// Contract address deployed to Monad Testnet using Remix
// 0x797BD798E2C96EBd66DE171BBf452D7ed38e1158 - NadChad Contract
export const NadChatAddress = '0x797BD798E2C96EBd66DE171BBf452D7ed38e1158';
export const NadChatABI = [
    {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'profileImage',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'isPublic',
                type: 'bool',
            },
        ],
        name: 'AccountCreated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'friend',
                type: 'address',
            },
        ],
        name: 'FriendAdded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'friend',
                type: 'address',
            },
        ],
        name: 'FriendRemoved',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'messageId',
                type: 'uint256',
            },
        ],
        name: 'MessageSent',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'friend',
                type: 'address',
            },
        ],
        name: 'MessagesDeleted',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'newName',
                type: 'string',
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'newProfileImage',
                type: 'string',
            },
        ],
        name: 'ProfileUpdated',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'friend_key',
                type: 'address',
            },
        ],
        name: 'addFriend',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'pubkey',
                type: 'address',
            },
        ],
        name: 'checkUserExists',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'profileImage',
                type: 'string',
            },
            {
                internalType: 'bool',
                name: 'isPublic',
                type: 'bool',
            },
        ],
        name: 'createAccount',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'friend_key',
                type: 'address',
            },
        ],
        name: 'deleteMessages',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'start',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'count',
                type: 'uint256',
            },
        ],
        name: 'getAllAppUser',
        outputs: [
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                    {
                        internalType: 'address',
                        name: 'accountAddress',
                        type: 'address',
                    },
                ],
                internalType: 'struct NadChat.AllUserStruct[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'start',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'count',
                type: 'uint256',
            },
        ],
        name: 'getMyFriendList',
        outputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'pubkey',
                        type: 'address',
                    },
                ],
                internalType: 'struct NadChat.Friend[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'pubkey',
                type: 'address',
            },
        ],
        name: 'getProfileImage',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'pubkey',
                type: 'address',
            },
        ],
        name: 'getUsername',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'pause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'paused',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'friend_key',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'start',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'count',
                type: 'uint256',
            },
        ],
        name: 'readMessage',
        outputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'sender',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'timestamp',
                        type: 'uint256',
                    },
                    {
                        internalType: 'string',
                        name: 'msg',
                        type: 'string',
                    },
                    {
                        internalType: 'bool',
                        name: 'deletedBySender',
                        type: 'bool',
                    },
                    {
                        internalType: 'bool',
                        name: 'deletedByReceiver',
                        type: 'bool',
                    },
                ],
                internalType: 'struct NadChat.Message[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'friend_key',
                type: 'address',
            },
        ],
        name: 'removeFriend',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'friend_key',
                type: 'address',
            },
            {
                internalType: 'string',
                name: '_msg',
                type: 'string',
            },
        ],
        name: 'sendMessage',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'unpause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'newName',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'newProfileImage',
                type: 'string',
            },
            {
                internalType: 'bool',
                name: 'isPublic',
                type: 'bool',
            },
        ],
        name: 'updateProfile',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
