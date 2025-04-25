import React from 'react';
import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('@/components/_login/loginForm'), { ssr: false });


const HomePage: React.FC = () => {
  return (
    <LoginForm></LoginForm>
  );
};

export default HomePage;
