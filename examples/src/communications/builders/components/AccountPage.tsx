import { List, message, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import React from 'react';
import { accountCommunication } from '../account.communication';
import { IAccountConnectedProps } from '../account.types';

class AccountPage extends React.Component<IAccountConnectedProps> {
  state = {
    hasMore: true
  };

  componentDidMount() {
    let {
      accountList: { params }
    } = this.props;
    const offset = params ? params.offset + 10 : 10;
    this.props.getAccountList({ limit: 10, offset });
  }

  handleInfiniteOnLoad = () => {
    let {
      accountList: { data, params }
    } = this.props;
    if (data && data.data.length > 140) {
      message.warning('Infinite List loaded all');
      this.setState({
        hasMore: false
      });
      return;
    }

    const offset = params ? params.offset + 10 : 10;
    this.props.getAccountList({ limit: 10, offset });
  };

  render() {
    const {
      accountList: { data, loading }
    } = this.props;

    return (
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!loading && this.state.hasMore}
          useWindow={false}
        >
          <List
            dataSource={data ? data.data : []}
            renderItem={item => (
              <List.Item key={item.id}>
                <div>Content - {item.id}</div>
              </List.Item>
            )}
          >
            {loading && this.state.hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    );
  }
}

export default accountCommunication.injector(AccountPage);
