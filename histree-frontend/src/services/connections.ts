import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import {
  AutoCompleteData,
  ExpandInfo,
  RelationshipInfo,
  RenderContent,
} from "../models";
import { CompareNodes } from "../models/compareInfo";

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
    return { searchTerm: search, autocompleteData: response.data };
  }
);

export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async (qid: string): Promise<ServiceStatus<RenderContent>> => {
    try {
      const response = await axios.get<RenderContent>(
        `https://histree.fly.dev/person_info/${qid}`
      );
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
