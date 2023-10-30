import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { Row, Col } from 'react-bootstrap';

const TreatmentListScreen = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { state } = useContext(Store); // Access userInfo from your Store context
  const { userInfo } = state;
  const getError = (error) => {
    // Implement your error-handling logic here
    return 'An error occurred';
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/treatments'); // Adjust the API route
        setTreatments(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  const generateReport = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Name', 'Type', 'Description', 'Duration (in days)', 'Cost']],
      body: treatments.map((treatment) => [
        treatment.name,
        treatment.type,
        treatment.description,
        treatment.duration,
        
      ]),
    });
    doc.save('Treatment_report.pdf');
  };
  const deleteHandler = async (treatment) => {
    if (window.confirm('Are you sure to delete this treatment?')) {
      try {
        // Send a DELETE request to the server to delete the treatment
        await axios.delete(`/api/treatments/${treatment._id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        // If the deletion is successful, you can display a success message or perform any other necessary actions.
        toast.success('Treatment deleted successfully');

        // You can also update the treatments list after deletion to reflect the changes.
        setTreatments((prevTreatments) =>
          prevTreatments.filter((t) => t._id !== treatment._id)
        );
      } catch (err) {
        // Handle errors, display an error message, or perform any other necessary actions.
        toast.error(getError(err));
      }
    }
  };
  return (
    <div>
     <div>
  <Row>
    <Col>
      <h1>Treatments</h1>
    </Col>
    <Col className="col text-end">
      <Button
        type="button"
        variant="light"
        style={{
          backgroundColor: '#3AD784',
          color: '#FFFFFF',
          borderRadius: '10px',
          fontSize: '16px',
          height: '32px',
          width: '140px',
          textAlign: 'center',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={generateReport}
      >
        Generate Report
      </Button>
      <Link to="/admin/treatments/create">
        <Button
          type="button"
          style={{
            backgroundColor: '#3AD784',
            color: '#FFFFFF',
            borderRadius: '10px',
            fontSize: '16px',
            height: '32px',
            width: '200px',
            textAlign: 'center',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Create New Treatment
        </Button>
      </Link>
    </Col>
  </Row>

  {/* Rest of your component code */}
</div>


      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table" id="pdfdiv">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
              <th>Duration (in days)</th>
              
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((treatment) => (
              <tr key={treatment._id}>
                <td>{treatment._id}</td>
                <td>{treatment.name}</td>
                <td>{treatment.type}</td>
                <td>{treatment.description}</td>
                <td>{treatment.duration}</td>
              
                <td>
                  <Button
                    type="button"
                    variant="light"
                    style={{
                      borderRadius: '35px',
                      backgroundColor: '#007BFF',
                      color: '#FFFFFF',
                      width: '100px',
                    }}
                    onClick={() => navigate(`/admin/treatments/${treatment._id}`)}
                  >
                    Edit
                  </Button>
                  &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    style={{
                      borderRadius: '35px',
                      backgroundColor: '#007BFF',
                      color: '#FFFFFF',
                      width: '100px',
                    }}
                    onClick={() => deleteHandler(treatment)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TreatmentListScreen;
