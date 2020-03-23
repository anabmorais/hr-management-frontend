import React from "react";
import { Row, Col } from "antd";
import WorkSchedule from "./WorkSchedule";

const WorkScheduleView = () => (
  <Row justify="center">
    <Col span={22}>
      <WorkSchedule />
    </Col>
  </Row>
);

export default WorkScheduleView;
