import { Meta, StoryObj } from '@storybook/react';
import { Formik } from 'formik';
import React from 'react';

import * as yup from 'yup';

import { Form } from '@patternfly/react-core';

import { getMultipleIpAddressValidationSchema } from '../../commonValidationSchemas';
import { DnsField } from './FormViewNetworkWideFields';
import { ProtocolVersion } from '../../data/dataTypes';

const DnsFieldWrapper = ({ initialValue, protocolVersion }: { initialValue: string, protocolVersion?: ProtocolVersion | ''}) => {
  const validationSchema = React.useMemo<yup.Schema<{ dns: string }>>(() => {
    return yup.object().shape({
      dns: getMultipleIpAddressValidationSchema(protocolVersion || undefined),
    });
  }, [protocolVersion]);

  return (
    <Formik
      initialValues={{ dns: initialValue }}
      onSubmit={console.log}
      validateOnMount
      validationSchema={validationSchema}
      enableReinitialize
      initialTouched={{dns: true}}
    >
      <Form>
       <DnsField />
      </Form>
    </Formik>
  );
};

const meta: Meta<typeof DnsFieldWrapper> = {
  title: 'DnsField',
  component: DnsFieldWrapper,
};

export default meta;
type Story = StoryObj<typeof DnsFieldWrapper>;

export const DNSInputFieldWrapper: Story = {
  args: {
    initialValue: '',
    protocolVersion: ''
  },
};
