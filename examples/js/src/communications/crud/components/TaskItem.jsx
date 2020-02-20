import React from 'react';
import { Button, Divider, Typography } from 'antd';

export default class TaskItem extends React.PureComponent {
  state = {
    deleting: false
  };

  onClick = () => {
    const { id, onDelete } = this.props;
    this.setState({ deleting: true });
    onDelete(id);
  };

  render() {
    const { title } = this.props;
    const { deleting } = this.state;

    return (
      <>
        <Button type="danger" onClick={this.onClick} loading={deleting}>
          Remove
        </Button>
        <Divider type="vertical" />
        <Typography.Text>{title}</Typography.Text>
      </>
    );
  }
}
