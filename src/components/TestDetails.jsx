import React, { useState, useEffect } from 'react';
import { ReactTabulator } from 'react-tabulator';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-tabulator/lib/styles.css';

const TestDetails = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const { dir, filePath } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setTitle(`Details: ${filePath.split('/').pop()}`);

        console.log(`Details: ${filePath.split('/').pop()}`);
        console.log(`data/${dir}/${filePath}`);
        
        const response = await fetch(`/data/${dir}/${filePath}`);
        const text = await response.text();

        // Parse tabular text data
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        const headers = lines[0].split(/\s{2,}/);
        const data = lines.slice(1).map(line => {
          const values = line.split(/\s{2,}/);
          return headers.reduce((obj, header, i) => {
            obj[header] = values[i];
            return obj;
          }, {});
        });
        
        setDetails(data);
      } catch (error) {
        console.error('Error loading details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [dir, filePath]);

  // put to the tabulator
  const columns = details.length > 0 ? 
    Object.keys(details[0]).map(key => ({
      title: key,
      field: key,
      headerFilter: false
    })) : [];

  return (
    <div className="test-details-container">
      <h2>{title}</h2>
      
      {loading ? (
        <div>Loading details...</div>
      ) : details.length > 0 ? (
        <ReactTabulator
          data={details}
          columns={columns}
          options={{
            pagination: false,
            height:"100%"
          }}
          layout="fitColumns"
          responsiveLayout="hide"
          className="details-table"
        />
      ) : (
        <div>No detailed results available</div>
      )}
    </div>
  );
};

export default TestDetails;
