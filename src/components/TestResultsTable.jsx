import React, { useRef, useState, useEffect } from 'react';
import { ReactTabulator as Tabulator} from 'react-tabulator';
import { useNavigate } from 'react-router-dom';
import 'react-tabulator/lib/styles.css';
import 'react-tabulator/css/tabulator.min.css';
import './TestResultsTable.css';
//import SafeTabulator from './SafeTabulator';


function fetchTextFileContent(fileUrl) {
  const modal = document.getElementById('textFileModal');
  const contentElement = document.getElementById('fileContent');
  const titleElement = document.getElementById('modalTitle');
  
  // Show loading state
  contentElement.textContent = "Loading...";
  modal.style.display = "block";
  
  // Fetch the text file
  fetch(fileUrl)
      .then(response => {
          if (!response.ok) throw new Error("Failed to load file");
          return response.text();
      })
      .then(text => {
          titleElement.textContent = `Content of: ${fileUrl}`;
          contentElement.textContent = text;
      })
      .catch(error => {
          contentElement.textContent = `Error: ${error.message}`;
      });
}

var fileListFormatter = function(cell, formatterParams, onRendered) {
  const files = cell.getValue();

  const timeStamp = cell.getRow().getCell("timestamp").getValue();

  if (!Array.isArray(files)) return "";

  // Create container for links
  const container = document.createElement("div");

  files.forEach(file => {
      const link = document.createElement("a");
      link.href = "#";
  
      var contentName = file;
      if (file.includes("error_")) {
         contentName= "[" + file.replace("error_", "").replace(".log","") + "]";
      } else if(file.includes("_dir.txt")) {
         contentName = file.replace("_dir.txt","");
      } else if(file.includes("_list.txt")) {
         contentName = file.replace("_list.txt","");
      } else if(file.includes(".venv")) {
         contentName = file.replace(".venv","");
      };

      link.textContent = contentName || "View Text File";
      link.style.display = "block";
      link.style.marginRight = "10px";
      link.style.cursor = "pointer";

      // Add click handler to show content
      link.addEventListener("click", function(e) {
          e.preventDefault();
          fetchTextFileContent(`data/ref_prov_${timeStamp}/${file}`);
      });

      container.appendChild(link);
  });

  return container;
}


const TestResultsTable = () => {
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();
  const tableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      // Access Tabulator instance if needed
      const tabulatorInstance = tableRef.current.querySelector('.tabulator')?.tabulator;
    }
    const cacheBuster = `?t=${new Date().getTime()}`;
    
    fetch(`/data/ref_prov_all.json${cacheBuster}`)
      .then(response => {
        const lastModified = response.headers.get('last-modified');
        if (lastModified) setLastUpdated(new Date(lastModified).toLocaleString());
        return response.json();
      })
      .then(data => {
        setTestData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  const handleCellClick = (e, cell) => {
    const field = cell.getField();
    const cellData = cell.getValue();


    const timeStamp = cell.getRow().getCell("timestamp").getValue();

    
    if (field === 'passed' && cellData.count > 0) {
      navigate(`/data/ref_prov_${timeStamp}/${encodeURIComponent(cellData.filepath)}`);
    } else if (field === 'failed' && cellData.count > 0) {
      navigate(`/data/ref_prov_${timeStamp}/${encodeURIComponent(cellData.filepath)}`);
    }
  };

  const columns = [
    { title: 'Time', field: 'timestamp', width: 100, vertAlign:"middle" },
    { title: 'Executor', field: 'executor', width: 100, vertAlign:"middle" },
    { 
      title: 'Passed', 
      field: 'passed', 
      width: 100,
      hozAlign:"center",
      headerHozAlign:"center",
      vertAlign:"middle",
      formatter:  (cell) => {
        const cellData = cell.getValue();
        return cellData.count;
      },
      cellClick: handleCellClick,
      cssClass: 'clickable-cell'
    },
    { 
      title: 'Failed', 
      field: 'failed', 
      width: 100,
      hozAlign:"center",
      vertAlign:"middle",
      headerHozAlign:"center",
      formatter:  (cell) => {
        const cellData = cell.getValue();
        return cellData.count;
      },
      cellClick: handleCellClick,
      cssClass: 'clickable-cell'
    },
    { 
      title: 'Pass Rate', 
      field: 'passed',
      width: 120,
      hozAlign:"center",
      vertAlign:"middle",
      headerHozAlign:"center",
      formatter: (cell) => {
        const rowData = cell.getRow().getData();
        const total = rowData.passed.count + rowData.failed.count;
        const rate = total > 0 ? (rowData.passed.count / total * 100).toFixed(1) : 0;
        return `${rate}%`;
      }
    },
    {
      title: 'VENV', 
      field: 'venv',
      width: 120,
      formatter: fileListFormatter, 
    },
    {
      title: 'Error logs', 
      field: 'error',
      width: 120,
      formatter: fileListFormatter, 
    },
    {
      title: 'Dir content', 
      field: 'dirs',
      width: 120,
      formatter: fileListFormatter, 
    },
    {
      title: 'Data', 
      field: 'data',
      width: 120,
      formatter: fileListFormatter, 
    },
    { 
      title: 'Log File', 
      field: 'logs',
      formatter: fileListFormatter, 
    }
  ];

  const options = {
    layout: 'fitColumns',
    responsiveLayout: 'hide',
    rowFormatter: (row) => {
      const data = row.getData();
      if (data.failed.count > 0) {
        row.getElement().style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading test data...</div>;
  }

  return (
    <div className="test-results-container">
      <h2>Test Results</h2>
      {lastUpdated && (
        <div className="last-updated">
          Last updated: {lastUpdated}
        </div>
      )}
      <h3> Perlmutter </h3>
      <Tabulator
        ref={tableRef}
        data={testData["perlmutter"]}
        columns={columns}
        options={options}
        className="test-results-table"
      />
    </div>
  );
};

export default TestResultsTable;
