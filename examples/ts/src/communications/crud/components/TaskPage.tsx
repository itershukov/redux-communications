import { taskCommunication } from '../task.communication';
import { ITaskConnectedProps } from '../task.types';
import React from 'react';
import TaskItem from './TaskItem';
import TaskEditor from './TaskEditor';
import { List } from 'antd';

class TaskPage extends React.Component<ITaskConnectedProps> {
  componentDidMount(): void {
    const { getTaskCollection } = this.props;
    getTaskCollection();
  }

  render() {
    const { taskCollection, deleteTaskModel } = this.props;

    const data = taskCollection.data || [];

    return (
      <List
        header={<TaskEditor />}
        rowKey={'id'}
        bordered
        dataSource={data}
        renderItem={task => (
          <List.Item key={task.id}>
            <TaskItem id={task.id} title={task.title} onDelete={deleteTaskModel} />
          </List.Item>
        )}
      />
    );
  }
}

export default taskCommunication.injector(TaskPage);
