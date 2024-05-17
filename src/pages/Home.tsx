import React from 'react';

const Profile: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Massa Web Wallet !</h1>
      <div className="mt-3">
        <h5>On Massa Web Wallet, you can :</h5>
        <div className="ms-3">
          <ul>
            <li><a href="/wallets">create wallets</a></li>
            <li><a href="/wallets">export wallets</a></li>
            <li><a href="/wallets">import wallets</a></li>
            <li><a href="/wallets">send transactions</a></li>
            <li><a>interact with smart contracts</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Profile;
