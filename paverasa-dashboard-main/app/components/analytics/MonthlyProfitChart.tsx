"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function MonthlyProfitChart() {

  const [data,setData]=useState([]);

  useEffect(()=>{

    fetch("/api/analytics/monthly-profit")
      .then(res=>res.json())
      .then(setData);

  },[]);

  return(

    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Monthly Profit
      </h2>

      <ResponsiveContainer width="100%" height={320}>

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3"/>

          <XAxis dataKey="month"/>

          <YAxis/>

          <Tooltip/>

          <Bar
            dataKey="profit"
            fill="#16a34a"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}