import React, { useState } from 'react';
import '../../styles/App.css';

function TeamScoreboard({ numberOfTeams = 2, currentTeamIndex = 0, teamScores = [], onClose, onEndGame }) {
  // Validate team count (min 2, max 6)
  const validTeamCount = Math.max(2, Math.min(6, numberOfTeams));
  
  // Initialize teams with scores from props
  const [teams, setTeams] = useState(
    Array.from({ length: validTeamCount }, (_, i) => ({
      id: i + 1,
      name: String.fromCharCode(65 + i), // A, B, C, D, E, F
      score: teamScores[i] || 0,
      color: getTeamColor(i)
    }))
  );

  const [editingTeam, setEditingTeam] = useState(null);
  const [tempName, setTempName] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  // Update scores when teamScores prop changes
  React.useEffect(() => {
    setTeams(prevTeams => 
      prevTeams.map((team, i) => ({
        ...team,
        score: teamScores[i] || 0
      }))
    );
  }, [teamScores]);

  // Get gradient colors for each team
  function getTeamColor(index) {
    const colors = [
      'linear-gradient(135deg, #8b9ded 0%, #f1abc2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    ];
    return colors[index % colors.length];
  }

  // Start editing team name
  const startEditingName = (team) => {
    setEditingTeam(team.id);
    setTempName(team.name);
  };

  // Save team name
  const saveTeamName = (teamId) => {
    if (tempName.trim()) {
      setTeams(teams.map(team => 
        team.id === teamId ? { ...team, name: tempName.trim() } : team
      ));
    }
    setEditingTeam(null);
    setTempName('');
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTeam(null);
    setTempName('');
  };

  // Get winner(s)
  const getWinners = () => {
    const maxScore = Math.max(...teams.map(t => t.score));
    if (maxScore === 0) return [];
    return teams.filter(t => t.score === maxScore);
  };

  const winners = getWinners();

  return (
    <div style={{
      position: 'fixed',
      top: 'clamp(70px, 15vw, 80px)',
      left: 'clamp(5px, 2vw, 10px)',
      zIndex: 10000,
      animation: 'slideInLeft 0.3s ease-out'
    }}>
      <style>{`
        @media (max-width: 768px) {
          .team-scoreboard-mobile {
            width: auto !important;
            max-width: calc(100vw - 20px) !important;
          }
        }
      `}</style>
      <div className="team-scoreboard-mobile" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: isMinimized ? '0.8rem' : 'clamp(0.6rem, 2vw, 1rem)',
        width: isMinimized ? 'auto' : 'clamp(180px, 40vw, 200px)',
        maxHeight: '85vh',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        border: '2px solid rgba(102, 126, 234, 0.2)',
        transition: 'all 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isMinimized ? 0 : '0.8rem',
          paddingBottom: isMinimized ? 0 : '0.8rem',
          borderBottom: isMinimized ? 'none' : '2px solid rgba(102, 126, 234, 0.1)'
        }}>
          {!isMinimized && (
            <div style={{
              fontSize: '1rem',
              fontWeight: 800,
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🏆 Teams
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              style={{
                background: 'rgba(102, 126, 234, 0.1)',
                border: 'none',
                borderRadius: '6px',
                width: '28px',
                height: '28px',
                color: '#667eea',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                fontWeight: 700
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
            >
              {isMinimized ? '→' : '←'}
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: 'none',
                borderRadius: '6px',
                width: '28px',
                height: '28px',
                color: '#ef4444',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                fontWeight: 700
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            >
              ×
            </button>
          </div>
        </div>

        {/* Winner Banner - Only show when not minimized */}
        {!isMinimized && winners.length > 0 && (
          <div style={{
            background: 'rgba(255, 215, 0, 0.1)',
            borderRadius: '8px',
            padding: '0.5rem',
            marginBottom: '0.8rem',
            textAlign: 'center',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <div style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>🎉</div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#667eea'
            }}>
              Team {winners[0].name}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#718096' }}>
              {winners[0].score} pts
            </div>
          </div>
        )}

        {/* Teams List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem'
        }}>
          {teams.map((team, index) => {
            const isCurrentTeam = index === currentTeamIndex;
            return (
            <div
              key={team.id}
              style={{
                background: isCurrentTeam ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.05)',
                borderRadius: '10px',
                padding: isMinimized ? '0.5rem' : '0.6rem',
                border: isCurrentTeam ? '2px solid #667eea' : '1px solid rgba(102, 126, 234, 0.2)',
                transition: 'all 0.3s',
                boxShadow: isCurrentTeam ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
                position: 'relative'
              }}
            >
              {/* Current Team Indicator */}
              {isCurrentTeam && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                  animation: 'pulse 2s infinite'
                }}>
                  ▶
                </div>
              )}

              {isMinimized ? (
                // Minimized view - just show team letter and score
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: isCurrentTeam ? '#10b981' : '#667eea'
                  }}>
                    {team.name}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#2d3748'
                  }}>
                    {team.score}
                  </div>
                </div>
              ) : (
                // Expanded view - read-only display
                <>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    {editingTeam === team.id ? (
                      <div style={{ display: 'flex', gap: '0.3rem', flex: 1 }}>
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveTeamName(team.id)}
                          autoFocus
                          style={{
                            flex: 1,
                            padding: '0.3rem',
                            border: '1px solid #667eea',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            outline: 'none'
                          }}
                        />
                        <button
                          onClick={() => saveTeamName(team.id)}
                          style={{
                            background: '#10b981',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.2rem 0.4rem',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '0.7rem'
                          }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEditing}
                          style={{
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.2rem 0.4rem',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '0.7rem'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => startEditingName(team)}
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: isCurrentTeam ? '#10b981' : '#2d3748',
                          cursor: 'pointer',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '6px',
                          transition: 'background 0.2s',
                          flex: 1
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        Team {team.name}
                      </div>
                    )}
                    <div style={{
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      color: isCurrentTeam ? '#10b981' : '#667eea',
                      minWidth: '30px',
                      textAlign: 'right'
                    }}>
                      {team.score}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
        </div>

        {/* End Game Button */}
        {!isMinimized && onEndGame && (
          <button
            onClick={onEndGame}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              marginTop: '0.8rem',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }}
          >
            🏁 End Game
          </button>
        )}
      </div>
    </div>
  );
}

export default TeamScoreboard;
