import { describe, expect, it, vi } from "vitest";

vi.mock("./selfIdentity", () => ({
  isSelfSender: (id: string) => id === "me",
}));

import { mentionCandidates } from "./mentionCandidates";

describe("mentionCandidates", () => {
  it("leaves you out of your own mention list", () => {
    // You are in the channel — the member list should show you — but
    // "@" is for addressing someone else. Offering yourself is noise in a
    // list that is often only two or three names long.
    const names = mentionCandidates(
      new Map([
        ["me", "Xabi"],
        ["them", "Fran"],
      ]),
      "ctx-1",
    );

    expect(names).toEqual(["Fran"]);
  });

  it("keeps everyone else", () => {
    const names = mentionCandidates(
      new Map([
        ["a", "TestUser"],
        ["b", "Fran"],
        ["c", "Xabi"],
      ]),
      "ctx-1",
    );

    expect(names.sort()).toEqual(["Fran", "TestUser", "Xabi"]);
  });

  it("drops blank names rather than offering an empty suggestion", () => {
    const names = mentionCandidates(new Map([["a", ""], ["b", "Fran"]]), "ctx-1");
    expect(names).toEqual(["Fran"]);
  });

  it("survives a missing map", () => {
    expect(mentionCandidates(undefined, "ctx-1")).toEqual([]);
  });
});
