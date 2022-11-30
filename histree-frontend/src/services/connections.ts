import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { AutoCompleteData, RelationshipInfo, RenderContent } from "../models";
import { CompareNodes } from "../models/compareInfo";

export type ServiceStatus<T> =
  | DataInitial
  | DataLoading
  | DataFail
  | DataSuccess<T>;
export interface DataInitial {
  status: "Initial";
}
export interface DataLoading {
  status: "Loading";
}
export interface DataFail {
  status: "Failure";
  error: string;
}

export interface DataSuccess<T> {
  status: "Success";
  content: T;
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
  async ({
    qid,
    name,
  }: {
    qid: string;
    name: string;
  }): Promise<DataSuccess<RenderContent> | DataFail> => {
    try {
      const response = await axios.get<RenderContent>(
        `https://histree.fly.dev/person_info/${qid}?depth_up=5&depth_down=5`
      );
      return {
        status: "Success",
        content: { ...response.data, searchedQid: qid, searchedName: name },
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
  async ({
    qid,
    name,
  }: {
    qid: string;
    name: string;
  }): Promise<DataSuccess<RenderContent> | DataFail> => {
    try {
      const response = await axios.get<RenderContent>(
        `https://histree.fly.dev/person_info/${qid}?depth_up=5&depth_down=5`
      );
      return {
        status: "Success",
        content: {
          ...response.data,
          searchedQid: qid,
          searchedName: name,
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

export const fetchRelationship = createAsyncThunk(
  "relationship/fetchRelationship",
  async (nodes: CompareNodes): Promise<ServiceStatus<RelationshipInfo>> => {
    try {
      if (!nodes.first || !nodes.second) {
        throw new Error(
          "Can't fetch relationship: one or more nodes in CompareNodes is not defined."
        );
      }

      const response = await axios.get(
        `https://histree.fly.dev/relationship?id1=${nodes.first.id}&id2=${nodes.second.id}`
      );

      return {
        status: "Success",
        content: { ...response.data },
      };
    } catch (e) {
      return {
        status: "Failure",
        error: (e as Error).message,
      };
    }
  }
);
