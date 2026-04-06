export default class Solana {
  // constructor is required, it is called when the app is loaded
  constructor(bp, options = {}) {
    this.bp = bp;
    this.options = options;
    return this;
  }

  // init is required, it is called when the app is opened or initialized
  async init() {
    await this.bp.load('https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js');
    await this.connectWallet();
    return 'loaded Hello World';
  }

  async connectWallet() {
    if (!window.solana || !window.solana.isPhantom) {
      alert('Please install Phantom Wallet');
      return;
    }

    if (this.solanConnected) {
      console.log('Phantom Wallet already connected');
      return;
    }

    console.log('Connecting to Phantom Wallet...');
    const resp = await window.solana.connect();
    const publicKey = resp.publicKey.toString();

    console.log('Wallet connected:', publicKey);
    this.solanConnected = true;
    return publicKey;
  }

  async checkBalance(publicKey) {
    console.log("Checking balance for:", publicKey);

    const { Connection, PublicKey } = window.solanaWeb3;

    const RPC = "https://mainnet.helius-rpc.com/?api-key=665b36ea-6969-4847-8872-0aa4f8bb3e2f";
    const TOKEN_MINT = "buZEcf51e2tD4goTbb9mFZ1567jpC6aYu7if1TTpump";

    try {

      const connection = new Connection(RPC, "confirmed");

      const owner = new PublicKey(publicKey);
      const mint = new PublicKey(TOKEN_MINT);
      console.log('created connection and public keys');
      console.log('getting tocken accounts for owner:', owner.toString(), 'and mint:', mint.toString());
      const tokenAccounts = await connection.getTokenAccountsByOwner(owner, {
        mint
      });
      console.log('token accounts:', tokenAccounts);

      if (tokenAccounts.value.length === 0) {
        console.log('No token accounts found for this mint');
        return 0;
      }

      const balanceInfo = await connection.getTokenAccountBalance(
        tokenAccounts.value[0].pubkey
      );

      console.log('balance info:', balanceInfo);

      return balanceInfo.value.uiAmount;

    } catch (err) {
      console.error("Balance check failed:", err);
      return 0;
    }
  }

  async getLoginChallenge(publicKey) {
    const res = await fetch('/api/web3/challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicKey }),
    });

    const data = await res.json();

    return data.message;
  }

  async signMessage(message) {
    const encoded = new TextEncoder().encode(message);

    const signed = await window.solana.signMessage(encoded, 'utf8');

    return signed.signature;
  }

  async verifyLogin(publicKey, message, signature) {
    const res = await fetch('/api/web3/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicKey,
        message,
        signature: Array.from(signature),
      }),
    });

    const data = await res.json();

    return data.success;
  }

  async web3Login() {
    console.log('Starting web3 login process...');
    const publicKey = await this.connectWallet();
    if (!publicKey) {
      return false;
    }

    console.log('Connected wallet with public key:', publicKey);
    const message = await this.getLoginChallenge(publicKey);
    const signature = await this.signMessage(message);
    const verified = await this.verifyLogin(publicKey, message, signature);
    console.log('Web3 login verification result:', verified);
    if (verified) {
      console.log('Web3 login successful');
    }

    return verified;
  }

  async open() {
    console.log('Solana app opened');

  }
}