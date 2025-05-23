import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import "../index.css";

// Mock Data
const mockWorkouts = [
  { name: "Full Body Workout", description: "A great full-body routine." },
  { name: "Cardio Burn", description: "High-intensity cardio session." },
  { name: "Strength Training", description: "Build muscle with weight training." },
];

const WorkoutList = () => {
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  // Fetch saved workouts from Firestore
  useEffect(() => {
    const fetchSavedWorkouts = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "workouts"));
        const workouts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSavedWorkouts(workouts);
      } catch (error) {
        console.error("Error fetching workouts: ", error);
      }
    };

    fetchSavedWorkouts();
  }, []);

  // Save workout to Firestore
  const handleSave = async (workout) => {
    if (savedWorkouts.some((item) => item.name === workout.name)) {
      alert("Workout already saved!");
      return;
    }
    try {
      console.log("Attempting to save workout:", workout);
      const workoutsCollection = collection(firestore, "workouts");
      console.log("Collection reference created");
      const docRef = await addDoc(workoutsCollection, workout);
      console.log("Document saved successfully with ID:", docRef.id);
      setSavedWorkouts((prev) => [...prev, { id: docRef.id, ...workout }]);
      alert(`"${workout.name}" saved to your plans!`);
    } catch (error) {
      console.error("Detailed error saving workout:", {
        code: error.code,
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      if (error.code === 'permission-denied') {
        alert("Permission denied. Please check your Firebase security rules.");
      } else if (error.code === 'unavailable') {
        alert("Firebase service is currently unavailable. Please try again later.");
      } else if (error.code === 'invalid-argument') {
        alert("Invalid data format. Please try again.");
      } else {
        alert(`Failed to save the workout: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <h1 className="title">🏋️‍♂️ Workout Plans</h1>
      <div className="workout-container">
        {mockWorkouts.map((workout, index) => (
          <div key={index} className="workout-card">
            <h2>{workout.name}</h2>
            <p>{workout.description}</p>
            <button onClick={() => handleSave(workout)}>💾 Save to My Plans</button>
          </div>
        ))}
      </div>
      <Link to="/selected">
        <button style={{ marginTop: "20px" }}>View My Plans</button>
      </Link>
    </div>
  );
};

export default WorkoutList;
