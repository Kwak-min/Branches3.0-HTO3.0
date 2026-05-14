import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Loading from './components/public/Loading';

const App: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  );
};

export default App;
