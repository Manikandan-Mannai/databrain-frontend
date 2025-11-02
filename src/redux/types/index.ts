export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  createdAt: string;
  updatedAt: string;
}

export interface DataSource {
  _id: string;
  name: string;
  collectionName: string;
  uploadedBy: string;
  rowCount: number;
  columns: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QueryMetric {
  column: string;
  aggregation: "SUM" | "AVG" | "COUNT" | "MIN" | "MAX";
  as: string;
}

export interface QueryFilter {
  column: string;
  operator: "=" | ">" | "<" | ">=" | "<=" | "!=" | "contains";
  value: string;
}

export interface Query {
  _id: string;
  name: string;
  dataSourceId: string;
  config: {
    groupBy?: string;
    metrics: QueryMetric[];
    filters: QueryFilter[];
  };
  createdBy: string;
  result: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }>;
}

export interface Chart {
  _id: string;
  title: string;
  type: "bar" | "line" | "pie";
  queryId: string;
  config: {
    xAxis: string;
    yAxis: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  data: ChartData;
}

export interface Dashboard {
  _id: string;
  name: string;
  chartIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Series {
  yField: string;
  name: string;
  type: "bar" | "line" | "area";
}

export interface PieSeries {
  labelField: string;
  valueField: string;
  name: string;
}

export interface ChartConfig {
  title: string;
  type: "bar" | "line" | "pie";
  xAxis: string;
  series: Series[];
  stack?: boolean;
  pieSeries: PieSeries[];
  pieLabel?: string;
  pieValue?: string;
}
