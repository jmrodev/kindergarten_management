import { useState, useEffect } from 'react';
import Card from '../components/Atoms/Card';
import Text from '../components/Atoms/Text';
import Input from '../components/Atoms/Input';
import usersService from '../services/usersService';
import Pagination from '../components/Atoms/Pagination';
import '../components/Organisms/organisms.css'; // Re-use styles

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(12); // Grid layout, 12 fits nicely
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadContacts();
    }, [page]);

    const loadContacts = async () => {
        try {
            setLoading(true);
            // Use the directory endpoint which is accessible to all
            const response = await usersService.getDirectory({ page, limit });

            let allContacts = [];
            if (response.data) {
                allContacts = response.data;
                if (response.meta) setTotalPages(response.meta.totalPages);
            } else if (Array.isArray(response)) {
                allContacts = response;
            }

            setContacts(allContacts);
        } catch (err) {
            console.error("Error loading contacts", err);
        } finally {
            setLoading(false);
        }
    };

    const normalizeText = (text) => {
        return text ? text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u0386]/g, '') : '';
    };

    const filteredContacts = contacts.filter(person => {
        const fullName = `${person.first_name} ${person.paternal_surname}`;
        return normalizeText(fullName).includes(normalizeText(searchTerm)) ||
            (person.email && normalizeText(person.email).includes(normalizeText(searchTerm))) ||
            (person.role_name && normalizeText(person.role_name).includes(normalizeText(searchTerm)));
    });

    return (
        <div className="contacts-page">
            <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <Text variant="h1">Directorio de Contactos</Text>
                <div style={{ maxWidth: '400px', width: '100%' }}>
                    <Input
                        type="text"
                        placeholder="Buscar por nombre, email o rol..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Cargando contactos...</div>
            ) : (
                <>
                    <div className="data-card-list">
                        {filteredContacts.map(person => (
                            <div key={person.id} className="data-card-item">
                                <div className="data-card-content">
                                    <div className="card-header" style={{ marginBottom: '0.5rem' }}>
                                        <Text variant="h3" style={{ margin: 0 }}>{person.first_name} {person.paternal_surname}</Text>
                                        <span className="badge" style={{
                                            backgroundColor: '#e3f2fd',
                                            color: '#1565c0',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            display: 'inline-block',
                                            marginTop: '4px'
                                        }}>
                                            {person.role_name}
                                        </span>
                                    </div>

                                    <div className="contact-details" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {person.email && (
                                            <div className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span role="img" aria-label="email">📧</span>
                                                <a href={`mailto:${person.email}`} style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                                                    {person.email}
                                                </a>
                                            </div>
                                        )}

                                        {person.phone && (
                                            <div className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span role="img" aria-label="phone">📞</span>
                                                <a href={`tel:${person.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    {person.phone}
                                                </a>
                                            </div>
                                        )}

                                        {person.classroom_name && (
                                            <div className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: '#666' }}>
                                                <span role="img" aria-label="classroom">🏫</span>
                                                <small>{person.classroom_name}</small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* No actions section - Read Only */}
                            </div>
                        ))}
                    </div>

                    {filteredContacts.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                            No se encontraron contactos.
                        </div>
                    )}

                    {!loading && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Contacts;
