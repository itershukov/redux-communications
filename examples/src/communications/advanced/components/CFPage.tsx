import { footclothsCommunication } from '../footcloths.communication';
import { IFootclothsConnectedProps } from '../footcloths.types';
import React from 'react';
import CFItem from './CFItem';
import FootclothsEditor from './CFEditor';
import { List } from 'antd';

class CFPage extends React.Component<IFootclothsConnectedProps> {
  componentDidMount(): void {
    const { getFootclothsCollection } = this.props;
    getFootclothsCollection();
  }

  render() {
    const { footclothsCollection, deleteFootclothsModel } = this.props;

    const data = footclothsCollection.data ? footclothsCollection.data : [];

    return (
      <List
        header={<FootclothsEditor />}
        rowKey={'id'}
        bordered
        dataSource={data}
        renderItem={footcloths => (
          <List.Item key={footcloths.id}>
            <CFItem id={footcloths.id} title={footcloths.title} onDelete={deleteFootclothsModel} />
          </List.Item>
        )}
      />
    );
  }
}

export default footclothsCommunication.injector(CFPage);
