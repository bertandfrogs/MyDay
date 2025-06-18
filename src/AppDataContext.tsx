import { createContext, useContext, useState, ReactNode, useEffect } from "react";

import { User } from "firebase/auth";
import DataManager from "./managers/DataManager";

type colorData = {
  name: string,
  hex: string,
}

export const gcColors: Map<string, colorData> = new Map([
  ["1", {
    name: "Lavender",
    hex: "#A4BDFC"
  }],

  ["2", {
    name: "Sage",
    hex: "#7AE7BF"
  }],

  ["3", {
    name: "Grape",
    hex: "#DBADFF"
  }],

  ["4", {
    name: "Flamingo",
    hex: "#FF887C"
  }],

  ["5", {
    name: "Banana",
    hex: "#FBD75B"
  }],

  ["6", {
    name: "Tangerine",
    hex: "#FFB878"
  }],

  ["7", {
    name: "Peacock",
    hex: "#46D6DB"
  }],

  ["8", {
    name: "Graphite",
    hex: "#E1E1E1"
  }],

  ["9", {
    name: "Blueberry",
    hex: "#5484ED"
  }],

  ["10", {
    name: "Basil",
    hex: "#51B749"
  }],

  ["11", {
    name: "Tomato",
    hex: "#DC2127"
  }]
]);

export interface Appointment {
  id: string;
  title: string;
  location: string | undefined;
  startTime: string | undefined; // e.g., "13:00"
  endTime: string | undefined; // e.g., "14:30"
  color: string | undefined;
}

export function convertGCtoAppointment(event: gapi.client.calendar.Event): Appointment {
  return {
    id: event.id,
    title: event.summary,
    location: event.location,
    startTime: event.start.dateTime,
    endTime: event.end.dateTime,
    color: event.colorId
  }
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority?: number; // 1 = High, 2 = Medium, 3 = Low
}

export interface Goal {
  id: number;
  name: string;
  log: { [date: string]: boolean };
}

export interface Habit {
  id: number;
  name: string;
  log: { [date: string]: boolean };
  type: "good" | "bad";
}

interface AppDataContextType {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  todayAppointments: Appointment[] | undefined;
  setTodayAppointments: React.Dispatch<React.SetStateAction<Appointment[] | undefined>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  dataManager: DataManager;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

interface appDataProviderProps {
  children: ReactNode;
  appointments?: Appointment[];
  tasks?: Task[];
  goals?: Goal[];
  habits?: Habit[];
}

export function AppDataProvider(props: appDataProviderProps) {
  const dataManager = new DataManager();

  const [appointments, setAppointments] = useState<Appointment[]>(
    props.appointments ? props.appointments : []
  );
  const [tasks, setTasks] = useState<Task[]>(props.tasks ? props.tasks : []);
  const [goals, setGoals] = useState<Goal[]>(props.goals ? props.goals : []);
  const [habits, setHabits] = useState<Habit[]>(
    props.habits ? props.habits : []
  );
  const [currentUser, setCurrentUser] = useState(
    dataManager.getCurrentUser()
  );
  const [todayAppointments, setTodayAppointments] = useState<Appointment[] | undefined>();

  function onAuthStateChange(setUser: React.Dispatch<React.SetStateAction<User | null>>) {
    return dataManager.firebaseManager.auth.onAuthStateChanged((user) => {
      setUser(user);
    })
  }

  useEffect(() => {
    const subscribeAuth = onAuthStateChange(setCurrentUser);
    return () => {
      subscribeAuth();
    };
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        appointments,
        setAppointments,
        tasks,
        setTasks,
        goals,
        setGoals,
        habits,
        setHabits,
        currentUser,
        setCurrentUser,
        dataManager,
        todayAppointments,
        setTodayAppointments
      }}
    >
      {props.children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}