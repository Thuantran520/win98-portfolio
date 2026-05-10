import { useState, useEffect } from 'react';

// BỘ THÔNG SỐ VẬT LÝ (Giữ nguyên gốc để tính toán chuẩn)
const BIRD_SIZE = 24;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 300;
const GRAVITY = 5;
const JUMP = 55;
const OBSTACLE_WIDTH = 45;
const OBSTACLE_GAP = 110;
const BIRD_X = 50;

export default function FlappyBird() {
  const [birdPosition, setBirdPosition] = useState(150);
  const [birdRotation, setBirdRotation] = useState(0); // Nâng cấp 1: State xoay góc chim
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(100);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // VÒNG LẶP VẬT LÝ: Lực hấp dẫn và Góc xoay
  useEffect(() => {
    let timeId;
    if (gameHasStarted && !gameOver) {
      timeId = setInterval(() => {
        setBirdPosition((prev) => prev + GRAVITY);
        setBirdRotation((prev) => Math.min(prev + 4, 90)); // Chim cắm đầu xuống dần khi rơi tự do
      }, 24);
    }
    return () => clearInterval(timeId);
  }, [gameHasStarted, gameOver]);

  // VÒNG LẶP CHƯỚNG NGẠI VẬT: Di chuyển ống
  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && !gameOver) {
      obstacleId = setInterval(() => {
        setObstacleLeft((left) => {
          if (left <= -OBSTACLE_WIDTH) {
            setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP - 40) + 20));
            setScore((s) => s + 1);
            return GAME_WIDTH;
          }
          return left - 4; // Tốc độ ống trôi
        });
      }, 24);
    }
    return () => clearInterval(obstacleId);
  }, [gameHasStarted, gameOver]);

  // KIỂM TRA VA CHẠM (HITBOX COLLISION)
  useEffect(() => {
    if (!gameHasStarted || gameOver) return;

    // Trừ hao hitbox 4px để người chơi không bị chết oan khi sượt ngang ống
    const hitPipeX = obstacleLeft < BIRD_X + BIRD_SIZE - 4 && obstacleLeft + OBSTACLE_WIDTH > BIRD_X + 4; 
    const hitTopPipeY = birdPosition < obstacleHeight;
    const hitBottomPipeY = birdPosition + BIRD_SIZE > obstacleHeight + OBSTACLE_GAP;
    const hitFloor = birdPosition + BIRD_SIZE >= GAME_HEIGHT;

    if (hitFloor || (hitPipeX && (hitTopPipeY || hitBottomPipeY))) {
      // Dùng setTimeout 0 để đẩy state update ra khỏi luồng render của useEffect
      setTimeout(() => {
        setGameOver(true);
        setGameHasStarted(false);
      }, 0);
    }
  }, [birdPosition, obstacleHeight, obstacleLeft, gameHasStarted, gameOver]);

  // XỬ LÝ CLICK / NHẢY
  const handleClick = () => {
    if (gameOver) {
      setGameOver(false);
      setBirdPosition(150);
      setBirdRotation(0);
      setScore(0);
      setObstacleLeft(GAME_WIDTH);
      setGameHasStarted(true);
      return;
    }

    if (!gameHasStarted) {
      setGameHasStarted(true);
    }
    
    setBirdPosition((prev) => Math.max(prev - JUMP, 0));
    setBirdRotation(-35); // Ngóc đầu lên khi được bơm lực nhảy
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#222', padding: '10px' }}>
      
      {/* KHUNG ĐIỂM SỐ */}
      <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold', color: '#0f0', fontFamily: 'monospace' }}>
        SCORE: {score}
      </div>
      
      {/* NÂNG CẤP 2: BỌC BẰNG FLEX ĐỂ ÉP KHUÔN VÀ DÙNG SVG ĐỂ AUTO-SCALE TỈ LỆ CHUẨN */}
      <div style={{ flexGrow: 1, width: '100%', display: 'flex', justifyContent: 'center', minHeight: 0 }} onClick={handleClick}>
        <svg 
          viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`} 
          style={{ 
            maxHeight: '100%', maxWidth: '100%', 
            backgroundColor: '#70c5ce', border: '4px solid #555', 
            cursor: 'pointer', borderRadius: '4px' 
          }}
        >
          {/* Ống bên trên */}
          <rect x={obstacleLeft} y={0} width={OBSTACLE_WIDTH} height={obstacleHeight} fill="#2ecc71" stroke="#000" strokeWidth="2" />
          <rect x={obstacleLeft - 2} y={obstacleHeight - 15} width={OBSTACLE_WIDTH + 4} height={15} fill="#27ae60" stroke="#000" strokeWidth="2" /> {/* Viền miệng ống */}

          {/* Ống bên dưới */}
          <rect x={obstacleLeft} y={obstacleHeight + OBSTACLE_GAP} width={OBSTACLE_WIDTH} height={GAME_HEIGHT - obstacleHeight - OBSTACLE_GAP} fill="#2ecc71" stroke="#000" strokeWidth="2" />
          <rect x={obstacleLeft - 2} y={obstacleHeight + OBSTACLE_GAP} width={OBSTACLE_WIDTH + 4} height={15} fill="#27ae60" stroke="#000" strokeWidth="2" /> {/* Viền miệng ống */}

          {/* Mặt đất giả (Floor) */}
          <rect x={0} y={GAME_HEIGHT - 10} width={GAME_WIDTH} height={10} fill="#ded895" stroke="#000" strokeWidth="2" />

          {/* Sprite Con Chim: Dùng thẻ text kết hợp transform để xoay quanh tâm */}
          <text 
            x={BIRD_X} 
            y={birdPosition + 20} 
            fontSize={BIRD_SIZE} 
            transform={`rotate(${birdRotation}, ${BIRD_X + BIRD_SIZE/2}, ${birdPosition + BIRD_SIZE/2})`}
            style={{ userSelect: 'none' }}
          >
            🐣
          </text>

          {/* MÀN HÌNH GAME OVER (Vẽ đè lên trên cùng) */}
          {gameOver && (
            <g>
              <rect x="0" y="0" width={GAME_WIDTH} height={GAME_HEIGHT} fill="rgba(0,0,0,0.6)" />
              <text x="50%" y="45%" textAnchor="middle" fill="red" fontSize="36" fontWeight="bold" stroke="#fff" strokeWidth="1">GAME OVER</text>
              <text x="50%" y="60%" textAnchor="middle" fill="white" fontSize="16">Click to Restart</text>
            </g>
          )}

          {/* MÀN HÌNH CHỜ BẮT ĐẦU */}
          {!gameHasStarted && !gameOver && (
            <g>
              <rect x="0" y="0" width={GAME_WIDTH} height={GAME_HEIGHT} fill="rgba(0,0,0,0.3)" />
              <text x="50%" y="50%" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">Click to Start</text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}