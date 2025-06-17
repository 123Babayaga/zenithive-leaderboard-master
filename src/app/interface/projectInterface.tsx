export interface ProjectCategory {
  id: string;
  name: string;
  description: string;
}

export interface ProjectLead {
  self: string;
  accountId: string;
  displayName: string;
  active: boolean;
}

export interface IssueType {
  self: string;
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  subtask: boolean;
}

export interface User {
  self: string;
  accountId: string;
  displayName: string;
  emailAddress: string;
  active: boolean;
  avatarUrls: {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
  };
}

interface Priority {
  self: string;
  iconUrl: string;
  name: string;
  id: string;
}

export interface Status {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: {
    self: string;
    id: number;
    key: string;
    colorName: string;
    name: string;
  };
}

export interface Issue {
  id: string;
  key: string;
  fields: {
    worklog: Worklog;
    summary: string;
    status: Status;
    assignee?: User;
    reporter: User;
    priority: Priority;
    issuetype: IssueType;
    created: string;
    updated: string;
    description?: string;
    labels: string[];
    components: Array<{
      self: string;
      id: string;
      name: string;
    }>;
  };
}

export interface IssuesResponse {
  success: boolean;
  projectKey: string;
  total: number;
  maxResults: number;
  startAt: number;
  data: Issue[];
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description?: string;
  lead?: ProjectLead;
  url?: string;
  avatarUrls: {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
  };
  projectCategory?: ProjectCategory;
  projectTypeKey: string;
  style: string;
  isPrivate: boolean;
  entityId: string;
  issueTypes?: IssueType[];
}

export interface ApiResponse {
  success: boolean;
  count: number;
  data: Project[];
}

export interface TeamMember {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  avatarUrls?: {
    '16x16'?: string;
    '24x24'?: string;
    '32x32'?: string;
    '48x48'?: string;
  };
  role?: string;
  isActive?: boolean;
  lastActive?: string;
  permissions?: string[];
  timezone?: string;
  locale?: string;
}

export interface Worklog {
  worklogs: string;
  author: {
    accountId: string;
    displayName: string;
    emailAddress: string;
    avatarUrls: string;
  };
  timeSpentSeconds: number;
}