import { PLACEHOLDER } from "./site-images";

/** The picture shown wherever a story, project or person has no photo yet: the programme's logo. */
export function imageOr(src: string | null | undefined): string {
  return src || PLACEHOLDER;
}
