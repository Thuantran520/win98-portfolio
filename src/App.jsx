import Desktop from './components/Desktop'
import WindowApp from './components/WindowApp'
import Taskbar from './components/Taskbar'
import './App.css'

// Tư duy ghép Lego trong React
function App() {
  return (
    <Desktop>
       <WindowApp />
       <Taskbar />
    </Desktop>
  )
}

export default App
