import { useAppData } from "../AppDataContext";
import { useState } from "react";
import {
  Container,
  Form,
  Button,
  ListGroup,
  Modal,
  ToggleButtonGroup,
  ToggleButton,
  Row,
  Col,
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Habit {
  id: number;
  name: string;
  log: { [date: string]: boolean };
  type: "good" | "bad";
}

function getCurrentStreak(log: { [date: string]: boolean }): number {
  let streak = 0;
  let date = new Date();
  while (true) {
    const dateStr = date.toISOString().split("T")[0];
    if (log[dateStr]) {
      streak++;
    } else {
      break;
    }
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

function getHistory(log: {
  [date: string]: boolean;
}): { date: string; checked: boolean }[] {
  const history = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const str = date.toISOString().split("T")[0];
    history.push({ date: str, checked: !!log[str] });
  }
  return history;
}

function Habits() {
  const { habits, setHabits } = useAppData();
  const [newHabit, setNewHabit] = useState("");
  const [newHabitType, setNewHabitType] = useState<"good" | "bad">("good");
  const [showAddModal, setShowAddModal] = useState(false);

  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedType, setEditedType] = useState<"good" | "bad">("good");

  const todayStr = new Date().toISOString().split("T")[0];

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setHabits([
      ...habits,
      {
        id: Date.now(),
        name: newHabit,
        log: { [todayStr]: false },
        type: newHabitType,
      },
    ]);
    setNewHabit("");
    setNewHabitType("good");
    setShowAddModal(false);
  };

  const toggleToday = (id: number) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              log: {
                ...habit.log,
                [todayStr]: !habit.log[todayStr],
              },
            }
          : habit
      )
    );
  };

  const renderHabitRow = (habit: Habit) => (
    <ListGroup.Item
      style={{
        backgroundColor: habit.type === "good" ? "#26ab7b" : "#ff6b6d",
        borderLeft: habit.type === "good" ? "4px solid green" : "4px solid red",
      }}
      key={habit.id}
      className="d-flex justify-content-between align-items-center"
    >
      <div>
        <strong>{habit.name}</strong>
        <span className="ms-2">
          {habit.type === "good" ? (
            <i className="bi bi-fire"></i>
          ) : (
            <i className="bi bi-exclamation-triangle-fill"></i>
          )}{" "}
          {getCurrentStreak(habit.log)}
        </span>
      </div>
      <div className="d-flex gap-2">
        <Button
          variant={
            habit.log[todayStr]
              ? habit.type === "good"
                ? "success"
                : "danger"
              : "outline-dark"
          }
          size="sm"
          onClick={() => toggleToday(habit.id)}
        >
          {habit.log[todayStr] ? <i className="bi bi-check-lg"></i> : "Mark"}
        </Button>
        <Button
          variant="outline-dark"
          size="sm"
          onClick={() => {
            setEditingHabit(habit);
            setEditedName(habit.name);
            setEditedType(habit.type);
          }}
          title="Edit"
        >
          <i className="bi bi-pencil-fill"></i>
        </Button>
        <Button
          variant="outline-dark"
          size="sm"
          onClick={() => setHabits(habits.filter((h) => h.id !== habit.id))}
          title="Delete"
        >
          <i className="bi bi-trash"></i>
        </Button>
      </div>
    </ListGroup.Item>
  );

  const renderHabitHistory = (habit: Habit) => {
    const history = getHistory(habit.log);
    return (
      <div key={habit.id} className="mt-2 mb-3">
        <div>
          <strong>{habit.name}</strong> (Past 7 Days)
        </div>
        <div className="d-flex gap-2 mt-1">
          {history.map((day) => (
            <div
              key={day.date}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: day.checked
                  ? habit.type === "good"
                    ? "green"
                    : "red"
                  : "#ccc",
              }}
              title={day.date}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  const goodHabits = habits.filter((h) => h.type === "good");
  const badHabits = habits.filter((h) => h.type === "bad");

  const getChartData = (filterType: "good" | "bad") => {
    return habits
      .filter((h) => h.type === filterType)
      .map((habit) => {
        const history = getHistory(habit.log);
        const count = history.filter((h) => h.checked).length;
        return { name: habit.name, count };
      });
  };

  return (
    <Container className="habits mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Habit Tracker</h1>
        <Button
          style={{ backgroundColor: "#8fd3fe", fontWeight: "bold" }}
          onClick={() => setShowAddModal(true)}
        >
          Add Habit
        </Button>
      </div>

      <Row>
        <Col md={6}>
          <h5>Good Habits</h5>
          <ListGroup>{goodHabits.map(renderHabitRow)}</ListGroup>
        </Col>
        <Col md={6}>
          <h5>Bad Habits</h5>
          <ListGroup>{badHabits.map(renderHabitRow)}</ListGroup>
        </Col>
      </Row>

      <div className="mt-5">
        <h6>Habit History (Last 7 Days)</h6>
        <Row>
          <Col md={6}>{goodHabits.map(renderHabitHistory)}</Col>
          <Col md={6}>{badHabits.map(renderHabitHistory)}</Col>
        </Row>
      </div>

      <div className="mt-5">
        <h6>Stats (Completions in Past 7 Days)</h6>
        <Row>
          <Col md={6}>
            <h6>Good Habits</h6>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getChartData("good")}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#28a745" />
              </BarChart>
            </ResponsiveContainer>
          </Col>
          <Col md={6}>
            <h6>Bad Habits</h6>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getChartData("bad")}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#dc3545" />
              </BarChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </div>

      {/* Add Habit Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Habit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Habit name"
            className="mb-3"
          />
          <ToggleButtonGroup
            type="radio"
            name="habitType"
            value={newHabitType}
            onChange={(val: "good" | "bad") => setNewHabitType(val)}
          >
            <ToggleButton
              id="good-habit"
              value="good"
              variant="outline-success"
            >
              Good
            </ToggleButton>
            <ToggleButton id="bad-habit" value="bad" variant="outline-danger">
              Bad
            </ToggleButton>
          </ToggleButtonGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addHabit}>
            Add Habit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Habit Modal */}
      <Modal
        show={!!editingHabit}
        onHide={() => setEditingHabit(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Habit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="mb-3"
          />
          <ToggleButtonGroup
            type="radio"
            name="editType"
            value={editedType}
            onChange={(val: "good" | "bad") => setEditedType(val)}
          >
            <ToggleButton id="edit-good" value="good" variant="outline-success">
              Good
            </ToggleButton>
            <ToggleButton id="edit-bad" value="bad" variant="outline-danger">
              Bad
            </ToggleButton>
          </ToggleButtonGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditingHabit(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (!editingHabit) return;
              setHabits(
                habits.map((h) =>
                  h.id === editingHabit.id
                    ? { ...h, name: editedName, type: editedType }
                    : h
                )
              );
              setEditingHabit(null);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Habits;
