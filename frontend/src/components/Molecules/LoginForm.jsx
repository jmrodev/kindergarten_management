import './molecules.css';

const LoginForm = ({ onSubmit, className = '', ...props }) => {
  const baseClasses = 'login-form';
  const customClasses = className;

  const formClasses = [
    baseClasses,
    customClasses
  ].filter(Boolean).join(' ');

  return (
    <form className={formClasses} onSubmit={onSubmit} {...props}>
      {props.children}
    </form>
  );
};

export default LoginForm;