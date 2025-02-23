import { ethers } from 'ethers';
import { NadChatABI, NadChatAddress } from '@/Context/constants';

export const MONAD_TESTNET_CHAIN_ID = 10143;

export const getContract = (signer: ethers.Signer) => {
    return new ethers.Contract(NadChatAddress, NadChatABI, signer);
};

export const getProviderAndSigner = async () => {
    if (!window.ethereum) throw new Error('Ethereum wallet not detected');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Check if on Monad Testnet
    const network = await provider.getNetwork();
    const currentChainId = Number(network.chainId);
    if (currentChainId !== MONAD_TESTNET_CHAIN_ID) {
        throw new Error('Please switch to Monad Testnet (Chain ID: 10143)');
    }

    return { provider, signer };
};

// Function to switch to Monad Testnet
export const switchToMonadTestnet = async () => {
    if (!window.ethereum) throw new Error('Ethereum wallet not detected');
    const provider = new ethers.BrowserProvider(window.ethereum);
    try {
        await provider.send('wallet_switchEthereumChain', [
            { chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}` },
        ]);
    } catch (switchError: any) {
        if (switchError.code === 4902) {
            // Chain not added
            await provider.send('wallet_addEthereumChain', [
                {
                    chainId: `0x${MONAD_TESTNET_CHAIN_ID.toString(16)}`,
                    chainName: 'Monad Testnet',
                    rpcUrls: ['https://testnet-rpc.monad.xyz'],
                    nativeCurrency: {
                        name: 'Monad',
                        symbol: 'MON',
                        decimals: 18,
                    },
                    blockExplorerUrls: ['https://testnet.monadexplorer.com'],
                },
            ]);
        } else {
            throw switchError;
        }
    }
};
