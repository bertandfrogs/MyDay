import { useAppData } from "../AppDataContext";
import { useState } from "react";
import {
  Container,
  Form,
  Button,
  ListGroup,
  ButtonGroup,
  Modal,
  Card,
} from "react-bootstrap";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority?: number; // 1 = High, 2 = Medium, 3 = Low
}

function Todo() {
  const { tasks, setTasks } = useAppData();
  const [newTask, setNewTask] = useState("");
  const [newDueDate, setNewDueDate] = useState<string | undefined>();
  const [newPriority, setNewPriority] = useState<number>(2); // Default = Medium
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState<string | undefined>(); // Edit due date
  const [editPriority, setEditPriority] = useState<number>(2); // Edit priority
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | null>(null);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        completed: false,
        dueDate: newDueDate || undefined,
        priority: newPriority,
      },
    ]);
    setNewTask("");
    setNewDueDate(undefined);
    setNewPriority(2);
    setShowAddModal(false);
  };

  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
    setEditTask(null);
  };

  const startEditTask = (task: Task) => {
    setEditTask(task);
    setEditText(task.text);
    setEditDueDate(task.dueDate);
    setEditPriority(task.priority || 2); // Set initial priority if not defined
  };

  const saveEditTask = () => {
    if (editTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editTask.id
            ? {
                ...task,
                text: editText,
                dueDate: editDueDate,
                priority: editPriority,
              }
            : task
        )
      );
      setEditTask(null);
      setEditText("");
      setEditDueDate(undefined);
      setEditPriority(2);
    }
  };

  const renderTask = (task: Task) => (
    <ListGroup.Item
      key={task.id}
      className="list-item d-flex justify-content-between align-items-center"
      variant={task.completed ? "success" : undefined}
    >
      <div>
        <div style={{ textDecoration: task.completed ? "line-through" : "none" }}>
          <strong>{task.text}</strong>
        </div>
        {task.dueDate && (
          <div className="text-muted" style={{ fontSize: "0.8rem" }}>
            Due: {new Date(task.dueDate).toLocaleString()}
          </div>
        )}
        {task.priority && (
          <div className="text-muted" style={{ fontSize: "0.8rem" }}>
            Priority: {["High", "Medium", "Low"][task.priority - 1]}
          </div>
        )}
      </div>
      <ButtonGroup>
        <Button
          className="done"
          variant="outline-success"
          size="sm"
          onClick={() => toggleComplete(task.id)}
        >
          {task.completed ? "Undo" : "Done"}
          {task.completed ? (
            <i className="bi bi-arrow-counterclockwise"></i>
          ) : (
            <i className="bi bi-check-lg"></i>
          )}
        </Button>
        <Button
          className="edit"
          variant="outline-secondary"
          size="sm"
          onClick={() => startEditTask(task)}
        >
          Edit <i className="bi bi-pencil-fill"></i>
        </Button>
      </ButtonGroup>
    </ListGroup.Item>
  );

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === "priority") {
      return (a.priority || 4) - (b.priority || 4);
    }
    return 0;
  });

  const incompleteTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>To-Do List</h1>
        <Button onClick={() => setShowAddModal(true)}>Add Task</Button>
      </div>

      <div className="mb-3">
        <ButtonGroup>
          <Button
            variant={sortBy === "dueDate" ? "dark" : "outline-dark"}
            onClick={() => setSortBy("dueDate")}
          >
            Sort by Due Date
          </Button>
          <Button
            variant={sortBy === "priority" ? "dark" : "outline-dark"}
            onClick={() => setSortBy("priority")}
          >
            Sort by Priority
          </Button>
        </ButtonGroup>
      </div>

      <Container className="m-0 p-0 d-flex justify-content-between flex-wrap">
        {/* Scheduled Tasks (Left) */}
        <Card
          className="todo-list with-date me-3 flex-fill mb-3 mb-md-0"
          style={{ maxWidth: "48%" }}
        >
          <Card.Header className="bg-primary text-black fw-bold">Scheduled</Card.Header>
          <ListGroup variant="flush">
            {incompleteTasks
              .filter((task) => task.dueDate)
              .map(renderTask)}
          </ListGroup>
        </Card>

        {/* Unscheduled Tasks (Right) */}
        <Card
          className="todo-list no-date flex-fill mb-3 mb-md-0"
          style={{ maxWidth: "48%" }}
        >
          <Card.Header className="bg-secondary text-black fw-bold">Unscheduled</Card.Header>
          <ListGroup variant="flush">
            {incompleteTasks
              .filter((task) => !task.dueDate)
              .map(renderTask)}
          </ListGroup>
        </Card>
      </Container>

      {completedTasks.length > 0 && (
        <div className="mt-5">
          <h5>Completed</h5>
          <ListGroup>{completedTasks.map(renderTask)}</ListGroup>
        </div>
      )}

      {/* Edit Task Modal */}
      <Modal show={!!editTask} onHide={() => setEditTask(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Task name"
            className="mb-3"
          />
          
          {/* Due Date & Time Field */}
          <Form.Group className="mb-3">
            <Form.Label>Due Date & Time (optional)</Form.Label>
            <Form.Control
              type="datetime-local"
              value={editTask?.dueDate || ""}
              onChange={(e) => setNewDueDate(e.target.value || undefined)}
            />
          </Form.Group>

          {/* Priority Field */}
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              value={editTask?.priority || 2}
              onChange={(e) =>
                setNewPriority(Number(e.target.value))
              }
            >
              <option value={1}>High</option>
              <option value={2}>Medium</option>
              <option value={3}>Low</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => editTask && deleteTask(editTask.id)}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setEditTask(null)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEditTask}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Add Task Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task name"
            className="mb-3"
          />
          <Form.Group className="mb-3">
            <Form.Label>Due Date & Time (optional)</Form.Label>
            <Form.Control
              type="datetime-local"
              value={newDueDate || ""}
              onChange={(e) => setNewDueDate(e.target.value || undefined)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Priority</Form.Label>
            <Form.Select
              value={newPriority}
              onChange={(e) => setNewPriority(Number(e.target.value))}
            >
              <option value={1}>High</option>
              <option value={2}>Medium</option>
              <option value={3}>Low</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addTask}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Todo;
