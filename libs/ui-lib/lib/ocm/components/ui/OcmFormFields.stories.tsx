import { Meta, StoryObj } from '@storybook/react';
import { Formik } from 'formik';
import React from 'react';

import * as yup from 'yup';

import { Form } from '@patternfly/react-core';

import { InputField } from '@openshift-assisted/ui-lib/ocm';
import { getMultipleIpAddressValidationSchema } from '../clusterConfiguration/staticIp/commonValidationSchemas';

const InputFieldWrapper = ({ initialValue }: { initialValue: string }) => {
  const validationSchema = React.useMemo<yup.Schema<{ dns: string }>>(() => {
    return yup.object().shape({
      dns: getMultipleIpAddressValidationSchema(),
    });
  }, []);

  return (
    <Formik
      initialValues={{ dns: initialValue }}
      onSubmit={console.log}
      validateOnMount
      validationSchema={validationSchema}
    >
      <Form>
        <InputField
          isRequired
          label="DNS"
          name={`dns`}
          data-testid={`dns`}
          helperText={'List of your DNS server addresses, separated by commas.'}
        />
      </Form>
    </Formik>
  );
};

const meta: Meta<typeof InputFieldWrapper> = {
  title: 'DNSInputFieldWrapper',
  component: InputFieldWrapper,
};

export default meta;
type Story = StoryObj<typeof InputFieldWrapper>;

export const DNSInputFieldWrapper: Story = {
  args: {
    initialValue: '',
  },
};
