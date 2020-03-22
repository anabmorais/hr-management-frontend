import { axiosInstance } from "../utils/api";

export const getEvents = date =>
  axiosInstance.get("/work-schedule/events", { params: { date:date.toISOString() } }).then(response => response.data);

export const createEvent = (start, end, taskId, userId) =>
  axiosInstance
    .post("/work-schedule/events", {
      start,
      end,
      taskId,
      userId
    })
    .then(response => response.data);

export const editEvent = (eventId, start, end, taskId, userId) =>
  axiosInstance
    .patch(`/work-schedule/events/${eventId}`, {
      start,
      end,
      taskId,
      userId
    })
    .then(response => response.data);

export const deleteEvent = eventId =>
  axiosInstance.delete(`/work-schedule/events/${eventId}`).then(response => response.data);
