import { PLANETS_MOCK } from "../src/modules/mock";
import { getApiUrl } from "../src/utils/config";

export type PlanetDTO = {
  planet_id: number;
  planet_title: string;
  planet_image?: string | null;
  planet_description?: string;
  albedo?: number;
};

type FetchPlanetsOptions = {
  page?: number;
  limit?: number;
  name?: string;
};

type FetchPlanetsResult = {
  items: PlanetDTO[];
  total?: number;
  planetCount?: number;
  systemID?: number;
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function fetchPlanets(opts: FetchPlanetsOptions = {}): Promise<FetchPlanetsResult> {
  const { page = 1, limit = 8, name } = opts;
  const params = new URLSearchParams();
  if (name) params.set("query", name);

  const url = `/api/planet?${params.toString()}`;

  try {
    const res = await fetch(getApiUrl(url), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    const json = data as unknown;

    if (Array.isArray(json)) {
    const start = (page - 1) * limit;
    const items = json.slice(start, start + limit);
    return { items, total: json.length };
    }

    if (typeof json === "object" && json !== null) {
        if ("planets" in json && Array.isArray((json as { planets: unknown }).planets)) {
            const j = json as { planets: PlanetDTO[]; planet_count?: number; system_id?: number };
            return { items: j.planets, total: j.planets.length, planetCount: j.planet_count, systemID: j.system_id };
        }
    }
    return { items: [] };
  } catch (err) {
    console.warn("Backend fetch failed, using mock data:", err);
    await sleep(300);

    let filtered = PLANETS_MOCK;
    if (name && name.trim().length > 0) {
      const q = name.trim().toLowerCase();
      filtered = PLANETS_MOCK.filter((p) => p.planet_title.toLowerCase().includes(q));
    }

    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);
    return { items, total: filtered.length };
  }
}

export async function fetchPlanetById(id: number) {
  const url = `/api/planet/${id}`;
  try {
    const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      planet_title: data.planet_title,
      planet_description: data.planet_description,
      planet_image: data.planet_image,
      albedo: data.albedo,
    };
  } catch (err) {
    console.warn("Failed to fetch planet, using mock fallback:", err);
    return {
      planet_title: "Неизвестная планета",
      planet_description: "Описание недоступно.",
      planet_image: null,
      albedo: 0,
    };
  }
}

export const getImageUrl = (filename: string | null | undefined): string => {
  if (!filename || filename == '/DefaultImage.jpg') {
    return '/DefaultImage.jpg';
  }

  if (import.meta.env.DEV) {
    return `/minio/minio-backend/${filename}`;
  } else {
    return `/planets/${filename}`;
  }
};
