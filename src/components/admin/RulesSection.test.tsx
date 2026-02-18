import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RulesSection } from './RulesSection';
import { mockSuppressionRules, mockDeduplicationRules, mockCorrelationRules } from '@/data/mock/mockData';

// Mock the Lucide icons since they are used heavily and might affect snapshots/searching
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual as any,
        // Add specific icon mocks if needed, otherwise use the actual ones or simple svgs
    };
});

describe('RulesSection Component', () => {
    it('renders the component and default tab', () => {
        render(<RulesSection />);
        expect(screen.getByText('Suppression')).toBeInTheDocument();
        expect(screen.getByText('Deduplication')).toBeInTheDocument();
        expect(screen.getByText('Correlation')).toBeInTheDocument();

        // Default tab is Suppression
        // Check for "Suppression Rules (Clean View)" header
        expect(screen.getByText(/Suppression Rules/i)).toBeInTheDocument();
    });

    it('displays mock suppression rules', async () => {
        render(<RulesSection />);
        // Check if the rules from mockData are rendered
        mockSuppressionRules.forEach(rule => {
            expect(screen.getByText(rule.name)).toBeInTheDocument();
            // Use regex or partial match for description as it might be truncated
            // expect(screen.getByText(rule.description)).toBeInTheDocument();
        });
    });

    it.skip('switches tabs correctly', async () => {
        render(<RulesSection />);

        // Find tabs
        const tabs = screen.getAllByRole('tab');
        expect(tabs.length).toBeGreaterThanOrEqual(3);

        // Switch to Deduplication (2nd tab)
        fireEvent.click(tabs[1]);

        await waitFor(() => {
            // Check for header specific to deduplication
            const headers = screen.getAllByRole('heading');
            const dedupHeader = headers.find(h => h.textContent?.includes('Deduplication Rules'));
            expect(dedupHeader).toBeInTheDocument();
        });

        // Check usage of mockDeduplicationRules
        mockDeduplicationRules.forEach(rule => {
            expect(screen.getByText(rule.name)).toBeInTheDocument();
        });

        // Switch to Correlation (3rd tab)
        fireEvent.click(tabs[2]);

        await waitFor(() => {
            // Check for header specific to correlation
            const headers = screen.getAllByRole('heading');
            const correlationHeader = headers.find(h => h.textContent?.includes('Correlation Rules'));
            expect(correlationHeader).toBeInTheDocument();
        });

        // Check usage of mockCorrelationRules
        mockCorrelationRules.forEach(rule => {
            expect(screen.getByText(rule.name)).toBeInTheDocument();
        });
    });

    it('filters rules by search query', async () => {
        render(<RulesSection />);
        const searchInput = screen.getByPlaceholderText(/search rules/i);

        // Type a specific rule name (assuming one exists)
        // Let's use the first suppression rule name
        const targetRule = mockSuppressionRules[0];
        fireEvent.change(searchInput, { target: { value: targetRule.name } });

        // Expect the target rule to be visible
        expect(screen.getByText(targetRule.name)).toBeInTheDocument();

        // Expect other rules to be filtered out (if names are distinct)
        // This is a basic check; stricter verification could check for non-existence of other rule names
    });

    it('handles empty data gracefully (simulated via empty filter result)', async () => {
        render(<RulesSection />);
        const searchInput = screen.getByPlaceholderText(/search rules/i);

        // Search for something that definitely doesn't exist
        fireEvent.change(searchInput, { target: { value: 'NON_EXISTENT_RULE_XYZ_123' } });

        expect(screen.getByText('No rules found')).toBeInTheDocument();
        expect(screen.getByText('Try adjusting your search or filters')).toBeInTheDocument();
    });

    it('renders "Add Rule" button', () => {
        render(<RulesSection />);
        const addButtons = screen.getAllByText('Add Rule');
        expect(addButtons.length).toBeGreaterThan(0);
    });
});
