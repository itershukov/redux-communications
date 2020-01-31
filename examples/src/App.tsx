import React from 'react';
import './App.css';
import MenuComponent from './communications/simple/components/Menu';
import 'antd/dist/antd.css';
import './index.css';
import Header from './communications/simple/components/Header';
import ContentLayout from './components/ContentLayout';
import { Col, Row } from 'antd';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Row>
        <Col span={4}>
          <MenuComponent />
        </Col>
        <Col span={20}>
          <ContentLayout />
        </Col>
      </Row>
    </div>
  );
};

export default App;
