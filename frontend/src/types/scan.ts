export interface ScanResult {
  target: string;
  timestamp?: string;

  sqli: {
    vulnerable: boolean;
    type?: string;
    severity?: string;
    confidence?: string;
    endpoint?: string;
    payload?: string;
    evidence?: string;
    fix?: string;
  };

  xss: {
    reflected: {
      vulnerable: boolean;
      message?: string;
      severity?: string;
      confidence?: string;
    };
    dom: {
      vulnerable: boolean;
      type?: string;
      severity?: string;
      confidence?: string;
      payload?: string;
      endpoint?: string;
      evidence?: string;
      fix?: string[];
    };
  };

  auth_bypass: {
    vulnerable: boolean;
    type?: string;
    severity?: string;
    confidence?: string;
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
    type?: string;
    severity?: string;
    confidence?: string;
    missing_headers?: {
      header: string;
      risk: string;
    }[];
  };
}