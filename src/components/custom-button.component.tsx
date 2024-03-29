import './custom-button.style.scss';

interface Props {
  inverted?: boolean;
  isGoogleSignIn?: boolean;
  apply?: boolean;
  overlay?: boolean;
  children?: React.ReactNode;
  onClick?: any;
  type?: any;
  className?: string;
  component?: any;
  ref?: any;
  disabled?: any;
}

const CustomButton: React.FC<Props> = ({
  onClick,
  type,
  children,
  className,
  disabled,
  ...props
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`${className} ${props?.inverted ? 'inverted' : ''} ${
      props?.isGoogleSignIn ? 'google-sign-in' : ''
    } ${props?.overlay ? 'overlay' : ''} ${
      props?.apply ? 'apply' : ''
    } custom-button`}
  >
    {children}
  </button>
);

export default CustomButton;
