import { useState } from 'react';
import { MainLayout } from '@/components/layout/mainLayout';
import { AdminSidebar, AdminSection } from '@/components/admin/adminSidebar';
import { RulesSection } from '@/components/admin/rulesSection';
import { IntentsSection } from '@/components/admin/intentsSection';
import { KBSection } from '@/components/admin/kbSection';
import { AutoRemediationSection } from '@/components/admin/autoRemediationSection';

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
