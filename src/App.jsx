import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { MoneyPyramid } from "./data/MoneyPyramid";
import Trivia from "./components/Trivia";
import Timer from "./components/Timer";
import Start from "./components/Start";
import { Earned } from "./components/Earned";
import { ListOfAvQuestions } from './data/avquestions';

function App() {
  //username 
  const [userName, setUserName] = useState(null)
  //Question - setting the current question number
  const [questionNumber, setQuestionNumber] = useState(1);
  //state for setting stop for the game
  const [stop, setStop] = useState(false)
  //state for seeting amount earned
  const [earned, setEarned] = useState("0")
  //using useMemo hook to hold the money pyraid data
  const MoneyPyramidData = useMemo(() => MoneyPyramid, []);

  const [userEmail, setUserEmail] = useState(null)  // Add this line
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [hint, setHint] = useState("");
  
  async function handleAskForHelp() {
    setIsLoadingHint(true);
    try {
      const currentQuestion = ListOfAvQuestions[questionNumber - 1];
      const response = await fetch('https://api.groq.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [{
            role: 'user',
            content: `You are a helpful aviation expert. The user needs a hint for this question:
              
              Question: ${currentQuestion.question}
              Options: ${currentQuestion.options.join(', ')}
              
              Provide a brief, helpful hint that guides them toward the correct answer without directly revealing it. Keep the hint under 100 words.`
          }],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      setHint(data.choices[0].message.content);
    } catch (error) {
      console.error('Error getting hint:', error);
      setHint("Sorry, couldn't get a hint right now.");
    } finally {
      setIsLoadingHint(false);
    }
  }

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
              </>
            ) : (
              <>
                <div className="top">
                  <div className="flex items-center justify-between w-full gap-4">
                    <div className="timer">
                      <Timer setStop={setStop} questionNumber={questionNumber} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={handleAskForHelp}
                        disabled={isLoadingHint}
                        className="ai-help-button"
                      >
                        {isLoadingHint ? "Getting Hint..." : "Ask AI for Help"}
                      </button>
                      {hint && (
                        <div className="hint-container">
                          <p>{hint}</p>
                        </div>
                      )}
                    </div>
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
                <li className={questionNumber === money.id ? "moneyListItem active" : "moneyListItem"}>
                  <div className="flex">
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
                setUserEmail={setUserEmail}  
                userEmail={userEmail}        
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;