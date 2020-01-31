import { IFootclothsConnectedProps, IFootclothsModel } from '../footcloths.types';
import React from 'react';
import { Button, Col, Input, message, Row } from 'antd';
import { footclothsCommunication } from '../footcloths.communication';

interface IComponentProps {
  task?: IFootclothsModel | null;
}

class CFEditor extends React.Component<IComponentProps & IFootclothsConnectedProps> {
  state = {
    title: ''
  };

  constructor(props: IComponentProps & IFootclothsConnectedProps) {
    super(props);
    if (props.task) {
      this.state = { title: props.task.title };
    }
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: e.target.value });
  };

  keyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.onClick();
    }
  };

  activate = async () => {
    const { activateFootcloths } = this.props;

    message.info('Start activation!');
    try {

      const res = await activateFootcloths({param: Math.random()});

      message.success(res);
    } catch (e) {
      message.error(e);
    }
  }

  onClick = () => {
    const { task, updateFootclothsModel, addFootclothsModel, deleteFootclothsModel } = this.props;
    const { title } = this.state;
    if (!title) {
      if (task) {
        deleteFootclothsModel(task.id);
      } else {
        alert('Title cant be empty');
      }
      return;
    }

    if (task) {
      updateFootclothsModel({ id: task.id, data: { title } });
    } else {
      addFootclothsModel({ title });
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
        <Col span={2}>
          <Button onClick={this.activate}>Activate</Button>
        </Col>
      </Row>
    );
  }
}

export default footclothsCommunication.injector(CFEditor);
