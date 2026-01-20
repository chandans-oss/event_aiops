import React from "react";
import { MainLayout } from "@/components/layout/mainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Topology = () => {
    return (
        <MainLayout>
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Topology</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Network Topology</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-[400px] border-2 border-dashed rounded-lg bg-muted/50">
                            <p className="text-muted-foreground">Topology visualization coming soon...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
};

export default Topology;
