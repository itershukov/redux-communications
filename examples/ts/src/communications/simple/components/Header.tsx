import React from 'react';
import { PageHeader } from 'antd';
import { uiCommunication } from '../ui.communication';
import { EMenuItems, IUIConnectedProps } from '../ui.types';

class Header extends React.Component<IUIConnectedProps> {
  render() {
    const {
      uiModel: { data }
    } = this.props;

    const activeItem = data ? data.activeItem : EMenuItems.Simple;

    let title = 'Unknown';

    switch (activeItem) {
      case EMenuItems.Simple:
        title = 'Simple';
        break;
      case EMenuItems.CRUD:
        title = 'CRUD';
        break;
      case EMenuItems.Base:
        title = 'Base';
        break;
      case EMenuItems.Builders:
        title = 'Builders';
        break;
      case EMenuItems.Advanced:
        title = 'Advanced';
        break;
    }

    return (
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)'
        }}
        title={title}
      />
    );
  }
}

export default uiCommunication.injector(Header);
