'use client';

import React from 'react';

import MultiCombobox, {
  ComboboxOption,
} from '@/components/admin/multi-combobox';
import TechStackIcon from '@/components/icons/tech-stack-icon';
import {
  techStack,
  TechStackIconName,
  techStackNames,
} from '@/data/tech-stack';

const options: ComboboxOption[] = techStackNames.map((name) => ({
  value: name,
  label: techStack[name].label,
  icon: <TechStackIcon name={name} size={16} className="shrink-0" />,
}));

type TechStackPickerProps = {
  value: TechStackIconName[];
  onChange: (value: TechStackIconName[]) => void;
  onBlur?: () => void;
  id?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

/**
 * Search and pick from every technology that has an icon. A search rather
 * than a dropdown: there are dozens, and typing two letters finds one faster
 * than scrolling for it.
 */
const TechStackPicker = ({
  value,
  onChange,
  ...props
}: TechStackPickerProps) => {
  return (
    <MultiCombobox
      {...props}
      value={value}
      // Only options can be chosen, so every value is a known name.
      onChange={(next) => onChange(next as TechStackIconName[])}
      options={options}
      placeholder={`Search ${options.length} technologies`}
    />
  );
};

export default TechStackPicker;
