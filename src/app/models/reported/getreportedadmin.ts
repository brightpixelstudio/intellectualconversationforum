import { GetReported } from './getreported';
import { GetReportedStatus } from './getreportedstatus';

export interface GetReportedAdmin {
  getReportedStatuses: GetReportedStatus[];
  getReportedMember: GetReported[];
}
