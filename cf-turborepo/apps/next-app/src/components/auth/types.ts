export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

export interface PasswordFieldProps extends Omit<InputFieldProps, 'type'> {
  mb?: string;
}

export interface SubmitButtonProps {
  text: string;
  loading?: boolean;
  className?: string;
}

export interface BackButtonProps {
  href?: string;
  className?: string;
} 