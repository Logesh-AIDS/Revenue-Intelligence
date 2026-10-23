import type { RouteKey, RouteMeta } from '../types';

export const ROUTES: Record<RouteKey, RouteMeta> = {
  sales_coaching: {
    key: 'sales_coaching',
    label: 'Sales Coaching',
    short: 'Coaching',
    description: 'Calls where rep technique needs manager feedback — e.g. pushing past clear signals, competitive handling, or data quality issues.',
    color: '#f59e0b',
    icon: '🎯',
    exportFolder: 'exports/sales-coaching',
  },
  deal_followup: {
    key: 'deal_followup',
    label: 'Deal Follow-up',
    short: 'Follow-up',
    description: 'Active pipeline conversations where a prospect showed interest or a next step was agreed. Includes referral pathways.',
    color: '#3b82f6',
    icon: '💼',
    exportFolder: 'exports/deal-followup',
  },
  customer_success: {
    key: 'customer_success',
    label: 'Customer Success',
    short: 'CS',
    description: 'Existing customers needing support, onboarding, account management, or bug escalations.',
    color: '#10b981',
    icon: '🤝',
    exportFolder: 'exports/customer-success',
  },
  partnership: {
    key: 'partnership',
    label: 'Partnership',
    short: 'Partner',
    description: 'Channel partnership development — advisory firms, referral arrangements, commission structures.',
    color: '#8b5cf6',
    icon: '🔗',
    exportFolder: 'exports/partnership',
  },
  vendor_evaluation: {
    key: 'vendor_evaluation',
    label: 'Vendor Evaluation',
    short: 'Vendor',
    description: 'SpendNest evaluating a supplier or vendor for its own product — strategic build/buy decisions.',
    color: '#ec4899',
    icon: '🔍',
    exportFolder: 'exports/vendor-evaluation',
  },
  internal: {
    key: 'internal',
    label: 'Internal / Training',
    short: 'Internal',
    description: 'Internal meetings and training sessions — not customer-facing.',
    color: '#64748b',
    icon: '📋',
    exportFolder: 'exports/internal',
  },
  intake_required: {
    key: 'intake_required',
    label: 'Intake Required',
    short: 'Intake',
    description: 'No usable supplied text. Needs human review to determine if further action is required.',
    color: '#94a3b8',
    icon: '📥',
    exportFolder: 'exports/intake-required',
  },
};

export const ROUTE_LIST = Object.values(ROUTES);
