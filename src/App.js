import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WorkoutList from "./components/WorkoutList";
import SelectedWorkouts from "./components/SelectedWorkouts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WorkoutList />} />
        <Route path="/selected" element={<SelectedWorkouts />} />
      </Routes>
    </Router>
  );
}

export default App;
