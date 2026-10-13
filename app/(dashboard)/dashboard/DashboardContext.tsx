'use client';

import constate from 'constate';

const useDashboard = () => {
  // dashboard queries/state will come here

  return {};
};

export const [
  DashboardContextProvider,
  useDashboardContext,
] = constate(useDashboard);
