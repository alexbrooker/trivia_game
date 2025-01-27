import React from 'react';

export function Leaderboard({ onClose }) {
  const scores = JSON.parse(
    localStorage.getItem('aviationQuizScores') || '[]'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Top Pilots</h2>
        <div className="space-y-2">
          {scores.map((entry, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 bg-gray-100 rounded"
            >
              <div>
                <span className="font-bold">{index + 1}. </span>
                <span>{entry.username}</span>
              </div>
              <div className="font-mono">$ {entry.score}</div>
            </div>
          ))}
          {scores.length === 0 && (
            <p className="text-center text-gray-500">No scores yet!</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}