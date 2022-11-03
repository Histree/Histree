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
  async (search: string) => {
    const response = await axios.get<Record<string, string>>(
      `http://localhost:8010/proxy/find_matches/${search}`
    );
    return response.data;
  }
);

export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async (qid: string): Promise<ServiceStatus<RenderContent>> => {
    // const response = await axios.get<RenderContent>(`https://histree.fly.dev/person_info/${qid}`);
    const response = await axios.get<RenderContent>(
      `http://localhost:8010/proxy/person_info/${qid}`
    );
    return {
      status: "Success",
      content: response.data,
    };
  }
);
