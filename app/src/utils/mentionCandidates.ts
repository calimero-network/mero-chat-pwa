import { isSelfSender } from "./selfIdentity";

/**
 * The names worth offering after an `@`.
 *
 * Channel membership and mention candidates are nearly the same list, with one
 * difference: yourself. You belong in the member list — you are in the channel —
 * but `@` addresses someone else, and in a channel with two or three people an
 * entry for yourself is a meaningful fraction of the suggestions.
 *
 * `isSelfSender` is the app's existing answer to "is this me". It matters that
 * it, and not a string comparison, is used here: the roster reports accounts
 * while the app holds device keys and several encodings of both, so a direct
 * comparison silently matches nothing and quietly leaves you in the list.
 */
export function mentionCandidates(
  members: Map<string, string> | undefined | null,
  contextId: string,
): string[] {
  if (!members) return [];

  const names: string[] = [];
  for (const [identity, name] of members) {
    if (!name.trim()) continue;
    if (isSelfSender(identity, contextId)) continue;
    names.push(name);
  }
  return names;
}
