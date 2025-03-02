// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NadChat {
    // Events for frontend tracking
    event AccountCreated(address indexed user, string name, string profileImage, bool isPublic);
    event FriendAdded(address indexed user, address indexed friend);
    event FriendRemoved(address indexed user, address indexed friend);
    event MessageSent(address indexed sender, address indexed receiver, uint256 timestamp, uint256 messageId);
    event ProfileUpdated(address indexed user, string newName, string newProfileImage);
    event MessagesDeleted(address indexed user, address indexed friend);

    struct Friend {
        address pubkey;
    }

    struct User {
        string name;
        string profileImage;
        Friend[] friendList;
        bool isPublic;
        bool exists;
    }

    struct Message {
        address sender;
        uint256 timestamp;
        string msg;
        bool deletedBySender;
        bool deletedByReceiver;
    }

    struct AllUserStruct {
        string name;
        address accountAddress;
    }

    address public owner;
    bool public paused;
    mapping(address => User) private userList;
    mapping(bytes32 => mapping(uint256 => Message)) private allMessages; // Chat ID -> Message ID -> Message
    mapping(bytes32 => uint256) private messageCount; // Tracks number of messages per chat
    mapping(address => mapping(address => bool)) private isFriend;
    address[] private registeredUsers; // Tracks all registered users for dynamic filtering
    uint256 constant MAX_FRIENDS = 100;
    uint256 constant MAX_MESSAGES_PER_CHAT = 1000;
    uint256 constant MAX_MESSAGE_LENGTH = 500;
    uint256 constant MAX_RETURN_COUNT = 50; // Limit for pagination returns

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyRegistered() {
        require(checkUserExists(msg.sender), "Create an account first");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function pause() external onlyOwner {
        paused = true;
    }

    function unpause() external onlyOwner {
        paused = false;
    }

    function checkUserExists(address pubkey) public view returns (bool) {
        return userList[pubkey].exists;
    }

    function createAccount(string calldata name, string calldata profileImage, bool isPublic) 
        external 
        whenNotPaused 
    {
        require(!checkUserExists(msg.sender), "User already exists");
        require(bytes(name).length > 0, "Username cannot be empty");

        User storage newUser = userList[msg.sender];
        newUser.name = name;
        newUser.profileImage = profileImage;
        newUser.isPublic = isPublic;
        newUser.exists = true;

        registeredUsers.push(msg.sender);

        emit AccountCreated(msg.sender, name, profileImage, isPublic);
    }

    function updateProfile(string calldata newName, string calldata newProfileImage, bool isPublic) 
        external 
        onlyRegistered 
        whenNotPaused 
    {
        require(bytes(newName).length > 0, "Username cannot be empty");

        User storage user = userList[msg.sender];
        user.name = newName;
        user.profileImage = newProfileImage;
        user.isPublic = isPublic;

        emit ProfileUpdated(msg.sender, newName, newProfileImage);
    }

    function getUsername(address pubkey) external view returns (string memory) {
        require(checkUserExists(pubkey), "User is not registered");
        return userList[pubkey].name;
    }

    function getProfileImage(address pubkey) external view returns (string memory) {
        require(checkUserExists(pubkey), "User is not registered");
        return userList[pubkey].profileImage;
    }

    function addFriend(address friend_key) 
        external 
        onlyRegistered 
        whenNotPaused 
    {
        require(checkUserExists(friend_key), "Friend is not registered");
        require(msg.sender != friend_key, "Cannot add yourself");
        require(!isFriend[msg.sender][friend_key], "Already friends");
        require(userList[msg.sender].friendList.length < MAX_FRIENDS, "Friend list full");

        userList[msg.sender].friendList.push(Friend(friend_key));
        userList[friend_key].friendList.push(Friend(msg.sender));
        isFriend[msg.sender][friend_key] = true;
        isFriend[friend_key][msg.sender] = true;

        emit FriendAdded(msg.sender, friend_key);
    }

    function removeFriend(address friend_key) 
        external 
        onlyRegistered 
        whenNotPaused 
    {
        require(isFriend[msg.sender][friend_key], "Not friends");

        Friend[] storage myFriends = userList[msg.sender].friendList;
        for (uint256 i = 0; i < myFriends.length; i++) {
            if (myFriends[i].pubkey == friend_key) {
                myFriends[i] = myFriends[myFriends.length - 1];
                myFriends.pop();
                break;
            }
        }

        Friend[] storage theirFriends = userList[friend_key].friendList;
        for (uint256 i = 0; i < theirFriends.length; i++) {
            if (theirFriends[i].pubkey == msg.sender) {
                theirFriends[i] = theirFriends[theirFriends.length - 1];
                theirFriends.pop();
                break;
            }
        }

        isFriend[msg.sender][friend_key] = false;
        isFriend[friend_key][msg.sender] = false;

        emit FriendRemoved(msg.sender, friend_key);
    }

    function getMyFriendList(uint256 start, uint256 count) 
        external 
        view 
        onlyRegistered 
        returns (Friend[] memory) 
    {
        Friend[] memory friends = userList[msg.sender].friendList;
        require(start < friends.length, "Start index out of bounds");
        require(count <= MAX_RETURN_COUNT, "Count exceeds maximum return limit");
        uint256 end = start + count > friends.length ? friends.length : start + count;
        Friend[] memory result = new Friend[](end - start);
        for (uint256 i = start; i < end; i++) {
            result[i - start] = friends[i];
        }
        return result;
    }

    function _getChatCode(address pubkey1, address pubkey2) internal pure returns (bytes32) {
        return pubkey1 < pubkey2 ? keccak256(abi.encodePacked(pubkey1, pubkey2)) : keccak256(abi.encodePacked(pubkey2, pubkey1));
    }

    function sendMessage(address friend_key, string calldata _msg) 
        external 
        onlyRegistered 
        whenNotPaused 
    {
        require(checkUserExists(friend_key), "Friend is not registered");
        require(isFriend[msg.sender][friend_key], "Not friends");
        require(bytes(_msg).length > 0, "Message cannot be empty");
        require(bytes(_msg).length <= MAX_MESSAGE_LENGTH, "Message too long");

        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        require(messageCount[chatCode] < MAX_MESSAGES_PER_CHAT, "Chat message limit reached");

        uint256 messageId = messageCount[chatCode]++;
        allMessages[chatCode][messageId] = Message({
            sender: msg.sender,
            timestamp: block.timestamp,
            msg: _msg,
            deletedBySender: false,
            deletedByReceiver: false
        });

        emit MessageSent(msg.sender, friend_key, block.timestamp, messageId);
    }

    function readMessage(address friend_key, uint256 start, uint256 count) 
        external 
        view 
        onlyRegistered 
        returns (Message[] memory) 
    {
        require(isFriend[msg.sender][friend_key], "Not friends");
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        uint256 totalMessages = messageCount[chatCode];
        require(start < totalMessages, "Start index out of bounds");
        require(count <= MAX_RETURN_COUNT, "Count exceeds maximum return limit");

        uint256 end = start + count > totalMessages ? totalMessages : start + count;
        Message[] memory temp = new Message[](end - start);
        uint256 validCount = 0;

        for (uint256 i = start; i < end; i++) {
            Message memory chatMsg = allMessages[chatCode][i]; // Renamed to chatMsg
            if ((chatMsg.sender == msg.sender && !chatMsg.deletedBySender) || 
                (chatMsg.sender == friend_key && !chatMsg.deletedByReceiver)) {
                temp[validCount] = chatMsg;
                validCount++;
            }
        }

        Message[] memory result = new Message[](validCount);
        for (uint256 i = 0; i < validCount; i++) {
            result[i] = temp[i];
        }
        return result;
    }

    function deleteMessages(address friend_key) 
        external 
        onlyRegistered 
        whenNotPaused 
    {
        require(isFriend[msg.sender][friend_key], "Not friends");
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        
        for (uint256 i = 0; i < messageCount[chatCode]; i++) {
            Message storage chatMsg = allMessages[chatCode][i]; // Renamed to chatMsg
            if (chatMsg.sender == msg.sender) { // Correct check for sender
                chatMsg.deletedBySender = true;
            } else { // Message sent by friend_key (received by msg.sender)
                chatMsg.deletedByReceiver = true;
            }
        }

        emit MessagesDeleted(msg.sender, friend_key);
    }

    function getAllAppUser(uint256 start, uint256 count) 
        external 
        view 
        onlyOwner 
        returns (AllUserStruct[] memory) 
    {
        require(start < registeredUsers.length, "Start index out of bounds");
        require(count <= MAX_RETURN_COUNT, "Count exceeds maximum return limit");
        uint256 end = start + count > registeredUsers.length ? registeredUsers.length : start + count;

        AllUserStruct[] memory result = new AllUserStruct[](end - start);
        uint256 validCount = 0;

        for (uint256 i = start; i < end && validCount < count; i++) {
            address userAddr = registeredUsers[i];
            if (userList[userAddr].isPublic) {
                result[validCount] = AllUserStruct(userList[userAddr].name, userAddr);
                validCount++;
            }
        }

        assembly {
            mstore(result, validCount)
        }
        return result;
    }
}