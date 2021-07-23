import { AxiosInstance } from "axios";
import { RouteComponentProps } from "react-router-dom";

export interface DashboardProps extends RouteComponentProps {
  apiClient: AxiosInstance;
}
