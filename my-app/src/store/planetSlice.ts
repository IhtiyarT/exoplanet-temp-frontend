import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";

export interface Planet {
  planet_id: number;
  planet_title: string;
  planet_image?: string | null;
  planet_description?: string;
  albedo?: number;
}

interface PlanetListResponseObject {
  planets: Planet[];
  planet_count?: number;
  system_id?: number;
}

type PlanetListResponse = Planet[] | PlanetListResponseObject;

interface PlanetsState {
  planets: Planet[];
  loading: boolean;
  error: string | null;
  planetCount: number;
  systemId: number;
}

const initialState: PlanetsState = {
  planets: [],
  loading: false,
  error: null,
  planetCount: 0,
  systemId: 0,
};

export const fetchPlanets = createAsyncThunk<
  PlanetListResponse,   
  string | undefined,   
  { rejectValue: string }
>(
  "planets/fetchPlanets",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.api.planetList(
        query ? { query } : undefined
      );

      return response.data as PlanetListResponse;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Ошибка запроса"
      );
    }
  }
);

const planetsSlice = createSlice({
  name: "planets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPlanets.fulfilled, (state, action: PayloadAction<PlanetListResponse>) => {
        state.loading = false;
        const data = action.payload;

        if (Array.isArray(data)) {
          state.planets = data;
          state.planetCount = data.length;
          state.systemId = 0;
        } else {
          state.planets = data.planets;
          state.planetCount = data.planet_count ?? data.planets.length;
          state.systemId = data.system_id ?? 0;
        }
      })

      .addCase(fetchPlanets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Неизвестная ошибка";
        state.planets = [];
        state.planetCount = 0;
        state.systemId = 0;
      });
  },
});

export default planetsSlice.reducer;
