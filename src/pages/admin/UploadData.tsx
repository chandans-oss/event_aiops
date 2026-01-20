import { useState } from 'react';
import { Upload, FileSpreadsheet, Download, CheckCircle2, X, Table, FileDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MainLayout } from '@/components/layout/mainLayout';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const requiredSheets = [
  {
    name: 'events',
    description: 'Network events and alerts',
    columns: ['eventId', 'device', 'eventCode', 'timestamp', 'severity', 'message', 'site', 'region', 'rack'],
    sampleRows: 3
  },
  {
    name: 'metrics',
    description: 'Performance metrics data',
    columns: ['timestamp', 'device', 'interface', 'utilizationPercent', 'inErrors', 'outDiscards', 'latencyMs'],
    sampleRows: 3
  },
  {
    name: 'topology',
    description: 'Network topology relationships',
    columns: ['sourceDevice', 'sourceInterface', 'targetDevice', 'targetInterface', 'linkType'],
    sampleRows: 3
  },
  {
    name: 'syslog',
    description: 'Syslog messages',
    columns: ['timestamp', 'device', 'severity', 'facility', 'message'],
    sampleRows: 3
  },
  {
    name: 'devices',
    description: 'Device inventory',
    columns: ['deviceId', 'hostname', 'type', 'vendor', 'model', 'site', 'rack', 'status'],
    sampleRows: 3
  },
];

export default function UploadData() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; sheets: string[] } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFile({
            name: 'simulation_data.xlsx',
            size: '4.2 MB',
            sheets: ['events', 'metrics', 'topology', 'syslog', 'devices']
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownloadTemplate = () => {
    // In a real app, this would download an actual Excel file
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'rca_simulation_template.xlsx';
    alert('Template download initiated! In production, this would download an Excel file with sample data.');
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Upload Simulation Data</h1>
            <p className="text-muted-foreground">Upload event data in Excel format for RCA simulation</p>
          </div>
          <Button onClick={handleDownloadTemplate} className="gap-2 gradient-primary">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Upload Excel File</h2>

            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileUpload();
              }}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">
                Drag and drop your Excel file here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supported format: Excel (.xlsx, .xls) with multiple sheets
              </p>
              <Button variant="outline" onClick={handleFileUpload}>Browse Files</Button>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="text-foreground font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Uploaded File */}
            {uploadedFile && !isUploading && (
              <div className="mt-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-status-success/10 border border-status-success/30">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-6 w-6 text-status-success" />
                    <div>
                      <p className="font-medium text-foreground">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{uploadedFile.size} • {uploadedFile.sheets.length} sheets</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-status-success" />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setUploadedFile(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Detected Sheets */}
                <div className="mt-4">
                  <h3 className="font-medium text-foreground mb-2">Detected Sheets</h3>
                  <div className="flex flex-wrap gap-2">
                    {uploadedFile.sheets.map((sheet) => (
                      <Badge key={sheet} variant="outline" className="bg-status-success/10 text-status-success border-status-success/30">
                        <Table className="h-3 w-3 mr-1" />
                        {sheet}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full mt-4 gradient-primary">
                  Start Simulation
                </Button>
              </div>
            )}
          </div>

          {/* Template Info */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Required Data Format</h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              The Excel file should contain the following sheets with the specified columns:
            </p>

            <Accordion type="single" collapsible className="w-full">
              {requiredSheets.map((sheet) => (
                <AccordionItem key={sheet.name} value={sheet.name}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4 text-primary" />
                      <span className="font-medium">{sheet.name}</span>
                      <Badge variant="secondary" className="ml-2">{sheet.columns.length} columns</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <p className="text-sm text-muted-foreground">{sheet.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {sheet.columns.map((col) => (
                          <Badge key={col} variant="outline" className="font-mono text-xs">
                            {col}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <FileDown className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Download Sample Template</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get a pre-filled template with sample data to understand the required format for RCA simulation.
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-2 text-primary" onClick={handleDownloadTemplate}>
                    Download Template with Demo Data →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
