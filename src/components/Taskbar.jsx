import { useState } from 'react';
import './Taskbar.css';

// Nhận "apps" và "onToggleApp" từ Desktop truyền xuống (gọi là Props)
export default function Taskbar({ apps, onToggleApp , onOpenApp}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);



  const handleOpenApp = (id) => {
    onOpenApp(id); // Gọi hàm từ Cha truyền xuống để mở app
    setIsMenuOpen(false); // Đóng Start Menu nếu đang mở
  };

  return (
    <div className="taskbar-container">
      {/* --- PHẦN NÚT START VÀ QUICK LAUNCH GIỮ NGUYÊN NHƯ CŨ --- */}
      <button className={`start-button ${isMenuOpen ? "active" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <img src="https://win98icons.alexmeub.com/icons/png/windows_slanted-1.png" alt="start" style={{ width: 16, marginRight: 5 }} />
        Start
      </button>

      {isMenuOpen && (
        <div className="window start-menu">
          <div className="window-body start-menu-items">
            <button className="menu-item" onClick={() => handleOpenApp('browser')}>
              👨‍💻 Về bản thân
            </button>
            <button className="menu-item" onClick={() => handleOpenApp('projects')}>
              📁 Dự án (Projects)
            </button>
            <button className="menu-item" onClick={() => handleOpenApp('terminal')}>
              🖥️ Terminal
            </button>
            <hr style={{ width: '100%' }} />
            <button className="menu-item">🛑 Tắt máy</button>
          </div>
        </div>
      )}

      <div className="quick-launch">
        <button className="quick-launch-btn" title="Show Desktop">
          <img src="https://win98icons.alexmeub.com/icons/png/desktop_old-0.png" alt="Desktop" />
        </button>
      </div>
      {/* -------------------------------------------------------- */}

      {/* DANH SÁCH ỨNG DỤNG ĐANG MỞ (TỰ ĐỘNG SINH RA TỪ STATE) */}
      <div className="taskbar-apps">
        {apps.map(app => (
          app.isOpen && ( // Chỉ hiển thị trên taskbar nếu app đang mở
            <button 
              key={app.id}
              // Nếu đang KHÔNG bị thu nhỏ -> Nghĩa là đang hiện -> Class "active" (nút bị lún xuống)
              className={`taskbar-app-btn ${!app.isMinimized ? "active" : ""}`}
              onClick={() => onToggleApp(app.id)} // Bấm vào thì gọi hàm bật/tắt

            >
              <img src={`https://win98icons.alexmeub.com/icons/png/${app.icon}`} alt="icon" style={{ width: 16 }} />
              {app.title}
            </button>
          )
        ))}
      </div>

      <div style={{ flexGrow: 1 }}></div>
      <div className="status-bar clock-container">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}