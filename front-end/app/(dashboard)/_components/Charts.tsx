"use client";

import Card, { CardBody, CardHeader } from "./Card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function WeeklyPickupsChart({
  data,
}: {
  data: Array<{ day: string; count: number }>;
}) {
  return (
    <Card>
      <CardHeader
        title="Weekly pickups"
        subtitle="Collections completed this week"
      />
      <CardBody>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[10, 10, 10, 10]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Tip: Use reports to flag missed pickups or overflow issues.
        </div>
      </CardBody>
    </Card>
  );
}
