import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
export default function RefreshKeyUI({ refetchFn }) {
  return (
    <div className="refresh-btn" onClick={refetchFn}>
      <FontAwesomeIcon icon={faRotateRight} />
    </div>
  );
}
