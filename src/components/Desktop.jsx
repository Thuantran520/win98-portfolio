import { useState } from 'react';
import WindowApp from './WindowApp';
import Taskbar from './Taskbar';
import './Desktop.css';

export default function Desktop() {
  // THÊM MỚI: Biến đếm Z-Index cao nhất hiện tại
  const [topZIndex, setTopZIndex] = useState(1);

  // THÊM MỚI: Bổ sung thuộc tính zIndex: 1 vào các app
  const [apps, setApps] = useState([
    { id: 'terminal', title: 'Terminal.exe', icon: 'console_prompt-0.png', isOpen: true, isMinimized: false, zIndex: 1 },
    { id: 'projects', title: 'My Projects.folder', icon: 'directory_open_file_mydocs-4.png', isOpen: true, isMinimized: true, zIndex: 0 },
    { id: 'browser', title: 'Internet Explorer', icon: 'msie1-0.png', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    { id: 'game', title: 'Flappy Bird.exe', icon: 'joystick-0.png', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 }
  ]);

  // THÊM MỚI: Hàm "Rút giấy lên trên cùng"
  const bringToFront = (id) => {
    setTopZIndex(topZIndex + 1); // Tăng kỷ lục Z-Index lên 1
    setApps(apps.map(app => 
      app.id === id ? { ...app, zIndex: topZIndex + 1 } : app
    ));
  };

  const toggleMinimize = (id) => {
    setTopZIndex(topZIndex + 1); // THÊM MỚI: Khi bấm dưới Taskbar cũng phải đẩy nó lên trên cùng
    setApps(apps.map(app => 
      app.id === id ? { ...app, isMinimized: !app.isMinimized, zIndex: topZIndex + 1 } : app
    ));
  };

  const closeApp = (id) => {
    setApps(apps.map(app => app.id === id ? { ...app, isOpen: false } : app));
  };

  const toggleMaximize = (id) => {
    setTopZIndex(topZIndex + 1);
    setApps(apps.map(app =>
        app.id === id ? { ...app, isMaximized: !app.isMaximized, zIndex: topZIndex + 1 } : app
    ));
  };
  
  const openApp = (id) => {
    setTopZIndex(topZIndex + 1);
    setApps(apps.map(app => 
      app.id === id ? { ...app, isOpen: true, isMinimized: false, zIndex: topZIndex + 1 } : app
    ));
  };
  return (
    <div style={{ backgroundColor: '#008080', height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      
      {/* =============== KHU VỰC DESKTOP ICONS =============== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px', width: 'fit-content' }}>
        {apps.map(app => (
          <div 
            key={app.id} 
            className="desktop-icon"
            tabIndex="0" // Cho phép thẻ div nhận sự kiện focus (hiện viền đứt khúc)
            onDoubleClick={() => openApp(app.id)} // BẤM ĐÚP CHUỘT ĐỂ MỞ APP
          >
            <img src={`https://win98icons.alexmeub.com/icons/png/${app.icon}`} alt={app.title} />
            <span>{app.title}</span>
          </div>
        ))}
      </div>
      {/* ===================================================== */}

      {/* RENDER CÁC CỬA SỔ APP */}
      {apps.map(app => (
        app.isOpen && (
          <WindowApp 
            key={app.id} appData={app} 
            onMinimize={() => toggleMinimize(app.id)} 
            onMaximize={() => toggleMaximize(app.id)}
            onClose={() => closeApp(app.id)}
            onFocus={() => bringToFront(app.id)}
          />
        )
      ))}

      {/* THANH TASKBAR */}
      <Taskbar apps={apps} onToggleApp={toggleMinimize} onOpenApp={openApp} />
    </div>
  );
}