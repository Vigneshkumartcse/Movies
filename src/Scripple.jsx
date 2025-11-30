import React, { useEffect, useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { doc, setDoc, getDoc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./Firebase";
import { useParams } from "react-router-dom";
import "./scripple.css";

const ScripplePage = () => {
  const { roomCode: urlRoomCode } = useParams();
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(4);
  const [tool, setTool] = useState("pen");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState("");

  const toggleTool = (t) => {
    setTool(t);
    if (t === "eraser") canvasRef.current.eraseMode(true);
    else canvasRef.current.eraseMode(false);
  };
  const dataa = "pen";
  useEffect(() => {
    if (messages == dataa) {
      alert("Pen tool selected");
    }
  }, [messages]);

  const [showEntryModal, setShowEntryModal] = useState(true);
  const [entryMode, setEntryMode] = useState(null); // 'create' or 'join'
  const [showPlayerSelect, setShowPlayerSelect] = useState(false);
  const [numPlayers, setNumPlayers] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameInputValue, setNameInputValue] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = Math.floor(Math.random() * 6) + 5; // 5-10 characters
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handlePlayerSelection = async (count) => {
    console.log("Player selection clicked:", count);
    setNumPlayers(count);
    const code = generateRoomCode();
    console.log("Generated room code:", code);
    setRoomCode(code);
    const creatorName = 'Player 1';
    setCurrentPlayerName(creatorName);
    const initialPlayers = [{ name: creatorName, isCreator: true }];
    setPlayers(initialPlayers);
    
    const roomData = {
      roomCode: code,
      maxPlayers: count,
      players: initialPlayers,
      gameStarted: false,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage as backup
    localStorage.setItem(`room_${code}`, JSON.stringify(roomData));
    console.log("Room saved to localStorage");
    
    // Update UI immediately
    window.history.pushState({}, '', `/scribble/${code}`);
    setShowPlayerSelect(false);
    setShowWaitingRoom(true);
    
    // Try to save to Firebase in background (non-blocking)
    setDoc(doc(db, "rooms", code), roomData)
      .then(() => {
        console.log("Room created in Firebase successfully!");
      })
      .catch((error) => {
        console.warn("Firebase save failed (using localStorage fallback):", error.message);
      });
  };

  // Check if URL has room code (joining existing room)
  useEffect(() => {
    if (urlRoomCode) {
      console.log("Room code detected in URL:", urlRoomCode);
      setRoomCode(urlRoomCode);
      setShowEntryModal(false);
      
      // Check if room exists in localStorage
      const localRoomData = localStorage.getItem(`room_${urlRoomCode}`);
      if (localRoomData) {
        console.log("Room found in localStorage");
        const roomData = JSON.parse(localRoomData);
        setNumPlayers(roomData.maxPlayers);
        setPlayers(roomData.players);
      }
      
      setShowNameInput(true);
    }
  }, [urlRoomCode]);

  // Show player select after create room
  useEffect(() => {
    if (entryMode === "create") {
      setShowPlayerSelect(true);
    } else if (entryMode === "join") {
      setShowNameInput(true);
    } else {
      setShowPlayerSelect(false);
    }
  }, [entryMode]);

  // Real-time listener for room updates (Firebase + localStorage polling)
  useEffect(() => {
    if (!roomCode) return;
    
    console.log("Setting up room listener for:", roomCode);
    
    // Poll localStorage every 2 seconds
    const localStorageInterval = setInterval(() => {
      const localRoomData = localStorage.getItem(`room_${roomCode}`);
      if (localRoomData) {
        const roomData = JSON.parse(localRoomData);
        console.log("LocalStorage update - Players:", roomData.players.length);
        setPlayers(roomData.players);
        setNumPlayers(roomData.maxPlayers);
        
        // Auto-start game when all players joined
        if (roomData.players.length === roomData.maxPlayers) {
          console.log("All players joined! Starting game...");
          setShowWaitingRoom(false);
          setGameStarted(true);
        }
      }
    }, 2000);
    
    // Try Firebase listener (may fail due to CORS)
    const roomRef = doc(db, "rooms", roomCode);
    
    const unsubscribe = onSnapshot(
      roomRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          const roomData = docSnap.data();
          console.log("Firebase update - Players:", roomData.players.length);
          setPlayers(roomData.players);
          setNumPlayers(roomData.maxPlayers);
          
          // Also save to localStorage for sync
          localStorage.setItem(`room_${roomCode}`, JSON.stringify(roomData));
          
          // Auto-start game when all players joined
          if (roomData.players.length === roomData.maxPlayers) {
            console.log("All players joined! Starting game...");
            setShowWaitingRoom(false);
            setGameStarted(true);
          }
        }
      }, 
      (error) => {
        console.warn("Firebase listener error (using localStorage only):", error.message);
      }
    );
    
    return () => {
      clearInterval(localStorageInterval);
      unsubscribe();
    };
  }, [roomCode]);

  const handleJoinRoom = async () => {
    console.log("handleJoinRoom called!");
    console.log("Name input value:", nameInputValue);
    
    if (!nameInputValue.trim()) {
      alert('Please enter your name!');
      return;
    }
    
    // Use room code from URL or state
    const code = roomCode || urlRoomCode;
    console.log("Room code to join:", code);
    
    if (!code) {
      alert('Invalid room link!');
      return;
    }
    
    const newPlayer = { name: nameInputValue.trim(), isCreator: false };
    
    // Show waiting room immediately with loading state
    setCurrentPlayerName(nameInputValue.trim());
    setShowNameInput(false);
    setShowWaitingRoom(true);
    
    // Try Firebase first (cross-device)
    try {
      console.log("Fetching room from Firebase...");
      const roomRef = doc(db, "rooms", code);
      const roomSnap = await getDoc(roomRef);
      
      if (roomSnap.exists()) {
        const roomData = roomSnap.data();
        console.log("Room found in Firebase:", roomData);
        
        if (roomData.players.length >= roomData.maxPlayers) {
          alert('Room is full!');
          setShowWaitingRoom(false);
          setShowNameInput(true);
          return;
        }
        
        // Update Firebase
        await updateDoc(roomRef, { players: arrayUnion(newPlayer) });
        
        // Update local state
        setNumPlayers(roomData.maxPlayers);
        setPlayers([...roomData.players, newPlayer]);
        
        // Save to localStorage for backup
        localStorage.setItem(`room_${code}`, JSON.stringify({
          ...roomData,
          players: [...roomData.players, newPlayer]
        }));
        
        console.log("Successfully joined via Firebase!");
        return;
      }
    } catch (error) {
      console.error("Firebase error:", error);
    }
    
    // Fallback: check localStorage
    console.log("Checking localStorage...");
    const localRoomData = localStorage.getItem(`room_${code}`);
    if (localRoomData) {
      console.log("Found room in localStorage");
      const roomData = JSON.parse(localRoomData);
      
      if (roomData.players.length >= roomData.maxPlayers) {
        alert('Room is full!');
        setShowWaitingRoom(false);
        setShowNameInput(true);
        return;
      }
      
      // Update room in localStorage
      roomData.players.push(newPlayer);
      localStorage.setItem(`room_${code}`, JSON.stringify(roomData));
      
      // Update UI
      setNumPlayers(roomData.maxPlayers);
      setPlayers(roomData.players);
      
      console.log("Joined via localStorage (same device only)");
      return;
    }
    
    // No room found
    alert('Room not found! Make sure the room creator has opened the link first.');
    setShowWaitingRoom(false);
    setShowNameInput(true);
  };

  const handleEntryModalClose = () => {
    setShowEntryModal(false);
  };

  return (
    <div className="three-layout">
      {showEntryModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(60, 60, 120, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 24px rgba(124, 58, 237, 0.18)",
              padding: "2.5rem 2.5rem",
              textAlign: "center",
              fontSize: "1.3rem",
              color: "#7c3aed",
              fontWeight: "700",
              minWidth: "320px",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>Welcome! Please choose:</div>
            <button
              style={{
                margin: "0 1rem 1rem 0",
                padding: "0.7rem 2rem",
                fontSize: "1.1rem",
                borderRadius: "8px",
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => {
                setEntryMode("create");
                setShowEntryModal(false);
              }}
            >
              Create Room
            </button>
            <button
              style={{
                margin: "0 0 1rem 1rem",
                padding: "0.7rem 2rem",
                fontSize: "1.1rem",
                borderRadius: "8px",
                background: "#16a34a",
                color: "#fff",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => {
                setEntryMode("join");
                setShowEntryModal(false);
              }}
            >
              Join Room
            </button>
          </div>
        </div>
      )}
      {showPlayerSelect && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(60, 60, 120, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 24px rgba(124, 58, 237, 0.18)",
              padding: "2.5rem 2.5rem",
              textAlign: "center",
              fontSize: "1.3rem",
              color: "#7c3aed",
              fontWeight: "700",
              minWidth: "320px",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>How many players?</div>
            <button
              style={{
                margin: "0 1rem 1rem 0",
                padding: "0.7rem 2rem",
                fontSize: "1.1rem",
                borderRadius: "8px",
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => handlePlayerSelection(2)}
            >
              2 Players
            </button>
            <button
              style={{
                margin: "0 1rem 1rem 0",
                padding: "0.7rem 2rem",
                fontSize: "1.1rem",
                borderRadius: "8px",
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => handlePlayerSelection(3)}
            >
              3 Players
            </button>
            <button
              style={{
                margin: "0 1rem 1rem 0",
                padding: "0.7rem 2rem",
                fontSize: "1.1rem",
                borderRadius: "8px",
                background: "#7c3aed",
                color: "#fff",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => handlePlayerSelection(4)}
            >
              4 Players
            </button>
          </div>
        </div>
      )}

      {showNameInput && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(60, 60, 120, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 24px rgba(124, 58, 237, 0.18)",
              padding: "2.5rem 2.5rem",
              textAlign: "center",
              fontSize: "1.3rem",
              color: "#7c3aed",
              fontWeight: "700",
              minWidth: "320px",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>Enter Your Name</div>
            <input
              type="text"
              value={nameInputValue}
              onChange={(e) => setNameInputValue(e.target.value)}
              placeholder="Your name..."
              style={{
                width: "100%",
                padding: "0.7rem",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "2px solid #7c3aed",
                marginBottom: "1.5rem",
                boxSizing: "border-box",
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleJoinRoom();
              }}
            />
            <button
              style={{
                padding: "0.7rem 2rem",
                fontSize: "1.1rem",
                borderRadius: "8px",
                background: "#16a34a",
                color: "#fff",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={handleJoinRoom}
            >
              Join Room
            </button>
          </div>
        </div>
      )}

      {showWaitingRoom && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(60, 60, 120, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 4px 24px rgba(124, 58, 237, 0.18)",
              padding: "2.5rem 2.5rem",
              textAlign: "center",
              fontSize: "1.3rem",
              color: "#7c3aed",
              fontWeight: "700",
              minWidth: "380px",
            }}
          >
            <div style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
              ⏳ Waiting for Players...
            </div>
            <div style={{ marginBottom: "1rem", fontSize: "1rem", color: "#333" }}>
              Room Code: <strong>{roomCode}</strong>
            </div>
            <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#666" }}>
              Players: {players.length} / {numPlayers}
            </div>
            <div style={{ marginBottom: "1rem", fontSize: "0.85rem", color: "#555", textAlign: "left" }}>
              {players.map((player, idx) => (
                <div key={idx} style={{ padding: "0.3rem 0" }}>
                  👤 {player.name} {player.isCreator && "(Host)"}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: "1.5rem", fontSize: "0.85rem", color: "#888" }}>
              Share this link with your friends:
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                style={{
                  padding: "0.7rem 2rem",
                  fontSize: "1.1rem",
                  borderRadius: "8px",
                  background: "#25D366",
                  color: "#fff",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onClick={() => {
                  const url = `${window.location.origin}/scribble/${roomCode}`;
                  const text = encodeURIComponent(
                    `Join my Scribble game!\nRoom Code: ${roomCode}\nPlayers needed: ${numPlayers}\nJoin here: ${url}`
                  );
                  window.open(`https://wa.me/?text=${text}`, "_blank");
                }}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  style={{ width: "22px", height: "22px" }}
                />
                Share
              </button>
              <button
                style={{
                  padding: "0.7rem 2rem",
                  fontSize: "1.1rem",
                  borderRadius: "8px",
                  background: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onClick={() => {
                  const url = `${window.location.origin}/scribble/${roomCode}`;
                  navigator.clipboard.writeText(url).then(() => {
                    alert("Link copied to clipboard!");
                  });
                }}
              >
                📋 Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT: Leaderboard */}
      <div className="left-board">
        <h3>🏆 Leaderboard</h3>
        <ul>
          <li>Player 1 – 120 pts</li>
          <li>Player 2 – 95 pts</li>
          <li>Player 3 – 80 pts</li>
        </ul>
      </div>

      {/* CENTER: Whiteboard */}
      <div className="center-board">
        <div className="board-container" style={{ width: "100%" }}>
          {/* Toolbar */}
          <div className="toolbar">
            <button
              className={tool === "pen" ? "active" : ""}
              onClick={() => toggleTool("pen")}
            >
              ✏️ Pen
            </button>

            <button
              className={tool === "eraser" ? "active" : ""}
              onClick={() => toggleTool("eraser")}
            >
              🧽 Eraser
            </button>

            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />

            <input
              type="range"
              min="1"
              max="20"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />

            <button onClick={() => canvasRef.current.undo()}>↩ Undo</button>
            <button onClick={() => canvasRef.current.redo()}>↪ Redo</button>
            <button onClick={() => canvasRef.current.clearCanvas()}>
              🗑 Clear
            </button>
          </div>

          <ReactSketchCanvas
            ref={canvasRef}
            strokeColor={color}
            strokeWidth={size}
            className="board"
            style={{ height: "500px" }}
          />
        </div>
      </div>

      {/* RIGHT: Chat */}
      <div className="right-board">
        <h3>💬 Chat</h3>

        <div className="chat-box">
          <p>
            <b>User1:</b> Hello!
          </p>
          <p>
            <b>User2:</b> Draw something!
          </p>
        </div>

        <textarea
          onChange={(e) => setChatInput(e.target.value)}
          className="chat-input"
          placeholder="Type here..."
        ></textarea>
        <button onClick={() => setMessages(chatInput)} className="chat-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default ScripplePage;
