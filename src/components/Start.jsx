import React, { useRef, useState } from 'react'
import { GithubLogo } from "phosphor-react"
import useSound from "use-sound";
import game from "../assets/main.mp3";
import { Leaderboard } from './Leaderboard';

// ... existing imports ...

export default function Start({ setUserName, userName }) {
    const [error, setError] = useState(false);
    const inputRef = useRef();
    const emailRef = useRef();
    const [hasConsent, setHasConsent] = useState(false);

    const [playGame, { stop }] = useSound(game);

    const handleClick = () => {
        if (inputRef.current.value === "" || emailRef.current.value === "") {
            setError(true);
        } else if (!hasConsent) {
            setError(true);
        } else {
            stop()
            setUserName(inputRef.current.value);
        }
    }

    return (
        <div className='start'>
            <div className="content">
                <div className="github">
                    <a href="https://github.com/alexbrooker" target='_blank' rel='noreferrer'>
                        <GithubLogo size={25} />
                    </a>
                </div>
                <div className="start-container">
                    <div className="wrapper">
                        <h1 className="text-2xl font-bold mb-8 text-white">Sign In To Start</h1>
                        <div>
                            <input 
                                type="text" 
                                placeholder='Enter Callsign' //todo selfie generated callsign
                                className='startInput' 
                                ref={inputRef} 
                                onFocus={() => playGame()} 
                            />
                            <div style={{ marginTop: '20px' }}>
                                <input 
                                    type="email" 
                                    placeholder='Enter Your Email' 
                                    className='startInput' 
                                    ref={emailRef} 
                                />
                            </div>
                            <div style={{ marginTop: '20px' }} className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    checked={hasConsent}
                                    onChange={(e) => setHasConsent(e.target.checked)}
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                                <label htmlFor="consent" className="text-sm text-white/90">
                                    I consent to Think Research storing my data and contacting me about future opportunities.
                                </label>
                            </div>
                            {error && <code>Please fill in all fields and accept the consent</code>}
                            <div className="btn">
                                <button 
                                    onClick={handleClick}
                                    disabled={!hasConsent}
                                >
                                    Start Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="leaderboard-container">
                        <Leaderboard />
                    </div>
                </div>
            </div>
        </div>
    )
}