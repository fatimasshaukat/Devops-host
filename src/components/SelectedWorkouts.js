import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import "../index.css";

const SelectedWorkouts = () => {
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

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

  // Handle Delete Function
  const handleDelete = async (id) => {
    if (!id) {
      alert("⚠️ Invalid workout ID.");
      return;
    }
    try {
      const docRef = doc(firestore, "workouts", id);
      console.log("Deleting document with ID:", id);
      await deleteDoc(docRef);

      setSavedWorkouts((prev) => prev.filter((workout) => workout.id !== id));
      alert("✅ Workout removed successfully!");
    } catch (error) {
      console.error("Error deleting workout:", error.message);
      alert("⚠️ Failed to delete workout. Please try again.");
    }
  };

  // Handle Edit Click
  const handleEditClick = (workout) => {
    setEditingId(workout.id);
    setEditName(workout.name);
    setEditDescription(workout.description);
  };

  // Handle Update Function
  const handleUpdate = async (id) => {
    if (!editName || !editDescription) {
      alert("⚠️ Please fill in all fields.");
      return;
    }

    try {
      const docRef = doc(firestore, "workouts", id);
      await updateDoc(docRef, {
        name: editName,
        description: editDescription,
      });

      setSavedWorkouts((prev) =>
        prev.map((workout) =>
          workout.id === id
            ? { ...workout, name: editName, description: editDescription }
            : workout
        )
      );

      alert("✅ Workout updated successfully!");
      setEditingId(null);
      setEditName("");
      setEditDescription("");
    } catch (error) {
      console.error("Error updating workout:", error.message);
      alert("⚠️ Failed to update workout. Please try again.");
    }
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  return (
    <div>
      <h1 className="title">💪 My Saved Workouts</h1>

      {savedWorkouts.length > 0 ? (
        <div className="workout-container">
          {savedWorkouts.map((workout) => (
            <div key={workout.id} className="workout-card">
              {editingId === workout.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Workout Name"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Workout Description"
                  />
                  <button onClick={() => handleUpdate(workout.id)}>✅ Save</button>
                  <button onClick={handleCancelEdit}>❌ Cancel</button>
                </>
              ) : (
                <>
                  <h2>{workout.name || "Unnamed Workout"}</h2>
                  <p>{workout.description || "No description available"}</p>
                  <button onClick={() => handleEditClick(workout)}>✏️ Edit</button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(workout.id)}
                  >
                    🗑️ Delete Plan
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No workouts saved yet.</p>
      )}

      <Link to="/">
        <button className="back-btn">⬅️ Back to Workouts</button>
      </Link>
    </div>
  );
};

export default SelectedWorkouts;
