// frontend/src/components/StudentFilter.jsx
import React, { useState } from 'react';
import { Form, Row, Col, Button, InputGroup, Collapse, Card, Badge } from 'react-bootstrap';

const StudentFilter = ({ onFilter, onClear, salas }) => {
    const [searchText, setSearchText] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({
        salaId: '',
        turno: '',
        ciudad: '',
        provincia: '',
        edadMin: '',
        edadMax: ''
    });

    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleAdvancedChange = (e) => {
        const { name, value } = e.target;
        setAdvancedFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuickSearch = async (e) => {
        e.preventDefault();
        if (searchText.trim()) {
            setIsSearching(true);
            await onFilter({ searchText: searchText.trim() });
            setIsSearching(false);
        }
    };

    const handleAdvancedSearch = async (e) => {
        e.preventDefault();
        const filters = { ...advancedFilters };
        if (searchText.trim()) {
            filters.searchText = searchText.trim();
        }
        
        // Filtrar valores vacíos
        const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value) acc[key] = value;
            return acc;
        }, {});
        
        setIsSearching(true);
        await onFilter(activeFilters);
        setIsSearching(false);
    };

    const handleClear = async () => {
        setSearchText('');
        setAdvancedFilters({
            salaId: '',
            turno: '',
            ciudad: '',
            provincia: '',
            edadMin: '',
            edadMax: ''
        });
        setIsSearching(true);
        await onClear();
        setIsSearching(false);
    };

    const handleRemoveFilter = async (filterKey) => {
        if (filterKey === 'searchText') {
            setSearchText('');
        } else {
            setAdvancedFilters(prev => ({
                ...prev,
                [filterKey]: ''
            }));
        }
        
        // Aplicar filtros actualizados
        const updatedFilters = { ...advancedFilters, [filterKey]: '' };
        const currentSearchText = filterKey === 'searchText' ? '' : searchText;
        
        if (currentSearchText) {
            updatedFilters.searchText = currentSearchText;
        }
        
        // Filtrar valores vacíos
        const activeFilters = Object.entries(updatedFilters).reduce((acc, [key, value]) => {
            if (value && key !== filterKey) acc[key] = value;
            return acc;
        }, {});
        
        // Si no hay filtros activos, recargar todos
        if (Object.keys(activeFilters).length === 0) {
            setIsSearching(true);
            await onClear();
            setIsSearching(false);
        } else {
            setIsSearching(true);
            await onFilter(activeFilters);
            setIsSearching(false);
        }
    };

    const hasActiveFilters = searchText || Object.values(advancedFilters).some(value => value);
    const activeFilterCount = [searchText, ...Object.values(advancedFilters)].filter(v => v).length;

    return (
        <div className="mb-4">
            {/* Búsqueda Rápida */}
            <Form onSubmit={handleQuickSearch}>
                <Row className="g-2 align-items-center">
                    <Col xs={12} md={9} lg={10}>
                        <InputGroup size="lg" className="shadow-sm" style={{borderRadius: '12px', overflow: 'hidden'}}>
                            <InputGroup.Text 
                                className="bg-white border-end-0 px-4" 
                                style={{fontSize: '1.5rem', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px', color: '#667eea'}}
                            >
                                <span className="material-icons">search</span>
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Buscar por cualquier dato: nombre, apellido, ciudad, calle, sala, contacto..."
                                value={searchText}
                                onChange={handleSearchTextChange}
                                className="border-start-0 border-end-0 ps-0 pe-0"
                                style={{
                                    fontSize: '1.05rem',
                                    boxShadow: 'none',
                                    borderTop: '1px solid #dee2e6',
                                    borderBottom: '1px solid #dee2e6'
                                }}
                                disabled={isSearching}
                            />
                            {searchText && (
                                <Button 
                                    variant="link" 
                                    className="text-secondary px-3"
                                    onClick={() => setSearchText('')}
                                    style={{
                                        textDecoration: 'none',
                                        fontSize: '1.3rem',
                                        borderTop: '1px solid #dee2e6',
                                        borderBottom: '1px solid #dee2e6'
                                    }}
                                    disabled={isSearching}
                                >
                                    ✕
                                </Button>
                            )}
                            <Button 
                                type="submit" 
                                className="px-5"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    borderTopRightRadius: '12px',
                                    borderBottomRightRadius: '12px',
                                    fontWeight: '600',
                                    fontSize: '1.05rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: searchText && !isSearching ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
                                }}
                                disabled={!searchText.trim() || isSearching}
                                onMouseEnter={(e) => {
                                    if (!isSearching && searchText.trim()) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)';
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                {isSearching ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Buscando...
                                    </>
                                ) : (
                                    <><span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>search</span> Buscar</>
                                )}
                            </Button>
                        </InputGroup>
                    </Col>
                    <Col xs={12} md={3} lg={2}>
                        <Button 
                            variant={showAdvanced ? "primary" : "outline-primary"}
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-100 position-relative"
                            size="lg"
                            style={{
                                borderRadius: '8px',
                                fontWeight: '500',
                                fontSize: '1rem',
                                transition: 'all 0.2s ease',
                                borderWidth: '1.5px',
                                background: showAdvanced ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                                borderColor: showAdvanced ? 'transparent' : '#667eea',
                                color: showAdvanced ? 'white' : '#667eea',
                                boxShadow: 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (!showAdvanced) {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!showAdvanced) {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.color = '#667eea';
                                    e.currentTarget.style.borderColor = '#667eea';
                                }
                            }}
                        >
                            <span className="material-icons" style={{fontSize: '1.1rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>tune</span> Filtros
                            {' '}
                            <span style={{fontSize: '1rem', verticalAlign: 'middle'}}>{showAdvanced ? '▲' : '▼'}</span>
                            {activeFilterCount > 0 && !searchText && (
                                <Badge 
                                    bg="danger" 
                                    pill 
                                    className="position-absolute top-0 start-100 translate-middle"
                                    style={{
                                        fontSize: '0.7rem',
                                        padding: '0.35rem 0.45rem'
                                    }}
                                >
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>
                    </Col>
                </Row>
            </Form>

            {/* Filtros Avanzados */}
            <Collapse in={showAdvanced}>
                <div>
                    <Card className="mt-3 shadow border-0" style={{background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'}}>
                        <Card.Body className="p-4">
                            <Form onSubmit={handleAdvancedSearch}>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h5 className="mb-0 fw-bold text-primary">
                                        <span className="material-icons" style={{fontSize: '1.3rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>filter_alt</span> Filtros Avanzados
                                    </h5>
                                    {Object.values(advancedFilters).some(v => v) && (
                                        <Badge bg="info" className="px-3 py-2">
                                            {Object.values(advancedFilters).filter(v => v).length} filtros aplicados
                                        </Badge>
                                    )}
                                </div>
                                <Row className="g-3">
                                    <Col md={6} lg={3}>
                                        <Form.Group>
                                            <Form.Label className="small fw-semibold mb-2">
                                                <span className="material-icons" style={{fontSize: '1.1rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>meeting_room</span> Sala
                                            </Form.Label>
                                            <Form.Select
                                                name="salaId"
                                                value={advancedFilters.salaId}
                                                onChange={handleAdvancedChange}
                                                className="shadow-sm"
                                                style={{
                                                    borderWidth: '2px',
                                                    borderColor: advancedFilters.salaId ? '#0d6efd' : '#dee2e6'
                                                }}
                                            >
                                                <option value="">Todas las salas</option>
                                                {salas && salas.map(sala => (
                                                    <option key={sala.id} value={sala.id}>
                                                        {sala.nombre}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col md={6} lg={3}>
                                        <Form.Group>
                                            <Form.Label className="small fw-semibold mb-2">
                                                <span className="material-icons" style={{fontSize: '1.1rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>schedule</span> Turno
                                            </Form.Label>
                                            <Form.Select
                                                name="turno"
                                                value={advancedFilters.turno}
                                                onChange={handleAdvancedChange}
                                                className="shadow-sm"
                                                style={{
                                                    borderWidth: '2px',
                                                    borderColor: advancedFilters.turno ? '#0d6efd' : '#dee2e6'
                                                }}
                                            >
                                                <option value="">Todos los turnos</option>
                                                <option value="Mañana">Mañana</option>
                                                <option value="Tarde">Tarde</option>
                                                <option value="Completo">Completo</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col md={6} lg={3}>
                                        <Form.Group>
                                            <Form.Label className="small fw-semibold mb-2">
                                                <span className="material-icons" style={{fontSize: '1.1rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>location_city</span> Ciudad
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="ciudad"
                                                placeholder="Ej: Buenos Aires"
                                                value={advancedFilters.ciudad}
                                                onChange={handleAdvancedChange}
                                                className="shadow-sm"
                                                style={{
                                                    borderWidth: '2px',
                                                    borderColor: advancedFilters.ciudad ? '#0d6efd' : '#dee2e6'
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col md={6} lg={3}>
                                        <Form.Group>
                                            <Form.Label className="small fw-semibold mb-2">
                                                <span className="material-icons" style={{fontSize: '1.1rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>map</span> Provincia
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="provincia"
                                                placeholder="Ej: Buenos Aires"
                                                value={advancedFilters.provincia}
                                                onChange={handleAdvancedChange}
                                                className="shadow-sm"
                                                style={{
                                                    borderWidth: '2px',
                                                    borderColor: advancedFilters.provincia ? '#0d6efd' : '#dee2e6'
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col md={6} lg={3}>
                                        <Form.Group>
                                            <Form.Label className="small fw-semibold mb-2">
                                                <span className="material-icons" style={{fontSize: '1.1rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>child_care</span> Edad Mínima
                                            </Form.Label>
                                            <InputGroup className="shadow-sm">
                                                <Form.Control
                                                    type="number"
                                                    name="edadMin"
                                                    placeholder="Ej: 3"
                                                    value={advancedFilters.edadMin}
                                                    onChange={handleAdvancedChange}
                                                    min="0"
                                                    max="10"
                                                    style={{
                                                        borderWidth: '2px',
                                                        borderColor: advancedFilters.edadMin ? '#0d6efd' : '#dee2e6'
                                                    }}
                                                />
                                                <InputGroup.Text>años</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col md={6} lg={3}>
                                        <Form.Group>
                                            <Form.Label className="small fw-semibold mb-2">
                                                <span className="material-icons" style={{fontSize: '1.1rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>escalator_warning</span> Edad Máxima
                                            </Form.Label>
                                            <InputGroup className="shadow-sm">
                                                <Form.Control
                                                    type="number"
                                                    name="edadMax"
                                                    placeholder="Ej: 5"
                                                    value={advancedFilters.edadMax}
                                                    onChange={handleAdvancedChange}
                                                    min="0"
                                                    max="10"
                                                    style={{
                                                        borderWidth: '2px',
                                                        borderColor: advancedFilters.edadMax ? '#0d6efd' : '#dee2e6'
                                                    }}
                                                />
                                                <InputGroup.Text>años</InputGroup.Text>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col xs={12} className="mt-4">
                                        <div className="d-flex gap-3 justify-content-end">
                                            <Button 
                                                type="submit" 
                                                style={{
                                                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontWeight: '500',
                                                    fontSize: '1rem',
                                                    transition: 'all 0.2s ease',
                                                    color: 'white',
                                                    minWidth: '160px',
                                                    padding: '0.6rem 2rem'
                                                }}
                                                disabled={isSearching}
                                                onMouseEnter={(e) => {
                                                    if (!isSearching) {
                                                        e.currentTarget.style.background = 'linear-gradient(135deg, #0e8074 0%, #2fdb6b 100%)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
                                                }}
                                            >
                                                {isSearching ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Buscando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-icons" style={{fontSize: '1.3rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>search</span> Aplicar Filtros
                                                    </>
                                                )}
                                            </Button>
                                            {hasActiveFilters && (
                                                <Button 
                                                    type="button"
                                                    onClick={handleClear}
                                                    disabled={isSearching}
                                                    style={{
                                                        background: '#dc3545',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        fontWeight: '500',
                                                        fontSize: '1rem',
                                                        transition: 'all 0.2s ease',
                                                        color: 'white',
                                                        minWidth: '160px',
                                                        padding: '0.6rem 2rem'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isSearching) {
                                                            e.currentTarget.style.background = '#bb2d3b';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = '#dc3545';
                                                    }}
                                                >
                                                    <span className="material-icons" style={{fontSize: '1.3rem', verticalAlign: 'middle', marginRight: '0.3rem'}}>delete</span> Limpiar Todo
                                                </Button>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </Collapse>
            
            {/* Indicadores de Filtros Activos */}
            {hasActiveFilters && (
                <Card className="mt-3 border-0 shadow-sm" style={{background: 'linear-gradient(to right, #e3f2fd, #fff3e0)'}}>
                    <Card.Body className="py-3 px-4">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="fw-bold text-primary" style={{fontSize: '1rem'}}>
                                <span className="material-icons" style={{fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '0.2rem'}}>search</span> {activeFilterCount} filtro{activeFilterCount !== 1 ? 's' : ''} activo{activeFilterCount !== 1 ? 's' : ''}:
                            </span>
                            <Button
                                variant="link"
                                size="sm"
                                className="text-danger fw-semibold"
                                onClick={handleClear}
                                disabled={isSearching}
                                style={{textDecoration: 'none', padding: '0.25rem 0.75rem'}}
                            >
                                <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.2rem'}}>delete</span> Limpiar todo
                            </Button>
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            {searchText && (
                                <Badge 
                                    bg="primary" 
                                    className="px-3 py-2 shadow-sm d-flex align-items-center gap-2"
                                    style={{fontSize: '0.9rem', fontWeight: 'normal', cursor: 'pointer'}}
                                    onClick={() => handleRemoveFilter('searchText')}
                                    title="Clic para remover este filtro"
                                >
                                    <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.2rem'}}>search</span> "{searchText}"
                                    <span 
                                        style={{
                                            marginLeft: '0.5rem',
                                            fontWeight: 'bold',
                                            opacity: 0.8,
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        ×
                                    </span>
                                </Badge>
                            )}
                            {advancedFilters.salaId && (
                                <Badge 
                                    bg="info" 
                                    className="px-3 py-2 shadow-sm d-flex align-items-center gap-2"
                                    style={{fontSize: '0.9rem', fontWeight: 'normal', cursor: 'pointer'}}
                                    onClick={() => handleRemoveFilter('salaId')}
                                    title="Clic para remover este filtro"
                                >
                                    <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.2rem'}}>meeting_room</span> {salas?.find(s => s.id == advancedFilters.salaId)?.nombre}
                                    <span 
                                        style={{
                                            marginLeft: '0.5rem',
                                            fontWeight: 'bold',
                                            opacity: 0.8,
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        ×
                                    </span>
                                </Badge>
                            )}
                            {advancedFilters.turno && (
                                <Badge 
                                    bg="warning" 
                                    text="dark"
                                    className="px-3 py-2 shadow-sm d-flex align-items-center gap-2"
                                    style={{fontSize: '0.9rem', fontWeight: 'normal', cursor: 'pointer'}}
                                    onClick={() => handleRemoveFilter('turno')}
                                    title="Clic para remover este filtro"
                                >
                                    <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.2rem'}}>schedule</span> {advancedFilters.turno}
                                    <span 
                                        style={{
                                            marginLeft: '0.5rem',
                                            fontWeight: 'bold',
                                            opacity: 0.8,
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        ×
                                    </span>
                                </Badge>
                            )}
                            {advancedFilters.ciudad && (
                                <Badge 
                                    bg="success" 
                                    className="px-3 py-2 shadow-sm d-flex align-items-center gap-2"
                                    style={{fontSize: '0.9rem', fontWeight: 'normal', cursor: 'pointer'}}
                                    onClick={() => handleRemoveFilter('ciudad')}
                                    title="Clic para remover este filtro"
                                >
                                    <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.2rem'}}>location_city</span> {advancedFilters.ciudad}
                                    <span 
                                        style={{
                                            marginLeft: '0.5rem',
                                            fontWeight: 'bold',
                                            opacity: 0.8,
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        ×
                                    </span>
                                </Badge>
                            )}
                            {advancedFilters.provincia && (
                                <Badge 
                                    bg="success" 
                                    className="px-3 py-2 shadow-sm d-flex align-items-center gap-2"
                                    style={{fontSize: '0.9rem', fontWeight: 'normal', cursor: 'pointer'}}
                                    onClick={() => handleRemoveFilter('provincia')}
                                    title="Clic para remover este filtro"
                                >
                                    <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.2rem'}}>map</span> {advancedFilters.provincia}
                                    <span 
                                        style={{
                                            marginLeft: '0.5rem',
                                            fontWeight: 'bold',
                                            opacity: 0.8,
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        ×
                                    </span>
                                </Badge>
                            )}
                            {advancedFilters.edadMin && (
                                <Badge 
                                    bg="secondary" 
                                    className="px-3 py-2 shadow-sm d-flex align-items-center gap-2"
                                    style={{fontSize: '0.9rem', fontWeight: 'normal', cursor: 'pointer'}}
                                    onClick={() => handleRemoveFilter('edadMin')}
                                    title="Clic para remover este filtro"
                                >
                                    <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.2rem'}}>child_care</span> {advancedFilters.edadMin}+ años
                                    <span 
                                        style={{
                                            marginLeft: '0.5rem',
                                            fontWeight: 'bold',
                                            opacity: 0.8,
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        ×
                                    </span>
                                </Badge>
                            )}
                            {advancedFilters.edadMax && (
                                <Badge 
                                    bg="secondary" 
                                    className="px-3 py-2 shadow-sm d-flex align-items-center gap-2"
                                    style={{fontSize: '0.9rem', fontWeight: 'normal', cursor: 'pointer'}}
                                    onClick={() => handleRemoveFilter('edadMax')}
                                    title="Clic para remover este filtro"
                                >
                                    <span className="material-icons" style={{fontSize: '1rem', verticalAlign: 'middle', marginRight: '0.2rem'}}>escalator_warning</span> hasta {advancedFilters.edadMax} años
                                    <span 
                                        style={{
                                            marginLeft: '0.5rem',
                                            fontWeight: 'bold',
                                            opacity: 0.8,
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        ×
                                    </span>
                                </Badge>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default StudentFilter;
