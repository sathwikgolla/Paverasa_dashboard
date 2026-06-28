export const ROLES = {
  ADMIN: "Admin",
  FINANCE_MANAGER: "Finance Manager",
  EMPLOYEE: "Employee",
};

export const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",

  VIEW_REVENUE: "view_revenue",
  MANAGE_REVENUE: "manage_revenue",

  VIEW_EXPENSES: "view_expenses",
  MANAGE_EXPENSES: "manage_expenses",

  VIEW_REPORTS: "view_reports",

  VIEW_CASH_FLOW: "view_cash_flow",

  VIEW_ANALYTICS: "view_analytics",

  // NEW
  VIEW_KPI: "view_kpi",

  MANAGE_SETTINGS: "manage_settings",
};

const ROLE_PERMISSIONS = {
  // Admin gets every permission automatically
  [ROLES.ADMIN]: Object.values(PERMISSIONS),

  [ROLES.FINANCE_MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,

    PERMISSIONS.VIEW_REVENUE,
    PERMISSIONS.MANAGE_REVENUE,

    PERMISSIONS.VIEW_EXPENSES,
    PERMISSIONS.MANAGE_EXPENSES,

    PERMISSIONS.VIEW_REPORTS,

    PERMISSIONS.VIEW_CASH_FLOW,

    PERMISSIONS.VIEW_ANALYTICS,

    // NEW
    PERMISSIONS.VIEW_KPI,
  ],

  [ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_DASHBOARD,
  ],
};

export const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "🏠 Dashboard",
    permission: PERMISSIONS.VIEW_DASHBOARD,
  },
  {
    href: "/revenue",
    label: "💰 Revenue",
    permission: PERMISSIONS.VIEW_REVENUE,
  },
  {
    href: "/expenses",
    label: "💸 Expenses",
    permission: PERMISSIONS.VIEW_EXPENSES,
  },
  {
    href: "/analytics",
    label: "📊 Analytics",
    permission: PERMISSIONS.VIEW_ANALYTICS,
  },
  
  {
    href: "/profit-loss",
    label: "📈 Profit & Loss",
    permission: PERMISSIONS.VIEW_REPORTS,
  },
  {
    href: "/kpi",
    label: "🎯 KPI Engine",
    permission: PERMISSIONS.VIEW_KPI,
  },
  {
    href: "/reports",
    label: "📉 Reports",
    permission: PERMISSIONS.VIEW_REPORTS,
  },
  {
    href: "/cash-flow",
    label: "💵 Cash Flow",
    permission: PERMISSIONS.VIEW_CASH_FLOW,
  },
  {
    href: "/settings",
    label: "⚙️ Settings",
    permission: PERMISSIONS.MANAGE_SETTINGS,
  },
];

const ROUTE_ACCESS = {
  "/dashboard": [
    ROLES.ADMIN,
    ROLES.FINANCE_MANAGER,
    ROLES.EMPLOYEE,
  ],

  "/revenue": [
    ROLES.ADMIN,
    ROLES.FINANCE_MANAGER,
  ],

  "/expenses": [
    ROLES.ADMIN,
    ROLES.FINANCE_MANAGER,
  ],

  "/analytics": [
    ROLES.ADMIN,
    ROLES.FINANCE_MANAGER,
  ],

  // NEW
  "/kpi": [
    ROLES.ADMIN,
    ROLES.FINANCE_MANAGER,
  ],

  "/profit-loss": [
    ROLES.ADMIN,
    ROLES.FINANCE_MANAGER,
  ],

  "/cash-flow": [
    ROLES.ADMIN,
    ROLES.FINANCE_MANAGER,
  ],

  "/settings": [
    ROLES.ADMIN,
  ],
};

export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function canAccessRoute(role, pathname) {
  const route = Object.keys(ROUTE_ACCESS).find(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!route) {
    return true;
  }

  return ROUTE_ACCESS[route].includes(role);
}

export function getRoleDescription(role) {
  switch (role) {
    case ROLES.ADMIN:
      return "Full access — manage all modules, analytics, reports and settings.";

    case ROLES.FINANCE_MANAGER:
      return "Manage revenue, expenses, analytics, KPI engine, cash flow and reports.";

    case ROLES.EMPLOYEE:
      return "View dashboard only.";

    default:
      return "";
  }
}