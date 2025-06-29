import { useState } from "react";
import {
  convertGCtoAppointment,
  gcColors,
  useAppData,
} from "../AppDataContext";
import {
  Container,
  Card,
  ListGroup,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { WidthProvider, Responsive } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

function Dashboard() {
  const {
    todayAppointments,
    tasks,
    goals,
    setTodayAppointments,
    setTasks,
    setGoals,
    habits,
    dataManager,
    currentUser
  } = useAppData();

  // Today’s date
  const todayStr = new Date().toISOString().split("T")[0];

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");

  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [newAppointmentTitle, setNewAppointmentTitle] = useState("");
  const [newAppointmentStartTime, setNewAppointmentStartTime] =
    useState("12:00");
  const [newAppointmentEndTime, setNewAppointmentEndTime] = useState("13:00");
  const [newAppointmentColor, setNewAppointmentColor] = useState("blue");

  const [showAddGoalModal, setShowAddGoalModal] = useState(false); // Modal state for adding goals
  const [newGoal, setNewGoal] = useState("");

  let colorData: {name: string, hex: string, id: string}[] = [];
  gcColors.forEach((color, key) => {
    colorData.push({name: color.name, hex: color.hex, id: key})
  })

  const sortedTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => {
      const aDate = new Date(a.dueDate ?? "9999-12-31");
      const bDate = new Date(b.dueDate ?? "9999-12-31");
      return aDate.getTime() - bDate.getTime();
    });

  const getTodayEvents = async () => {
    return await dataManager.getTodayEvents();
  };

  // Modal to add a new task
  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: newTaskText, completed: false },
    ]);
    setNewTaskText("");
    setShowAddTaskModal(false);
  };

  // Modal to add a new appointment
  const handleAddAppointment = () => {
    // if (!newAppointmentTitle.trim()) return;
    // setAppointments([
    //   ...appointments,
    //   {
    //     id: Date.now(),
    //     title: newAppointmentTitle,
    //     date: todayStr,
    //     startTime: newAppointmentStartTime,
    //     endTime: newAppointmentEndTime,
    //     color: newAppointmentColor,
    //   },
    // ]);
    setShowAddAppointmentModal(false);
  };

  // Add a new goal
  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([
      ...goals,
      { id: Date.now(), name: newGoal, log: { [todayStr]: false } },
    ]);
    setNewGoal("");
    setShowAddGoalModal(false); // Close the modal after adding
  };

  // Toggle goal tracking
  const toggleGoalTracking = (goalId: number) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              log: {
                ...goal.log,
                [todayStr]: !goal.log[todayStr],
              },
            }
          : goal
      )
    );
  };

  // Delete a goal
  const handleDeleteGoal = (goalId: number) => {
    setGoals(goals.filter((goal) => goal.id !== goalId));
  };

  // Mark a task as completed or not
  const handleTaskToggle = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const layouts = {
    xl: [
      { i: "calendar", x: 0, y: 0, w: 5, h: 12, minH: 4, minW: 3 },
      { i: "todo", x: 5, y: 0, w: 3, h: 12, minH: 2 },
      { i: "goals", x: 8, y: 0, w: 4, h: 5, minH: 2 },
      { i: "habits", x: 8, y: 3, w: 4, h: 7, minH: 2 },
    ],
    lg: [
      { i: "calendar", x: 0, y: 0, w: 4, h: 9, minH: 4, minW: 3 },
      { i: "todo", x: 4, y: 0, w: 3, h: 9, minH: 4 },
      { i: "goals", x: 7, y: 0, w: 3, h: 4, minH: 4 },
      { i: "habits", x: 7, y: 3, w: 3, h: 5, minH: 4 },
    ],
    md: [
      { i: "calendar", x: 0, y: 0, w: 4, h: 7, minH: 4, minW: 3 },
      { i: "todo", x: 4, y: 0, w: 2, h: 7, minH: 2 },
      { i: "habits", x: 0, y: 7, w: 3, h: 4, minH: 4 },
      { i: "goals", x: 3, y: 7, w: 3, h: 4, minH: 2 },
    ],
    sm: [
      { i: "calendar", x: 0, y: 0, w: 4, h: 6, minH: 4, minW: 3 },
      { i: "todo", x: 0, y: 3, w: 2, h: 5, minH: 2 },
      { i: "goals", x: 2, y: 0, w: 2, h: 5, minH: 2 },
      { i: "habits", x: 0, y: 11, w: 2, h: 4, minH: 4 },
    ],
    xs: [
      { i: "calendar", x: 0, y: 0, w: 4, h: 7, minH: 4 },
      { i: "goals", x: 0, y: 5, w: 2, h: 5, minH: 2 },
      { i: "todo", x: 0, y: 10, w: 2, h: 5, minH: 2 },
      { i: "habits", x: 0, y: 15, w: 2, h: 4, minH: 4 },
    ],
  };

  const formatTimeStr = (start: string | undefined, end: string | undefined) => {
    if (!start || !end) {
      return "All day";
    }
    // start
    const startDate = new Date(start);
    const startHours24 = startDate.getHours();
    const startHours = (startHours24 == 0 || startHours24 == 12) ? 12 : startHours24 % 12;
    const startMins = startDate.getMinutes();
    const startMinsStr = (startMins < 10 ? `0${startMins}` : `${startMins}`);
    const startAmPm = (startHours24 < 12) ? "am" : "pm";

    // end
    const endDate = new Date(end);
    const endHours24 = endDate.getHours();
    const endHours = (endHours24 == 0 || endHours24 == 12) ? 12 : endHours24 % 12;
    const endMins = endDate.getMinutes();
    const endMinsStr = (endMins < 10 ? `0${endMins}` : `${endMins}`);
    const endAmPm = (endHours24 < 12) ? "am" : "pm";
    return `${startHours}:${startMinsStr} ${startAmPm == endAmPm ? "" : startAmPm} - ${endHours}:${endMinsStr} ${endAmPm}`;
  }

  const renderTimeSlots = () => {
    return (
      <div className="time-slots">
        {todayAppointments && todayAppointments.length > 0 ? todayAppointments.map((appt) => (
          <div className="time-slot">
            <div className="time-slot-label">{formatTimeStr(appt.startTime, appt.endTime)}</div>
            <div
              key={appt.id}
              className={`appointment-box event-color-${
                appt.color ? appt.color : 1
              }`}
            >
              <div>{appt.title}</div>
            </div>
          </div>
        )) : (
          <div className="time-slot">
            <div className="">Nothing scheduled for today</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Container className="homepage">
      <ResponsiveReactGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ xl: 1200, lg: 992, md: 768, sm: 576, xs: 0 }}
        cols={{ xl: 12, lg: 10, md: 6, sm: 4, xs: 2 }}
        margin={[20, 20]}
        rowHeight={40}
        draggableHandle=".drag-handle"
        useCSSTransforms={false}
      >
        {/* Today's Schedule */}
        <Card key="calendar" className="calendar shadow-sm">
          <Card.Header className="fw-bold drag-handle">
            Today's Schedule
          </Card.Header>
          <Card.Body>
            <div className="d-flex">
              <Button
                size="sm"
                variant="outline-dark"
                onClick={async () => {
                  setTodayAppointments(await getTodayEvents());
                }}
              >
                <i className="bi bi-arrow-clockwise"></i>
              </Button>
              <Button
                size="sm"
                variant="outline-dark"
                onClick={() => setShowAddAppointmentModal(true)}
              >
                <i className="bi bi-calendar-plus me-2"></i>
                Schedule Event
              </Button>
            </div>
            {currentUser && (renderTimeSlots())}
          </Card.Body>
        </Card>

        {/* Goals */}
        <Card key="goals" className="goals shadow-sm">
          <Card.Header className="fw-bold drag-handle">Goals</Card.Header>
          <Card.Body>
            {goals.length > 0 ? (
              goals.map((goal) => {
                const checked = goal.log[todayStr] ?? false;
                return (
                  <div
                    key={goal.id}
                    className="mb-2 d-flex justify-content-between align-items-center"
                  >
                    <span>{goal.name}</span>
                    <div className="d-flex gap-2">
                      <Button
                        variant={checked ? "success" : "outline-dark"}
                        size="sm"
                        onClick={() => toggleGoalTracking(goal.id)}
                      >
                        {checked && <i className="bi bi-check-lg"></i>}
                        {checked ? "Tracked" : "Track"}
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="d-flex justify-content-between">
                <div className="text-muted">No goals yet</div>
              </div>
            )}
            <Button
              size="sm"
              variant="outline-dark"
              onClick={() => setShowAddGoalModal(true)} // Show the modal for adding a goal
              className="mt-2"
              style={{ width: "fit-content" }}
            >
              <i className="bi bi-plus"></i>
              Add Goal
            </Button>
          </Card.Body>
        </Card>

        {/* To-Do List */}
        <Card key="todo" className="todo shadow-sm">
          <Card.Header className="fw-bold drag-handle">To-Do List</Card.Header>
          <Card.Body>
            {sortedTasks.length > 0 ? (
              <ListGroup>
                {sortedTasks.map((task) => (
                  <ListGroup.Item
                    key={task.id}
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskToggle(task.id)}
                    />
                    {task.text}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="d-flex justify-content-between">
                <div className="text-muted mb-2">No tasks for today</div>
              </div>
            )}
            <Button
              size="sm"
              variant="outline-dark"
              onClick={() => setShowAddTaskModal(true)} // Show the modal for adding a task
              className="mt-2"
              style={{ width: "fit-content" }}
            >
              <i className="bi bi-plus"></i>
              Add Task
            </Button>
          </Card.Body>
        </Card>

        {/* Habits */}
        <Card key="habits" className="habits shadow-sm">
          <Card.Header className="fw-bold drag-handle">Habits</Card.Header>
          <Card.Body>
            {habits.length > 0 ? (
              habits.map((habit) => {
                const checked = habit.log[todayStr] ?? false;
                return (
                  <div
                    key={habit.id}
                    className="mb-2 d-flex justify-content-between align-items-center"
                  >
                    <span>{habit.name}</span>
                    <div className="d-flex gap-2">
                      <Button
                        variant={checked ? "success" : "outline-dark"}
                        size="sm"
                      >
                        {checked && <i className="bi bi-check-lg"></i>}
                        {checked ? "Tracked" : "Track"}
                      </Button>
                      <Button variant="outline-danger" size="sm">
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="d-flex justify-content-between">
                <div className="text-muted">No habits yet</div>
              </div>
            )}
            <Button
              size="sm"
              variant="outline-dark"
              className="mt-2"
              style={{ width: "fit-content" }}
            >
              <i className="bi bi-plus"></i>
              Add Habit
            </Button>
          </Card.Body>
        </Card>
      </ResponsiveReactGridLayout>

      {/* Add Goal Modal */}
      <Modal
        show={showAddGoalModal}
        onHide={() => setShowAddGoalModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Goal name"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddGoalModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddGoal}>
            Add Goal
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        show={showAddTaskModal}
        onHide={() => setShowAddTaskModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Task description"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddTaskModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTask}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Appointment Modal */}
      <Modal
        show={showAddAppointmentModal}
        onHide={() => setShowAddAppointmentModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Event for Today</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={newAppointmentTitle}
              onChange={(e) => setNewAppointmentTitle(e.target.value)}
              placeholder="Appointment title"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              value={newAppointmentStartTime}
              onChange={(e) => setNewAppointmentStartTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              value={newAppointmentEndTime}
              onChange={(e) => setNewAppointmentEndTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Color</Form.Label>
            <Form.Select
              className={`gc-modern-color-${newAppointmentColor}`}
              value={newAppointmentColor}
              onChange={(e) => setNewAppointmentColor(e.target.value)}
            >
              {colorData.map(c => (
                <option className={`gc-modern-color-${c.id}`}key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddAppointmentModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddAppointment}>
            Add Appointment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Dashboard;
