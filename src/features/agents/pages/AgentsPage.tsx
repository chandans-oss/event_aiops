import { MainLayout } from '@/shared/components/layout/MainLayout';
import { AgentFleetTable } from '../components/AgentFleetTable';

export default function AgentsPage() {
    return (
        <MainLayout>
            <div className="p-6 space-y-8 max-w-[1600px] mx-auto pb-24 h-full overflow-y-auto w-full">
                <AgentFleetTable />
            </div>
        </MainLayout>
    );
}
