import React from 'react';
import { Table, Divider, Typography, Button, Col, Row } from 'antd';
import { IUserConnectedProps, IUserModel } from '../user.types';
import { userCommunication } from '../user.communication';

function getConfig(onClick: (id: IUserModel) => void, onDelete: (id: number) => void) {
  return [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text: string) => <Typography.Text>{text}</Typography.Text>
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: IUserModel) => (
        <span>
          <Button type="danger" onClick={() => onDelete(record.id)}>
            Delete
          </Button>
          <Divider type="vertical" />
          <Button onClick={() => onClick(record)}>Invite {record.firstName}</Button>
        </span>
      )
    }
  ];
}

class UserPage extends React.Component<IUserConnectedProps> {
  componentDidMount(): void {
    const { getUserCollection, getUserFollowers } = this.props;
    getUserCollection();
    getUserFollowers();
  }

  render() {
    const { userCollection, userFollowers, followUserModel, unfollowUserModel, deleteUserModel } = this.props;

    const users = userCollection.data || [];
    const followers = userFollowers.data || [];

    const columnsUsers = getConfig(followUserModel, deleteUserModel);
    const columnsFollowers = getConfig(unfollowUserModel, deleteUserModel);

    return (
      <Row>
        <Col span={12}>
          <Table columns={columnsUsers} dataSource={users} rowKey="id"/>
        </Col>
        <Col span={12}>
          <Table columns={columnsFollowers} dataSource={followers} rowKey="id"/>
        </Col>
      </Row>
    );
  }
}

export default userCommunication.injector(UserPage);
