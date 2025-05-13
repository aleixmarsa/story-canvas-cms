import { InfoTooltip } from "../InfoTooltip";

const PasswordInfoTooltip = () => {
  return (
    <InfoTooltip
      message={
        <ul className="text-xs list-disc list-inside space-y-1">
          <li>Min. 8 characters</li>
          <li>At least one uppercase letter</li>
          <li>At least one lowercase letter</li>
          <li>At least one number</li>
          <li>At least one special character</li>
        </ul>
      }
    />
  );
};
export default PasswordInfoTooltip;
