// src/components/Terminal.jsx
import { useState, useRef, useEffect } from 'react';

export default function Terminal({ closeApp }) {
  // 1. State lưu lịch sử các dòng lệnh
  const [history, setHistory] = useState([
    { id: 0, text: 'Microsoft(R) Windows DOS' },
    { id: 1, text: '(C)Copyright Microsoft Corp 1981-1998.' },
    { id: 2, text: 'Gõ "help" để xem danh sách lệnh.' },
  ]);
  
  // 2. State lưu chữ người dùng đang gõ
  const [input, setInput] = useState('');
  
  // Tham chiếu để tự động cuộn xuống đáy khi có dòng mới
  const endOfTerminalRef = useRef(null);
  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // 3. Hàm xử lý khi bấm Enter
  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();

      if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      if (cmd === 'exit') {
        closeApp();
        return;
      }

      const newHistory = [...history, { id: Date.now(), text: `C:\\Windows\\System32> ${input}` }];

      if (cmd === 'help') {
        const output = 'Các lệnh hỗ trợ:\n > whoami\n > skills\n > projects\n > clear\n > exit\n';
        output.split('\n').forEach((line, index) => newHistory.push({ id: Date.now() + index + 1, text: line }));
      } else if (cmd === 'whoami') {
        const output = 'Trần Phan Minh Thuận - Software Engineering Student. Đam mê build project thực chiến, không thích lý thuyết suông.';
        newHistory.push({ id: Date.now() + 1, text: output });
      } else if (cmd === 'skills') {
        const output = '> Ngôn ngữ: C++, Python, JavaScript, Rust\n> Công nghệ: Flutter, React\n> Chuyên môn: DSA, CLI tools, Automation, System Admin';
        output.split('\n').forEach((line, index) => newHistory.push({ id: Date.now() + index + 1, text: line }));
      } else if (cmd === 'projects') {
        // Fetch GitHub repos for the user's profile and display names
        try {
          const res = await fetch('https://api.github.com/users/Thuantran520/repos?per_page=100&sort=updated');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const repos = await res.json();
          if (Array.isArray(repos) && repos.length > 0) {
            repos.forEach((r, i) => {
              const nameLine = `${i + 1}. ${r.name} - ${r.description || ''}`.trim();
              newHistory.push({ id: Date.now() + i + 1, text: nameLine });
              newHistory.push({ id: Date.now() + i + 1000, text: `   ${r.html_url}` });
            });
          } else {
            newHistory.push({ id: Date.now() + 1, text: 'Không tìm thấy project nào.' });
          }
        } catch {
          newHistory.push({ id: Date.now() + 1, text: 'Không thể tải dự án từ GitHub.' });
        }
      } else if (cmd !== '') {
        newHistory.push({ id: Date.now() + 1, text: `'${cmd}' is not recognized as an internal or external command.` });
      }

      setHistory(newHistory);
      setInput('');
    }
  };

  return (
    <div style={{ padding: '5px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} onClick={() => document.getElementById('term-input').focus()}>
      {/* In lịch sử ra màn hình */}
      {history.map(line => (
        <div key={line.id} style={{ whiteSpace: 'pre-wrap' }}>{line.text}</div>
      ))}
      
      {/* Dòng gõ lệnh hiện tại */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>C:\Windows\System32&gt;&nbsp;</span>
        <input 
          id="term-input"
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          
          autoFocus
          autoComplete="off"
          spellCheck="false"
          style={{ 
            flexGrow: 1, background: 'transparent', border: 'none', color: '#0f0', 
            outline: 'none', fontFamily: 'monospace', fontSize: 'inherit', boxShadow: 'none', padding: 0, margin: 0
          }} 
        />
      </div>
      <div ref={endOfTerminalRef} />
    </div>
  );
}