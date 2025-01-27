import React from 'react';

export function Leaderboard() {
  const scores = JSON.parse(
    localStorage.getItem('aviationQuizScores') || '[]'
  );

  return (
    <div className="leaderboard-wrapper">
      <h2 className="text-2xl font-bold mb-4 text-white">Top Pilots</h2>
      <div className="scores-container">
        {/* Column Headers */}
        <div className="score-item">
          <div className="rank">Rank</div>
          <div className="username">Callsign</div>
          <div className="score">Flight Hours</div>
        </div>

        {/* Score Items */}
        {scores.map((entry, index) => (
          <div key={index} className="score-item">
            <div className="rank">{index + 1}</div>
            <div className="username">{entry.username}</div>
            <div className="score">{entry.score}</div>
          </div>
        ))}
        
        {scores.length === 0 && (
          <p className="text-center text-white">No scores yet!</p>
        )}
      </div>
    </div>
  );
}