export type selectButtonParams = {
  selector: string;
  url: string | null;
  format: string;
  attribute?: string;
};

export type pullTextParams = {
  selector: string;
  url: string | null;
  format: string;
  attribute?: string;
};

export type pullTextListParams = {
  selector: string;
  url: string | null;
  format: string;
  attribute?: string;
  setLinkList?: boolean;
};

export type pullLinkListParams = {
  baseUrl: string | null;
  type: string;
  loopAction: loopPullAction;
};

export type loopPullAction = {
  selector: string;
  type: string;
  format: string;
  attribute?: string;
  url?: string;
};
export type saveDataParams = {
  type: string;
  headString: string;
  jsonData: string;
  setLinkList?: boolean;
};
/*
interface ClawGripTypes {
  selectButtonParams: {
    selector: string;
    url: string | null;
  };
  pullTextParams: {
    selector: string;
    url: string | null;
  };
}

export default ClawGripTypes;
*/
