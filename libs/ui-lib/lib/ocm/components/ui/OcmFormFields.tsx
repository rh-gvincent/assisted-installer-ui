import * as React from 'react';
import { Checkbox, CheckboxProps, Radio, RadioProps } from '@patternfly/react-core';
import {
  CheckboxField,
  CodeField,
  InputField,
  RadioField,
  RichInputField,
  SelectField,
  SwitchField,
} from '../../../common';
import {
  CheckboxFieldProps,
  CodeFieldProps,
  RadioFieldProps,
  SelectFieldProps,
  SwitchFieldProps,
} from '../../../common/components/ui/formik/types';
import { RichInputFieldPropsProps } from '../../../common/components/ui/formik/RichInputField';

type DisableableField = {
  isDisabled?: boolean;
};

function FormFieldDisabler<T extends DisableableField>(FormComponent: React.ComponentType<T>) {
  return function WrapperHoc(props: T) {    
    return <FormComponent {...props} isDisabled={false} />;
  };
}

export function RefFormFieldDisabler<T extends DisableableField>(
  FormComponent: React.ComponentType<T>,
) {
  return React.forwardRef(function useInputRef(props: T, ref) {    
    return <FormComponent ref={ref} {...props} isDisabled={false} />;
  });
}

// Formik Fields
const OcmInputField = FormFieldDisabler<React.ComponentProps<typeof InputField>>(InputField);
type OcmInputFieldProps = Parameters<typeof OcmInputField>[0];
const OcmSelectField = FormFieldDisabler<SelectFieldProps>(SelectField);
type OcmSelectFieldProps = Parameters<typeof OcmSelectField>[0];
const OcmCheckboxField = FormFieldDisabler<CheckboxFieldProps>(CheckboxField);
type OcmCheckboxFieldProps = Parameters<typeof OcmCheckboxField>[0];
const OcmSwitchField = FormFieldDisabler<SwitchFieldProps>(SwitchField);
type OcmSwitchFieldProps = Parameters<typeof OcmSwitchField>[0];
const OcmRadioField = FormFieldDisabler<RadioFieldProps>(RadioField);
type OcmRadioFieldProps = Parameters<typeof OcmRadioField>[0];
const OcmCodeField = FormFieldDisabler<CodeFieldProps>(CodeField);
type OcmCodeFieldProps = Parameters<typeof OcmCodeField>[0];

// Patternfly components
const OcmCheckbox = FormFieldDisabler<CheckboxProps>(Checkbox);
type OcmCheckboxProps = Parameters<typeof OcmCheckbox>[0];
const OcmRadio = FormFieldDisabler<RadioProps>(Radio);
type OcmRadioProps = Parameters<typeof OcmRadio>[0];

// With forwardRef
const OcmRichInputField = RefFormFieldDisabler<RichInputFieldPropsProps>(RichInputField);
type OcmRichInputFieldProps = Parameters<typeof OcmRichInputField>[0];

export {
  OcmInputField,
  OcmInputFieldProps,
  OcmRichInputField,
  OcmRichInputFieldProps,
  OcmSelectField,
  OcmSelectFieldProps,
  OcmCheckbox,
  OcmCheckboxProps,
  OcmCheckboxField,
  OcmCheckboxFieldProps,
  OcmCodeField,
  OcmCodeFieldProps,
  OcmSwitchField,
  OcmSwitchFieldProps,
  OcmRadioField,
  OcmRadioFieldProps,
  OcmRadio,
  OcmRadioProps,
};
