import React, { useEffect } from 'react';
import Board from '../components/Board';
import { useHistory, useParams } from 'react-router';

const Home: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const history = useHistory();

  useEffect(() => {
    const randomHash = Math.random().toString(36).substring(3, 9);
    if (!hash) history.push(`/${randomHash}`);
  }, []);

  return <div className="container h-100">{!!hash && <Board />}</div>;
};

export default Home;
