import React, { useContext, useEffect, useReducer, useState } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Product from '../components/Product'; // Import the Product component

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [products, setProducts] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };

    // Fetch the list of products
    axios.get('/api/products').then((response) => {
      setProducts(response.data);
    });

    fetchData();
  }, [userInfo]);

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card className="bg-info text-white">
                <Card.Body>
                  <Card.Title>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text>Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-success text-white">
                <Card.Body>
                  <Card.Title>
                    {summary.products && summary.products[0]
                      ? summary.products[0].numProducts
                      : 0}
                  </Card.Title>
                  <Card.Text>Posts</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-secondary text-white">
                <Card.Body>
                  <Card.Title>
                    {summary.Treatments && summary.Treatments[0]
                      ? summary.Treatments[0].numTreatments
                      : 0}
                  </Card.Title>
                  <Card.Text>Treatments</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
          </Row>

          {/* Render the list of products using the Product component */}
          <Row>
            {products.map((product, index) => (
              <Col key={product._id} md={6} lg={6}>
                <Product product={product} />
                {index % 2 === 1 && <div className="w-100"></div>} 
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
}
