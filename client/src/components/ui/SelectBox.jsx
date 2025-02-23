"use client";

import {
  Select,
  SelectValue,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/app/_components/ui/select";
import { toast } from "react-hot-toast";
import React, { useState } from "react";
import { FormControl } from "@/app/_components/ui/form";

export default function SelectBox({ field, props, onChange }) {
  function handleValueChange(value) {
    field.onChange(value);
    onChange(value);
    console.log(value);
  }

  return (
    <Select
      disabled={props.disabled}
      value={props.selectValue || field.value}
      onValueChange={(value) => {
        // field.onChange(value); // update field value
        handleValueChange(value);
      }}
      defaultValue={field.value}
    >
      <FormControl>
        <SelectTrigger
          onMouseDown={(event) => {
            event.stopPropagation(); // Prevent parent handlers from interfering

            if (!props.selectOptions?.length) {
              console.log("selectOptions", props.selectOptions);
              event.preventDefault();
              toast.error(props.selectMessage || "Select an option");
            }
          }}
          className={``}
        >
          {/* ${
              !props.selectOptions?.length && "opacity-30 cursor-not-allowed"
            } */}
          {!props.selectOptions?.length ? (
            <p className="text-muted">
              {props.selectMessage || "No options available"}
            </p>
          ) : (
            <SelectValue placeholder={props.placeholder} />
          )}
        </SelectTrigger>
      </FormControl>
      <SelectContent className="shad-select-content">
        {props.selectOptions && props.selectOptions.length > 0
          ? props.selectOptions
              // .map((val) => val[0].toUpperCase() + val.slice(1))
              .map((option) => (
                <SelectItem key={option} value={option}>
                  {option[0].toUpperCase() + option.slice(1)}
                </SelectItem>
              ))
          : props.selectGroupOptions &&
            props.selectGroupOptions.length > 0 &&
            props.selectGroupOptions.map((group) => (
              <SelectGroup key={group.title}>
                <SelectLabel className="text-2xl mt-6">
                  {group.title}
                </SelectLabel>
                {group.items.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
      </SelectContent>
    </Select>
  );
}
