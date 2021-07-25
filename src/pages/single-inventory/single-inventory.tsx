import { AxiosInstance } from "axios";
import React, { FunctionComponent } from "react";
import { RouteComponentProps, useParams } from "react-router-dom";

interface SingleInventoryProps extends RouteComponentProps {
  apiClient: AxiosInstance;
}

export const SingleInventory: FunctionComponent<SingleInventoryProps> = ({
  apiClient,
}) => {
  const { id } = useParams<{ id: string }>();
  return <h1>Hello</h1>;
};
