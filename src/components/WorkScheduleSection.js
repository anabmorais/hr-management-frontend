import React from "react";
import { Typography, Card } from "antd";
import WorkSchedule from "./WorkSchedule";

const WorkScheduleSection = () => (
  <>
    <Typography.Title level={3}>Work Schedule</Typography.Title>
    <Card>
      <WorkSchedule allowEdit/>
    </Card>
  </>
);

export default WorkScheduleSection;
