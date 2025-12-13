import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { PersonFill, Pencil, Calendar, FileMedical, PersonCheck } from 'react-bootstrap-icons';
import api from '../api/api.js';
import { Row, Col } from '../components/atoms/Grid';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import ChildrenTable from './parent/ChildrenTable';
import FeatureBlock from '../components/molecules/FeatureBlock';
import RetryableErrorAlert from '../components/molecules/RetryableErrorAlert';
import FeatureCardWrapper from '../components/molecules/FeatureCardWrapper';
import ParentDashboardHeader from '../components/organisms/ParentDashboardHeader';
import ParentInfoCard from '../components/organisms/ParentInfoCard';
import TemporaryInscriptionStatusCard from '../components/molecules/TemporaryInscriptionStatusCard';
import EnrolledChildrenCard from '../components/organisms/EnrolledChildrenCard';

const ParentDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parentInfo, setParentInfo] = useState(null);
  const [children, setChildren] = useState([]);
  const [error, setError] = useState('');

  const loadParentData = React.useCallback(async () => {
    if (!currentUser) return;
    try {
      setError('');
      setLoading(true);

      // Get parent info from parent portal users
      const parentResponse = await api.get(`/parent-portal/portal-user/${currentUser.id}`);
      setParentInfo(parentResponse.data.data);

      // Get children associated with this parent
      const childrenResponse = await api.get(`/parent-portal/children/parent/${currentUser.id}`);
      setChildren(childrenResponse.data.children || []);
    } catch (err) {
      setError('Error al cargar la información: ' + (err?.message || err));
      console.error('Error loading parent data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadParentData();
  }, [currentUser, navigate, loadParentData]);

  // Eliminado el manejo de registro de niños ya que el formulario ha sido eliminado

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <Spinner role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <ParentDashboardHeader currentUser={currentUser} logout={logout} />

      {error && (
        <Row className="mb-4">
          <RetryableErrorAlert
            message={error}
            onRetry={loadParentData}
            onClose={() => setError('')}
          />
        </Row>
      )}

      <Row className="mb-4">
        <Col md={8}>
          <ParentInfoCard parentInfo={parentInfo} currentUser={currentUser} />
        </Col>
        <Col md={4}>
          <TemporaryInscriptionStatusCard />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <EnrolledChildrenCard children={children} />
        </Col>
      </Row>

      <Row className="g-4">
        <FeatureCardWrapper>
              <FeatureBlock
                Icon={Calendar}
                title="Calendario Escolar"
                description="Consulte las fechas importantes del calendario escolar"
                actionElement={
                  <Button variant="outline-primary" disabled>
                    Próximamente
                  </Button>
                }
              />
            </FeatureCardWrapper>
        <FeatureCardWrapper>
              <FeatureBlock
                Icon={FileMedical}
                title="Documentación"
                description="Suba y verifique la documentación requerida"
                actionElement={
                  <Button variant="outline-success" disabled>
                    Próximamente
                  </Button>
                }
              />
            </FeatureCardWrapper>
        <FeatureCardWrapper>
              <FeatureBlock
                Icon={PersonCheck}
                title="Asistencia"
                description="Consulte la asistencia de sus hijos"
                actionElement={
                  <Button variant="outline-info" disabled>
                    Próximamente
                  </Button>
                }
              />
            </FeatureCardWrapper>
      </Row>
    </div>
  );
};

export default ParentDashboard;