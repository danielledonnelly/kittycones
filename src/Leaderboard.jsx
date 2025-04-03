import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { GameContext } from "./GameContext";
import { Button } from "@radix-ui/themes";

const Leaderboard = () => {
  const { 
    highScores, 
    setHighScores, 
    globalScores, 
    isLoadingGlobalScores, 
    globalScoreError, 
    fetchGlobalScores 
  } = useContext(GameContext);
  const [isClearing, setIsClearing] = useState(false);
  const [isClearingGlobal, setIsClearingGlobal] = useState(false);

  useEffect(() => {
    // Log current state of high scores for debugging
    console.log("Current highScores in context:", highScores);
    console.log("Current highScores in localStorage:", localStorage.getItem("highScores"));
  }, []);

  // Function to clear all high scores
  const clearAllScores = () => {
    setIsClearing(true);
    
    // Clear in context
    setHighScores([]);
    
    // Clear in localStorage
    try {
      localStorage.removeItem("highScores");
      // Also try setting it to an empty array as a fallback
      localStorage.setItem("highScores", JSON.stringify([]));
      console.log("Scores cleared successfully");
      // alert("All local scores have been cleared!");
    } catch (error) {
      console.error("Error clearing scores:", error);
      alert("There was an error clearing scores. Please check console.");
    } finally {
      setIsClearing(false);
    }
  };

  // Function to clear all global scores (this will just refresh the global scores)
  const clearAllGlobalScores = () => {
    setIsClearingGlobal(true);
    
    // Refresh global scores
    fetchGlobalScores()
      .then(() => {
        // alert("Global leaderboard has been refreshed!");
      })
      .catch(error => {
        console.error("Error refreshing global scores:", error);
        alert("There was an error refreshing global scores. Please try again.");
      })
      .finally(() => {
        setIsClearingGlobal(false);
      });
  };

  // Ensure we have exactly 10 scores for display in local leaderboard
  const displayHighScores = [...highScores];
  
  // If we have fewer than 10 scores, pad the array to 10 elements with empty placeholders
  if (displayHighScores.length < 10) {
    for (let i = displayHighScores.length; i < 10; i++) {
      displayHighScores.push({ initials: "", score: "" });
    }
  }

  // Ensure we have exactly 10 scores for the global leaderboard
  const displayGlobalScores = [...globalScores];
  
  // If we have fewer than 10 scores, pad the array to 10 elements with empty placeholders
  if (displayGlobalScores.length < 10) {
    for (let i = displayGlobalScores.length; i < 10; i++) {
      displayGlobalScores.push({ initials: "", score: "" });
    }
  }

  return (
    <>
      <div className="counter">
        <div className="buttons-group" style={{ visibility: 'hidden' }}>
          <button className="button" disabled></button>
          <button className="button" disabled></button>
        </div>
        <div className="ice-cream" style={{ visibility: 'hidden' }}></div>
        <div className="restart-button" style={{ visibility: 'hidden' }}></div>
      </div>

      <div className="starting screen">
        <div className="home-title-container">
          <h1 className="home-title">KITTY CONES</h1>
        </div>

        <div className="home-buttons-row">
          <Link to="/game" style={{ textDecoration: 'none' }}>
            <Button size="3" variant="soft">Start</Button>
          </Link>

          <Link to="/about" style={{ textDecoration: 'none' }}>
            <Button size="3" variant="soft">About</Button>
          </Link>
          
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button size="3" variant="soft">Home</Button>
          </Link>
        </div>

        <div className="end screen end-screen">
          <h1 className="screen-title">High Scores</h1>
          
          <div className="leaderboard-container">
            <div className="leaderboard-column">
              <h2>Local Leaderboard</h2>
              <div className="high-scores">
                {displayHighScores.map((scoreData, index) => (
                  <div key={index} className="high-score-item">
                    <span className={`rank-number ${index < 9 ? 'single-digit' : ''}`}>{index + 1}.</span>
                    {scoreData.score ? `   ${scoreData.initials || ""}      ${scoreData.score} pts` : ""}
                  </div>
                ))}
              </div>
              <Button 
                size="3" 
                variant="soft" 
                onClick={clearAllScores}
                disabled={isClearing}
                style={{ marginTop: '20px' }}
              >
                Clear All Scores
              </Button>
            </div>
            <div className="leaderboard-column">
              <h2>Global Leaderboard</h2>
              {isLoadingGlobalScores ? (
                <p>Loading global scores...</p>
              ) : globalScoreError ? (
                <div>
                  <p>Error loading global scores</p>
                  <Button 
                    size="3" 
                    variant="soft" 
                    onClick={fetchGlobalScores}
                    style={{ marginTop: '10px' }}
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <>
                  <div className="high-scores">
                    {displayGlobalScores.map((scoreData, index) => (
                      <div key={index} className="high-score-item">
                        <span className={`rank-number ${index < 9 ? 'single-digit' : ''}`}>{index + 1}.</span>
                        {scoreData.score ? `   ${scoreData.initials || ""}      ${scoreData.score} pts` : ""}
                      </div>
                    ))}
                  </div>
                  <Button 
                    size="3" 
                    variant="soft" 
                    onClick={clearAllGlobalScores}
                    disabled={isClearingGlobal}
                    style={{ marginTop: '20px' }}
                  >
                    Refresh Scores
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;