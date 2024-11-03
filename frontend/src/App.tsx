import './App.css'
import PollList from "./components/PollList.tsx";
import CreatePollPopup from "./components/CreatePollPopup.tsx";

function App() {
  return (
    <>
        <CreatePollPopup />
        <PollList />
    </>
  )
}

export default App
