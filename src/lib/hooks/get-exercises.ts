import { db } from "$lib/firebase.client";
import { collection, getDocs } from "firebase/firestore";

export interface Exercise {
    id: string;
    [key: string]: any;
  }

/**
 * Get all exercises from Firestore.
 * @returns {Exercise[]} An array of Exercise objects, one for each exercise in Firestore.
 */
export const getExercises = async (): Promise<Exercise[]|null> => {
  try {
    const exercisesCollection = collection(db, "Exercises");
    const exercisesSnapshot = await getDocs(exercisesCollection);
    const exercises = exercisesSnapshot.docs.map((exercise) => ({
      id: exercise.id,
      ...exercise.data()
    }));
    return exercises;
  } catch (error) {
    console.error(error);
    return null;
  }
};



