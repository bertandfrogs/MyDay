import { useState } from "react";
import { Container, Button, Modal, Form, Dropdown } from "react-bootstrap";
import { useAppData, Appointment } from "../AppDataContext";
import WeekView from "../components/WeekView";
import MonthView from "../components/MonthView";

function Schedule() {
  const { setAppointments } = useAppData();

  const [weekOffset, setWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  // Modal and form state
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [color, setColor] = useState("blue");

  const openCreateModal = () => {
    setEditingAppointment(null);
    resetModalFields();
    setShowModal(true);
  };

  const openEditModal = (appt: Appointment) => {
    setEditingAppointment(appt);
    setTitle(appt.title);
    setDate(appt.date);
    setStartTime(appt.startTime);
    setEndTime(appt.endTime);
    setColor(appt.color);
    setShowModal(true);
  };

  const resetModalFields = () => {
    setTitle("");
    setDate(new Date().toISOString().split("T")[0]);
    setStartTime("12:00");
    setEndTime("13:00");
    setColor("blue");
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    if (editingAppointment) {
      // Editing
      setAppointments(prev =>
        prev.map(a =>
          a.id === editingAppointment.id
            ? { ...editingAppointment, title, date, startTime, endTime, color }
            : a
        )
      );
    } else {
      // New
      setAppointments(prev => [
        ...prev,
        {
          id: Date.now(),
          title,
          date,
          startTime,
          endTime,
          color,
        },
      ]);
    }

    setShowModal(false);
    resetModalFields();
    setEditingAppointment(null);
  };

  return (
    <Container className="schedule mt-4">
      <Container className="heading d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          {viewMode === "week" && (
            <>
              <Button
                variant="dark"
                onClick={() => setWeekOffset((prev) => prev - 1)}
              >
                <i className="bi bi-arrow-left pe-1"></i>
                Previous
              </Button>
              <Button
                variant="dark"
                onClick={() => setWeekOffset((prev) => prev + 1)}
              >
                Next
                <i className="bi bi-arrow-right ps-1"></i>
              </Button>
            </>
          )}
          <Button variant="dark" onClick={openCreateModal}>
            Add Appointment
          </Button>
        </div>

        <Dropdown>
          <Dropdown.Toggle variant="dark" id="view-toggle">
            View: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setViewMode("week")}>Week View</Dropdown.Item>
            <Dropdown.Item onClick={() => setViewMode("month")}>Month View</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>

      {/* Render week or month */}
      {viewMode === "week" ? (
        <WeekView
          weekOffset={weekOffset}
          onEditAppointment={openEditModal}
        />
      ) : (
        <MonthView onEditAppointment={openEditModal} />
      )}

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAppointment ? "Edit Appointment" : "Add Appointment"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Select
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="blue">Blue</option>
                <option value="yellow">Yellow</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
                <option value="purple">Purple</option>
                <option value="green">Green</option>
                <option value="pink">Pink</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingAppointment ? "Save Changes" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Schedule;
