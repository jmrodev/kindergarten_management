import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SvgIcon from '../Atoms/SvgIcon';
import './organisms.css';

const MobileMenu = ({ items, title, currentPath, onClose }) => {
    const location = useLocation();
    const actualCurrentPath = currentPath || location.pathname;

    const handleMenuItemClick = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="mobile-menu-container">
            <div className="mobile-menu-header">
                <h2 className="mobile-menu-title">{title}</h2>
                <button className="mobile-menu-close" onClick={onClose} aria-label="Cerrar menú">
                    ✕
                </button>
            </div>

            <nav className="mobile-menu-nav">
                <ul className="mobile-menu-list">
                    {items.map((item, index) => (
                        <li key={index} className="mobile-menu-item">
                            <Link
                                to={item.path}
                                className={`mobile-menu-link ${actualCurrentPath === item.path ? 'mobile-menu-link-active' : ''}`}
                                onClick={handleMenuItemClick}
                            >
                                {item.icon && <SvgIcon src={item.icon} size={20} className="mobile-menu-icon" />}
                                <span className="mobile-menu-label">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default MobileMenu;
