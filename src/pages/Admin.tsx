import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminSidebar, AdminSection } from '@/components/admin/AdminSidebar';
import { RulesSection } from '@/components/admin/RulesSection';
import { IntentsSection } from '@/components/admin/IntentsSection';
import { KBSection } from '@/components/admin/KBSection';
import { AutoRemediationSection } from '@/components/admin/AutoRemediationSection';

export default function Admin() {
  const [activeSection, setActiveSection] = useState<AdminSection>('rules');

  const renderSection = () => {
    switch (activeSection) {
      case 'rules':
        return <RulesSection />;
      case 'intents':
        return <IntentsSection />;
      case 'kb':
        return <KBSection />;
      case 'auto-remediation':
        return <AutoRemediationSection />;
      default:
        return <RulesSection />;
    }
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </div>
      </div>
    </MainLayout>
  );
}
