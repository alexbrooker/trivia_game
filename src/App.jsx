import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { MoneyPyramid } from "./data/MoneyPyramid";
import Trivia from "./components/Trivia";
import Timer from "./components/Timer";
import Start from "./components/Start";
import { Earned } from "./components/Earned";
import { ListOfAvQuestions } from './data/avquestions';
import { Leaderboard } from "./components/Leaderboard";

function App() {
  //username 
  const [userName, setUserName] = useState(null)
  //Question - setting the current question number
  const [questionNumber, setQuestionNumber] = useState(1);
  //state for setting stop for the game
  const [stop, setStop] = useState(false)
  //state for seeting amount earned
  const [earned, setEarned] = useState("0")
  //state for showing leaderboard
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  //using useMemo hook to hold the money pyraid data
  const MoneyPyramidData = useMemo(() => MoneyPyramid, []);

  const [userEmail, setUserEmail] = useState(null)  // Add this line

  const handleGameComplete = () => {
    try {
      const scoreData = {
        username: userName,
        email: userEmail,  // Add this line
        score: earned,
        timestamp: new Date().toISOString()
      };
      
      const existingScores = JSON.parse(localStorage.getItem('aviationQuizScores') || '[]');
      const updatedScores = [...existingScores, scoreData]
        .sort((a, b) => Number(b.score) - Number(a.score))
        .slice(0, 10); // Keep top 10 scores
      
      localStorage.setItem('aviationQuizScores', JSON.stringify(updatedScores));
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  useEffect(() => {
    if (stop) {
      handleGameComplete();
    }
  }, [stop]);

  useEffect(() => {
    //If the length of the list of questions is not equal to questionNumber, set the Earned amount to the amount that matches the questionNumber - 1 and id of the moneypyraid data. Else If the length of the list of questions is not equal, set the Earned amount to the amount that matches the questionNumber and id of the moneypyraid data
    if (ListOfAvQuestions.length !== questionNumber) {
      questionNumber > 1 && setEarned(MoneyPyramid.find((m) => m.id === questionNumber - 1).amount)
    } else {
      questionNumber > 1 && setEarned(MoneyPyramid.find((m) => m.id === questionNumber).amount)
    }
  }, [questionNumber])

  //formatting amount
  const convert = (num) => {
    const localeString = new Intl.NumberFormat("en-US").format(num);
    return localeString;
  };

  return (
    <div className="app">
      {userName ? (
        <>
          <div className="main">
            {stop ? (
              <>
                <Earned 
                  earned={earned}
                  setUserName={setUserName}
                  userName={userName}
                  setStop={setStop}
                  setQuestionNumber={setQuestionNumber}
                  setEarned={setEarned}
                />
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setShowLeaderboard(true)}
                >
                  View Leaderboard
                </button>
              </>
            ) : (
              <>
                <div className="top">
                  <div className="timer">
                    <Timer setStop={setStop} questionNumber={questionNumber} />
                  </div>
                </div>
                <div className="bottom">
                  <Trivia 
                    setStop={setStop} 
                    setQuestionNumber={setQuestionNumber} 
                    questionNumber={questionNumber} 
                  />
                </div>
              </>
            )}
          </div>
          <div className="pyramid">
            <ul className="moneyList">
              {MoneyPyramidData.map((money) => (
                <li 
                  key={money.id}
                  className={questionNumber === money.id ? "moneyListItem active" : "moneyListItem"}
                >
                  <div className="flex items-center">
                    <span className="moneyListItemNumber">{money.id}</span>
                    <span>{money.rank}</span>
                  </div>
                  <span className="moneyListItemAmount">
                    $ {convert(money.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="start">
          <div className="content">
            <div className="start-container">
              <Start 
                setUserName={setUserName}
                userName={userName}
                setUserEmail={setUserEmail}  // Add this line
                userEmail={userEmail}        // Add this line
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;