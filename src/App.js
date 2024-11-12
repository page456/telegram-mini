import React, { useState, useEffect } from 'react';
import AuthorizedPage from './components/AuthorizedPage';
import UnauthorizedPage from './components/UnauthorizedPage';

function App() {
  const [userId, setUserId] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    // Initialize Telegram Web App
    if (window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      // Fetch the Telegram user ID
      const telegramUserId = tg.initDataUnsafe?.user?.id;
      setUserId(telegramUserId);

      // Fetch authorized users JSON
      fetch('/users.json')
        .then((response) => response.json())
        .then((data) => {
          // Check if user ID is authorized
          setIsAuthorized(data.authorizedUsers.includes(telegramUserId));
        })
        .catch((error) => console.error('Error fetching authorized users:', error));
    } else {
      console.error('Telegram WebApp not initialized');
    }
  }, []);

  if (userId === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Check User Authorization</h1>
      {isAuthorized === null ? (
        <p>Checking authorization...</p>
      ) : isAuthorized ? (
        <AuthorizedPage />
      ) : (
        <UnauthorizedPage />
      )}
    </div>
  );
}

export default App;
