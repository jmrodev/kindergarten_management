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
  title = 'Menú Principal',
  currentPath,
  ...props
}) => {
  const location = useLocation();
  const actualCurrentPath = currentPath || location.pathname;

  return (
    <>
      {/* Borde izquierdo invisible para detectar hover */}
      <div
        className={`sidebar-edge ${!hidden ? 'sidebar-edge-visible' : 'sidebar-edge-hidden'}`}
        onMouseEnter={onExpand}
      >
        {!hidden && (
          <Sidebar collapsed={collapsed} className={hidden ? 'sidebar-hidden' : ''} {...props}>
            <div className="sidebar-header">
              {!collapsed && <Text variant="h3" className="menu-title">{title}</Text>}
              <Button
                className="sidebar-toggle-btn"
                onClick={onToggleCollapse}
                variant="secondary"
                size="small"
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
        {/* Borde derecho celeste cuando está completamente oculto */}
        {hidden && (
          <div className="sidebar-hidden-edge" onMouseEnter={onExpand}></div>
        )}
      </div>
    </>
  );
};

export default SidebarMenu;