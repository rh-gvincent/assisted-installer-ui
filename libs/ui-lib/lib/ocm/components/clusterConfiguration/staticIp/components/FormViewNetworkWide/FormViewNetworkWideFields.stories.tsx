import { Meta, StoryObj } from '@storybook/react';
import { Formik } from 'formik';
import React from 'react';


import { Form } from '@patternfly/react-core';

import { FormViewNetworkWideFields } from './FormViewNetworkWideFields';
import { FormViewNetworkWideValues } from '../../data/dataTypes';
import { networkWideValidationSchema } from './formViewNetworkWideValidationSchema';

const FormViewNetworkWideFieldsWrapper = ({ initialValues }: { initialValues: FormViewNetworkWideValues }) => {
  return (
    <Formik<FormViewNetworkWideValues>
      initialValues={initialValues}
      onSubmit={console.log}
      validateOnMount
      validationSchema={networkWideValidationSchema}
    >
      <Form>
        <FormViewNetworkWideFields hosts={[]}/>        
      </Form>
    </Formik>
  );
};

const meta: Meta<typeof FormViewNetworkWideFieldsWrapper> = {
  title: 'NetworkWide',
  component: FormViewNetworkWideFieldsWrapper,
};

export default meta;
type Story = StoryObj<typeof FormViewNetworkWideFieldsWrapper>;

export const NetworkWide: Story = {
  args: {
    initialValues: {
      protocolType: 'ipv4',
      useVlan: false,
      dns: '',
      vlanId: '',
      ipConfigs: {
        ipv4: {
          machineNetwork: {
            ip: '',
            prefixLength: ''
          },
          gateway: '',
        },
        ipv6: {
          machineNetwork: {
            ip: '',
            prefixLength: ''
          },
          gateway: '',
        }
      }
    }
  },
};
