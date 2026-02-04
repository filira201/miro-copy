export type SelectionModifier = "replace" | "add" | "toggle";
export type Selection = Set<string>;

export function selectItems(initialSelect: Selection, ids: string[], modif: SelectionModifier): Selection {
  if (modif === "replace") {
    return new Set(ids);
  } else if (modif === "add") {
    return new Set([...initialSelect, ...ids]);
  } else if (modif === "toggle") {
    const currentIds = new Set(initialSelect);
    const newIds = new Set(ids);

    const base = Array.from(initialSelect).filter((id) => !newIds.has(id));
    const added = ids.filter((id) => !currentIds.has(id));

    return new Set([...base, ...added]);
  }

  return initialSelect;
}
