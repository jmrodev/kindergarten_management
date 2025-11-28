import StaffList from '../components/StaffList';

function PersonalPage({ darkMode, showSuccess, showError }) {
    return <StaffList darkMode={darkMode} showSuccess={showSuccess} showError={showError} />;
}

export default PersonalPage;
