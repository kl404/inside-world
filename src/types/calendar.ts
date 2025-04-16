import { Mood } from "./mood";

export type MonthData = {
  [day: number]: Mood;
};

export type YearData = {
  [month: number]: MonthData;
};

export type CompleteData = {
  [year: number]: YearData;
};

export type MonthName =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export type MonthAbbreviation =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sept"
  | "Oct"
  | "Nov"
  | "Dec";

export type Months = {
  [key in MonthName]: MonthAbbreviation;
};
