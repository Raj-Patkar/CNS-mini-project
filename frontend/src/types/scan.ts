export interface ScanResult {
  timestamp: string;
  results: {
    target: string;

    sqli: {
      vulnerable: boolean;
      severity: string;
      endpoint?: string;
      payload?: string;
      evidence?: string;
      fix?: string;
    };

    xss: {
      reflected: {
        vulnerable: boolean;
        message?: string;
      };
      dom: {
        vulnerable: boolean;
        payload?: string;
        endpoint?: string;
        evidence?: string;
        fix?: string[];
      };
    };

    auth_bypass: {
      vulnerable: boolean;
      payload?: {
        username: string;
        password: string;
      };
      endpoint?: string;
      evidence?: string;
      fix?: string[];
    };

    headers: {
      vulnerable: boolean;
      missing_headers?: {
        header: string;
        risk: string;
      }[];
    };
  };
}