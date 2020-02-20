import { uiCommunication } from '../ui.communication';
import React from 'react';
import { Menu } from 'antd';
import { EMenuItems } from '../ui.types';

class MenuComponent extends React.Component {
  handleClick = e => {
    const { setUiModel } = this.props;
    setUiModel({ activeItem: +e.key });
  };

  render() {
    const {
      uiModel: { data: uiModelData }
    } = this.props;
    const activeItem = uiModelData ? uiModelData.activeItem : EMenuItems.Simple;
    return (
      <Menu
        onClick={this.handleClick}
        style={{ height: '100vh', overflow: 'hidden' }}
        defaultSelectedKeys={[`${activeItem}`]}
        mode="inline"
      >
        <Menu.Item key={`${EMenuItems.Simple}`}>Simple(UI)</Menu.Item>
        <Menu.Item key={`${EMenuItems.CRUD}`}>CRUD(Task)</Menu.Item>
        <Menu.Item key={`${EMenuItems.Base}`}>Base(User)</Menu.Item>
        <Menu.Item key={`${EMenuItems.Builders}`}>Builders(Accounts)</Menu.Item>
        <Menu.Item key={`${EMenuItems.Advanced}`}>Advanced(Keep it for emergencies)</Menu.Item>
      </Menu>
    );
  }
}

export default uiCommunication.injector(MenuComponent);
