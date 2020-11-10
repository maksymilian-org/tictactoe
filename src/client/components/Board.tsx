import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import io from 'socket.io-client';
import Square from './Square';
import './Board.scss';

const Board: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const [state, setState] = useState({
    values: ['', '', '', '', '', '', '', '', ''],
    turn: 'o',
    winner: '',
    winnerSquares: [-1],
    result: [0, 0],
    players: [undefined, undefined]
  });

  const socket = useMemo(() => io.connect('http://localhost:8080'), []);

  const [player, setPlayer] = useState(undefined);

  useEffect(() => {
    socket.on('connect', () => {
      setPlayer(socket.id);
    });
    socket.on('update', (data) => {
      setState(data);
    });
  }, []);

  const setNewRound = () => {
    socket.emit('clear', hash);
  };

  const handleClick = (id) => {
    const yourSign = state.players[0] === player ? 'o' : state.players[1] === player ? 'x' : '';
    !state.winner && yourSign === state.turn && socket.emit('move', { id, hash });
  };

  return (
    <>
      <div className="row align-items-center justify-content-center m-auto h-100" style={{ maxWidth: 300 }}>
        <div className="col">
          <div className="row text-center">
            <div
              className={`col-4 rounded px-1 border${state.turn === 'o' ? ' border-primary' : ''}${
                state.winner === 'o' ? ' bg-success text-white' : ''
              }`}
            >
              <p className="my-2">
                {state.players[0] === player ? 'You ' : 'Rival'} O{' '}
                <span className={`status ${state.players[0] ? '' : 'in'}active`} />
              </p>
            </div>
            <div className="col-2">
              <p className="my-2">{state.result[0]}</p>
            </div>
            <div className="col-2">
              <p className="my-2">{state.result[1]}</p>
            </div>
            <div
              className={`col-4 rounded px-1 border${state.turn === 'x' ? ' border-primary' : ''}${
                state.winner === 'x' ? ' bg-success' : ''
              }`}
            >
              <p className="my-2">
                {state.players[1] === player ? 'You ' : 'Rival'} X{' '}
                <span className={`status ${state.players[1] ? '' : 'in'}active`} />
              </p>
            </div>
            <div className="col-12 border-bottom mt-4"></div>
          </div>
          <div className="row row-cols-3">
            {[...Array(9)].map((v, i) => (
              <Square
                key={i}
                id={i}
                handleClick={handleClick}
                value={state.values[i]}
                isWinnerSquare={state.winnerSquares.includes(i)}
              />
            ))}
            <div className="col-12 mt-4">
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
                disabled={state.winner ? undefined : true}
                onClick={setNewRound}
              >
                New round
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
