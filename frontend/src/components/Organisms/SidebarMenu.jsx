import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Menu from '../Molecules/Menu';
import MenuItem from '../Molecules/MenuItem';
import Text from '../Atoms/Text';
import SvgIcon from '../Atoms/SvgIcon';
import Button from '../Atoms/Button';
import './organisms.css';

const SidebarMenu = ({
  items,
  collapsed = false,
  onToggleCollapse,
  onExpand,
  hidden = false,
  title = 'Menu Principal',
  currentPath,
  ...props
}) => {
  const location = useLocation();
  const actualCurrentPath = currentPath || location.pathname;

  return (
    <>
      {!hidden && (
        <Sidebar collapsed={collapsed} className={hidden ? 'sidebar-hidden' : ''} {...props}>
          <div className="sidebar-header">
            {!collapsed && <Text variant="h3" className="menu-title">{title}</Text>}
            <Button
              variant="secondary"
              size="small"
              className="sidebar-toggle-btn"
              onClick={onToggleCollapse}
              title={collapsed ? 'Expandir menú' : 'Contraer menú'}
            >
              {collapsed ? '→' : '←'}
            </Button>
          </div>
          <Menu>
            {items.map((item, index) => (
              <MenuItem
                key={index}
                href={item.path}
                active={actualCurrentPath === item.path}
                onClick={item.onClick}
              >
                {item.icon && <SvgIcon src={item.icon} size={18} className="menu-item-icon" />}
                {!collapsed && <span className="menu-item-text">{item.label}</span>}
              </MenuItem>
            ))}
          </Menu>
        </Sidebar>
      )}
      {/* Pestaña clickeable cuando el menú está oculto */}
      {hidden && (
        <div className="sidebar-tab" onClick={onExpand} title="Abrir menú">
          <span className="sidebar-tab-icon">≡</span>
        </div>
      )}
    </>
  );
};

export default SidebarMenu;