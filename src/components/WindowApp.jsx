import { Rnd } from 'react-rnd';
import Terminal from './Terminal'; // Import file Terminal mới làm
import Browser from './Browser';
import Myproject from './Myproject';
import FlappyBird from './FlappyBird';

export default function WindowApp({ appData, onMinimize, onMaximize, onClose, onFocus }) {
  return (
    <Rnd
      default={{ x: appData.id === 'terminal' ? 50 : 200, y: 50, width: appData.id === 'browser' ? 600 : 450, height: appData.id === 'browser' ? 400 : 300 }}
      dragHandleClassName="title-bar"
      onMouseDown={onFocus}
      disableDragging={appData.isMaximized}
      enableResizing={!appData.isMaximized}
      className={appData.isMaximized ? "maximized-window" : ""}
      style={{ display: appData.isMinimized ? 'none' : 'block', zIndex: appData.zIndex }}
    >
      <div className="window" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

        <div className="title-bar">
          <div className="title-bar-text" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <img src={`https://win98icons.alexmeub.com/icons/png/${appData.icon}`} width="16" alt="icon" />
            {appData.title}
          </div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" onMouseDown={(e) => { e.stopPropagation(); onMinimize(); }}></button>
            <button aria-label={appData.isMaximized ? "Restore" : "Maximize"} onMouseDown={(e) => { e.stopPropagation(); onMaximize(); }}></button>
            <button aria-label="Close" onMouseDown={(e) => { e.stopPropagation(); onClose(); }}></button>
          </div>
        </div>

        {/* NỘI DUNG BÊN TRONG CỬA SỔ SẼ THAY ĐỔI TÙY THEO ID */}
        <div className="window-body" style={{
          flexGrow: 1, margin: 0, display: 'flex', flexDirection: 'column',overflow: 'hidden', 
          padding: appData.id === 'browser' ? 0 : '5px',
          fontSize: appData.id === 'terminal' && appData.isMaximized ? '18px' : '12px', // Tăng font size nếu là Terminal và đang Maximize
          paddingTop: appData.id === 'terminal' && appData.isMaximized ? '15px' : '10px',
          backgroundColor: appData.id === 'terminal' ? '#000' : '#c0c0c0',
          color: appData.id === 'terminal' ? '#0f0' : '#000'
        }}>

          {/* 1. Nếu là Terminal */}
          {appData.id === 'terminal' && (
            // Gọi component Terminal ra, truyền hàm onClose vào để lệnh "exit" có thể tự tắt cửa sổ
            <Terminal closeApp={onClose} />
          )}

          {/* 2. Nếu là Trình duyệt (Browser) */}
          {appData.id === 'browser' && (
            <Browser />
          )}

          {/* 3. Nếu là Folder Projects */}
          {appData.id === 'projects' && (
            <div style={{ backgroundColor: '#fff', height: '100%', padding: '10px' }}>
              <Myproject />
            </div>
          )}

          {/* 4. Nếu là Game Flappy Bird */}
          {appData.id === 'game' && (
            <FlappyBird />
          )}

        </div>
      </div>
    </Rnd>
  );
}