export interface IJobType {
  id: string;
  status: string;
  type: string;
  start_time: string;
  end_time: string;
  graph_name?: string;
}

export interface IState {
  jobsList: IJobType[];
  rawJobsList: IJobType[];
  typeOptions: { value: string; label: string }[];
  searchOptions: { value: string; label: string }[];
  jobId: string;
  loading: boolean;
}

export interface IJobHeaderProps extends Partial<IState> {
  onChange: (val: any, type: string) => void;
}
