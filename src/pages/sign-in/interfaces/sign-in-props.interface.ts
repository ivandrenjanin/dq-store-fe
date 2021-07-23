import { AxiosInstance } from "axios";
import { RouteComponentProps } from "react-router-dom";

export interface SignInProps extends RouteComponentProps {
  apiClient: AxiosInstance;
}
