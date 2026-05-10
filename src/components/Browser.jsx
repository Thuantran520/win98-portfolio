import { useState } from 'react';
import Myavatar from '../assets/avatar2.jpg'; 

export default function Browser() {
  // 1. STATE QUẢN LÝ LỊCH SỬ TRÌNH DUYỆT (Giống như Stack/Array trong DSA)
  const [history, setHistory] = useState(['about']); // Lịch sử duyệt web
  const [currentIndex, setCurrentIndex] = useState(0); // Con trỏ đang đứng ở đâu
  const [isLoading, setIsLoading] = useState(false); // Hiệu ứng load
  const [progress, setProgress] = useState(0);

  // Lấy ra tab hiện tại dựa vào con trỏ index
  const activeTab = history[currentIndex]; 
  
  // Tự động sinh URL cho thanh Address dựa vào tab đang mở
  const currentUrl = `https://minhthuan-portfolio.dev/${activeTab}`;

  // 2. CÁC HÀM XỬ LÝ LOGIC NÚT BẤM
  const handleTabClick = (tabId, e) => {
    if (e) e.preventDefault();
    if (tabId === activeTab) return; // Nếu đang ở tab đó rồi thì không làm gì cả

    // Khi bấm tab mới, cắt bỏ tương lai (nếu đang back về quá khứ) và thêm tab mới vào mảng
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(tabId);
    
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1); // Dời con trỏ đến phần tử cuối cùng vừa thêm
  };

  const handleBack = () => {
    // Nếu chưa lùi về tận cùng (index > 0) thì lùi con trỏ lại 1 bước
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleForward = () => {
    // Nếu chưa tiến đến tận cùng thì tăng con trỏ lên 1 bước
    if (currentIndex < history.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleRefresh = () => {
    if (isLoading) return; // Chặn spam click khi đang load dở
    
    setIsLoading(true);
    setProgress(15); // Bắt đầu ở 15%

    // Giả lập tốc độ mạng thời "quay số" dial-up (tăng dần % lên)
    setTimeout(() => setProgress(40), 200);
    setTimeout(() => setProgress(75), 400);
    setTimeout(() => {
      setProgress(100); // Đầy bình
      // Đợi thêm một nhịp nhỏ cho người dùng thấy đã đầy 100% rồi mới tắt loading
      setTimeout(() => setIsLoading(false), 200); 
    }, 600);
}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#c0c0c0' }}>
      
      {/* --- HÀNG 1: TOOLBAR --- */}
      <div style={{ display: 'flex', gap: '5px', padding: '2px 4px', borderBottom: '1px solid #808080' }}>
        <button 
          style={{ minWidth: '50px', padding: '2px' }} 
          onClick={handleBack} 
          disabled={currentIndex === 0} // Làm mờ nút nếu không thể Back được nữa
        >
          <span style={{ fontSize: '18px', display: 'block' }}>←</span> Back
        </button>
        <button 
          style={{ minWidth: '50px', padding: '2px' }} 
          onClick={handleForward}
          disabled={currentIndex === history.length - 1} // Làm mờ nút nếu không thể Forward
        >
          <span style={{ fontSize: '18px', display: 'block' }}>→</span> Forward
        </button>
        <button style={{ minWidth: '50px', padding: '2px' }} onClick={handleRefresh}>
          <span style={{ fontSize: '18px', display: 'block' }}>↺</span> Refresh
        </button>
        <button style={{ minWidth: '50px', padding: '2px' }} onClick={() => handleTabClick('about')}>
          <span style={{ fontSize: '18px', display: 'block' }}>⌂</span> Home
        </button>
      </div>

      {/* --- HÀNG 2: THANH ĐỊA CHỈ --- */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '4px', borderBottom: '2px groove #fff' }}>
        <span style={{ marginRight: '5px', color: '#000' }}>Address</span>
        {/* URL giờ sẽ tự động nhảy theo currentUrl */}
        <input type="text" value={currentUrl} readOnly style={{ flexGrow: 1, padding: '2px', backgroundColor: '#fff', border: '2px inset #dfdfdf', color: '#808080' }} />
        <button onClick={handleRefresh} style={{ marginLeft: '4px', fontWeight: 'bold' }}>Go</button>
      </div>

      {/* --- HÀNG 3: MENU TABS --- */}
      <div style={{ padding: '5px 4px 0 4px' }}>
        <menu role="tablist" className="multirows" style={{ display: 'flex', margin: 0 }}>
            <li role="tab" aria-selected={activeTab === 'about'} onClick={(e) => handleTabClick('about', e)}>
                <a href="#about">About me</a>
            </li>
            <li role="tab" aria-selected={activeTab === 'projects'} onClick={(e) => handleTabClick('projects', e)}>
                <a href="#projects">My projects</a>
            </li>
            <li role="tab" aria-selected={activeTab === 'contact'} onClick={(e) => handleTabClick('contact', e)}>
                <a href="#contact">Contact</a>
            </li>
        </menu>
      </div>

      {/* --- HÀNG 4: NỘI DUNG TRANG WEB --- */}
      <div className="window" role="tabpanel" style={{ flexGrow: 1, margin: '0 4px 4px 4px', height: 0, overflowY: 'auto', backgroundColor: '#fff', color: '#000' }}>
        <div className="window-body" style={{ padding: '15px' }}>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
                <img src="https://win98icons.alexmeub.com/icons/png/world-1.png" alt="World" width="32" style={{ marginBottom: '10px' }} />
                <p style={{ marginBottom: '10px' }}>Đang tải dữ liệu trang web...</p>
                
                {/* Đã đổi class thành className và truyền biến progress vào style width */}
                <div className="progress-indicator segmented" style={{ width: '250px' }}>
                    <span className="progress-indicator-bar" style={{ width: `${progress}%` }} />
                </div>
            </div>
          ) : (
            <>
              {/* ================= NỘI DUNG TAB: ABOUT ME ================= */}
              {activeTab === 'about' && (
                <div>
                  <h1 style={{ textAlign: 'center', color: '#000080', textDecoration: 'underline', fontFamily: '"Comic Sans MS", cursive, sans-serif' }}>
                    <marquee scrollamount="5">Chào mừng đến với Homepage của Trần Phan Minh Thuận!</marquee>
                  </h1>
                  <img src={Myavatar} alt="Avatar" className="avatar-retro" />
                  <h3 style={{ borderBottom: '1px solid #000080', marginTop: 0 }}>Về bản thân:</h3>
                  <p>Tôi là sinh viên năm 3 chuyên ngành Software Engineering tại Đại học Nguyễn Tất Thành.</p>
                  <p>Mục tiêu: Trở thành Dev thực chiến, tập trung build project thật, nói không với lý thuyết lan man.</p>
                  <div style={{ clear: 'both' }}></div>
                  <fieldset style={{ marginTop: '20px', padding: '10px' }}>
                    <legend style={{ fontWeight: 'bold' }}>Tech Stack & Đam mê</legend>
                    <ul style={{ lineHeight: '1.6' }}>
                      <li><b>Ngôn ngữ:</b> C++, Python, JavaScript, Rust, Flutter.</li>
                      <li><b>Lĩnh vực:</b> Web, System Admin, CLI Tools, Automation.</li>
                      <li><b>Mảng cốt lõi:</b> Cấu trúc dữ liệu và giải thuật (DSA).</li>
                    </ul>
                  </fieldset>
                </div>
              )}

              {/* ================= NỘI DUNG TAB: MY PROJECTS ================= */}
              {activeTab === 'projects' && (
                <div>
                  <h2 style={{ color: '#000080', borderBottom: '2px solid #dfdfdf', paddingBottom: '5px' }}>Dự án thực chiến</h2>
                  <p>Những project tôi đang build và phát triển:</p>
                  <ul>
                    <li style={{ marginBottom: '15px' }}><b>PC Shield (Rust)</b>: Tool giám sát mạng, phát hiện ARP Spoofing. Tối ưu hiệu năng và an toàn bộ nhớ.</li>
                    <li style={{ marginBottom: '15px' }}><b>Sync Schedule Tool (Python)</b>: Tự động scrape dữ liệu lịch học từ portal NTTU và VUS.</li>
                    <li style={{ marginBottom: '15px' }}><b>QuanLyKhachSan (C#)</b>: Hệ thống quản lý khách sạn, làm chung với partner.</li>
                  </ul>
                </div>
              )}

              {/* ================= NỘI DUNG TAB: CONTACT ================= */}
              {activeTab === 'contact' && (
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <img src="https://win98icons.alexmeub.com/icons/png/envelope_closed-0.png" alt="Mail" width="64" />
                  <h2 style={{ color: '#000080' }}>Liên hệ với tôi</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginTop: '20px' }}>
                    <button style={{ width: '200px', fontWeight: 'bold' }} onClick={() => window.open('https://github.com/Thuantran520', '_blank')} target="_blank" rel="noopener noreferrer">My GitHub</button>
                    <button style={{ width: '200px', fontWeight: 'bold' }} onClick={() => window.open('mailto:tranphanminhthuan2674@gmail.com', '_blank')} target="_blank" rel="noopener noreferrer">Gửi Email</button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
      
    </div>
  );
}
