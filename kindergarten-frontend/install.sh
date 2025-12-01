#!/bin/bash
# Install all required dependencies

echo "Installing React and related dependencies..."
npm install react react-dom react-scripts --save

echo "Installing routing dependencies..."
npm install react-router-dom --save

echo "Installing UI dependencies..."
npm install bootstrap react-bootstrap react-bootstrap-icons --save

echo "Installing utility dependencies..."
npm install axios date-fns react-hook-form react-toastify --save

echo "Installing development dependencies..."
npm install web-vitals --save-dev

echo "Installation completed!"