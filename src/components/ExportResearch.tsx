
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ExportResearchProps {
  simulationResults: any;
}

const ExportResearch = ({ simulationResults }: ExportResearchProps) => {
  const [exportFormat, setExportFormat] = useState("json");
  const [paperTitle, setPaperTitle] = useState("FUSE: A Novel Hybrid Container Scheduling Algorithm");
  const [authors, setAuthors] = useState("Researcher Name");

  const handleExport = () => {
    if (!simulationResults) return;

    let exportData;
    let filename;
    let mimeType;

    switch (exportFormat) {
      case "json":
        exportData = JSON.stringify(simulationResults, null, 2);
        filename = "fuse_algorithm_research_data.json";
        mimeType = "application/json";
        break;
      case "csv":
        exportData = convertToCSV(simulationResults);
        filename = "fuse_algorithm_research_data.csv";
        mimeType = "text/csv";
        break;
      case "latex":
        exportData = generateLatexTable(simulationResults);
        filename = "fuse_algorithm_latex_tables.tex";
        mimeType = "application/x-tex";
        break;
      default:
        exportData = JSON.stringify(simulationResults, null, 2);
        filename = "fuse_algorithm_research_data.json";
        mimeType = "application/json";
    }

    const blob = new Blob([exportData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `${filename} has been downloaded to your device.`,
    });
  };

  // Function to download all charts as a PDF
  const handleDownloadAllCharts = () => {
    toast({
      title: "Charts Download",
      description: "Please use the download buttons on individual charts to save them.",
    });
    
    // Scroll to the charts section
    const dashboardTab = document.querySelector('[value="dashboard"]');
    if (dashboardTab) {
      (dashboardTab as HTMLElement).click();
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const convertToCSV = (data: any) => {
    // Simple CSV conversion for raw data
    let csv = "Algorithm,CPU Utilization (%),Memory Utilization (%),Scheduling Time (ms),Energy (W),Makespan (ms),Node Count\n";
    
    csv += `Bin Packing,${data.rawData.binPacking.cpuUtilization.toFixed(2)},${data.rawData.binPacking.memoryUtilization.toFixed(2)},${data.rawData.binPacking.schedulingTime.toFixed(2)},${data.rawData.binPacking.energy.toFixed(2)},${data.rawData.binPacking.makespan.toFixed(2)},${data.rawData.binPacking.nodeCount}\n`;
    
    csv += `DRF,${data.rawData.drf.cpuUtilization.toFixed(2)},${data.rawData.drf.memoryUtilization.toFixed(2)},${data.rawData.drf.schedulingTime.toFixed(2)},${data.rawData.drf.energy.toFixed(2)},${data.rawData.drf.makespan.toFixed(2)},${data.rawData.drf.nodeCount}\n`;
    
    csv += `FUSE,${data.rawData.fuse.cpuUtilization.toFixed(2)},${data.rawData.fuse.memoryUtilization.toFixed(2)},${data.rawData.fuse.schedulingTime.toFixed(2)},${data.rawData.fuse.energy.toFixed(2)},${data.rawData.fuse.makespan.toFixed(2)},${data.rawData.fuse.nodeCount}\n`;
    
    return csv;
  };

  const generateLatexTable = (data: any) => {
    // Generate LaTeX tables for a research paper
    let latex = `% LaTeX tables for paper: ${paperTitle}\n`;
    latex += `% Authors: ${authors}\n\n`;
    
    // Resource utilization table
    latex += "\\begin{table}[h]\n";
    latex += "\\centering\n";
    latex += "\\caption{Resource Utilization Comparison of Container Scheduling Algorithms}\n";
    latex += "\\begin{tabular}{|l|c|c|}\n";
    latex += "\\hline\n";
    latex += "\\textbf{Algorithm} & \\textbf{CPU Utilization (\\%)} & \\textbf{Memory Utilization (\\%)} \\\\ \\hline\n";
    latex += `Bin Packing & ${data.rawData.binPacking.cpuUtilization.toFixed(2)} & ${data.rawData.binPacking.memoryUtilization.toFixed(2)} \\\\ \\hline\n`;
    latex += `DRF & ${data.rawData.drf.cpuUtilization.toFixed(2)} & ${data.rawData.drf.memoryUtilization.toFixed(2)} \\\\ \\hline\n`;
    latex += `FUSE & ${data.rawData.fuse.cpuUtilization.toFixed(2)} & ${data.rawData.fuse.memoryUtilization.toFixed(2)} \\\\ \\hline\n`;
    latex += "\\end{tabular}\n";
    latex += "\\label{tab:resource_utilization}\n";
    latex += "\\end{table}\n\n";
    
    // Performance metrics table
    latex += "\\begin{table}[h]\n";
    latex += "\\centering\n";
    latex += "\\caption{Performance Metrics of Container Scheduling Algorithms}\n";
    latex += "\\begin{tabular}{|l|c|c|c|}\n";
    latex += "\\hline\n";
    latex += "\\textbf{Algorithm} & \\textbf{Scheduling Time (ms)} & \\textbf{Makespan (ms)} & \\textbf{Energy (W)} \\\\ \\hline\n";
    latex += `Bin Packing & ${data.rawData.binPacking.schedulingTime.toFixed(2)} & ${data.rawData.binPacking.makespan.toFixed(2)} & ${data.rawData.binPacking.energy.toFixed(2)} \\\\ \\hline\n`;
    latex += `DRF & ${data.rawData.drf.schedulingTime.toFixed(2)} & ${data.rawData.drf.makespan.toFixed(2)} & ${data.rawData.drf.energy.toFixed(2)} \\\\ \\hline\n`;
    latex += `FUSE & ${data.rawData.fuse.schedulingTime.toFixed(2)} & ${data.rawData.fuse.makespan.toFixed(2)} & ${data.rawData.fuse.energy.toFixed(2)} \\\\ \\hline\n`;
    latex += "\\end{tabular}\n";
    latex += "\\label{tab:performance_metrics}\n";
    latex += "\\end{table}\n\n";
    
    // Improvement percentages
    const cpuImprovement = ((data.rawData.fuse.cpuUtilization - Math.max(data.rawData.binPacking.cpuUtilization, data.rawData.drf.cpuUtilization)) / 
      Math.max(data.rawData.binPacking.cpuUtilization, data.rawData.drf.cpuUtilization) * 100).toFixed(2);
    
    const timeImprovement = ((1 - data.rawData.fuse.schedulingTime / 
      Math.min(data.rawData.binPacking.schedulingTime, data.rawData.drf.schedulingTime)) * 100).toFixed(2);
    
    const energyImprovement = ((1 - data.rawData.fuse.energy / 
      Math.min(data.rawData.binPacking.energy, data.rawData.drf.energy)) * 100).toFixed(2);
    
    // Add improvement table
    latex += "\\begin{table}[h]\n";
    latex += "\\centering\n";
    latex += "\\caption{FUSE Algorithm Improvements Over Traditional Algorithms}\n";
    latex += "\\begin{tabular}{|l|c|}\n";
    latex += "\\hline\n";
    latex += "\\textbf{Metric} & \\textbf{Improvement (\\%)} \\\\ \\hline\n";
    latex += `CPU Utilization & +${cpuImprovement}\\% \\\\ \\hline\n`;
    latex += `Scheduling Time & ${timeImprovement}\\% faster \\\\ \\hline\n`;
    latex += `Energy Consumption & ${energyImprovement}\\% less \\\\ \\hline\n`;
    latex += "\\end{tabular}\n";
    latex += "\\label{tab:fuse_improvements}\n";
    latex += "\\end{table}\n";
    
    return latex;
  };

  if (!simulationResults) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Export Research Data</CardTitle>
        <CardDescription>Prepare your simulation results for publication</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="paper-title">Paper Title</Label>
            <Input 
              id="paper-title" 
              value={paperTitle} 
              onChange={(e) => setPaperTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="authors">Authors</Label>
            <Input 
              id="authors" 
              value={authors} 
              onChange={(e) => setAuthors(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="export-format">Export Format</Label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger id="export-format" className="w-full">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON (Raw Data)</SelectItem>
              <SelectItem value="csv">CSV (Spreadsheet Compatible)</SelectItem>
              <SelectItem value="latex">LaTeX Tables</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            {exportFormat === "json" && "Export raw data in JSON format for further processing"}
            {exportFormat === "csv" && "Export as CSV for use in spreadsheets or statistical software"}
            {exportFormat === "latex" && "Export LaTeX tables ready to use in your research paper"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 flex justify-between">
        <Button 
          variant="outline"
          onClick={handleDownloadAllCharts}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          View Charts
        </Button>
        <Button onClick={handleExport} className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          Export Research Data
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExportResearch;
