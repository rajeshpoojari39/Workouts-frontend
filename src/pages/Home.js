import { useEffect, useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [formToggle, setFormToggle] = useState(false);
  const [viewWidth, setViewWidth] = useState();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch(
        "https://workouts-backend-production.up.railway.app/api/workouts",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_WORKOUTS", payload: json });
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!viewWidth) {
      setViewWidth(window.innerWidth);
    }

    window.addEventListener("resize", () => {
      setViewWidth(window.innerWidth);
    });

    if (viewWidth < "600") {
      setFormToggle(false);
    }

    if (viewWidth > "600") {
      setFormToggle(true);
    }

    return () => {
      window.removeEventListener("resize", () => {
        setViewWidth(window.innerWidth);
      });
    };
  }, [viewWidth]);

  return (
    <>
      {viewWidth < "600" && (
        <button
          className="formToggle"
          onClick={() => setFormToggle(!formToggle)}
        >
          Workout Form
        </button>
      )}

      <div className="home">
        <div className="workouts">
          {workouts &&
            workouts.map((workout) => (
              <WorkoutDetails workout={workout} key={workout._id} />
            ))}
        </div>
        {formToggle && <WorkoutForm />}
      </div>
    </>
  );
};

export default Home;
