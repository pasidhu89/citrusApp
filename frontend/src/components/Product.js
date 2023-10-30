import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import { Col, Row } from 'react-bootstrap';

function Product(props) {
  const { product } = props;
  const [expanded, setExpanded] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  return (
    <Row
      style={{
        borderRadius: '20px',
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
        margin: '20px',
        padding: '20px',
        backgroundColor: '#ffffff',
      }}
    >
      <Col xs={12} sm={6} md={8} lg={12}>
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              height: '200px',
              width: '100%',
              objectFit: 'cover',
              borderRadius: '10px',
              boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
            }}
          />
        </Link>
      </Col>
      <Col xs={12} sm={6} md={4} lg={12}>
        <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h4
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            {product.name}
          </h4>
        </Link>
        <div
          style={{
            fontSize: '14px',
            color: '#555',
            maxHeight: expanded ? 'none' : '70px',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </div>
        {product.description.length > 70 && (
          <button
            onClick={toggleDescription}
            className="btn btn-link"
            style={{ fontSize: '14px' }}
          >
           
          </button>
        )}
       
        {/* Move the "Edit Product" button to the right and make it green */}
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/admin/product/${product._id}`}>
            <button className="btn btn-primary" style={{ backgroundColor: '#3AD784', color: '#FFFFFF', fontSize: '14px' }}>
              Edit Product
            </button>
          </Link>
        </div>
      </Col>
    </Row>
  );
}

export default Product;
