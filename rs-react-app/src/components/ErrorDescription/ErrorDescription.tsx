type ErrorDescriptionProps = {
  message: string;
};

export default function ErrorDescription({ message }: ErrorDescriptionProps) {
  return <div className="error-message">⚠ {message}</div>;
}
