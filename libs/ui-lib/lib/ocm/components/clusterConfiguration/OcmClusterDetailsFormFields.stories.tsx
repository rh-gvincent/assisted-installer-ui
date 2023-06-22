/* eslint-disable @typescript-eslint/no-unused-vars */
import { Meta, StoryObj } from '@storybook/react';
import { Formik } from 'formik';
import React from 'react';
import { TFunction } from 'react-i18next';

import * as yup from 'yup';

import { Form } from '@patternfly/react-core';
import { _OcmClusterDetailsFormFields } from './OcmClusterDetailsFormFields';
import { AlertsContextProvider, FeatureId, FeatureIdToSupportLevel, FeatureSupportLevelContextProvider, getRichTextValidation, nameValidationSchema, SupportLevel } from '../../../common';
import ClusterWizardContext, { ClusterWizardContextType } from '../clusterWizard/ClusterWizardContext';
import { ClusterWizardStepsType } from '../clusterWizard/wizardTransition';
import { StaticIpView } from './staticIp/data/dataTypes';
import { HostsNetworkConfigurationType } from '../../services';
import { Provider } from 'react-redux';
import { store } from '../../store';
import { ACMFeatureSupportLevelProvider } from '../../../cim';
import { NewFeatureSupportLevelContextProvider, NewFeatureSupportLevelData, NewFeatureSupportLevelMap } from '../../../common/components/newFeatureSupportLevels';
const featureSupportLevels: NewFeatureSupportLevelMap = {
  SNO: 'supported',
  
  VIP_AUTO_ALLOC: 'supported',
  CUSTOM_MANIFEST: 'supported',
  SINGLE_NODE_EXPANSION: 'supported',
  LVM: 'supported',
  ODF: 'supported',
  LSO: 'supported',
  CNV: 'supported',
  NUTANIX_INTEGRATION: 'supported',
  VSPHERE_INTEGRATION: 'supported',
  DUAL_STACK_VIPS: 'supported',
  CLUSTER_MANAGED_NETWORKING: 'supported',
  USER_MANAGED_NETWORKING: 'supported',
  MINIMAL_ISO: 'supported',
  FULL_ISO: 'supported',
  EXTERNAL_PLATFORM_OCI: 'supported'
}

const DummyFeatureSupportLevelProvider = ({children}: {children: React.ReactNode}) => {
  const value = React.useMemo<NewFeatureSupportLevelData>(() => ({
    getVersionSupportLevelsMap: (version: string): FeatureIdToSupportLevel | undefined => ({}),
    getFeatureSupportLevel: (version: string, supportLevelData?: NewFeatureSupportLevelMap) => 'supported',
    isFeatureDisabled: (version: string, supportLevelData?: NewFeatureSupportLevelMap) => false,
    getFeatureDisabledReason: (
      featureId: FeatureId,
      t?: TFunction,
      supportLevelData?: NewFeatureSupportLevelMap,
    ) => undefined,
    isFeatureSupported: (featureId: FeatureId, supportLevelData?: NewFeatureSupportLevelMap) => true,
    getFeatureSupportLevels: () => featureSupportLevels
  }), []);
  
  return <NewFeatureSupportLevelContextProvider value={value}>{children}</NewFeatureSupportLevelContextProvider>
}

const DummyWizardContextProvider = ({children}: {children: React.ReactNode}) => {
  const value = React.useMemo<ClusterWizardContextType>(() => ({
    currentStepId: "cluster-details",
    setCurrentStepId: (stepId: ClusterWizardStepsType) => console.log(stepId),
    moveBack: () => console.log("moveBack"),
    moveNext: () => console.log("moveNext"),
    wizardStepIds: ["cluster-details"],
    onUpdateStaticIpView: (view: StaticIpView) => console.log(view),
    onUpdateHostNetworkConfigType: (type: HostsNetworkConfigurationType) => console.log(type),
    setAddCustomManifests: (addCustomManifest: boolean) => console.log(addCustomManifest),
    addCustomManifests: false,
    wizardPerPage: 1,
    setWizardPerPage: (perPage: number) => console.log(perPage),
  }), []);
  return (<ClusterWizardContext.Provider value={value}>
    {children}
  </ClusterWizardContext.Provider>)
}


const OcmClusterDetailsFormFieldsWrapper = ({ initialName }: { initialName: string }) => {
  const tFunction: TFunction = (text: string) => text;
  
  const validationSchema = React.useMemo<yup.Schema<{ name: string }>>(() => {
    return yup.object().shape({
      name: yup.string().concat(nameValidationSchema(tFunction, [])),
    });
  }, []);
  return (
    <Provider store={store}>
      <ACMFeatureSupportLevelProvider clusterImages={[]}>
        <DummyFeatureSupportLevelProvider>
          <DummyWizardContextProvider>
            <AlertsContextProvider>
              <Formik
                initialValues={{ name: initialName }}
                onSubmit={(values) => console.log(values)}
                validateOnMount
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                validate={getRichTextValidation<{ name: string }>(validationSchema)}
              >
                <Form>
                  <_OcmClusterDetailsFormFields />
                </Form>
              </Formik>
            </AlertsContextProvider>
          </DummyWizardContextProvider>
        </DummyFeatureSupportLevelProvider>
      </ACMFeatureSupportLevelProvider>
    </Provider>
  );
};

const meta: Meta<typeof OcmClusterDetailsFormFieldsWrapper> = {
  title: 'OcmClusterDetailsFormFieldsWrapper',
  component: OcmClusterDetailsFormFieldsWrapper,
};

export default meta;
type Story = StoryObj<typeof OcmClusterDetailsFormFieldsWrapper>;

export const OcmClusterDetailsFormFieldStory: Story = {
  args: {
    initialName: '',
  },
};
