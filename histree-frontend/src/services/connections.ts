import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface ServiceStatus<T> {
  status: "Initial" | "Loading" | "Success" | "Failure";
  content?: T;
  error?: string;
}

export const fetchRenderContent = createAsyncThunk(
  "table/fetchTableData",
  async () => {
    const response = await axios.get("temp url");
  }
);
