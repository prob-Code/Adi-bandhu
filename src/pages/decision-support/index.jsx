import React, { useMemo, useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import DSSPanel from '../committee-review/components/DSSPanel';

const DecisionSupport = () => {
 
  const [claim] = useState({
    id: 'FR-DSS-0001',
    type: 'Community Forest Rights',
    village: 'Khandwa',
    district: 'Barwani',
    state: 'Madhya Pradesh',
    block: 'Khandwa',
    area: 12.3,
    families: 36,
    priority: 'High',
    status: 'in_review',
    submittedDate: '2025-01-12',
    daysPending: 2,
  });

  const breadcrumbItems = useMemo(() => [{ label: 'Planning', path: '/multi-role-dashboard' }], []);

  useEffect(() => {
    document.title = 'Decision Support System';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <QuickActionsToolbar userRole="Committee Member" currentPage="decision-support" />
      <main className="pt-16">
        <div className="px-4 lg:px-6 py-4 border-b border-border bg-card">
          <BreadcrumbNavigation items={breadcrumbItems} currentPage="Decision Support System" />
        </div>
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Decision Support System</h1>
              <p className="text-muted-foreground">Recommend and layer CSS schemes based on mapped data</p>
            </div>
          </div>

          <div className="h-[calc(100vh-240px)]">
            <DSSPanel claim={claim} onClose={() => {  }} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DecisionSupport;
