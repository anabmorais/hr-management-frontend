import { axiosInstance } from "../utils/api";

export const createAbsence = (userId, date) =>
  axiosInstance
    .post("/absences", {
      userId,
      date
    })
    .then(response => response.data);

export const deleteAbsence = absenceId => axiosInstance.delete(`/absences/${absenceId}`).then(response => response.data);

export const getAbsences = (userId, fromDate, toDate) =>
  axiosInstance
    .get("/absences", {
      params: {
        userId,
        fromDate,
        toDate
      }
    })
    .then(response => response.data);
