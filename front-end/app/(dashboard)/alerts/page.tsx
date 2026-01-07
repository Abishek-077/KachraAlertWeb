import { alerts } from "../../../lib/demo-data";
import AlertsCenter from "../_components/AlertsCenter";

export default function AlertsPage() {
  return <AlertsCenter initial={alerts} />;
}
