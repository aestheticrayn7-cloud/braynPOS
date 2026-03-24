export interface NavItem {
  href:  string
  label: string
  icon:  string
}

export interface NavGroup {
  group: string
  items: NavItem[]
}

export const NAV_ITEMS_BY_ROLE: Record<string, NavGroup[]> = {
  SUPER_ADMIN: [
    { group: 'Overview', items: [
      { href: '/dashboard',            label: '📊 Dashboard',        icon: '📊' },
      { href: '/dashboard/pos',        label: '🛒 POS Terminal',      icon: '🛒' },
      { href: '/dashboard/approvals',  label: '✅ Pending Approvals', icon: '✅' },
    ]},
    { group: 'Operations', items: [
      { href: '/dashboard/sales',      label: '💰 Sales',             icon: '💰' },
      { href: '/dashboard/purchases',  label: '📦 Purchases',         icon: '📦' },
      { href: '/dashboard/transfers',  label: '🔄 Transfers',         icon: '🔄' },
      { href: '/dashboard/expenses',   label: '💸 Expenses',          icon: '💸' },
      { href: '/dashboard/customers',  label: '👥 Customers',         icon: '👥' },
    ]},
    { group: 'Inventory', items: [
      { href: '/dashboard/items',      label: '📋 Items',             icon: '📋' },
      { href: '/dashboard/stock',      label: '📈 Stock Levels',      icon: '📈' },
      { href: '/dashboard/serials',    label: '🔢 Serial Numbers',    icon: '🔢' },
      { href: '/dashboard/stock/take', label: '📝 Physical Count',    icon: '📝' },
    ]},
    { group: 'Finance', items: [
      { href: '/dashboard/accounting', label: '📒 Accounting',        icon: '📒' },
      { href: '/dashboard/credit',     label: '🏦 Credit',            icon: '🏦' },
      { href: '/dashboard/payroll',    label: '💵 Payroll',           icon: '💵' },
    ]},
    { group: 'System', items: [
      { href: '/dashboard/channels',   label: '🏪 Channels',          icon: '🏪' },
      { href: '/dashboard/users',      label: '👥 Users',             icon: '👥' },
      { href: '/dashboard/reports',    label: '📊 Reports',           icon: '📊' },
      { href: '/dashboard/ai-portal',  label: '🤖 BraynAI',           icon: '🤖' },
      { href: '/dashboard/support',    label: '🎧 Support',           icon: '🎧' },
      { href: '/dashboard/audit',      label: '📜 Audit Trail',       icon: '📜' },
      { href: '/dashboard/settings',   label: '⚙️ Settings',          icon: '⚙️' },
    ]},
  ],
  MANAGER_ADMIN: [
    { group: 'Overview', items: [
      { href: '/dashboard',            label: '📊 Dashboard',        icon: '📊' },
      { href: '/dashboard/pos',        label: '🛒 POS Terminal',      icon: '🛒' },
      { href: '/dashboard/approvals',  label: '✅ Pending Approvals', icon: '✅' },
    ]},
    { group: 'Operations', items: [
      { href: '/dashboard/sales',      label: '💰 Sales',             icon: '💰' },
      { href: '/dashboard/purchases',  label: '📦 Purchases',         icon: '📦' },
      { href: '/dashboard/transfers',  label: '🔄 Transfers',         icon: '🔄' },
      { href: '/dashboard/expenses',   label: '💸 Expenses',          icon: '💸' },
      { href: '/dashboard/customers',  label: '👥 Customers',         icon: '👥' },
    ]},
    { group: 'Inventory', items: [
      { href: '/dashboard/items',      label: '📋 Items',             icon: '📋' },
      { href: '/dashboard/stock',      label: '📈 Stock Levels',      icon: '📈' },
      { href: '/dashboard/serials',    label: '🔢 Serial Numbers',    icon: '🔢' },
      { href: '/dashboard/stock/take', label: '📝 Physical Count',    icon: '📝' },
    ]},
    { group: 'Finance', items: [
      { href: '/dashboard/accounting', label: '📒 Accounting',        icon: '📒' },
      { href: '/dashboard/credit',     label: '🏦 Credit',            icon: '🏦' },
      { href: '/dashboard/payroll',    label: '💵 Payroll',           icon: '💵' },
    ]},
    { group: 'System', items: [
      { href: '/dashboard/channels',   label: '🏪 Channels',          icon: '🏪' },
      { href: '/dashboard/users',      label: '👥 Users',             icon: '👥' },
      { href: '/dashboard/reports',    label: '📊 Reports',           icon: '📊' },
      { href: '/dashboard/ai-portal',  label: '🤖 BraynAI',           icon: '🤖' },
      { href: '/dashboard/support',    label: '🎧 Support',           icon: '🎧' },
      { href: '/dashboard/audit',      label: '📜 Audit Trail',       icon: '📜' },
      { href: '/dashboard/settings',   label: '⚙️ Settings',          icon: '⚙️' },
    ]},
  ],
  ADMIN: [
    { group: 'Overview', items: [
      { href: '/dashboard',            label: '📊 Dashboard',        icon: '📊' },
      { href: '/dashboard/pos',        label: '🛒 POS Terminal',      icon: '🛒' },
      { href: '/dashboard/approvals',  label: '✅ Pending Approvals', icon: '✅' },
    ]},
    { group: 'Operations', items: [
      { href: '/dashboard/sales',      label: '💰 Sales',             icon: '💰' },
      { href: '/dashboard/purchases',  label: '📦 Purchases',         icon: '📦' },
      { href: '/dashboard/transfers',  label: '🔄 Transfers',         icon: '🔄' },
      { href: '/dashboard/expenses',   label: '💸 Expenses',          icon: '💸' },
      { href: '/dashboard/customers',  label: '👥 Customers',         icon: '👥' },
    ]},
    { group: 'Inventory', items: [
      { href: '/dashboard/items',      label: '📋 Items',             icon: '📋' },
      { href: '/dashboard/stock',      label: '📈 Stock Levels',      icon: '📈' },
      { href: '/dashboard/serials',    label: '🔢 Serial Numbers',    icon: '🔢' },
      { href: '/dashboard/stock/take', label: '📝 Physical Count',    icon: '📝' },
    ]},
    { group: 'Finance', items: [
      { href: '/dashboard/accounting', label: '📒 Accounting',        icon: '📒' },
      { href: '/dashboard/credit',     label: '🏦 Credit',            icon: '🏦' },
      { href: '/dashboard/payroll',    label: '💵 Payroll',           icon: '💵' },
    ]},
    { group: 'System', items: [
      { href: '/dashboard/channels',   label: '🏪 Channels',          icon: '🏪' },
      { href: '/dashboard/users',      label: '👥 Users',             icon: '👥' },
      { href: '/dashboard/reports',    label: '📊 Reports',           icon: '📊' },
      { href: '/dashboard/ai-portal',  label: '🤖 BraynAI',           icon: '🤖' },
      { href: '/dashboard/support',    label: '🎧 Support',           icon: '🎧' },
      { href: '/dashboard/audit',      label: '📜 Audit Trail',       icon: '📜' },
      { href: '/dashboard/settings',   label: '⚙️ Settings',          icon: '⚙️' },
    ]},
  ],
  MANAGER: [
    { group: 'Overview', items: [
      { href: '/dashboard',            label: '📊 Dashboard',        icon: '📊' },
      { href: '/dashboard/pos',        label: '🛒 POS Terminal',      icon: '🛒' },
      { href: '/dashboard/approvals',  label: '✅ Pending Approvals', icon: '✅' },
    ]},
    { group: 'Operations', items: [
      { href: '/dashboard/sales',      label: '💰 Sales',             icon: '💰' },
      { href: '/dashboard/purchases',  label: '📦 Purchases',         icon: '📦' },
      { href: '/dashboard/transfers',  label: '🔄 Transfers',         icon: '🔄' },
      { href: '/dashboard/expenses',   label: '💸 Expenses',          icon: '💸' },
      { href: '/dashboard/customers',  label: '👥 Customers',         icon: '👥' },
    ]},
    { group: 'Inventory', items: [
      { href: '/dashboard/items',      label: '📋 Items',             icon: '📋' },
      { href: '/dashboard/stock',      label: '📈 Stock Levels',      icon: '📈' },
      { href: '/dashboard/serials',    label: '🔢 Serial Numbers',    icon: '🔢' },
      { href: '/dashboard/stock/take', label: '📝 Physical Count',    icon: '📝' },
    ]},
    { group: 'Finance', items: [
      { href: '/dashboard/accounting', label: '📒 Accounting',        icon: '📒' },
      { href: '/dashboard/credit',     label: '🏦 Credit',            icon: '🏦' },
    ]},
    { group: 'System', items: [
      { href: '/dashboard/reports',    label: '📊 Reports',           icon: '📊' },
      { href: '/dashboard/ai-portal',  label: '🤖 BraynAI',           icon: '🤖' },
      { href: '/dashboard/support',    label: '🎧 Support',           icon: '🎧' },
      { href: '/dashboard/audit',      label: '📜 Audit Trail',       icon: '📜' },
      { href: '/dashboard/settings',   label: '⚙️ Settings',          icon: '⚙️' },
    ]},
  ],
  STOREKEEPER: [
    { group: 'Inventory', items: [
      { href: '/dashboard/items',      label: '📋 Items',             icon: '📋' },
      { href: '/dashboard/stock',      label: '📈 Stock Levels',      icon: '📈' },
      { href: '/dashboard/serials',    label: '🔢 Serial Numbers',    icon: '🔢' },
    ]},
    { group: 'Operations', items: [
      { href: '/dashboard/sales',      label: '💰 Sales',             icon: '💰' },
      { href: '/dashboard/transfers',  label: '🔄 Transfers',         icon: '🔄' },
      { href: '/dashboard/settings',   label: '⚙️ Settings',          icon: '⚙️' },
    ]},
  ],

  // ── Shift-based roles: sessions required, visible in nav ──────────
  CASHIER: [
    { group: 'Overview', items: [
      { href: '/dashboard/sessions',   label: '🎫 My Session',        icon: '🎫' },
      { href: '/dashboard/pos',        label: '🛒 POS Terminal',      icon: '🛒' },
      { href: '/dashboard/sales',      label: '💰 Sales History',     icon: '💰' },
      { href: '/dashboard/customers',  label: '👥 Customers',         icon: '👥' },
      { href: '/dashboard/settings',   label: '⚙️ Settings',          icon: '⚙️' },
    ]},
  ],
  PROMOTER: [
    { group: 'Overview', items: [
      { href: '/dashboard/pos',        label: '🛒 POS Terminal',      icon: '🛒' },
      { href: '/dashboard/sales',      label: '💰 My Sales',          icon: '💰' },
      { href: '/dashboard/settings',   label: '⚙️ Settings',          icon: '⚙️' },
    ]},
  ],
  SALES_PERSON: [
    { group: 'Overview', items: [
      { href: '/dashboard/pos',        label: '🛒 POS Terminal',      icon: '🛒' },
      { href: '/dashboard/sales',      label: '💰 Sales History',     icon: '💰' },
      { href: '/dashboard/customers',  label: '👥 Customers',         icon: '👥' },
      { href: '/dashboard/settings',   label: '⚙️ Settings',          icon: '⚙️' },
    ]},
  ],
}

export const ROLE_LANDING_PAGES: Record<string, string> = {
  SUPER_ADMIN:   '/dashboard',
  MANAGER_ADMIN: '/dashboard',
  ADMIN:         '/dashboard',
  MANAGER:       '/dashboard',
  STOREKEEPER:   '/dashboard/stock',
  CASHIER:       '/dashboard/sessions',  // Cashier lands on sessions first
  PROMOTER:      '/dashboard/pos',
  SALES_PERSON:  '/dashboard/pos',
}
