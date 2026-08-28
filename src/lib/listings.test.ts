import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/public", () => ({
  getSupabasePublicClient: vi.fn(),
}));

import { getSupabasePublicClient } from "@/lib/supabase/public";
import { getListingsWithStatus } from "./listings";

const mockedGetClient = vi.mocked(getSupabasePublicClient);

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("production listing failure behavior", () => {
  it("fails closed instead of showing fixtures when configuration is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    mockedGetClient.mockReturnValue(null);

    await expect(getListingsWithStatus()).resolves.toEqual({
      listings: [],
      unavailable: true,
    });
  });

  it("keeps fixture data available for local development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    mockedGetClient.mockReturnValue(null);

    const result = await getListingsWithStatus();
    expect(result.unavailable).toBe(false);
    expect(result.listings.length).toBeGreaterThan(0);
  });
});
