import { reports } from "../../../lib/demo-data";
import ReportsClient from "../_components/ReportsClient";

export default function ReportsPage() {
  return <ReportsClient initial={reports} />;
}
