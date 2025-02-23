import { ethers } from 'hardhat';

async function main() {
    const NadChat = await ethers.getContractFactory('NadChat');
    const nadChat = await NadChat.deploy();
    await nadChat.waitForDeployment();
    console.log('NadChat deployed to:', nadChat.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
