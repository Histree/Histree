import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RenderContent } from "../models";

export interface ServiceStatus<T> {
  status: "Initial" | "Loading" | "Success" | "Failure";
  content?: T;
  error?: string;
}

export const fetchSearchSuggestions = createAsyncThunk(
  "search/fetchSuggestions",
  async () => {
    const response = await axios.get("url");
    return response.data as string[];
  }
);

export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async (): Promise<ServiceStatus<RenderContent>> => {
    const response = await axios.get<RenderContent>("url");
    return {
      status: "Success",
      content: response.data,
    };
  }
);
