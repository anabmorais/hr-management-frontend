import { axiosInstance } from "../utils/api";

export const createWorkSchedule = (date, items, remarks) =>
  axiosInstance
    .put(
      "/work-schedule",
      {
        items,
        remarks
      },
      {
        params: { date }
      }
    )
    .then(response => response.data);

export const getWorkSchedule = date =>
  axiosInstance.get("/work-schedule", { params: { date } }).then(response => response.data);
