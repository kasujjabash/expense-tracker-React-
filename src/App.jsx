import { SignedOut, SignedIn, SignInButton, SignOutButton, UserButton, SignUpButton } from '@clerk/clerk-react';
import React from 'react';
import AppLayout from './AppLayout';
import SignupForm from './SignupForm';

function App() {
  return (
    <>
      <header>
        <SignupForm />
        <SignedIn>
          <UserButton />
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
      </header>
      <AppLayout />
    </>
  );
}

export default App;
