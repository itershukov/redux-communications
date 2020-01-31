import React from 'react';
import { Button, Divider, Typography } from 'antd';

interface IComponentProps {
  id: number;
  title: string;
  onDelete: (id: number) => void;
}

export default class CFItem extends React.PureComponent<IComponentProps> {
  state = {
    deleting: false
  };

  onClick = async () => {
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
