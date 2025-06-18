import { gcColors, useAppData } from "../AppDataContext";
import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

export default function AddAppointmentModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const { setAppointments } = useAppData();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [color, setColor] = useState("1");
  const [location, setLocation] = useState();

  let colorData: {name: string, hex: string, id: string}[] = [];
  gcColors.forEach((color, key) => {
    colorData.push({name: color.name, hex: color.hex, id: key})
  })

  const handleAdd = () => {
    if (!title.trim()) return;
    setAppointments(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title,
        date,
        startTime,
        endTime,
        location,
        color,
      },
    ]);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Color</Form.Label>
            <Form.Select value={color} onChange={(e) => setColor(e.target.value)}>
              {colorData.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleAdd}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
}
