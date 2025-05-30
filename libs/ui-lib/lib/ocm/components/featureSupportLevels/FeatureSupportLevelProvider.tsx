import useSWR from 'swr';
import React, { PropsWithChildren } from 'react';
import * as Sentry from '@sentry/browser';
import {
  ActiveFeatureConfiguration,
  Cluster,
  CpuArchitecture,
  FeatureId,
  FeatureIdToSupportLevel,
  FeatureSupportLevelContextProvider,
  FeatureSupportLevelData,
  FeatureSupportLevels,
  FeatureSupportLevelsMap,
  getDefaultCpuArchitecture,
  SupportLevel,
} from '../../../common';
import { handleApiError } from '../../api';
import { FeatureSupportLevelsAPI } from '../../services/apis';
import { captureException } from '../../sentry';
import { useOpenshiftVersions, usePullSecret } from '../../hooks';
import { getFeatureDisabledReason, isFeatureSupported } from './featureStateUtils';
import useInfraEnv from '../../hooks/useInfraEnv';
import { isFeatureSupportedAndAvailable } from '../newFeatureSupportLevels/newFeatureStateUtils';

export type SupportLevelProviderProps = PropsWithChildren<{
  clusterFeatureUsage?: string;
  openshiftVersion?: string;
  loadingUi: React.ReactNode;
  cluster?: Cluster;
}>;

const getFeatureSupportLevelsMap = (
  featureSupportLevels: FeatureSupportLevels,
): FeatureSupportLevelsMap => {
  try {
    const featureSupportLevelsMap: FeatureSupportLevelsMap = {};
    for (const { openshiftVersion, features } of featureSupportLevels) {
      if (!openshiftVersion || !features) {
        continue;
      }
      featureSupportLevelsMap[openshiftVersion] = {};
      for (const { featureId, supportLevel } of features) {
        if (!featureId || !supportLevel) {
          continue;
        }
        featureSupportLevelsMap[openshiftVersion][featureId] = supportLevel;
      }
    }
    return featureSupportLevelsMap;
  } catch (err) {
    captureException(err, 'Failed to parse feature support levels', Sentry.Severity.Warning);
    return {};
  }
};

const getVersionSupportLevelsMap = (
  versionName: string,
  supportLevelData: FeatureSupportLevelsMap,
): FeatureIdToSupportLevel | undefined => {
  // There is only one feature-support-level item per minor OpenShift version
  // To solve the problem of partial matching (4.1 vs 4.11), we sort the list from most recent to least recent.
  const versionKey = Object.keys(supportLevelData)
    .reverse()
    .find((key) => versionName.startsWith(key));
  if (!versionKey) {
    return undefined;
  }

  return supportLevelData[versionKey];
};

export const getFeatureSupported = (
  openshiftVersion: string,
  featureSupportLevels: FeatureSupportLevels,
  featureId: FeatureId,
) => {
  const featureSupportLevelsMap = getFeatureSupportLevelsMap(featureSupportLevels);
  const versionSupportLevels = getVersionSupportLevelsMap(
    openshiftVersion,
    featureSupportLevelsMap,
  );
  return versionSupportLevels && isFeatureSupportedAndAvailable(versionSupportLevels[featureId]);
};

export const FeatureSupportLevelProvider: React.FC<SupportLevelProviderProps> = ({
  cluster,
  children,
  loadingUi,
}) => {
  const { loading: loadingOCPVersions, versions: versionOptions } = useOpenshiftVersions();
  const pullSecret = usePullSecret();
  const { infraEnv, isLoading: isInfraEnvLoading } = useInfraEnv(
    cluster?.id || '',
    cluster?.cpuArchitecture ? (cluster.cpuArchitecture as CpuArchitecture) : CpuArchitecture.x86,
    cluster?.name,
    pullSecret,
    cluster?.openshiftVersion,
  );
  const fetcher = () => FeatureSupportLevelsAPI.list().then((res) => res.data);
  const { data: featureSupportLevels, error } = useSWR<FeatureSupportLevels, unknown>(
    FeatureSupportLevelsAPI.makeBaseURI(),
    fetcher,
    { errorRetryCount: 0, revalidateOnFocus: false },
  );
  const isLoading = (!featureSupportLevels && !error) || loadingOCPVersions || isInfraEnvLoading;

  const supportLevelData = React.useMemo<FeatureSupportLevelsMap>(() => {
    if (!featureSupportLevels || error) {
      return {};
    }
    return getFeatureSupportLevelsMap(featureSupportLevels);
  }, [error, featureSupportLevels]);

  const activeFeatureConfiguration = React.useMemo<ActiveFeatureConfiguration>(
    () => ({
      underlyingCpuArchitecture: (infraEnv?.cpuArchitecture ||
        cluster?.cpuArchitecture ||
        getDefaultCpuArchitecture()) as CpuArchitecture,
      hasStaticIpNetworking: !!infraEnv?.staticNetworkConfig,
    }),
    [cluster?.cpuArchitecture, infraEnv?.cpuArchitecture, infraEnv?.staticNetworkConfig],
  );

  const getVersionSupportLevelsMapCallback = React.useCallback(
    (versionName: string): FeatureIdToSupportLevel | undefined => {
      return getVersionSupportLevelsMap(versionName, supportLevelData);
    },
    [supportLevelData],
  );

  const getFeatureSupportLevel = React.useCallback(
    (versionName: string, featureId: FeatureId): SupportLevel | undefined => {
      const versionSupportLevelData = getVersionSupportLevelsMapCallback(versionName);
      return versionSupportLevelData ? versionSupportLevelData[featureId] : undefined;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [getVersionSupportLevelsMapCallback],
  );

  const isFeatureSupportedCallback = React.useCallback(
    (versionName: string, featureId: FeatureId) => {
      const supportLevel = getFeatureSupportLevel(versionName, featureId);
      return isFeatureSupported(versionName, featureId, supportLevel, versionOptions);
    },
    [getFeatureSupportLevel, versionOptions],
  );

  //TODO(brotman): move to separate context FeatureStateContext
  const getDisabledReasonCallback = React.useCallback(
    (versionName: string, featureId: FeatureId) => {
      const isSupported = isFeatureSupportedCallback(versionName, featureId);
      return getFeatureDisabledReason(
        featureId,
        cluster,
        activeFeatureConfiguration,
        versionName,
        versionOptions,
        isSupported,
      );
    },
    [isFeatureSupportedCallback, versionOptions, cluster, activeFeatureConfiguration],
  );

  const isFeatureDisabled = React.useCallback(
    (version: string, featureId: FeatureId) => !!getDisabledReasonCallback(version, featureId),
    [getDisabledReasonCallback],
  );

  const providerValue = React.useMemo<FeatureSupportLevelData>(() => {
    return {
      getVersionSupportLevelsMap: getVersionSupportLevelsMapCallback,
      getFeatureSupportLevel: getFeatureSupportLevel,
      isFeatureDisabled: isFeatureDisabled,
      getFeatureDisabledReason: getDisabledReasonCallback,
      isFeatureSupported: isFeatureSupportedCallback,
      activeFeatureConfiguration,
    };
  }, [
    getVersionSupportLevelsMapCallback,
    getFeatureSupportLevel,
    isFeatureDisabled,
    getDisabledReasonCallback,
    isFeatureSupportedCallback,
    activeFeatureConfiguration,
  ]);

  React.useEffect(() => {
    if (error) {
      handleApiError(error);
    }
  }, [error]);

  return (
    <FeatureSupportLevelContextProvider value={providerValue}>
      {isLoading ? loadingUi : children}
    </FeatureSupportLevelContextProvider>
  );
};

export default FeatureSupportLevelProvider;
