import React from 'react';
import { uiCommunication } from '../communications/simple/ui.communication';
import { EMenuItems, IUIConnectedProps } from '../communications/simple/ui.types';
import UserPage from '../communications/base/components/UserPage';
import TaskPage from '../communications/crud/components/TaskPage';
import AccountPage from '../communications/builders/components/AccountPage';
import CFPage from '../communications/advanced/components/CFPage';
import { Card, Typography } from 'antd';

class ContentLayout extends React.Component<IUIConnectedProps> {
  render() {
    const {
      uiModel: { data }
    } = this.props;

    const activeItem = data ? data.activeItem : 0;

    switch (activeItem) {
      case EMenuItems.Simple:
        return <Card><Typography.Text>Simple strategy can be used to keep UI state</Typography.Text></Card>
      case EMenuItems.CRUD:
        return <Card><Typography.Text>CRUD strategy is an easiest way to implement integration with BE</Typography.Text><TaskPage /></Card>;
      case EMenuItems.Base:
        return <Card><Typography.Text>Base strategy can be used when you need to implement some custom logic</Typography.Text><UserPage /></Card>;
      case EMenuItems.Builders:
        return <Card><Typography.Text>Builders it's an alternative way to do the same things using classes</Typography.Text><AccountPage /></Card>;
      case EMenuItems.Advanced:
        return <Card><Typography.Text>Async actions and extending of CRUD strategy can be used in special cases when you need, for example, execute few async actions simultaneously and handle it result in a component.</Typography.Text><CFPage /></Card>;
      default:
        return null;
    }
  }
}

export default uiCommunication.injector(ContentLayout);
