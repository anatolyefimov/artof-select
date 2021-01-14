import React from "react";

import { fireEvent } from "../fireEvent";
import {
  SelectCommonProps,
  SelectMultiple,
  SelectSingle,
} from "../Select.types";

interface Props {
  multiple: boolean;
  options: SelectCommonProps["options"];
  asTags: SelectCommonProps["asTags"];
  value: SelectMultiple["value"] | SelectSingle["value"];
  placeholder: SelectCommonProps["placeholder"];
  textSelected: SelectCommonProps["textSelected"];
  allowTagsCount: SelectCommonProps["allowTagsCount"];
  allowClear: SelectCommonProps["allowClear"];
  select: React.RefObject<HTMLSelectElement>;
}

const SelectedValues: React.FC<Props> = ({
  multiple,
  options,
  placeholder,
  allowTagsCount,
  allowClear,
  select,
  ...props
}): JSX.Element => {
  const onClear = (): void => {
    if (select.current) {
      select.current.value = "";
      fireEvent(select.current, "change");
    }
  };

  if (multiple) {
    const { asTags, textSelected } = props;
    const value = props.value as SelectMultiple["value"];

    if (asTags) {
      const tags = options.filter((option) =>
        value?.includes(`${option.value}`)
      );

      if (!tags.length) {
        return <>{placeholder}</>;
      }

      return (
        <>
          {allowTagsCount && tags.length && (
            <div className="artof_select-tags_count">{tags.length}</div>
          )}

          {tags.map(
            (option): JSX.Element => (
              <div
                className="artof_select-tag"
                key={`artof_select-tag__${option.value}`}
              >
                {option.component || option.label}
              </div>
            )
          )}

          {allowClear && (
            <button
              type="button"
              onClick={onClear}
              className="artof_select-clear"
            />
          )}
        </>
      );
    } else if (value?.length) {
      return (
        <>
          <div className="artof_select-value-text">
            {textSelected} {value.length}
          </div>

          {allowClear && (
            <button
              type="button"
              onClick={onClear}
              className="artof_select-clear"
            />
          )}
        </>
      );
    } else {
      return <>{placeholder}</>;
    }
  }

  const value = props.value as SelectSingle["value"];
  const label = options.find((option) => value === option.value)?.label;

  if (label || value) {
    return (
      <>
        <div className="artof_select-value-text">{label || value}</div>

        {allowClear && (
          <button
            type="button"
            onClick={onClear}
            className="artof_select-clear"
          />
        )}
      </>
    );
  }

  return <>{placeholder}</>;
};

export { SelectedValues };
