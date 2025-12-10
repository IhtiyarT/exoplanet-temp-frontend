/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";

export interface PlanetSystem {
  system_id: number;
  star_name: string;
  star_type: string;
  star_luminosity: number;
  planet_count: number;
  planet_temp_count: number;
  status: string;
  created_at: string | number;
  user_login: string;
}

interface ListParams {
  start_date?: string;
  end_date?: string;
  system_status?: string;
}

interface RequestsState {
  systems: PlanetSystem[];
  loading: boolean;
  error: string | null;
}

const initialState: RequestsState = {
  systems: [],
  loading: false,
  error: null,
};

export const fetchPlanetSystems = createAsyncThunk<
  PlanetSystem[],
  ListParams | undefined,
  { rejectValue: string }
>("requests/fetchPlanetSystems", async (params, { rejectWithValue }) => {
  try {
    const response = await api.api.planetSystemListList(params || {});
    const rawData = response.data as any;
    const arrayData = Array.isArray(rawData) ? rawData : rawData.planet_systems ?? [];

    const list: PlanetSystem[] = arrayData.map((item: any) => ({
      system_id: item.id ?? 0,
      star_name: item.star_name ?? "—",
      star_type: item.star_type ?? "—",
      star_luminosity: item.star_luminosity ?? 0,
      planet_count: item.planet_count ?? 0,
      planet_temp_count: item.planet_temp_count ?? 0,
      status: item.status ?? item.system_status ?? "Черновик",
      created_at: item.date_created ?? item.created_at ?? "",
      user_login: item.user_login ?? item.user?.login ?? "",
    }));

    return list;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Ошибка загрузки заявок");
  }
});

export const moderatePlanetSystem = createAsyncThunk<
  void,
  { systemId: number; newStatus: "Завершена" | "Отклонена" },
  { rejectValue: string }
>("requests/moderatePlanetSystem", async ({ systemId, newStatus }, { rejectWithValue }) => {
  try {
    await api.api.planetSystemModerUpdate(systemId, { status: newStatus });
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Ошибка модерации");
  }
});

const systemReducer = createSlice({
  name: "requests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanetSystems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanetSystems.fulfilled, (state, action: PayloadAction<PlanetSystem[]>) => {
        state.loading = false;
        state.systems = action.payload;
      })
      .addCase(fetchPlanetSystems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка загрузки";
        state.systems = [];
      })
      .addCase(moderatePlanetSystem.pending, (state) => {
        state.error = null;
      })
      .addCase(moderatePlanetSystem.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(moderatePlanetSystem.rejected, (state, action) => {
        state.error = action.payload ?? "Ошибка модерации";
      });
  },
});

export default systemReducer.reducer;
