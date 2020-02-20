import React from 'react';
import { taskCommunication } from '../task.communication';
import { Button, Col, Input, Row } from 'antd';

class TaskEditor extends React.Component {
  state = {
    title: ''
  };

  constructor(props) {
    super(props);
    if (props.task) {
      this.state = { title: props.task.title };
    }
  }

  onChange = e => {
    this.setState({ title: e.target.value });
  };

  keyPressed = event => {
    if (event.key === 'Enter') {
      this.onClick();
    }
  };

  onClick = () => {
    const { task, updateTaskModel, addTaskModel, deleteTaskModel } = this.props;
    const { title } = this.state;
    if (!title) {
      if (task) {
        deleteTaskModel(task.id);
      } else {
        alert('Title cant be empty');
      }
      return;
    }

    if (task) {
      updateTaskModel({ id: task.id, data: { title } });
    } else {
      addTaskModel({ title });
    }
    this.setState({ title: '' });
  };

  render() {
    const { task } = this.props;
    const { title } = this.state;

    return (
      <Row>
        <Col span={4}>
          <Input value={title} onChange={this.onChange} onKeyPress={this.keyPressed} />
        </Col>
        <Col span={1} />
        <Col span={2}>
          <Button onClick={this.onClick}>{task ? 'Update' : 'Add'}</Button>
        </Col>
      </Row>
    );
  }
}

export default taskCommunication.injector(TaskEditor);
