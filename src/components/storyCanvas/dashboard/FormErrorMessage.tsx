const FormErrorMessage = ({
  error,
  textRight,
}: {
  error?: string;
  textRight?: boolean;
}) => {
  if (!error) return null;
  return (
    <p className={`text-sm text-red-500 ${textRight ? "text-right" : ""}`}>
      {error}
    </p>
  );
};

export default FormErrorMessage;
