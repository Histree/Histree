import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { AutoCompleteData, ExpandInfo, RenderContent } from "../models";

export interface ServiceStatus<T> {
  status: "Initial" | "Loading" | "Success" | "Failure";
  content?: T;
  error?: string;
}

export const fetchSearchSuggestions = createAsyncThunk(
  "search/fetchSuggestions",
  async (search: string) => {
    const response = await axios.get<Record<string, AutoCompleteData>>(
      `https://histree.fly.dev/find_matches/${search}`
    );
    return response.data;
  }
);

export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async (qid: string): Promise<ServiceStatus<RenderContent>> => {
    try {
      const response = await axios.get<RenderContent>(
        `https://histree.fly.dev/person_info/${qid}`
      );
      console.log(response.data);

      return {
        status: "Success",
        content: { ...response.data, searchedQid: qid },
      };
    } catch (e) {
      return {
        status: "Failure",
        error: (e as AxiosError).message,
      };
    }
  }
);

export const fetchSelectedExpansion = createAsyncThunk(
  "search/fetchExpand",
  async (
    info: ExpandInfo
  ): Promise<ServiceStatus<RenderContent & ExpandInfo>> => {
    try {
      const response = await axios.get<RenderContent>(
        `https://histree.fly.dev/person_info/${info.searchedQid}`
      );
      console.log(response.data);
      return {
        status: "Success",
        content: {
          ...response.data,
          searchedQid: info.searchedQid,
          direction: info.direction,
        },
      };
    } catch (e) {
      return {
        status: "Failure",
        error: (e as AxiosError).message,
      };
    }
  }
);
