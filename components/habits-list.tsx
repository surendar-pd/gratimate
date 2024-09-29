"use client";
import React, { useEffect, useState } from "react";
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
	doc,
	setDoc,
	getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import getAuth and onAuthStateChanged from Firebase

// Define interfaces for Habit and Entry
interface Habit {
	_id: string;
	name: string; // Assuming habits have a name field
	_creationTime: string; // Assuming _creationTime is a string representing a timestamp
}

interface Entry {
	habitId: string;
	date: string;
	value: string;
}

interface HabitWithEntry {
	habitId: string;
	habit: Habit;
	entry: Entry | null;
}

const HabitsList: React.FC = () => {
	const [habits, setHabits] = useState<HabitWithEntry[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [userId, setUserId] = useState<string | null>(null);
	const date = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
	const auth = getAuth(); // Get Firebase Authentication instance

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				const uid = user.uid;
				setUserId(uid); // Set the user ID
			} else {
				// Handle signed-out state (e.g., redirect to login)
				console.error("No user is currently logged in.");
				setUserId(null); // Reset userId if not logged in
			}
		});

		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, [auth]);

	useEffect(() => {
		const fetchHabits = async () => {
			if (userId) {
				// Only fetch habits if userId is available
				try {
					const habitsData = await getHabits({ userId, date });
					setHabits(habitsData);
				} catch (error) {
					console.error("Error fetching habits:", error);
				} finally {
					setLoading(false);
				}
			}
		};

		fetchHabits();
	}, [userId, date]);

	if (loading) {
		return <div>Loading habits...</div>;
	}

	return (
		<div>
			<h2>Your Habits</h2>
			{habits.length === 0 ? (
				<p>No habits found.</p>
			) : (
				<ul>
					{habits.map(({ habitId, habit, entry }) => (
						<li key={habitId}>
							<strong>{habit.name}</strong>
							<p>
								Created on:{" "}
								{new Date(
									habit._creationTime
								).toLocaleDateString()}
							</p>
							<p>
								Entry for {date}:{" "}
								{entry ? entry.value : "Not logged yet"}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default HabitsList;

// Utility function to parse ISO strings
function parseISOString(s: string) {
	const dateString = `${s}T00:00:00.000Z`;
	const b = dateString.split(/\D+/).map((n) => parseInt(n, 10));
	return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

// The getHabits function remains unchanged
const getHabits = async ({
	userId,
	date,
}: {
	userId: string;
	date: string;
}): Promise<HabitWithEntry[]> => {
	const db = getFirestore(); // Get Firestore instance
	const habitsCollection = collection(db, "habits");

	const habitsQuery = query(habitsCollection, where("userId", "==", userId));
	const habitsSnapshot = await getDocs(habitsQuery);

	const habits: HabitWithEntry[] = (
		await Promise.all(
			habitsSnapshot.docs.map(async (habitDoc) => {
				const habit = habitDoc.data() as Habit; 
				const habitCreatedDate = new Date(habit._creationTime);

				habitCreatedDate.setHours(0, 0, 0, 0);
				const userSelectedDate = parseISOString(date);

				if (userSelectedDate >= habitCreatedDate) {
					const entryDocRef = doc(
						db,
						"entries",
						`${habitDoc.id}-${date}`
					);

					const entrySnapshot = await getDoc(entryDocRef);

					if (!entrySnapshot.exists()) {
						await setDoc(entryDocRef, {
							habitId: habitDoc.id,
							date: date,
							value: "N",
						});
					}

					const entryData = (await getDoc(entryDocRef)).data() as
						| Entry
						| undefined;

					return {
						habitId: habitDoc.id,
						habit: { ...habit, _id: habitDoc.id }, 
						entry: entryData || null,
					};
				}
				return null; 
			})
		)
	).filter((habit): habit is HabitWithEntry => habit !== null);

	return habits.filter((habit): habit is HabitWithEntry => habit !== null);
};
