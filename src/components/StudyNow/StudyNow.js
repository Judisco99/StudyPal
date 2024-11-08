import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudyContext } from '../../contexts/StudyContext';
import './StudyNow.css';

const StudyNow = () => {
    const { updateTodayStudyTime, updateWeekStudyTime } = useContext(StudyContext) || {};
    const [selectedDuration, setSelectedDuration] = useState(25 * 60); // Default 25 minutes
    const [timeLeft, setTimeLeft] = useState(selectedDuration);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [quote, setQuote] = useState("Stay focused and keep going!");
    const [playMusic, setPlayMusic] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [musicPromptVisible, setMusicPromptVisible] = useState(true);
    const [studiedTime, setStudiedTime] = useState(0); // Accurate studied time
    const [isBreak, setIsBreak] = useState(false); // Track break status
    const navigate = useNavigate();

    const motivationalQuotes = [
        "Stay focused and keep going!",
        "Progress, not perfection.",
        "You're doing amazing!",
        "Push through, it's worth it.",
        "Every minute counts."
    ];

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const formatStudiedTime = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs} hr${hrs !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
    };

    useEffect(() => {
        let timer;
        if (isRunning && !isPaused && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0 && isRunning) {
            if (isBreak) {
                setShowSummary(true);
                setIsRunning(false);
            } else {
                startBreak();
            }
        }
        return () => clearInterval(timer);
    }, [isRunning, isPaused, timeLeft, isBreak]);

    useEffect(() => {
        const quoteInterval = setInterval(() => {
            setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
        }, 300000); // Every 5 minutes
        return () => clearInterval(quoteInterval);
    }, []);

    useEffect(() => {
        if (audioFile && isRunning && !isPaused) {
            audioFile.loop = true;
            audioFile.play();
        } else if (audioFile) {
            audioFile.pause();
        }
    }, [audioFile, isRunning, isPaused]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isRunning && !isBreak) {
                // Record studied time if leaving during study session
                endSession();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isRunning, isBreak]);

    const startSession = () => {
        setTimeLeft(selectedDuration);
        setIsRunning(true);
        setIsPaused(false);
        setShowSummary(false);
        setIsBreak(false);
        setStudiedTime(0); // Reset studied time at the start of each session
        if (playMusic) document.getElementById("audioFileInput").click();
    };

    const startBreak = () => {
        setIsBreak(true);
        setTimeLeft(5 * 60); // Set break time for 5 minutes

        // Notify user when break ends
        setTimeout(() => {
            if (isBreak) {
                new Notification("Break Ended", { body: "Your break has ended. Please return to study!" });
                setIsBreak(false); // Reset break state
                startSession(); // Automatically resume study session
            }
        }, 5 * 60 * 1000); // 5 minutes in milliseconds
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const audio = new Audio(URL.createObjectURL(file));
            setAudioFile(audio);
        }
    };

    const endSession = () => {
        setIsRunning(false);
        const actualStudiedTime = selectedDuration - timeLeft; // Calculate the actual studied time in seconds
        const minutesStudied = Math.floor(actualStudiedTime / 60); // Convert to minutes
        setStudiedTime(minutesStudied); // Store studied time for summary display

        // Update study times in context
        if (updateTodayStudyTime) updateTodayStudyTime(minutesStudied / 60); // Convert to hours if required by context
        if (updateWeekStudyTime) updateWeekStudyTime(minutesStudied / 60);

        setShowSummary(true); // Show summary
    };

    const togglePauseSession = () => {
        setIsPaused((prev) => !prev);
    };

    const closeSummary = () => {
        setShowSummary(false);
        navigate('/dashboard');
    };

    const handleMusicPromptYes = () => {
        setPlayMusic(true);
        document.getElementById("audioFileInput").click();
        setMusicPromptVisible(false);
    };

    const handleMusicPromptNo = () => {
        setPlayMusic(false);
        setAudioFile(null);
        setMusicPromptVisible(false);
    };

    return (
        <div className="study-now distraction-free">
            {isRunning || isPaused ? (
                <>
                    <h2 className={isBreak ? "break-pulsate" : "study-pulsate"}>
                        {isBreak ? "Break Time" : "Study in Session"}
                    </h2>
                    <h3>Time Left: {formatTime(timeLeft)}</h3>
                    <p className="motivational-quote">{quote}</p>
                    <button onClick={togglePauseSession} className="pause-button">
                        {isPaused ? "Continue" : "Pause"}
                    </button>
                    <button onClick={endSession} className="end-button">End Session</button>
                </>
            ) : showSummary ? (
                <div className="session-summary">
                    <h3>Session Complete!</h3>
                    <p>Great job staying focused! You studied for {formatStudiedTime(studiedTime)}.</p>
                    <button onClick={closeSummary} className="summary-close-button">Back to Dashboard</button>
                </div>
            ) : (
                <div>
                    <h2>STUDY NOW</h2>
                    <label htmlFor="duration">Select Duration (minutes): </label>
                    <select
                        id="duration"
                        value={selectedDuration / 60}
                        onChange={(e) => setSelectedDuration(parseInt(e.target.value) * 60)}
                    >
                        {[5, 10, 15, 20, 25, 30, 45, 60, 75, 90].map((time) => (
                            <option key={time} value={time}>
                                {time} min
                            </option>
                        ))}
                    </select>
                    <div className="start-button-container">
                        <button onClick={startSession} className="start-button">Start</button>
                    </div>

                    {musicPromptVisible && (
                        <div className="music-prompt">
                            <p>Would you like to play music while studying?</p>
                            <button onClick={handleMusicPromptYes}>Yes</button>
                            <button onClick={handleMusicPromptNo}>No</button>
                        </div>
                    )}
                    <input
                        id="audioFileInput"
                        type="file"
                        accept="audio/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                </div>
            )}
        </div>
    );
};

export default StudyNow;