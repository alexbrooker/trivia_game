import React from 'react';

export function Leaderboard() {
  const scores = JSON.parse(
    localStorage.getItem('aviationQuizScores') || '[]'
  );

  return (
    <div className="leaderboard-wrapper">
      <h2 className="text-2xl font-bold mb-4 text-white">Top Pilots</h2>
      <div className="scores-container">
        {scores.map((entry, index) => (
          <div
            key={index}
            className="score-item"
          >
            <div>
              <span className="rank">{index + 1}. </span>
              <span className="username">{entry.username}</span>
            </div>
            <div className="score">$ {entry.score}</div>
          </div>
        ))}
        {scores.length === 0 && (
          <p className="no-scores">No scores yet!</p>
        )}
      </div>
    </div>
  );
}